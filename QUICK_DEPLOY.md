# CropCloud Vercel Deployment - Quick Start

## 📋 Pre-Deployment Checklist

- [ ] Git repository is clean and up-to-date
- [ ] All environment variables are documented
- [ ] Neon database is set up and running
- [ ] JWT secrets are generated (use strong random strings)
- [ ] Razorpay production keys obtained
- [ ] Email/SMTP credentials available

---

## ⚡ Quick Deployment Steps

### 1️⃣ Frontend Deployment (5 minutes)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to Vercel
cd apps/web
vercel --prod
```

**or use GitHub integration:**
- Go to https://vercel.com
- Click "Add New" → "Project"
- Select your GitHub repository
- Vercel auto-detects Next.js app
- Click "Deploy"

### 2️⃣ Backend Deployment (10 minutes)

**Railway (Recommended):**
1. Go to https://railway.app
2. Create new project
3. Select "Deploy from GitHub"
4. Select your repository
5. Railway auto-detects Node.js
6. Set these environment variables:
   - `DATABASE_URL` = your Neon connection string
   - `JWT_ACCESS_SECRET` = random string
   - `JWT_REFRESH_SECRET` = random string
   - (see `PRODUCTION_ENV_TEMPLATE.md` for all variables)
7. Deploy!

### 3️⃣ Connect Frontend to Backend (2 minutes)

Get your Railway URL (looks like `https://your-app.railway.app`)

In Vercel Dashboard:
1. Settings → Environment Variables
2. Update: `NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1`
3. Redeploy frontend: `vercel --prod`

### 4️⃣ Test It Works

- Visit your Vercel frontend URL
- Login with: `buyer@cropcloud.dev` / `Buyer@123`
- You should see the homepage!

---

## 📁 Files Created for Deployment

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel configuration (monorepo setup) |
| `.vercelignore` | Files to exclude from Vercel deploy |
| `apps/web/.env.production` | Production env vars template |
| `apps/api/Dockerfile` | Docker image for API |
| `docker-compose.yml` | Local production-like setup |
| `VERCEL_DEPLOYMENT.md` | Detailed deployment guide |
| `PRODUCTION_ENV_TEMPLATE.md` | All env vars needed |
| `deploy.sh` | Deployment helper script |

---

## 🔧 Environment Variables Quick Reference

**Frontend (apps/web/.env.production):**
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
```

**Backend (set in Railway dashboard):**
```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=generate_a_random_string
JWT_REFRESH_SECRET=generate_another_random_string
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
And others from PRODUCTION_ENV_TEMPLATE.md
```

---

## 🚀 Production URLs You'll Get

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API Endpoint**: `https://your-app.railway.app/api/v1`

---

## ⚠️ Common Issues & Fixes

**"Can't connect to API"**
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is running on Railway
- Test: `curl https://your-api.railway.app/api/v1`

**"Login fails"**
- Check database connection in backend logs
- Verify JWT secrets are set
- Clear browser cookies and try again

**"Build fails on Vercel"**
- Check build logs in Vercel dashboard
- Ensure `pnpm-lock.yaml` is committed
- Verify Node version: 20.x or higher

---

## 📊 Deployment Architecture

```
Internet
    ↑
┌───────────────────────────────┐
│   Vercel (frontend)           │
│   - Next.js app               │
│   - Hosted at vercel.app      │
└───────────────┬───────────────┘
                │
     API calls  │
                ↓
┌───────────────────────────────┐
│   Railway (backend)           │
│   - NestJS server             │
│   - Hosted at railway.app     │
└───────────────┬───────────────┘
                │
     SQL query  │
                ↓
┌───────────────────────────────┐
│   Neon (database)             │
│   - PostgreSQL                │
│   - Already configured        │
└───────────────────────────────┘
```

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (optional)
   - Add custom domain in Vercel Settings
   - Update backend URL in frontend

2. **Monitoring**
   - Set up error tracking (Sentry.io)
   - Monitor database performance (Neon dashboard)
   - Check Railway logs for API errors

3. **Scaling**
   - As traffic increases, upgrade Railway app
   - Monitor Neon database usage

---

## 📞 Support Resources

- **Vercel**: https://vercel.com/docs (deployment issues)
- **Railway**: https://docs.railway.app (backend issues)
- **Neon**: https://neon.tech/docs (database issues)
- **Next.js**: https://nextjs.org/docs (frontend issues)

---

## 🎉 You're Done!

Your CropCloud app is now in production! 

Check these URLs:
- Frontend: https://your-app.vercel.app
- API Health: https://your-app.railway.app/api/v1
- Database: Check Neon dashboard

Celebrate! 🚀
