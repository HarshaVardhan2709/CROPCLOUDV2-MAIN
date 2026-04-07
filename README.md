# CropCloud V2

Production-style agricultural marketplace connecting farmers and producers with retailers, wholesalers, exporters, processors, and institutional buyers.

## Architecture

- `apps/api`: NestJS backend with modular domain structure
- `apps/web`: Next.js App Router frontend with Tailwind, TanStack Query, and Zustand
- `apps/api/prisma/schema.prisma`: normalized PostgreSQL schema
- `apps/api/prisma/seed.ts`: realistic demo data

## Feature Coverage

- JWT auth with refresh tokens and RBAC
- Buyer, seller, admin, and logistics dashboards
- Homepage banners, category strip, featured/deal/seasonal/recent sections
- Product listing, category pages, product detail, related items, traceability timeline
- Cart, checkout, order creation, order detail, Razorpay payment creation and verification
- Wishlist API and page
- Seller product CRUD API
- Admin analytics and seller approval surface
- Deliverability checks using service zones and OpenStreetMap/Nominatim abstraction
- Local file storage abstraction for future S3/Cloudinary replacement

## Monorepo Structure

```text
apps/
  api/
    prisma/
    src/modules/
      auth/
      users/
      catalog/
      cart/
      orders/
      payments/
      logistics/
      reviews/
      wishlist/
      admin/
      dashboard/
      storage/
  web/
    src/app/
    src/components/
    src/lib/
    src/store/
```

## Environment Variables

### `apps/api/.env`

```env
PORT=4000
APP_URL=http://localhost:4000
WEB_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cropcloud?schema=public
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxx
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
STORAGE_DRIVER=local
PLATFORM_FEE_PERCENT=2.5
OTP_DELIVERY_MODE=console
RESEND_API_KEY=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

## Local Setup

1. Install Node.js 20+ and PostgreSQL 15+.
2. Create a database named `cropcloud`.
3. Copy env files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

4. Install workspace dependencies:

```bash
pnpm install
```

5. Generate Prisma client and create the initial migration from the schema:

```bash
pnpm db:generate
pnpm db:migrate
```

6. Seed demo data:

```bash
pnpm db:seed
```

7. Start both apps:

```bash
pnpm dev
```

## App URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000/api/v1`

## Demo Accounts

- Admin: `admin@cropcloud.dev` / `Admin@123`
- Buyer: `buyer@cropcloud.dev` / `Buyer@123`
- Seller: `seller@cropcloud.dev` / `Seller@123`
- Seller 2: `seller2@cropcloud.dev` / `Seller@123`
- Logistics: `logistics@cropcloud.dev` / `Logistics@123`

## Important API Areas

- Auth: `/auth/signup`, `/auth/login`, `/auth/refresh`, `/auth/me`
- Catalog: `/home`, `/products`, `/products/:slug`, `/categories`
- Seller catalog: `/seller/products`, `/seller/products/:productId`
- Cart: `/cart`, `/cart/items`
- Wishlist: `/wishlist`, `/wishlist/items`
- Orders: `/orders`, `/orders/:orderId`, `/orders/:orderId/status`
- Payments: `/payments/create-order`, `/payments/verify`
- Logistics: `/logistics/deliverability`
- Dashboards: `/dashboard/buyer`, `/dashboard/seller`, `/dashboard/logistics`
- Admin: `/admin/dashboard`, `/admin/homepage`, `/admin/sellers/:sellerId`

## Seed Data Contents

- 5 categories
- 3 homepage banners
- 2 approved sellers with delivery zones
- multiple products with images and inventory
- traceability batches and timeline events
- buyer cart, wishlist, reviews, notifications
- sample in-transit order and payout data

## Notes

- Orders remain `PAYMENT_PENDING` until Razorpay signature verification succeeds.
- Deliverability is enforced during order creation using seller service zones.
- File storage currently targets local `/uploads` but is isolated behind `StorageService`.
- The frontend includes the core marketplace experience plus dashboards; seller product management UI can be extended on top of the existing seller product CRUD APIs.
