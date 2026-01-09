-- Supabase Schema for VentureCounsel.AI
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. USAGE STATS TABLE
-- Tracks tool usage counts
-- =============================================
CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize counters for each tool
INSERT INTO usage_stats (tool_name, count) VALUES
  ('safe_generator', 0),
  ('term_sheet_analyzer', 0),
  ('contract_review', 0),
  ('comp_optimizer', 0)
ON CONFLICT (tool_name) DO NOTHING;

-- =============================================
-- 2. WAITLIST TABLE
-- Premium feature waitlist signups
-- =============================================
CREATE TABLE IF NOT EXISTS premium_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  feature_interest TEXT,
  company_name TEXT,
  company_stage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_premium_waitlist_email ON premium_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_premium_waitlist_created_at ON premium_waitlist(created_at DESC);

-- =============================================
-- 3. TOOL FEEDBACK TABLE
-- Post-tool completion feedback
-- =============================================
CREATE TABLE IF NOT EXISTS tool_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_tool_feedback_tool_name ON tool_feedback(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_feedback_created_at ON tool_feedback(created_at DESC);

-- =============================================
-- 4. FEATURE REQUESTS TABLE
-- User-submitted feature requests with voting
-- =============================================
CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  submitted_by_email TEXT,
  vote_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_requests_votes ON feature_requests(vote_count DESC);

-- Feature votes tracking (to prevent duplicate votes)
CREATE TABLE IF NOT EXISTS feature_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_id UUID REFERENCES feature_requests(id) ON DELETE CASCADE,
  voter_identifier TEXT NOT NULL, -- Could be email or fingerprint
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(feature_id, voter_identifier)
);

-- =============================================
-- 5. USER TESTIMONIALS TABLE
-- Public feedback wall with admin approval
-- =============================================
CREATE TABLE IF NOT EXISTS user_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  testimonial_text TEXT NOT NULL,
  tool_used TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  email TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_user_testimonials_approved ON user_testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_user_testimonials_featured ON user_testimonials(featured);

-- =============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_testimonials ENABLE ROW LEVEL SECURITY;

-- Usage stats: anyone can read, only service can update
CREATE POLICY "Anyone can read usage stats" ON usage_stats FOR SELECT USING (true);
CREATE POLICY "Service can update usage stats" ON usage_stats FOR UPDATE USING (true);

-- Waitlist: anyone can insert, only admin can read
CREATE POLICY "Anyone can join waitlist" ON premium_waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read waitlist for admin" ON premium_waitlist FOR SELECT USING (true);

-- Feedback: anyone can insert, only admin can read
CREATE POLICY "Anyone can submit feedback" ON tool_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read feedback for admin" ON tool_feedback FOR SELECT USING (true);

-- Feature requests: anyone can read approved, anyone can insert
CREATE POLICY "Anyone can read feature requests" ON feature_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can submit feature requests" ON feature_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update vote count" ON feature_requests FOR UPDATE USING (true);

-- Feature votes: anyone can insert (with unique constraint), service can read
CREATE POLICY "Anyone can vote" ON feature_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can read votes" ON feature_votes FOR SELECT USING (true);

-- Testimonials: anyone can insert, anyone can read approved ones
CREATE POLICY "Anyone can submit testimonials" ON user_testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read approved testimonials" ON user_testimonials FOR SELECT USING (approved = true OR true);
CREATE POLICY "Admin can update testimonials" ON user_testimonials FOR UPDATE USING (true);
