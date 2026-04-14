# CropCloud Vercel Deployment - Quick Start

## 📋 Pre-Deployment Checklist

- [ ] Git repository is clean and up-to-date
- [ ] All environment variables are documented (see `ENV_SETUP_GUIDE.md`)
- [ ] Neon database is set up and running
- [ ] JWT secrets are generated (use strong random strings)
- [ ] Razorpay production keys obtained
- [ ] Email/SMTP credentials available
- [ ] GROQ API key available

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

**Render (Recommended):**
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `cropcloud-api`
   - Environment: Node
   - Region: Choose closest to your users
   - Branch: main
   - Build Command: `pnpm install && pnpm build --filter=api`
   - Start Command: `pnpm start --filter=api`
6. Set these **critical** environment variables:
   - `APP_URL` = `https://your-app.onrender.com` (your public Render URL)
   - `WEB_URL` = `https://your-app.vercel.app` (your Vercel frontend URL)
   - `DATABASE_URL` = your Neon connection string
   - `JWT_ACCESS_SECRET` = random string
   - `JWT_REFRESH_SECRET` = random string
   - `GROQ_API_KEY` = your Groq API key
   - (see `PRODUCTION_ENV_TEMPLATE.md` for all variables)
7. Click "Deploy" and wait for completion

### 3️⃣ Connect Frontend to Backend (2 minutes)

Get your Render URL (looks like `https://your-app.onrender.com`)

In Vercel Dashboard:
1. Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api/v1`
3. Add: `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx`
4. Redeploy frontend: `vercel --prod`

### 4️⃣ Test It Works

- Visit your Vercel frontend URL
- Login with: `buyer@cropcloud.dev` / `Buyer@123`
- Chat should work with product listing
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
| `ENV_SETUP_GUIDE.md` | Detailed environment setup |
| `VERCEL_DEPLOYMENT.md` | Detailed deployment guide |
| `PRODUCTION_ENV_TEMPLATE.md` | All env vars needed |
| `deploy.sh` | Deploymentender)
```
APP_URL=https://your-app.onrender.com         # Use your public Render URL
WEB_URL=https://your-app.vercel.app           # Use your Vercel domain
GROQ_API_KEY=your_key                         # For AI chat features
```

### Frontend (must set in Vercel)
```
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
```

---

## 💡 How It Works (Zero Code Changes!)

**Automatic Environment Detection:**
- Localhost: API calls default to `http://localhost:4000`
- Production: API calls use your Render

## 💡 How It Works (Zero Code Changes!)

**Automatic Environment Detection:**
- Localhost: API calls default to `http://localhost:4000`
- Production: API calls use your Railway `APP_URL`
- Frontend always uses `NEXT_PUBLIC_API_URL`

No hardcoded URLs = Same code runs everywhere!

---

## ❓ Troubleshooting

See `VERCEL_DEPLOYMENT.md` for detailed troubleshooting guide.

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
