# Term Sheet Reality Checker - Complete Setup Guide

## Step-by-Step Setup Instructions

### 1. Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)
6. **Keep this secure** - don't share it or commit it to Git

**Pricing:**
- Claude Opus 4: $3/M input tokens, $15/M output tokens
- Typical analysis costs: ~$0.15 per term sheet
- Start with $20-50 credit allocation for testing

### 2. Install Dependencies

```bash
cd term-sheet-checker
npm install
```

This installs:
- Next.js 15
- React 19
- Anthropic SDK
- TypeScript
- Tailwind CSS

### 3. Configure Environment

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit the file
nano .env.local
# Or use your preferred editor: code .env.local, vim .env.local, etc.
```

Add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

**IMPORTANT**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### 4. Test Locally

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Test the app:**
1. Paste a sample term sheet (or create a simple one)
2. Fill in the context form
3. Click "Analyze My Term Sheet"
4. Wait 30-90 seconds for analysis
5. Review the report

**If you get errors:**
- Check browser console (F12)
- Check terminal for server errors
- Verify API key is correct
- Check you have API credits

### 5. Deploy to Vercel

#### Method A: GitHub + Vercel Dashboard (Recommended)

1. **Create a new GitHub repository**
   ```bash
   cd term-sheet-checker
   git init
   git add .
   git commit -m "Initial commit: Term Sheet Reality Checker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/term-sheet-checker.git
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign up or log in (connect your GitHub account)

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - **Important**: Set Root Directory to `term-sheet-checker` if this is in a monorepo
   - Framework will auto-detect as Next.js

4. **Configure Environment Variables**
   - Click "Environment Variables"
   - Add: `ANTHROPIC_API_KEY` = `your_api_key_here`
   - Apply to: Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://term-sheet-checker.vercel.app`

6. **Custom Domain (Optional)**
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain: `checker.venturecounsel.ai`
   - Or configure as subdirectory on main domain

#### Method B: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy
cd term-sheet-checker
vercel

# Follow prompts:
# - Link to existing project? No (first time)
# - Project name: term-sheet-checker
# - Directory: ./ (already in the right folder)
```

**Add environment variable:**
```bash
vercel env add ANTHROPIC_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development
```

**Deploy to production:**
```bash
vercel --prod
```

### 6. Integrate with Main Website

Your main site (`index.html`) has already been updated with:
- "Term Sheet Checker" link in navigation
- Updated mobile menu

**Deployment options:**

**Option A: Subdomain (Recommended)**
```
Main site: venturecounsel.ai → Your current hosting
Checker: checker.venturecounsel.ai → Vercel deployment
```

In Vercel:
1. Go to Settings → Domains
2. Add `checker.venturecounsel.ai`
3. Follow DNS instructions to add CNAME record

In your DNS provider:
```
Type: CNAME
Name: checker
Value: cname.vercel-dns.com
```

**Option B: Subdirectory Path**
```
Main site: venturecounsel.ai → Your current hosting
Checker: venturecounsel.ai/term-sheet-checker → Vercel
```

This requires:
1. Vercel Pro plan for path rewrites, OR
2. Proxy configuration on your main hosting
3. More complex setup

**We recommend Option A (subdomain) for simplicity.**

### 7. Update Your Main Site Links

If using subdomain, update `index.html`:

```html
<!-- Change from: -->
<a href="/term-sheet-checker">Term Sheet Checker</a>

<!-- To: -->
<a href="https://checker.venturecounsel.ai">Term Sheet Checker</a>
```

### 8. Monitor & Maintain

**Check Usage:**
1. Anthropic Console → Usage
2. Monitor API costs
3. Set up billing alerts

**Monitor Errors:**
1. Vercel Dashboard → Your Project → Logs
2. Check for failed requests
3. Monitor rate limit hits

**Update Data Quarterly:**
1. Edit `data/norms/v1-2025-q1.json` with new market data
2. Update `data/clauses/library-v1.json` with new terms
3. Commit and deploy updates

## Testing Checklist

Before launching publicly:

- [ ] Test with 3-5 different term sheets
- [ ] Verify all 5 report sections render correctly
- [ ] Test copy-to-clipboard functionality
- [ ] Test on mobile devices
- [ ] Verify rate limiting works (try 6th request)
- [ ] Check error handling (paste gibberish)
- [ ] Review cost per analysis
- [ ] Test with different context combinations
- [ ] Ensure all disclaimers are visible
- [ ] Verify navigation from main site works

## Common Issues & Solutions

### "API key not found"
- Check `.env.local` file exists
- Verify no typos in variable name
- Restart dev server after changing .env
- In production: check Vercel env vars

### "Rate limit exceeded"
- Expected after 5 requests from same IP
- Resets after 24 hours
- For testing: restart dev server or change network

### "Analysis taking too long"
- Claude Opus can take 60-90 seconds
- This is normal for complex term sheets
- Consider timeout message if >2 minutes
- Monitor Anthropic API status

### Build errors
- Delete `node_modules` and `.next`
- Run `npm install` again
- Check Node.js version: `node -v` (needs 18+)

### Styling looks broken
- Tailwind not building: check `tailwind.config.ts`
- Clear browser cache
- Check for console errors

## Cost Management

**Estimated costs at scale:**

| Monthly Analyses | Cost (Opus 4) | Cost (Sonnet 3.5) |
|-----------------|---------------|-------------------|
| 100 | $15 | $2 |
| 500 | $75 | $10 |
| 1,000 | $150 | $20 |
| 5,000 | $750 | $100 |

**To reduce costs:**
1. Switch to Claude Sonnet in `lib/ai/analyzer.ts`:
   ```typescript
   const MODEL = 'claude-sonnet-3-5-20241022';
   ```
2. Implement prompt caching
3. Tighten rate limits
4. Add user authentication + paid tiers

## Security Checklist

- [ ] API key in environment variables (not code)
- [ ] `.env.local` in `.gitignore`
- [ ] Rate limiting enabled
- [ ] Input validation on API route
- [ ] Max input size enforced (50K chars)
- [ ] CORS configured properly
- [ ] Disclaimer visible on every page
- [ ] No PII stored without consent

## Next Steps

Once deployed:

1. **Test in production** - Run through full workflow
2. **Share with beta users** - Get feedback from 5-10 founders
3. **Monitor usage** - Check Vercel + Anthropic dashboards daily
4. **Collect feedback** - Add feedback form or email
5. **Iterate** - Refine prompts based on real usage
6. **Market** - Announce on Twitter, HN, LinkedIn
7. **Scale** - Add authentication, premium features

## Need Help?

- **Vercel Issues**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Issues**: [nextjs.org/docs](https://nextjs.org/docs)
- **Anthropic API**: [docs.anthropic.com](https://docs.anthropic.com)
- **This Project**: Check `BUILD_STATUS.md` for architecture details

Good luck! 🚀
