# 🌾 CropCloud Deployment Roadmap

A complete guide for running this project in **localhost**, **production-like docker**, and **Render + Vercel**.

---

## 🎯 Quick Navigation

### I want to...

| Goal | Read This | Time |
|------|-----------|------|
| **Run locally for development** | [LOCALHOST_DEPLOYMENT.md](LOCALHOST_DEPLOYMENT.md) | 5 min ⚡ |
| **Test production deployment locally** | [LOCALHOST_DEPLOYMENT.md](LOCALHOST_DEPLOYMENT.md) - Option 2 | 10 min 🐳 |
| **Set up environment variables** | [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) | 10 min 🔧 |
| **Deploy to Render + Vercel** | [QUICK_DEPLOY.md](QUICK_DEPLOY.md) | 15 min 🚀 |
| **Understand the setup** | [ENVIRONMENT_CONFIG_COMPLETE.md](ENVIRONMENT_CONFIG_COMPLETE.md) | 5 min 📚 |
| **Detailed Vercel deployment** | [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | 20 min 📖 |
| **Production environment template** | [PRODUCTION_ENV_TEMPLATE.md](PRODUCTION_ENV_TEMPLATE.md) | 5 min ✅ |

---

## 🚀 Deployment Flow

```
Development                Production-Like           Production
(pnpm dev)               (docker-compose)          (Render + Vercel)
   │                            │                        │
   ├─ Frontend: 3000            ├─ API: 4000             ├─ Vercel
   ├─ Backend: 4000             ├─ PostgreSQL            ├─ Render
   └─ Neon DB (cloud)           └─ Local PostgreSQL      └─ Neon DB
```

---

## 📍 Environment Variables by Stage

### **Stage 1: Localhost Development**

**File**: `apps/api/.env` (already configured)

```env
APP_URL=http://localhost:4000       # Backend URL
WEB_URL=http://localhost:3000       # Frontend URL
DATABASE_URL=postgresql://...       # Neon cloud database
GROQ_API_KEY=your_key              # AI chat
```

**Start**: `pnpm dev`

✅ **What's included:**
- Hot reload with code changes
- Both frontend & backend running
- Cloud database (Neon)
- All AI/payment services

---

### **Stage 2: Production-Like (Docker Compose)**

**File**: `docker-compose.yml` (preconfigured)

```env
NODE_ENV=production                 # Simulates production
DATABASE_URL=local PostgreSQL        # Local database in Docker
```

**Start**: `docker-compose up --build`

✅ **What's included:**
- Full containerization
- Production-like environment
- Local database testing
- No code changes between dev and production

---

### **Stage 3: Render Production**

**Vercel Dashboard** + **Render Dashboard**

```env
# Render
APP_URL=https://your-app.onrender.com
WEB_URL=https://your-app.vercel.app

# Vercel
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api/v1
```

**Start**: Push to GitHub → Auto-deploy to Render & Vercel

✅ **What's included:**
- Auto-deploy on every push
- SSL/HTTPS
- Global CDN (Vercel)
- Production database (Neon with connection pooling)

---

## 🔄 How Environment Variables Work

### **Automatic Detection**

Your code has **zero hardcoded URLs**. It automatically detects the environment:

```typescript
// Backend: apps/api/src/chat/chat.service.ts
private getInternalApiUrl(): string {
  return process.env.APP_URL || 'http://localhost:4000';
}

// Frontend: apps/web/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
```

| Environment | APP_URL | Result |
|-------------|---------|--------|
| **Localhost** | `http://localhost:4000` | Uses localhost 🏠 |
| **Docker** | `http://localhost:4000` | Uses localhost 🏠 |
| **Render** | `https://your-app.onrender.com` | Uses Render 🌐 |

**Same code. Different environments. No changes needed!** ✨

---

## 📊 Comparison Table

| Aspect | Localhost | Docker Compose | Render + Vercel |
|--------|-----------|-----------------|-----------------|
| **Setup Time** | 5 min ⚡ | 10 min 🐳 | 15 min 🚀 |
| **Hot Reload** | ✅ Yes | ❌ No | ❌ No |
| **Production-like** | ❌ No | ✅ Yes | ✅ Yes |
| **Database** | ☁️ Neon Cloud | 🏠 Local | ☁️ Neon Cloud |
| **Cost** | FREE | FREE | ~$10/month |
| **Auto-deploy** | ❌ No | ❌ No | ✅ From GitHub |
| **HTTPS** | ❌ No | ❌ No | ✅ Yes |
| **Use Case** | Development | Testing | Production |

---

## 🛠️ Typical Workflow

### **Day 1: Setup**
```bash
# Clone repo
git clone your-repo-url

# Install & setup
cd CropCloudV2-main
pnpm install
pnpm db:generate

# Start developing
pnpm dev
```
→ Visit http://localhost:3000

### **Before Pushing to Production**
```bash
# Test production-like locally
docker-compose up --build

# Verify API: curl http://localhost:4000/api/v1/products
```

### **Ready to Deploy**
1. Push to GitHub
2. Follow [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
3. Deploy to Render + Vercel
4. Set environment variables
5. Done! 🎉

---

## 📚 Detailed Documentation

| File | Purpose | When to Read |
|------|---------|--------------|
| **LOCALHOST_DEPLOYMENT.md** | Localhost setup & troubleshooting | Starting or having issues |
| **ENV_SETUP_GUIDE.md** | Environment variables explained | Understanding the setup |
| **QUICK_DEPLOY.md** | Fast deployment steps | Ready to deploy |
| **VERCEL_DEPLOYMENT.md** | Detailed deployment guide | Need comprehensive guide |
| **PRODUCTION_ENV_TEMPLATE.md** | All production variables | Setting up Render |
| **ENVIRONMENT_CONFIG_COMPLETE.md** | Architecture & how it works | Understanding auto-detection |

---

## 🔐 Security Checklist

- ✅ No hardcoded URLs in code
- ✅ Secrets in environment variables only
- ✅ `.env` in `.gitignore`
- ✅ `.env.local` for local overrides
- ✅ Production keys only in production
- ✅ Test keys (Razorpay) for localhost

---

## ⚡ Pro Tips

1. **Start with `pnpm dev`** for the fastest development experience
2. **Use `docker-compose up`** before deploying to catch issues early
3. **Keep `.env` for defaults**, use `.env.local` for local changes
4. **Never commit `.env.local`** to git (it's in `.gitignore`)
5. **All environment variables are sourced from env files** - no code changes needed!

---

## 🆘 Troubleshooting

**Can't reach localhost:3000?**
→ See [LOCALHOST_DEPLOYMENT.md](LOCALHOST_DEPLOYMENT.md) - Troubleshooting

**Docker won't start?**
→ See [LOCALHOST_DEPLOYMENT.md](LOCALHOST_DEPLOYMENT.md) - Docker issues

**Deployment has CORS errors?**
→ See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - CORS configuration

**Environment variables confused?**
→ See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) - Detailed explanation

---

## 📞 Need Help?

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process on that port |
| Database won't connect | Verify DATABASE_URL & Neon is running |
| Dependencies not installing | `pnpm store prune && pnpm install` |
| Deployment failed | Check Render/Vercel logs |
| API not responding | Check backend is running & logs |

---

## ✅ Summary

You have a **fully environment-aware** project that:
- 🏠 Works on **localhost** with `pnpm dev`
- 🐳 Simulates production with `docker-compose`
- 🌐 Deploys to **Render + Vercel** with zero code changes
- 🔄 Auto-detects environment from env variables
- 🔐 Keeps secrets secure in env files

**Ready to start? Pick your path above! 🚀**
