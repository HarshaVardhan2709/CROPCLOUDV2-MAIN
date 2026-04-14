# 🚀 Localhost Deployment Guide

Your project is ready to run on localhost with **two options**:

---

## 📋 Option 1: Development Mode (Recommended for Development)

Perfect for active development with hot reload and fast rebuilds.

### Prerequisites
```bash
# Ensure pnpm is installed
pnpm --version

# Should output something like: 10.6.2
```

### Setup Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Generate Prisma Client**
   ```bash
   pnpm db:generate
   ```

3. **Run Database Migrations** (if not done before)
   ```bash
   pnpm db:migrate
   ```

4. **Seed Database** (optional - adds sample data)
   ```bash
   pnpm db:seed
   ```

5. **Start Development Servers**
   ```bash
   pnpm dev
   ```
   
   This starts both:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:4000

### Access Your App
- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **Default Login**: `buyer@cropcloud.dev` / `Buyer@123`

### What's Running
| Service | Port | Mode |
|---------|------|------|
| Next.js Frontend | 3000 | Hot reload ✨ |
| NestJS Backend | 4000 | Watch mode ✨ |
| PostgreSQL | Remote (Neon) | ☁️ |

### Stop Servers
```bash
# Press Ctrl+C in the terminal
```

---

## 🐳 Option 2: Production-Like Deployment (Docker Compose)

Perfect for testing production deployment locally before deploying to Render.

### Prerequisites
- **Docker Desktop** installed and running
- **Docker Compose** v2+
- Check: `docker --version && docker-compose --version`

### Setup Steps

1. **Create `.env.docker` for Local Docker** (optional, uses existing `.env`)

2. **Build and Start Containers**
   ```bash
   docker-compose up --build
   ```
   
   This runs:
   - NestJS API in a Docker container
   - PostgreSQL database (local instance)

3. **Access Your App**
   - **API**: http://localhost:4000/api/v1
   - **Database**: `postgresql://postgres:yourpassword@localhost:5432/cropcloud`

### Important Notes for Docker Compose

- **Database**: Creates a local PostgreSQL (not the Neon cloud database)
- **Data Persistence**: Stored in Docker volume `postgres_data`
- **Environment**: `NODE_ENV=production` (simulates production)

### Stop Containers
```bash
docker-compose down
```

### Remove Everything (including data)
```bash
docker-compose down -v
```

---

## ✅ Localhost Environment Configuration

Your `.env` file is already properly configured:

```env
# Server Configuration
PORT=4000
APP_URL=http://localhost:4000
WEB_URL=http://localhost:3000
NODE_ENV=development

# Database (Cloud - Neon)
DATABASE_URL=postgresql://...@neon.tech/neondb

# Authentication
JWT_ACCESS_SECRET=your_dev_access_secret_here
JWT_REFRESH_SECRET=your_dev_refresh_secret_here

# AI & Third-party
GROQ_API_KEY=your_groq_dev_key_here

# Payment (Test Keys)
RAZORPAY_KEY_ID=rzp_test_SaaAqBn2QZezQU
```

**No changes needed!** Everything is localhost-ready.

---

## 🔍 Quick Troubleshooting

### Port Already in Use

**Port 3000 is busy:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or try different port
PORT=3001 pnpm dev
```

**Port 4000 is busy:**
```bash
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Database Connection Failed

```bash
# Check DATABASE_URL in .env
# Ensure Neon database is accessible
# Test connection:
psql $DATABASE_URL -c "SELECT version();"
```

### Dependencies Not Installing

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall
pnpm install
```

### Hot Reload Not Working

```bash
# Try restarting dev servers
pnpm dev

# If still issues, kill all node processes:
# Windows:
taskkill /F /IM node.exe

# Then restart:
pnpm dev
```

---

## 📊 Testing the Deployment

### 1. Test Frontend → Backend Communication
```bash
# Open browser DevTools (F12)
# Go to http://localhost:3000
# Check Console for errors
# Try logging in
```

### 2. Test API Directly
```bash
# Get all products
curl http://localhost:4000/api/v1/products

# Should return JSON list of products
```

### 3. Test Chat Feature
```bash
# Try chat in the app
# Ask: "show products"
# Should fetch from backend and display
```

### 4. Test Database
```bash
# Connect to database
psql $DATABASE_URL

# Query users table
SELECT id, email, role FROM "User" LIMIT 5;
```

---

## 🔄 Workflow Comparison

### Development (pnpm dev)
```
Edit Code → Auto-rebuild → Refresh Browser → Test
```
✅ Fast feedback loop
✅ See changes instantly
❌ Less realistic than production

### Docker Compose
```
Edit Code → Run docker-compose up → Full Container → Test
```
✅ Simulates actual deployment
✅ Tests containerization
❌ Slower iteration

---

## 📝 Common Commands

```bash
# Development workflow
pnpm dev                          # Start dev servers (hot reload)
pnpm build                        # Build both apps
pnpm lint                         # Check code quality
pnpm format                       # Auto-format code

# Database
pnpm db:generate                  # Generate Prisma client
pnpm db:migrate                   # Run migrations
pnpm db:seed                      # Add sample data

# Docker
docker-compose up                 # Start services
docker-compose down               # Stop services
docker-compose logs -f api        # Watch API logs
```

---

## 🎯 Next Steps

### If You're Developing:
1. Run `pnpm dev`
2. Open http://localhost:3000
3. Start coding with hot reload

### If You're Testing Production Deployment:
1. Run `docker-compose up --build`
2. Test at http://localhost:4000/api/v1
3. Verify Docker logs: `docker-compose logs -f`

### If You're Ready for Render:
1. Follow **QUICK_DEPLOY.md**
2. Deploy to Render with Vercel
3. Set environment variables on each platform

---

## ⚡ Pro Tips

1. **Use .env.local for local overrides**
   - Create `apps/api/.env.local`
   - Override any `.env` values
   - Won't be committed to git

2. **Monitor logs in development**
   - Backend logs show in terminal
   - Frontend logs show in browser DevTools
   - Both useful for debugging!

3. **Clear node_modules if issues persist**
   ```bash
   rm -rf node_modules apps/*/node_modules
   pnpm install
   ```

4. **Database inspection**
   - Use Neon console: https://console.neon.tech
   - Or: `psql $DATABASE_URL`
   - Check schema: `\dt` (list tables)

---

## 🆘 Getting Help

| Problem | Solution |
|---------|----------|
| Port in use | Kill process on port 3000/4000 |
| DB connection fails | Check DATABASE_URL, verify Neon is running |
| Dependencies not installing | `pnpm store prune && pnpm install` |
| API not responding | Check http://localhost:4000/health or logs |
| Frontend won't load | Check if `pnpm dev` is running both apps |
| CORS errors | Verify WEB_URL and APP_URL in .env |

---

**Your project is ready to run locally!** Start with `pnpm dev` 🚀
