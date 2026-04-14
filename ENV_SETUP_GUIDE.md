# Environment Setup Guide

This guide explains all environment variables needed for localhost and production deployments.

---

## 🚀 Local Development (localhost)

### Backend API (`apps/api/.env`)

```env
# Server & URLs
PORT=4000
APP_URL=http://localhost:4000
WEB_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://neondb_owner:password@host/neondb

# JWT Secrets (use any dev-only strings)
JWT_ACCESS_SECRET=dev_access_secret_key_here
JWT_REFRESH_SECRET=dev_refresh_secret_key_here
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Third-party Services
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
GROQ_API_KEY=your_groq_dev_key

# Email (optional for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=dev@cropcloud.local

# Others
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
STORAGE_DRIVER=local
PLATFORM_FEE_PERCENT=2.5
OTP_DELIVERY_MODE=console
RESEND_API_KEY=optional
```

### Frontend Web (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## 🌐 Production Deployment

### Key Concept
The project automatically detects environment from variables:
- **Localhost detection**: `APP_URL` defaults to `http://localhost:4000` if not set
- **Production detection**: Any other `APP_URL` value is used as-is

### Frontend (Vercel)

Set these in **Vercel Dashboard → Settings → Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Backend (Render)

Set these in your Render dashboard's environment variables:

#### Critical Variables (must set)
```
PORT=4000
NODE_ENV=production
APP_URL=https://your-api.onrender.com              # Same as your public Render URL
WEB_URL=https://your-frontend.vercel.app          # Your Vercel domain
DATABASE_URL=postgresql://...                      # Neon connection string
```

#### Auth & Security
```
JWT_ACCESS_SECRET=generate_random_string_256bit
JWT_REFRESH_SECRET=generate_random_string_256bit
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
```

#### Payment & Services
```
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
GROQ_API_KEY=your_production_groq_key
```

#### Email Configuration
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=optional
```

#### APIs & Storage
```
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
STORAGE_DRIVER=local
PLATFORM_FEE_PERCENT=2.5
OTP_DELIVERY_MODE=email
```

---

## ✅ Checklist

### Before Local Development
- [ ] `.env` exists in `apps/api/` with `APP_URL=http://localhost:4000`
- [ ] `.env.local` exists in `apps/web/` with `NEXT_PUBLIC_API_URL`
- [ ] Database credentials are correct
- [ ] GROQ API key is set

### Before Pushing Production
- [ ] Backend `APP_URL` matches your Render public URL
- [ ] Frontend `NEXT_PUBLIC_API_URL` includes `/api/v1` suffix
- [ ] Both `WEB_URL` are set in backend for CORS
- [ ] Secrets are generated strong random strings
- [ ] No sensitive data in git (`.env` is in `.gitignore`)

---

## 🔧 How It Works

### API URLs Resolution

**In Chat Service** (`apps/api/src/chat/chat.service.ts`):
```typescript
private getInternalApiUrl(): string {
  return process.env.APP_URL || 'http://localhost:4000';
}
```

- Localhost: Uses `APP_URL=http://localhost:4000`
- Production: Uses `APP_URL=https://your-api.onrender.com` (or your public Render URL)
- **No code changes needed!**

### Frontend API Resolution

**In Web** (`apps/web/src/lib/api.ts`):
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
```

- Localhost: Defaults to `http://localhost:4000/api/v1`
- Production: Uses `NEXT_PUBLIC_API_URL` from Vercel env

### CORS Configuration

**In Backend** (`apps/api/src/main.ts`):
```typescript
app.enableCors({
  origin: process.env.WEB_URL?.split(',') ?? ['http://localhost:3000'],
  credentials: true,
});
```

- Localhost: Allows `http://localhost:3000`
- Production: Allows URLs from `WEB_URL`

---

## 📝 Notes

1. **APP_URL vs WEB_URL**
   - `APP_URL`: Backend's public URL (used for internal API calls)
   - `WEB_URL`: Frontend's public URL (used for CORS)

2. **NEXT_PUBLIC prefix**
   - Variables with `NEXT_PUBLIC_` are exposed to the browser
   - Never put secrets here!

3. **Environment File Names**
   - `.env`: Production defaults (committed to git)
   - `.env.local`: Local overrides (in `.gitignore`)
   - `.env.production`: Vercel-specific (if needed)

4. **Zero Code Changes**
   - Switch between localhost and production by just changing environment variables
   - No hardcoded URLs anywhere!
