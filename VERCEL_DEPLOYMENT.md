# Vercel Deployment Guide

## Overview
This project is configured for deployment on Vercel, which provides excellent support for Next.js applications with API routes.

## Prerequisites
1. Vercel account (free tier available)
2. GitHub repository connected to Vercel
3. Stripe account for payment processing

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js configuration

### 2. Environment Variables
Set these environment variables in your Vercel project:

```
# NOWPayments Configuration
NOWPAYMENTS_API_KEY=78WRCRN-GV3M3RB-HD1CHR9-HVXS5RZ
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_here

# App Configuration  
NEXT_PUBLIC_URL=https://your-domain.vercel.app
```

### 3. Automatic Deployments
- Every push to `master` branch triggers automatic deployment
- Vercel automatically builds and deploys your application
- Preview deployments are created for pull requests

### 4. Custom Domain (Optional)
1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Features Enabled
- ✅ API routes (Stripe checkout)
- ✅ Server-side rendering
- ✅ Dynamic routing
- ✅ Environment variables
- ✅ Automatic HTTPS
- ✅ Global CDN

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility (18.x recommended)
- Verify environment variables are set correctly

### API Route Issues
- Confirm `STRIPE_SECRET_KEY` is set
- Check Stripe API version compatibility
- Verify webhook endpoints if using webhooks

### Performance
- Vercel automatically optimizes images and assets
- Edge functions available for global performance
- Automatic caching and compression

## Support
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment#vercel)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
