# Deployment Guide

## Production
- URL: https://venturecounsel.ai
- - Platform: Vercel
  - - Framework: Next.js 16
   
    - ## Vercel Configuration
    - - Project: venturecounsel
      - - GitHub Repo: zack814/venturecounsel-ai
        - - Root Directory: term-sheet-checker
         
          - ## Required Environment Variables
          - - ANTHROPIC_API_KEY (required) - Claude API key
            - - ADMIN_PASSWORD (required for admin features)
             
              - ## Quick Troubleshooting
             
              - ### Site showing 404
              - 1. Check Vercel Settings > Git - ensure correct repo (venturecounsel-ai, NOT venturecounsel)
                2. 2. Verify Root Directory is term-sheet-checker
                   3. 3. Trigger manual redeploy from Vercel Deployments
                     
                      4. ### API not working
                      5. 1. Check Environment Variables in Vercel
                         2. 2. ANTHROPIC_API_KEY must be plain value (not @secret syntax)
                           
                            3. ## Health Check
                            4. curl https://venturecounsel.ai/api/health
