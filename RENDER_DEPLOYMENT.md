# Render Backend Deployment Guide

## Prerequisites
- Render account (free at https://render.com)
- GitHub repository (already set up) ✅
- **Neon PostgreSQL database** (already set up) ✅
- Neon connection string (DATABASE_URL)

---

## Step 1: Get Your Neon Database Connection String

1. Go to **https://console.neon.tech**
2. Select your project
3. Copy the **Connection String** (looks like):
   ```
   postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Save this** - you'll need it in Step 3

---

## Step 2: Deploy NestJS API on Render

1. Click **New +** → **Web Service**
2. **Connect GitHub**:
   - Select your repository: `CROPCLOUDV2-MAIN`
   - Branch: `master`
   - Root Directory: `apps/api`

3. **Configure Service**:
   - **Name**: `cropcloud-api`
   - **Environment**: `Node`
   - **Region**: Match your database region
   - **Build Command**: 
     ```
     npm install -g pnpm && pnpm install && pnpm build
     ```
   - **Start Command**: 
     ```
     pnpm start
     ```
   - **Plan**: Free tier

4. Click **Create Web Service**

---

## Step 3: Set Environment Variables

In Render dashboard, go to your API service → **Environment**:

```
# Database (from Neon)
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Secrets (generate random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# API Configuration
PORT=4000
NODE_ENV=production
APP_URL=https://your-api.onrender.com

# Frontend URL (for CORS)
WEB_URL=https://your-frontend.vercel.app

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Services
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
RESEND_API_KEY=your_resend_key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=noreply@yourdomain.com

# Platform Configuration
STORAGE_DRIVER=local
PLATFORM_FEE_PERCENT=2.5
OTP_DELIVERY_MODE=email
```

---

## Step 4: Run Database Migrations

After deployment, run migrations:

```bash
# Option 1: Via Render Shell
# Go to service → Shell and run:
pnpm dlx prisma migrate deploy

# Option 2: Via GitHub Actions (recommended for future deployments)
# Add this to .github/workflows/migrate.yml
```

---

## Step 5: Connect Frontend to Backend

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1
   ```
3. Redeploy frontend

---

## Step 6: Test the Connection

```bash
# Test API health
curl https://your-api.onrender.com/api/v1/health

# Test from frontend
# Check browser console for connectivity
```

---

## Important Notes

- ⚠️ **Render free tier** may take 15-30s to wake up (cold starts)
- 🔄 **Database backups**: Set up in Render dashboard
- 🔐 **CORS**: Already configured for Vercel domain
- 📝 **Logs**: Available in Render dashboard for debugging
- 🗄️ **Prisma**: Migrations run during build if configured

---

## Useful Commands for Deployment

```bash
# Build locally to test
cd apps/api && pnpm build

# Run migrations locally
pnpm dlx prisma migrate deploy

# Generate Prisma client
pnpm dlx prisma generate

# Seed database
pnpm dlx prisma db seed
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check logs in Render dashboard |
| Database won't connect | Verify CONNECTION_URL format |
| 502 Bad Gateway | API might be starting, wait 30-60s |
| CORS errors | Update WEB_URL in env vars |
| Migrations fail | Manually run via Render Shell |

