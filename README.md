# Transactional Lawyer AI - Website

Professional marketing website for a custom GPT that provides senior-level transactional legal counsel focused exclusively on contracts, M&A, IP transactions, and commercial agreements.

## Overview

This website showcases an AI-powered legal tool that drafts, redlines, and analyzes commercial contracts with the judgment and precision of experienced deal counsel. Unlike generic legal AI, this tool produces production-ready output and deliberately allocates risk to protect clients.

## Features

- **Clean, Professional Design**: Modern, law-firm aesthetic with clear hierarchy
- **Responsive Layout**: Fully responsive across desktop, tablet, and mobile devices
- **Smooth Animations**: Subtle fade-in effects and hover interactions
- **SEO Optimized**: Semantic HTML with proper meta tags and descriptions
- **Fast Loading**: Minimal dependencies, vanilla JavaScript, optimized CSS

## Project Structure

```
.
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Interactive functionality and animations
└── README.md          # This file
```

## Key Sections

1. **Hero**: Bold value proposition with clear CTAs
2. **Value Proposition**: Three core differentiators
3. **Capabilities**: Six primary use cases with icons
4. **Expertise**: Transaction types and focus areas
5. **Philosophy**: Four operating principles
6. **Differentiation**: Side-by-side comparison with generic legal AI
7. **Examples**: Real-world use cases
8. **Access CTA**: Call to action with GPT link
9. **Footer**: Scope clarification and disclaimer

## Setup & Deployment

### Local Development

1. Clone or download this repository
2. Open `index.html` in a web browser
3. No build process or dependencies required

### Deployment Options

#### Option 1: GitHub Pages (Free)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Then enable GitHub Pages in repository settings.

#### Option 2: Netlify (Free)
1. Drag and drop the folder into [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository for continuous deployment

#### Option 3: Vercel (Free)
```bash
npm i -g vercel
vercel
```

#### Option 4: Traditional Web Hosting
Upload all files via FTP to your web host's public directory.

## Customization

### Update GPT Link
In `index.html` line 226, replace the href with your actual ChatGPT custom GPT URL:
```html
<a href="YOUR_GPT_URL_HERE" target="_blank" class="btn btn-primary btn-large">Access the GPT</a>
```

### Color Scheme
Edit CSS variables in `styles.css` lines 10-21:
```css
:root {
    --primary: #1a1a2e;        /* Main dark color */
    --accent: #0f4c75;         /* Primary accent */
    --accent-light: #3282b8;   /* Lighter accent */
    /* ... */
}
```

### Content Updates
All content is in `index.html`. Sections are clearly marked with semantic HTML and comments.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- No external dependencies
- Vanilla JavaScript (no frameworks)
- Optimized CSS with minimal specificity
- Lazy-loaded animations with Intersection Observer
- Debounced scroll handlers for performance

## SEO Considerations

- Semantic HTML5 structure
- Proper heading hierarchy (h1 → h2 → h3)
- Meta description and title tags
- Mobile-responsive (Google mobile-first indexing)
- Fast loading time
- Descriptive link text

### Recommended Next Steps for SEO:
1. Add Google Analytics or Plausible
2. Create sitemap.xml
3. Add robots.txt
4. Set up Google Search Console
5. Add Open Graph tags for social sharing
6. Consider adding schema.org markup for legal services

## Analytics Integration

To add Google Analytics, insert before closing `</head>` tag in `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## License

All rights reserved. This website is proprietary to the Transactional Counsel AI project.

## Support

For questions or customization requests, refer to the custom GPT documentation or contact the project maintainer.

---

**Note**: This is a static website. The actual AI functionality resides in the ChatGPT custom GPT, which requires a ChatGPT Plus or Enterprise subscription.
