-- =============================================================================
-- PERFORMANCE OPTIMIZATIONS - Database triggers and functions
-- Run this migration in your Supabase SQL Editor
-- =============================================================================

-- ============================================================================
-- 1. VOTE COUNTING TRIGGER
-- Automatically updates vote_count when votes are inserted/deleted
-- Eliminates N+1 query pattern in /api/features/vote
-- ============================================================================

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_feature_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE feature_requests
    SET vote_count = vote_count + 1,
        updated_at = NOW()
    WHERE id = NEW.feature_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE feature_requests
    SET vote_count = vote_count - 1,
        updated_at = NOW()
    WHERE id = OLD.feature_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_feature_vote ON feature_votes;

-- Create the trigger
CREATE TRIGGER on_feature_vote
AFTER INSERT OR DELETE ON feature_votes
FOR EACH ROW EXECUTE FUNCTION update_feature_vote_count();

-- ============================================================================
-- 2. ATOMIC STATS INCREMENT
-- RPC function to atomically increment usage stats
-- Eliminates race condition in /api/stats/increment
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_usage_stat(p_tool_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO usage_stats (tool_name, count, last_updated)
  VALUES (p_tool_name, 1, NOW())
  ON CONFLICT (tool_name) DO UPDATE SET
    count = usage_stats.count + 1,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. INDEXES FOR COMMON QUERIES
-- Improve query performance for frequently accessed data
-- ============================================================================

-- Index for email lookups (used in subscribe, waitlist, etc.)
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_premium_waitlist_email ON premium_waitlist(email);

-- Index for vote lookups (feature_id + voter_identifier)
CREATE INDEX IF NOT EXISTS idx_feature_votes_lookup
ON feature_votes(feature_id, voter_identifier);

-- Index for feedback aggregation by tool
CREATE INDEX IF NOT EXISTS idx_tool_feedback_tool_name ON tool_feedback(tool_name);

-- ============================================================================
-- 4. UNIQUE CONSTRAINT FOR DUPLICATE VOTE PREVENTION
-- Ensures database-level uniqueness for votes
-- ============================================================================

-- Add unique constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_feature_vote'
  ) THEN
    ALTER TABLE feature_votes
    ADD CONSTRAINT unique_feature_vote UNIQUE (feature_id, voter_identifier);
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- Run these queries to verify the migration was successful
-- ============================================================================

-- Check trigger exists
-- SELECT tgname FROM pg_trigger WHERE tgname = 'on_feature_vote';

-- Check function exists
-- SELECT proname FROM pg_proc WHERE proname = 'increment_usage_stat';

-- Check indexes exist
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('email_subscribers', 'premium_waitlist', 'feature_votes', 'tool_feedback');
