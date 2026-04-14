# Production Environment Variables Template
# Use this checklist when deploying to Render and Vercel

# =============================================================================
# FRONTEND - Add this to Vercel Dashboard → Settings → Environment Variables
# =============================================================================
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY

# =============================================================================
# BACKEND - Add these to Render Dashboard → Environment Variables
# =============================================================================

# Server Configuration
PORT=4000
NODE_ENV=production
APP_URL=https://your-app.onrender.com              # Your Render public URL
WEB_URL=https://your-frontend-domain.vercel.app    # Your Vercel frontend URL

# Database (from your Neon account)
DATABASE_URL=postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require

# Authentication (generate using: openssl rand -hex 32)
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Payment Integration (Razorpay - Production Keys Only!)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Third-party Services
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
RESEND_API_KEY=your_resend_key
GROQ_API_KEY=your_groq_api_key

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=noreply@yourdomain.com

# Storage & Platform Settings
STORAGE_DRIVER=local
PLATFORM_FEE_PERCENT=2.5
OTP_DELIVERY_MODE=email
