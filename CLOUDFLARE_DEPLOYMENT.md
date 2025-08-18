# Cloudflare Pages Deployment Guide

## Overview
This project is configured to deploy to Cloudflare Pages as a static site. The Next.js app is built with static export enabled.

## Prerequisites
1. Cloudflare account
2. Cloudflare API token with Pages permissions
3. Node.js 18+ installed locally

## Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server locally
```

## Deployment Options

### Option 1: Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out
```

### Option 2: Using Package Scripts
```bash
npm run deploy        # Deploy to production
npm run deploy:staging # Deploy to staging
```

### Option 3: GitHub Actions (Recommended)
1. Push your code to GitHub
2. Set up the following secrets in your repository:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
3. The workflow will automatically deploy on push to main branch

## Configuration Files

### next.config.js
- `output: 'export'`: Enables static export
- `trailingSlash: true`: Adds trailing slashes for Cloudflare compatibility
- `images.unoptimized: true`: Required for static export

### wrangler.toml
- Configures the Cloudflare Pages project
- Specifies the output directory (`./out`)

## Build Output
After running `npm run build`, the static files will be generated in the `out/` directory. This directory contains all the HTML, CSS, and JavaScript files needed for the static site.

## Troubleshooting

### Common Issues
1. **Build fails**: Check that all dependencies are installed
2. **Deployment fails**: Verify your Cloudflare API token and account ID
3. **Images not loading**: Ensure all image paths are relative and images are in the public directory

### Support
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
