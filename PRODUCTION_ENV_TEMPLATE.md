# Production Environment Variables Template

# Add this to apps/web/.env.production
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY

# Add these to your backend hosting environment (Railway/Render/.env):
PORT=4000
NODE_ENV=production
APP_URL=https://your-backend-api.com
WEB_URL=https://your-frontend-domain.vercel.app

# Database (from your Neon account)
DATABASE_URL=postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Secrets (generate secure random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Third-party Services
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
RESEND_API_KEY=your_resend_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=noreply@yourdomain.com

# Storage & Features
STORAGE_DRIVER=local
PLATFORM_FEE_PERCENT=2.5
OTP_DELIVERY_MODE=email
