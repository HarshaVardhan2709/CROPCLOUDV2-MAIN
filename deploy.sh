#!/bin/bash

# CropCloud Production Deployment Script
# This script helps deploy both frontend and backend

set -e

echo "🚀 CropCloud Production Deployment Script"
echo "=========================================="
echo ""

# Step 1: Frontend Deployment
echo "📦 Step 1: Deploying Frontend to Vercel"
echo "----------------------------------------"
echo "1. Ensure you have Vercel CLI installed: npm i -g vercel"
echo "2. Run: vercel --prod"
echo "3. Set environment variables in Vercel Dashboard:"
echo "   - NEXT_PUBLIC_API_URL = your-api-url/api/v1"
echo "   - NEXT_PUBLIC_RAZORPAY_KEY_ID = your-production-key"
echo ""
read -p "Press enter after deploying to Vercel..."

# Step 2: Backend Deployment Info
echo ""
echo "📦 Step 2: Deploy Backend"
echo "------------------------"
echo ""
echo "Choose your backend hosting:"
echo "1. Railway (https://railway.app) - Recommended"
echo "2. Render (https://render.com)"
echo "3. Fly.io (https://fly.io)"
echo ""
echo "For Railway:"
echo "  - Connect your GitHub repo"
echo "  - Select Service: Node.js"
echo "  - Build: pnpm install && pnpm build --filter=api"
echo "  - Start: pnpm start --filter=api"
echo ""
echo "Get your backend URL after deployment and update Vercel."
echo ""

# Step 3: Database Setup
echo ""
echo "💾 Step 3: Database Setup"
echo "------------------------"
echo "Your Neon PostgreSQL is already configured in:"
echo "  apps/api/.env → DATABASE_URL"
echo ""
echo "Once backend is deployed, run migrations:"
echo "  pnpm db:migrate (in production environment)"
echo ""

# Step 4: Final Testing
echo ""
echo "🧪 Step 4: Testing"
echo "-----------------"
echo "1. Visit your Vercel frontend URL"
echo "2. Try logging in with:"
echo "   Email: buyer@cropcloud.dev"
echo "   Password: Buyer@123"
echo ""
echo "If login fails:"
echo "   - Check NEXT_PUBLIC_API_URL is correct in Vercel"
echo "   - Verify backend is running"
echo "   - Check CORS settings in backend"
echo ""

echo "✅ Deployment guide complete!"
echo ""
echo "For detailed instructions, see: VERCEL_DEPLOYMENT.md"
