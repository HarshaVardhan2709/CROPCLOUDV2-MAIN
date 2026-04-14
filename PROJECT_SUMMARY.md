# 🌾 CropCloud V2 - Complete Project Summary (5 Minutes Read)

## 📱 What is CropCloud?

**CropCloud** is a **production-grade agricultural marketplace** connecting:
- **Farmers & Producers** (Sellers) → Upload products
- **Buyers** (Retailers, Wholesalers) → Browse & purchase
- **Logistics** → Manage deliveries
- **Admins** → Manage approvals & analytics

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
│              Next.js 15 + React 19 + Tailwind              │
│        Browser → http://localhost:3000 (dev)              │
│    https://your-app.vercel.app (production)               │
└─────────────────────────────────────────────────────────────┘
                           ↕️ (HTTP/REST)
                       Environment-Based URLs
                    (Uses NEXT_PUBLIC_API_URL)
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Render)                          │
│           NestJS + Node.js + Express                       │
│      http://localhost:4000 (dev)                           │
│   https://your-app.onrender.com (production)              │
└─────────────────────────────────────────────────────────────┘
                           ↕️ (SQL Query)
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Neon PostgreSQL)                     │
│  Cloud-hosted PostgreSQL with connection pooling          │
│      (Normalized schema with 20+ tables)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure (Monorepo)

### **Two Main Applications (pnpm workspaces)**

```
CropCloudV2-main/
├── apps/
│   ├── api/           ← NestJS Backend
│   │   ├── src/modules/
│   │   │   ├── auth/           → JWT, OAuth, Login/Signup
│   │   │   ├── users/          → User profiles, roles
│   │   │   ├── catalog/        → Products, categories
│   │   │   ├── cart/           → Shopping cart
│   │   │   ├── orders/         → Order management
│   │   │   ├── payments/       → Razorpay integration
│   │   │   ├── logistics/      → Delivery zones, tracking
│   │   │   ├── admin/          → Admin dashboard, approvals
│   │   │   ├── dashboard/      → Seller/Buyer dashboards
│   │   │   ├── reviews/        → Product reviews
│   │   │   ├── wishlist/       → Saved products
│   │   │   ├── storage/        → File uploads
│   │   │   └── mail/           → Email notifications
│   │   ├── prisma/
│   │   │   ├── schema.prisma   → Database schema
│   │   │   └── migrations/     → Database versions
│   │   └── dist/               → Built files
│   │
│   └── web/           ← Next.js Frontend
│       ├── src/
│       │   ├── app/             → Pages (App Router)
│       │   │   ├── page.tsx     → Homepage
│       │   │   ├── login/       → Auth page
│       │   │   ├── signup/      → Registration
│       │   │   ├── dashboard/   → User dashboard
│       │   │   ├── product/     → Product pages
│       │   │   ├── cart/        → Cart page
│       │   │   └── checkout/    → Checkout flow
│       │   ├── components/      → React components
│       │   ├── lib/             → Utilities
│       │   │   ├── api.ts       → API client
│       │   │   ├── client-api.ts → Client-side API
│       │   │   └── auth.ts      → Auth utilities
│       │   └── store/           → Zustand state
│       └── public/              → Static assets
│
└── Configuration Files
    ├── pnpm-workspace.yaml      → Monorepo setup
    ├── package.json             → Root dependencies
    ├── tsconfig.json            → TypeScript config
    ├── .env                     → Localhost variables
    ├── .env.production          → Production variables
    ├── docker-compose.yml       → Local Docker setup
    ├── vercel.json              → Vercel configuration
    └── DOCUMENTATION/
        ├── DEPLOYMENT_ROADMAP.md
        ├── LOCALHOST_DEPLOYMENT.md
        ├── ENV_SETUP_GUIDE.md
        └── QUICK_DEPLOY.md
```

---

## 🔄 Data Flow (How It Works)

### **1️⃣ User Opens App (Frontend)**
```
Browser → http://localhost:3000 (dev) or Vercel URL (prod)
  ↓
Next.js App Router loads pages
  ↓
React components render with Tailwind CSS
```

### **2️⃣ Frontend Makes API Calls**
```
React Component
  ↓
client-api.ts or api.ts (Server Component)
  ↓
Reads NEXT_PUBLIC_API_URL environment variable
  ↓
Sends HTTP request to backend:
  
GET/POST http://localhost:4000/api/v1/products  (dev)
GET/POST https://your-app.onrender.com/api/v1/products  (prod)
```

### **3️⃣ Backend Processes Request**
```
NestJS Server (Port 4000)
  ↓
Request hits Controller (e.g., ProductController)
  ↓
Controller calls Service (e.g., ProductService)
  ↓
Service queries Prisma Client
  ↓
Prisma Client → SQL Query → PostgreSQL Database
  ↓
Database returns data
  ↓
Service processes/transforms data
  ↓
Controller returns JSON response
```

### **4️⃣ Frontend Receives & Displays Data**
```
API response received
  ↓
State updated (Zustand store or React Query)
  ↓
Component re-renders with new data
  ↓
User sees updated UI
```

---

## 🔐 Authentication Flow

```
User clicks "Login"
  ↓
Enters email/password
  ↓
Sent to POST /api/v1/auth/login
  ↓
Backend validates credentials with Argon2 hashing
  ↓
Backend generates JWT tokens:
  - accessToken (15 min expiry)
  - refreshToken (7 day expiry)
  ↓
Tokens stored in localStorage + cookies
  ↓
Frontend attaches Authorization header to requests:
  GET /products Authorization: Bearer <accessToken>
  ↓
Backend validates JWT on each request
  ↓
User authenticated for 15 min, auto-refreshes with refreshToken
```

---

## 💰 Payment Flow (Razorpay Integration)

```
User clicks "Checkout"
  ↓
Order created in backend (status: PAYMENT_PENDING)
  ↓
Backend generates Razorpay order
  ↓
Returns Razorpay order ID + amount to frontend
  ↓
Frontend opens Razorpay payment modal
  ↓
User enters card details (handled by Razorpay securely)
  ↓
Payment success/failure
  ↓
Razorpay webhook hits backend
  ↓
Backend verifies payment signature
  ↓
Order status: CONFIRMED / FAILED
  ↓
Email sent to user
  ↓
Seller & Logistics notified
```

---

## 📊 Database Schema (Key Tables)

```
User (id, email, password_hash, role, name, etc.)
  ↓ references
  ├─→ Product (seller_id, name, price, category_id)
  │      ↓
  │      ├─→ Cart (user_id, product_id, quantity)
  │      ├─→ Wishlist (user_id, product_id)
  │      └─→ Review (user_id, product_id, rating, comment)
  │
  ├─→ Order (user_id, total_amount, status, tracking_id)
  │      ↓
  │      ├─→ OrderItem (order_id, product_id, quantity, price)
  │      └─→ Payment (order_id, amount, status, razorpay_id)
  │
  ├─→ ServiceZone (seller_id, delivery_radius, pincodes)
  │      ↓
  │      └─→ LogisticsTracking (order_id, location, status)
  │
  └─→ AdminApproval (user_id, status, reason)
```

**Key Point**: All relationships are properly indexed and normalized for fast queries.

---

## 🔄 Key Features & Their APIs

### **🏪 Browsing (Public)**
```
GET /api/v1/home              → Homepage data (banners, deal sections)
GET /api/v1/categories        → All categories
GET /api/v1/products          → Product listing with filters
GET /api/v1/products/:slug    → Product detail + related items
```

### **🛒 Shopping (Authenticated)**
```
POST /api/v1/cart             → Add to cart
GET  /api/v1/cart             → View cart
DELETE /api/v1/cart/:itemId   → Remove from cart

POST /api/v1/wishlist         → Add to wishlist
GET  /api/v1/wishlist         → View wishlist
```

### **💳 Checkout & Payment**
```
POST /api/v1/orders           → Create order
POST /api/v1/payments         → Create Razorpay order
POST /api/v1/payments/verify  → Verify payment (webhook)
GET  /api/v1/orders/:id       → Order details & tracking
```

### **👤 User Roles & Permissions**
```
BUYER     → Browse, purchase, rate products, track orders
SELLER    → Upload products, manage inventory, view analytics
LOGISTICS → View assigned orders, update delivery status
ADMIN     → Approve sellers, manage content, view analytics
```

---

## 🤖 AI Chatbot Feature

```
User types "Show products" in chat
  ↓
Frontend sends: POST /api/v1/chat
  Body: { message: "show products", auth: token }
  ↓
Backend ChatService receives message
  ↓
Groq AI (LLM) classifies intent:
  - GET_PRODUCTS → Fetch from /api/v1/products
  - GET_CART → Fetch from /api/v1/cart
  - GET_WISHLIST → Fetch from /api/v1/wishlist
  - TRACK_ORDER → Fetch from /api/v1/orders
  - GENERAL_CHAT → AI responds with farming advice
  ↓
Response formatted and returned to frontend
  ↓
Displayed in floating chatbot window
```

---

## 🚀 Deployment Architecture

### **3-Stage Pipeline**

#### **Stage 1: Localhost Development**
```
Command: pnpm dev
Environment: NODE_ENV=development
Frontend: http://localhost:3000
Backend: http://localhost:4000
Database: Neon cloud (shared)
Features: Hot reload, fast rebuild
```

#### **Stage 2: Docker Compose (Local Production Test)**
```
Command: docker-compose up --build
Environment: NODE_ENV=production
Backend: Containerized NestJS
Database: Local PostgreSQL (in Docker)
Use Case: Test before deploying to Render
```

#### **Stage 3: Production (Render + Vercel)**
```
Frontend (Vercel):
  - Auto-deploy on git push
  - Global CDN for fast delivery
  - URL: https://your-app.vercel.app
  - Env vars: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_RAZORPAY_KEY_ID

Backend (Render):
  - Auto-deploy on git push
  - URL: https://your-app.onrender.com
  - Env vars: APP_URL, WEB_URL, DATABASE_URL, JWT_SECRETS, etc.

Database (Neon PostgreSQL):
  - Managed cloud PostgreSQL
  - Connection pooling for performance
  - Automated backups
```

---

## 🔗 Environment-Based URL Resolution (The Smart Part!)

**Problem Solved**: Same code runs on localhost, Docker, and Render without changes!

### **Backend (Node.js)**
```typescript
// apps/api/src/chat/chat.service.ts
private getInternalApiUrl(): string {
  return process.env.APP_URL || 'http://localhost:4000';
}
// Localhost: 'http://localhost:4000'
// Production: 'https://your-app.onrender.com'
```

### **Frontend (Next.js)**
```typescript
// apps/web/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 
                'http://localhost:4000/api/v1';
// Localhost: 'http://localhost:4000/api/v1'
// Production: 'https://your-app.onrender.com/api/v1'
```

### **CORS Configuration (Backend)**
```typescript
app.enableCors({
  origin: process.env.WEB_URL?.split(',') ?? ['http://localhost:3000'],
  credentials: true,
});
// Allows frontend to communicate with backend
```

**Result**: ✅ No hardcoded URLs, same codebase for all environments!

---

## 📦 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 15 (App Router) |
| **Frontend Language** | TypeScript |
| **Frontend Styling** | Tailwind CSS |
| **Frontend State** | Zustand (auth store) |
| **Frontend Data** | TanStack React Query |
| **Frontend Forms** | React Hook Form + Zod validation |
| **Backend Framework** | NestJS |
| **Backend Language** | TypeScript |
| **Database ORM** | Prisma 6.x |
| **Database** | PostgreSQL (Neon) |
| **Authentication** | JWT + Argon2 hashing |
| **Payment** | Razorpay API |
| **AI/Chat** | Groq LLM API |
| **Email** | SMTP (Gmail) or Resend |
| **Maps/Geolocation** | OpenStreetMap/Nominatim |
| **File Storage** | Local (abstracted for S3/Cloudinary) |
| **Deployment** | Vercel (frontend) + Render (backend) |
| **Package Manager** | pnpm |

---

## 📋 User Journey Examples

### **Example 1: Buyer Purchases Product**
```
1. User visits http://localhost:3000
2. Browses products (calls /products API)
3. Clicks product → Views details (calls /products/:slug)
4. Clicks "Add to Cart" → Cart updated (POST /cart)
5. Goes to checkout → Creates order (POST /orders)
6. Enters card details → Razorpay payment modal
7. Payment confirmed → Order marked CONFIRMED
8. Seller receives notification
9. Buyer sees tracking in dashboard
10. Seller updates status → Buyer sees real-time update
```

### **Example 2: Seller Lists Product**
```
1. Seller logs in (JWT auth)
2. Goes to dashboard → Seller page
3. Clicks "Add Product"
4. Fills form → Submits (POST /products)
5. Admin receives notification
6. Admin reviews product → Approves (POST /admin/approve)
7. Product visible in marketplace
8. Buyers can now purchase
9. Seller sees analytics in dashboard
```

### **Example 3: User Chats with AI**
```
1. User opens chatbot (bottom-right corner)
2. Types "Show me tomato prices"
3. Message sent to POST /chat
4. Backend: Groq AI classifies as GENERAL_CHAT
5. Backend: Groq AI responds with farming advice
6. Response displayed in chat window
```

---

## ✅ Quality Assurances

| Aspect | Solution |
|--------|----------|
| **Secure Passwords** | Argon2 hashing (military-grade) |
| **API Security** | JWT tokens + CORS validation |
| **Data Validation** | Zod schemas (frontend) + NestJS pipes (backend) |
| **Type Safety** | Full TypeScript on both frontend & backend |
| **Reproducible Builds** | pnpm-lock.yaml committed to git |
| **Database Integrity** | Prisma migrations + normalized schema |
| **Payment Security** | Razorpay webhook signature verification |
| **Error Handling** | Global error handlers + validation pipes |

---

## 🎯 Key Metrics & Results

| Metric | Status |
|--------|--------|
| **Deployment Stages** | ✅ 3 (localhost → Docker → Production) |
| **Frontend/Backend Communication** | ✅ Environment-aware (no hardcoding) |
| **User Roles** | ✅ 4 (Admin, Buyer, Seller, Logistics) |
| **API Endpoints** | ✅ 50+ RESTful endpoints |
| **Database Tables** | ✅ 20+ normalized tables |
| **Authentication** | ✅ JWT with refresh tokens |
| **Payment Integration** | ✅ Razorpay (20+ scenarios) |
| **AI Features** | ✅ Groq LLM for intelligent chat |
| **Type Safety** | ✅ Full TypeScript coverage |
| **Auto-Deploy** | ✅ GitHub → Render + Vercel |

---

## 🎉 Summary in One Line

**CropCloud is a full-stack, production-grade agricultural e-commerce marketplace built with Next.js (frontend) and NestJS (backend) on PostgreSQL, deployed across Vercel and Render, with environment-aware configuration for seamless deployment across localhost, Docker, and production.**

---

This is your complete production system! 🚀
