# CropCloud Vercel Deployment Guide

## Overview
This monorepo contains a Next.js frontend (apps/web) and NestJS backend (apps/api). Vercel is designed for frontend hosting, so deployment strategy:

- **Frontend (Next.js)**: Deploy to Vercel
- **Backend (NestJS API)**: Deploy to Railway, Render, Fly.io, or another backend hosting service

---

## Part 1: Deploy Frontend to Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub account with the repository connected

### Steps

1. **Connect Repository to Vercel**
   ```bash
   # Using Vercel CLI
   npm i -g vercel
   vercel
   ```

2. **Configure Vercel Project**
   - Root Directory: Leave empty (Vercel auto-detects from vercel.json)
   - Framework: Next.js (auto-detected)
   - Build Command: `pnpm build --filter=web`
   - Output Directory: `apps/web/.next`
   - Environment Variables: (see below)

3. **Set Environment Variables in Vercel Dashboard**
   - Go to: Settings → Environment Variables
   - Add the following:
     ```
     NEXT_PUBLIC_API_URL = https://your-api-domain.com/api/v1
     NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_YOUR_PRODUCTION_KEY
     ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

---

## Part 2: Deploy Backend to Railway/Render

### Option A: Railway (Recommended)

1. **Create Railway Account** (https://railway.app)

2. **Connect GitHub Repository**
   - Create new project
   - Select "Deploy from GitHub"
   - Select this repository

3. **Configure Service**
   - Select the main branch
   - Service: NestJS
   - Framework: Node.js

4. **Set Build & Start Commands**
   - Build command: `pnpm install && pnpm build --filter=api`
   - Start command: `pnpm start --filter=api`

5. **Add Environment Variables in Railway**
   ```
   PORT=4000
   NODE_ENV=production
   DATABASE_URL=postgresql://...  (your Neon connection string)
   JWT_ACCESS_SECRET=your_production_secret
   JWT_REFRESH_SECRET=your_production_secret
   JWT_ACCESS_TTL=15m
   JWT_REFRESH_TTL=7d
   RAZORPAY_KEY_ID=rzp_live_...
   RAZORPAY_KEY_SECRET=...
   NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
   STORAGE_DRIVER=local
   PLATFORM_FEE_PERCENT=2.5
   OTP_DELIVERY_MODE=console
   RESEND_API_KEY=...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=...
   SMTP_PASS=...
   MAIL_FROM=...
   ```

6. **Get Public URL**
   - Railway provides a public URL like `https://your-app.railway.app`
   - Update Vercel's `NEXT_PUBLIC_API_URL` to this URL

### Option B: Render

1. **Create Render Account** (https://render.com)

2. **Create New Web Service**
   - Connect GitHub
   - Select repository
   - Name: `cropcloud-api`
   - Environment: Node
   - Build Command: `pnpm install && pnpm build --filter=api`
   - Start Command: `pnpm start --filter=api`

3. **Set Environment Variables** (same as Railway above)

4. **Deploy** - Render will auto-deploy from main branch

---

## Part 3: Connect Frontend & Backend

After both deployments:

1. **Get API URL** from your backend hosting (Railway/Render)
   - Example: `https://cropcloud-api.railway.app/api/v1`

2. **Update Vercel Environment Variable**
   - Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to your backend URL
   - Trigger a redeployment

3. **Update App URLs**
   - Backend: Add your Vercel domain to CORS/allowed origins
   - Frontend: `.env.production` should reference backend URL

---

## Part 4: Database Configuration

### Using Neon (PostgreSQL)
Your `.env` already has Neon connection. Ensure it's set in backend hosting:
```
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-lively-pine-anx3mb5s-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Verify Migrations
```bash
# In production backend container
pnpm db:migrate
pnpm db:seed  # Only once for initial data
```

---

## Troubleshooting

### CORS Issues
If frontend can't connect to backend:
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings
- Add Vercel domain to backend's allowed origins

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure ip whitelist includes hosting provider's IPs (usually unrestricted on Neon)

### Build Fails
- Ensure `pnpm` workspaces are configured
- Check that all dependencies are installed
- Review build logs in deployment dashboard

---

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Environment variables set in backend hosting
- [ ] Database migrations run in production
- [ ] CORS configured correctly
- [ ] API URL updated in frontend
- [ ] SSL/HTTPS enabled (auto on both Vercel & Railway/Render)
- [ ] Sensitive keys are not in git (use dashboard secrets)
- [ ] Custom domain configured (optional)
- [ ] Monitor logs for errors

---

## Local Development After Setup

```bash
# Frontend (points to production API)
cd apps/web
pnpm dev  # Will use NEXT_PUBLIC_API_URL from .env.local

# Or point to local backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 pnpm dev
```

---

## Quick Deployment Commands

```bash
# Deploy frontend to Vercel (after git push)
vercel --prod

# Or via GitHub - automatic on main branch push

# Manual backend restart (Railway)
railway up

# Manual backend restart (Render)
# Use dashboard or git push to trigger
```

---

## Support

For issues:
1. Check deployment platform logs (Vercel/Railway/Render)
2. Verify environment variables are set
3. Test API connection: `curl https://your-api-url/api/v1/health`
4. Check database connection in backend logs
