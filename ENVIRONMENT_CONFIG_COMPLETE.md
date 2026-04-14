# ✅ Environment Configuration - Complete Setup

Your project is now fully configured to work on **both localhost and Vercel** without any code changes!

---

## 📋 What Was Fixed

### 1. **Hardcoded URLs → Environment Variables**
**Problem**: `chat.service.ts` had hardcoded `http://127.0.0.1:4000` URLs that would break on Vercel.

**Solution**: Created `getInternalApiUrl()` method that reads from `APP_URL` env variable:
```typescript
private getInternalApiUrl(): string {
  return process.env.APP_URL || 'http://localhost:4000';
}
```

**All API calls updated**:
- ✅ GET_PRODUCTS: `/api/v1/products`
- ✅ GET_CART: `/api/v1/cart`
- ✅ GET_WISHLIST: `/api/v1/wishlist`
- ✅ TRACK_ORDER: `/api/v1/orders`

### 2. **Production Environment Template Updated**
Files updated with critical `APP_URL` and `WEB_URL`:
- ✅ `PRODUCTION_ENV_TEMPLATE.md` - Added `GROQ_API_KEY`
- ✅ `VERCEL_DEPLOYMENT.md` - Added `APP_URL` and `WEB_URL` to env vars
- ✅ `apps/web/.env.production` - Clear Vercel setup instructions
- ✅ `QUICK_DEPLOY.md` - Highlighted critical variables

### 3. **New Documentation**
- ✅ **`ENV_SETUP_GUIDE.md`** - Comprehensive environment setup guide
  - Localhost configuration
  - Production configuration
  - How resolution works
  - Troubleshooting checklist

---

## 🚀 How It Works Now

### **Localhost (Development)**
```env
# apps/api/.env
APP_URL=http://localhost:4000
WEB_URL=http://localhost:3000

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```
↓ All API calls use `getInternalApiUrl()` = `http://localhost:4000`

### **Render Production**
```env
# Render (set in dashboard)
APP_URL=https://your-app.onrender.com
WEB_URL=https://your-app.vercel.app

# Vercel (set in dashboard)
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api/v1
```
↓ All API calls use `getInternalApiUrl()` = `https://your-app.onrender.com`

**No code changes needed!** 🎉

---

## ✅ Verification Checklist

### Local Development
- [ ] `apps/api/.env` has `APP_URL=http://localhost:4000`
- [ ] `apps/web/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`
- [ ] `pnpm dev` runs without errors
- [ ] Chat queries (show products, show cart, etc.) work
- [ ] Frontend connects to backend successfully

### Production Deployment
- [ ] Backend (Railway/Render) has `APP_URL=https://your-app.railway.app`
- [ ] Backend has `WEB_URL=https://your-app.vercel.app`
- [ ] Frontend (Vercel) has `NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1`
- [ ] Frontend has `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx`
- [ ] Chat features work in production
- [ ] No CORS errors in browser console

---

## 📝 Key Environment Variables

| Variable | Where | Purpose | Example |
|----------|-------|---------|---------|
| `APP_URL` | Backend (Railway) | Internal API base URL | `https://your-app.railway.app` |
| `WEB_URL` | Backend (Railway) | Frontend URL for CORS | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Frontend (Vercel) | Backend API endpoint | `https://your-app.railway.app/api/v1` |
| `PORT` | Backend | Server port | `4000` |
| `NODE_ENV` | Backend | Environment | `production` |
| `DATABASE_URL` | Backend | Neon connection | `postgresql://...` |
| `JWT_ACCESS_SECRET` | Backend | Auth token secret | random string |
| `JWT_REFRESH_SECRET` | Backend | Refresh token secret | random string |
| `GROQ_API_KEY` | Backend | AI chat service | your key |
| `RAZORPAY_KEY_ID` | Frontend + Backend | Payment gateway | `rzp_live_xxx` |

---

## 🔄 Routing Resolution

### Backend API Calls (Chat Service)
```
localhost: APP_URL env var → http://localhost:4000
production: APP_URL env var → https://your-app.onrender.com
Fallback: http://localhost:4000
```

### Frontend API Calls
```
localhost: NEXT_PUBLIC_API_URL env || http://localhost:4000/api/v1
production: NEXT_PUBLIC_API_URL env from Vercel
```

### CORS Configuration
```
Backend: origin from WEB_URL env || http://localhost:3000
Allows frontend to communicate with backend
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `ENV_SETUP_GUIDE.md` | **START HERE** - Complete env variable guide |
| `PRODUCTION_ENV_TEMPLATE.md` | Template of all production variables |
| `QUICK_DEPLOY.md` | Quick deployment checklist |
| `VERCEL_DEPLOYMENT.md` | Detailed Vercel deployment steps |
| `.env.production` | Frontend production template |
| `docker-compose.yml` | Local production-like setup |

---

## 🎯 Next Steps

1. **For Localhost Development**
   - Ensure `.env` and `.env.local` are properly set
   - Run `pnpm dev`
   - Test all features work

2. **For Vercel Deployment**
   - Follow `QUICK_DEPLOY.md` or `VERCEL_DEPLOYMENT.md`
   - Set all environment variables as documented
   - Redeploy when env vars change

3. **No More Hardcoding!**
   - All URLs are now environment-based
   - Same code works everywhere
   - Just change env vars to switch environments

---

## ❓ Questions?

- **Need to understand all env vars?** → Read `ENV_SETUP_GUIDE.md`
- **Deploying to Vercel?** → Follow `QUICK_DEPLOY.md`
- **Having CORS issues?** → Check `VERCEL_DEPLOYMENT.md` Troubleshooting
- **Local setup not working?** → Ensure `.env` and `.env.local` match examples

---

**Your project is now production-ready and environment-agnostic!** ✨
