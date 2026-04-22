import { CategoryStrip } from '@/components/home/category-strip';
import { DealBanner } from '@/components/home/deal-banner';
import { Hero } from '@/components/home/hero';
import { ProductSection } from '@/components/home/product-section';
import { api } from '@/lib/api';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ✅ Force dynamic rendering because this page requires:
// 1. Auth check (reads cookies)
// 2. Real-time API data from backend
// These must be executed at request time, not build time
// Deployment triggered: 2026-04-11
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 🔐 AUTH CHECK - Homepage requires login
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  // 🚨 Redirect if not logged in
  if (!token) {
    redirect('/login');
  }

  // ✅ Fetch homepage data with explicit cache bypass
  let data = {
    banners: [],
    categories: [],
    featured: [],
    deals: [],
    seasonal: [],
    recent: [],
  };

  try {
    const response = await api.homepage();
    if (response && typeof response === 'object') {
      data = {
        banners: response.banners ?? [],
        categories: response.categories ?? [],
        featured: response.featured ?? [],
        deals: response.deals ?? [],
        seasonal: response.seasonal ?? [],
        recent: response.recent ?? [],
      };
    }
  } catch (error) {
    console.warn('Could not fetch homepage data, using empty defaults:', error instanceof Error ? error.message : String(error));
    // Continue with empty defaults instead of throwing
  }

  return (
    <>
      <div className="pb-16">
        <Hero banners={data.banners} />
        <CategoryStrip categories={data.categories} />

        <ProductSection
          title="Featured Produce"
          subtitle="High-visibility lots from approved sellers."
          href="/shop"
          products={data.featured}
        />

        <ProductSection
          title="Best Deals"
          subtitle="Bulk-friendly pricing across vegetables and fast-moving staples."
          href="/shop?sort=price_asc"
          products={data.deals}
        />

        <DealBanner />

        <ProductSection
          title="Seasonal Picks"
          subtitle="Produce timed to current harvest windows."
          href="/shop"
          products={data.seasonal}
        />

        <ProductSection
          title="Recently Added"
          subtitle="Fresh listings added by sellers this week."
          href="/shop?sort=newest"
          products={data.recent}
        />
      </div>

    </>
  );
}