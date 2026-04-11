import { CategoryStrip } from '@/components/home/category-strip';
import { DealBanner } from '@/components/home/deal-banner';
import { Hero } from '@/components/home/hero';
import { ProductSection } from '@/components/home/product-section';
import { api } from '@/lib/api';
import Chatbot from '../../components/Chatbot';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // 🔐 AUTH CHECK - Homepage requires login
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  // 🚨 Redirect if not logged in
  if (!token) {
    redirect('/login');
  }

  // ✅ Fetch homepage data with explicit cache bypass
  let data;
  try {
    data = await api.homepage();
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    throw new Error(`Homepage data fetch failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  // ✅ Validate data structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid homepage data received from API');
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

      {/* 🤖 Chatbot only visible after login */}
      <Chatbot />
    </>
  );
}