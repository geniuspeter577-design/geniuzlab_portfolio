# GeniuzLab Portfolio - Deployment & Operations Guide

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)
10. [Scaling & Performance](#scaling--performance)

---

## Pre-Deployment Checklist

### Before Going Live

- [ ] All environment variables configured
- [ ] Database migrations applied and tested
- [ ] SSL/TLS certificates installed
- [ ] Backup strategy in place
- [ ] Monitoring and alerts configured
- [ ] Admin credentials created and secured
- [ ] Vercel Blob token obtained and configured
- [ ] Domain configured with DNS
- [ ] CORS settings correct for frontend/backend
- [ ] Rate limiting configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Load testing completed

### Code Quality

- [ ] All tests passing
- [ ] ESLint passes without warnings
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings
- [ ] Code review completed
- [ ] Security audit passed
- [ ] Performance optimized (Lighthouse score > 80)

---

## Environment Setup

### Production Environment Variables

Create `.env.production` files for each app:

#### apps/web/.env.production

```env
# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.geniuzlab.com
NEXT_PUBLIC_APP_URL=https://geniuzlab.com

# Vercel Blob
NEXT_PUBLIC_BLOB_STORE_ID=your-store-id
BLOB_READ_WRITE_TOKEN=your-blob-token

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

#### apps/backend/.env.production

```env
# Server
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@prod-db-host:5432/geniuzlab_prod

# Authentication
AUTH_SECRET=your-secure-32-char-secret-change-this
JWT_EXPIRY=7d

# Admin
ADMIN_EMAIL=admin@geniuzlab.com
ADMIN_PASSWORD_HASH=bcrypt-hash-of-admin-password

# CORS
CORS_ORIGIN=https://geniuzlab.com

# Image Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# Error Tracking
SENTRY_DSN=https://xxx@sentry.io/project-id
```

### Secrets Management

**Never commit `.env.production` files to Git!**

Use platform-specific secret management:

- **Vercel**: Use Environment Variables in project settings
- **Railway/Render**: Use secret management dashboard
- **AWS**: Use Systems Manager Parameter Store or Secrets Manager
- **Self-hosted**: Use Docker secrets or encrypted files

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Advantages:**
- Built-in Next.js optimization
- Automatic deployments on git push
- Global CDN
- Built-in analytics

**Setup:**

1. **Connect repository**
   ```bash
   # Via GitHub, GitLab, or Bitbucket
   # Login to vercel.com and import repository
   ```

2. **Configure project**
   - Framework: Next.js
   - Root directory: `./apps/web`
   - Environment variables: Add from `.env.production`

3. **Add build settings**
   ```
   Build Command: npm run build --workspace=@geniuzlab/web
   Output Directory: .next
   ```

4. **Deploy**
   ```bash
   # Automatic on git push to main
   # Or manual:
   vercel --prod
   ```

### Option 2: Netlify

**Setup:**

1. Connect repository (GitHub/GitLab)
2. Configure build settings:
   ```
   Base directory: apps/web
   Build command: npm run build
   Publish directory: .next/standalone
   ```

3. Add environment variables in Netlify dashboard
4. Deploy: `netlify deploy --prod`

### Option 3: Self-Hosted (Docker)

**Dockerfile for frontend:**

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=@geniuzlab/web

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package*.json ./apps/web/
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start", "--workspace=@geniuzlab/web"]
```

**Build and run:**

```bash
docker build -t geniuzlab-web:1.0.0 -f apps/web/Dockerfile .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.geniuzlab.com \
  geniuzlab-web:1.0.0
```

### Performance Optimization

```typescript
// apps/web/next.config.ts
export default {
  images: {
    domains: ['blob.vercelusercontent.com', 'your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: false, // Enable optimization
  },
  compress: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@geniuzlab/shared'],
  },
};
```

---

## Backend Deployment

### Option 1: Railway

**Setup:**

1. Connect GitHub repository
2. Create PostgreSQL database
3. Add service for backend:
   - Root directory: `/apps/backend`
   - Build command: `npm run build`
   - Start command: `npm start`
4. Set environment variables
5. Deploy

### Option 2: Render

**Setup:**

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Root directory: `apps/backend`
   - Build command: `npm run build`
   - Start command: `npm start`
4. Create PostgreSQL database from Render dashboard
5. Add DATABASE_URL environment variable
6. Deploy

### Option 3: AWS (Elastic Beanstalk + RDS)

**Dockerfile for backend:**

```dockerfile
# apps/backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci

COPY . .
RUN npm run build --workspace=@geniuzlab/backend

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY apps/backend/package*.json ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
```

**Deploy to Elastic Beanstalk:**

```bash
# Install EB CLI
pip install awsebcli --upgrade --user

# Initialize
eb init -p docker geniuzlab-backend

# Create environment
eb create geniuzlab-prod

# Deploy
eb deploy
```

### Option 4: Self-Hosted (VPS)

**Steps:**

1. **Provision server** (Ubuntu 22.04 recommended)
2. **Install dependencies**
   ```bash
   sudo apt update && sudo apt upgrade
   sudo apt install nodejs npm postgresql nginx certbot
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/geniuspeter577-design/geniuzlab_portfolio.git
   cd geniuzlab_portfolio
   ```

4. **Install and build**
   ```bash
   npm install
   npm run build --workspace=@geniuzlab/backend
   ```

5. **Create systemd service**
   ```ini
   # /etc/systemd/system/geniuzlab-backend.service
   [Unit]
   Description=GeniuzLab Backend API
   After=network.target postgresql.service

   [Service]
   Type=simple
   User=geniuzlab
   WorkingDirectory=/home/geniuzlab/geniuzlab_portfolio/apps/backend
   ExecStart=/usr/bin/node /home/geniuzlab/geniuzlab_portfolio/apps/backend/dist/index.js
   Restart=always
   Environment="NODE_ENV=production"
   EnvironmentFile=/home/geniuzlab/.env.production

   [Install]
   WantedBy=multi-user.target
   ```

6. **Start service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable geniuzlab-backend
   sudo systemctl start geniuzlab-backend
   ```

7. **Configure reverse proxy (Nginx)**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name api.geniuzlab.com;

       ssl_certificate /etc/letsencrypt/live/api.geniuzlab.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.geniuzlab.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

8. **Enable SSL with Certbot**
   ```bash
   sudo certbot certonly --nginx -d api.geniuzlab.com
   ```

---

## Database Setup

### PostgreSQL Deployment

#### Cloud Option: Supabase (Recommended)

1. **Create Supabase project**
   - Go to https://supabase.com
   - Create new project
   - Copy connection string

2. **Configure environment**
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
   ```

3. **Run migrations**
   ```bash
   npm run db:migrate
   ```

#### Self-Hosted PostgreSQL

**Install PostgreSQL:**

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Create database and user:**

```bash
sudo -u postgres psql

# In psql:
CREATE USER geniuzlab WITH PASSWORD 'secure-password';
CREATE DATABASE geniuzlab_prod OWNER geniuzlab;
GRANT ALL PRIVILEGES ON DATABASE geniuzlab_prod TO geniuzlab;
ALTER DATABASE geniuzlab_prod OWNER TO geniuzlab;
```

**Backup strategy:**

```bash
# Daily backup (add to crontab)
0 2 * * * pg_dump postgresql://geniuzlab:password@localhost/geniuzlab_prod > /backups/geniuzlab_$(date +\%Y\%m\%d).sql

# Weekly remote backup
0 3 * * 0 aws s3 cp /backups/geniuzlab_latest.sql s3://my-bucket/backups/
```

### Database Migrations

```bash
# Create new migration
npm run db:migrate -- --name add_feature_name

# Review migrations
ls prisma/migrations/

# Push schema without migration file (dev only)
npm run db:push
```

---

## Monitoring & Maintenance

### Health Checks

**Frontend:**
```bash
curl https://geniuzlab.com/
# Check for 200 OK and page content
```

**Backend:**
```bash
curl https://api.geniuzlab.com/health
# Should return: { "status": "ok", "timestamp": "..." }
```

### Error Tracking

**Setup Sentry:**

1. Create Sentry account (https://sentry.io)
2. Create project for each app
3. Add to environment variables:
   ```env
   SENTRY_DSN=https://key@sentry.io/project
   ```

4. Configure in apps:
   ```typescript
   // Backend
   import * as Sentry from "@sentry/node";
   Sentry.init({ dsn: process.env.SENTRY_DSN });

   // Frontend
   import * as Sentry from "@sentry/nextjs";
   Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
   ```

### Logging

**Backend logging:**

```typescript
// apps/backend/src/middleware/logger.ts
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});
```

**Log aggregation (ELK Stack, Datadog, etc.):**

- Collect logs from all services
- Search and analyze with dashboard
- Set up alerts for errors

### Database Maintenance

```bash
# Weekly maintenance
VACUUM ANALYZE;

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Monitor slow queries
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

---

## Rollback Procedures

### Frontend Rollback (Vercel)

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous stable deployment
4. Click "... → Promote to Production"

### Backend Rollback

**With Docker:**
```bash
# Rollback to previous image
docker run -d \
  -e DATABASE_URL=$DATABASE_URL \
  geniuzlab-backend:1.0.0-previous
```

**With Systemd:**
```bash
# Restore previous database backup
pg_restore -d geniuzlab_prod backup_2024-01-15.sql

# Revert code
git revert <commit-hash>
npm run build
sudo systemctl restart geniuzlab-backend
```

**With Git:**
```bash
# Create rollback branch
git checkout <previous-stable-tag>
npm run build
# Deploy and test
git checkout main  # Return to main after confirming
```

---

## Troubleshooting

### Frontend Issues

**White screen or 404 errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check deployment logs
vercel logs
```

**Slow performance:**
```bash
# Analyze bundle
npm run build -- --analyze

# Check image optimization
# Ensure images use next/image component
```

### Backend Issues

**Database connection errors:**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Verify credentials in .env
echo $DATABASE_URL
```

**Port already in use:**
```bash
lsof -i :3001
kill -9 <PID>
```

**High memory usage:**
```bash
# Check for memory leaks
node --inspect dist/index.js
# Open chrome://inspect in Chrome
```

### Application Errors

**Check logs:**
```bash
# Frontend (Vercel)
vercel logs

# Backend (systemd)
journalctl -u geniuzlab-backend -f

# Docker
docker logs <container-id>
```

**Enable debug mode:**
```env
DEBUG=*
NODE_ENV=development
LOG_LEVEL=debug
```

---

## Security Considerations

### SSL/TLS Certificates

```bash
# Auto-renew Let's Encrypt (already configured with Certbot)
sudo certbot renew --dry-run

# Verify certificate
openssl s_client -connect api.geniuzlab.com:443
```

### Environment Variables

- [ ] Never commit `.env.local` or `.env.production`
- [ ] Rotate AUTH_SECRET regularly
- [ ] Use strong passwords (32+ characters)
- [ ] Update DATABASE_URL credentials periodically
- [ ] Restrict access to secrets management console

### Database Security

```sql
-- Create read-only user for backups
CREATE USER backup_user WITH PASSWORD 'backup-password';
GRANT CONNECT ON DATABASE geniuzlab_prod TO backup_user;
GRANT USAGE ON SCHEMA public TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;

-- Enable SSL for connections
ALTER SYSTEM SET ssl = on;
```

### API Security

```typescript
// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Input validation
import { z } from 'zod';

const ProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(10).max(500),
});
```

---

## Scaling & Performance

### Caching Strategy

**Frontend:**
- Use Next.js ISR (Incremental Static Regeneration)
- Set Cache-Control headers
- Use CDN for static assets

```typescript
export const revalidate = 3600; // Revalidate every hour
```

**Backend:**
```typescript
// Redis cache for frequently accessed data
import redis from 'redis';
const cache = redis.createClient();

app.get('/api/projects', async (req, res) => {
  const cached = await cache.get('projects');
  if (cached) return res.json(JSON.parse(cached));

  const projects = await db.project.findMany();
  await cache.setex('projects', 3600, JSON.stringify(projects));
  res.json(projects);
});
```

### Database Optimization

- Add indexes on frequently queried columns
- Paginate large result sets
- Use connection pooling

```typescript
// Connection pooling with Prisma
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});
```

### Load Balancing

**Multiple backend instances:**
```nginx
upstream backend {
  server backend1.geniuzlab.com:3001;
  server backend2.geniuzlab.com:3001;
  server backend3.geniuzlab.com:3001;
}

server {
  listen 443 ssl;
  server_name api.geniuzlab.com;

  location / {
    proxy_pass http://backend;
    proxy_next_upstream error timeout http_503;
  }
}
```

### Monitoring Performance

```bash
# Monitor server resources
top
df -h
netstat -i

# Monitor Node.js
node --prof dist/index.js
node --prof-process isolate-*.log > profile.txt
```

---

## Maintenance Schedule

### Daily
- [ ] Check error tracking dashboard
- [ ] Verify health checks pass
- [ ] Review application logs

### Weekly
- [ ] Database backup verification
- [ ] Performance metrics review
- [ ] Security update checks

### Monthly
- [ ] Full database backup test
- [ ] SSL certificate expiry check
- [ ] Dependency security audit (npm audit)
- [ ] Performance optimization review

### Quarterly
- [ ] Load testing
- [ ] Security penetration test
- [ ] Disaster recovery drill
- [ ] Capacity planning review

---

## Emergency Contacts & Procedures

### Incident Response

1. **Critical error detected**
   - Check error tracking (Sentry)
   - Review recent deployments
   - Decide: Fix & Deploy or Rollback

2. **Database outage**
   - Verify PostgreSQL service status
   - Check connection pool
   - Restore from backup if needed

3. **Security breach**
   - Immediate: Rotate AUTH_SECRET
   - Force password reset for admin
   - Review access logs
   - Deploy security patch
   - Notify users if data exposed

4. **Performance degradation**
   - Check database queries
   - Review recent code changes
   - Enable caching
   - Scale up resources if needed

---

## Useful Commands Reference

```bash
# Deployment
git push origin main  # Triggers automatic deployment

# Database
npm run db:migrate -- --name migration_name
npm run db:push
npm run db:seed

# Backup
pg_dump $DATABASE_URL > backup.sql
pg_restore -d geniuzlab_prod backup.sql

# Logs
tail -f /var/log/syslog
journalctl -u geniuzlab-backend -f
docker logs -f <container>

# Restart services
sudo systemctl restart geniuzlab-backend
sudo systemctl restart nginx

# SSL Certificate
sudo certbot renew
openssl s_client -connect api.geniuzlab.com:443

# Health check
curl https://geniuzlab.com
curl https://api.geniuzlab.com/health
```

