# CoffeeOracle Deployment Guide 🚀

## Domain Setup: coffeeoracle.org

### 1. Domain Registration & DNS Configuration

#### Domain Registrar Setup
- **Domain:** coffeeoracle.org
- **Registrar:** Any reliable registrar (Namecheap, GoDaddy, Google Domains)
- **Duration:** Recommended 2-5 years

#### DNS Records Configuration
```
Type    Name    Value                    TTL
A       @       [YOUR_SERVER_IP]        300
CNAME   www     coffeeoracle.org        300
CNAME   api     api.coffeeoracle.org    300
```

### 2. SSL Certificate Setup

#### Automatic SSL (Recommended)
- Use Let's Encrypt for free SSL certificates
- Configure auto-renewal every 90 days
- Force HTTPS redirect

#### Manual SSL Setup
```bash
# Generate SSL certificate
sudo certbot --nginx -d coffeeoracle.org -d www.coffeeoracle.org

# Test renewal
sudo certbot renew --dry-run
```

### 3. Hosting Platform Options

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set custom domain
vercel domains add coffeeoracle.org
```

#### Option B: Netlify
```bash
# Build project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=out
```

#### Option C: Self-hosted VPS
```bash
# Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# Build and start
npm run build
pm2 start npm --name "coffeeoracle" -- start
```

### 4. Environment Variables

Create `.env.production` file:
```env
NEXT_PUBLIC_SITE_URL=https://coffeeoracle.org
NEXT_PUBLIC_SITE_NAME=CoffeeOracle
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

### 5. SEO & Performance Optimization

#### Google Search Console
1. Add property: `https://coffeeoracle.org`
2. Verify ownership (use HTML tag or DNS record)
3. Submit sitemap: `https://coffeeoracle.org/sitemap.xml`

#### Google Analytics
1. Create property for coffeeoracle.org
2. Add tracking code to layout.tsx
3. Set up goals and conversions

#### Performance Monitoring
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Core Web Vitals
npm install -g web-vitals
```

### 6. Security Headers

Already configured in `next.config.js`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- X-DNS-Prefetch-Control: on

### 7. Monitoring & Maintenance

#### Health Checks
```bash
# Check site status
curl -I https://coffeeoracle.org

# Monitor SSL certificate
openssl s_client -connect coffeeoracle.org:443 -servername coffeeoracle.org
```

#### Backup Strategy
- Daily database backups (if applicable)
- Weekly code repository backups
- Monthly full system backups

### 8. Post-Deployment Checklist

- [ ] Domain resolves correctly
- [ ] SSL certificate is valid
- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Images and assets load
- [ ] Forms work correctly
- [ ] Mobile responsiveness
- [ ] Performance scores > 90
- [ ] Google Search Console verified
- [ ] Analytics tracking working
- [ ] Social media previews working

### 9. Troubleshooting

#### Common Issues
1. **DNS not propagating:** Wait 24-48 hours
2. **SSL errors:** Check certificate validity
3. **404 errors:** Verify build output
4. **Performance issues:** Check image optimization

#### Support Resources
- **Vercel:** https://vercel.com/docs
- **Netlify:** https://docs.netlify.com
- **Let's Encrypt:** https://letsencrypt.org/docs

---

**Need help?** Contact: hello@coffeeoracle.org

**Happy deploying! ☕✨**
