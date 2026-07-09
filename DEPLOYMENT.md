# Deployment Guide for SmartLLM Cloud

## Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the official Next.js hosting platform and recommended for SmartLLM Cloud.

#### Deploy via Git

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Set environment variables in Vercel dashboard
5. Deploy with one click

#### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to your account
vercel login

# Deploy to production
vercel --prod
```

#### Environment Variables

Set in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://api.smartllm.cloud
NEXT_PUBLIC_APP_ENV=production
```

### 2. Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Run

```bash
# Build image
docker build -t smartllm-cloud .

# Run container
docker run -p 3000:3000 smartllm-cloud

# With environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.smartllm.cloud \
  smartllm-cloud
```

### 3. AWS (EC2 + CloudFront)

#### EC2 Setup

```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone repository
git clone your-repo-url
cd smartllm-cloud

# Install and build
pnpm install
pnpm build

# Start with PM2
npm install -g pm2
pm2 start pnpm --name "smartllm" --interpreter bash -- start
pm2 save
```

#### CloudFront Distribution

1. Create CloudFront distribution
2. Set S3 bucket as origin for static files
3. Point .next/static to S3
4. Set EC2 instance as origin for dynamic routes

### 4. Google Cloud Run

```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/smartllm-cloud

# Deploy to Cloud Run
gcloud run deploy smartllm-cloud \
  --image gcr.io/PROJECT_ID/smartllm-cloud \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://api.smartllm.cloud
```

### 5. DigitalOcean App Platform

```bash
# Create app.yaml
name: smartllm-cloud
services:
- name: web
  github:
    branch: main
    repo: username/smartllm-cloud
  build_command: pnpm build
  run_command: pnpm start
  http_port: 3000
  envs:
  - key: NEXT_PUBLIC_API_URL
    value: https://api.smartllm.cloud
```

Then deploy via DigitalOcean dashboard or CLI.

## Environment Variables

### Development (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development
```

### Staging (.env.staging)

```bash
NEXT_PUBLIC_API_URL=https://api-staging.smartllm.cloud
NEXT_PUBLIC_APP_ENV=staging
```

### Production (.env.production)

```bash
NEXT_PUBLIC_API_URL=https://api.smartllm.cloud
NEXT_PUBLIC_APP_ENV=production
NODE_ENV=production
```

## Performance Optimization

### 1. Image Optimization

Next.js automatically optimizes images. Use the Image component:

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="SmartLLM Logo"
  width={40}
  height={40}
  priority
/>
```

### 2. Code Splitting

Routes are automatically code-split. Dynamic imports for heavy components:

```typescript
const HeavyChart = dynamic(() => import('@/components/Charts'), {
  loading: () => <Skeleton />,
});
```

### 3. Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true pnpm build
```

### 4. Caching Headers

```typescript
// next.config.mjs
export default {
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

## Security Checklist

- [ ] HTTPS enabled (SSL/TLS certificate)
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Environment variables not exposed
- [ ] Secrets stored securely
- [ ] Rate limiting implemented
- [ ] Input validation enabled
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Regular security updates

### Security Headers (Next.js)

```typescript
// next.config.mjs
export default {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],
};
```

## Monitoring & Logging

### Vercel Analytics

Built-in analytics on Vercel dashboard:
- Web Vitals
- Custom metrics
- Error tracking

### Sentry for Error Tracking

```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
});
```

### LogRocket for Session Replay

```bash
pnpm add logrocket
```

```typescript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');
```

## Database Migrations

For production database updates:

```bash
# Create migration
npm run migrate:create UpdateUsers

# Run migrations
npm run migrate:up

# Rollback
npm run migrate:down
```

## Backup & Recovery

### Automated Backups

- Enable automated snapshots (2-3x daily)
- Store backups in multiple regions
- Test restore procedures monthly

### Manual Backup

```bash
# Backup database
pg_dump smartllm_prod > backup_$(date +%Y%m%d).sql

# Restore from backup
psql smartllm_prod < backup_20240101.sql
```

## Scaling

### Horizontal Scaling

- Load balancer (e.g., Nginx, HAProxy)
- Multiple app instances
- Session storage in Redis

### Vertical Scaling

- Increase CPU/RAM allocation
- Database connection pooling
- Cache optimization

### CDN for Static Assets

```typescript
// next.config.mjs
export default {
  images: {
    unoptimized: false, // Let Next.js optimize
    domains: ['cdn.smartllm.cloud'],
  },
};
```

## Troubleshooting

### Build Fails

```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

### Slow Performance

1. Check Web Vitals (Vercel dashboard)
2. Analyze bundle size: `ANALYZE=true pnpm build`
3. Optimize images and large components
4. Enable caching

### 404 Errors

1. Verify API endpoints are correct
2. Check CORS configuration on backend
3. Verify environment variables are set
4. Check CloudFront cache settings

### Memory Issues

1. Check for memory leaks (Vercel serverless log)
2. Optimize data processing
3. Implement pagination for large datasets
4. Use streaming for large responses

## Rollback Procedure

### Vercel

```bash
# Revert to previous deployment
vercel rollback
```

### Docker

```bash
# Pull previous image tag
docker pull smartllm-cloud:v1.2.0

# Run previous version
docker run -p 3000:3000 smartllm-cloud:v1.2.0
```

## Performance Targets

- **Lighthouse Score**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## Production Checklist

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] SSL certificate installed
- [ ] Monitoring enabled
- [ ] Backup system tested
- [ ] Log aggregation setup
- [ ] CDN configured
- [ ] Rate limiting enabled
- [ ] Caching strategy tested
- [ ] Incident response plan ready

## Contact & Support

For deployment issues:
- Check Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- Review error logs in your deployment platform

---

**Version**: 1.0.0  
**Last Updated**: July 2024
