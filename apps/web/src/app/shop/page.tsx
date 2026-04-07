import { FilterSidebar } from '@/components/products/filter-sidebar';
import { ProductCard } from '@/components/products/product-card';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') query.set(key, value);
  });

  const data = await api.products(query.toString() ? `?${query}` : '');
  const categories = await api.categories();

  return (
    <div className="container-shell py-10">
      <div className="mb-8 rounded-[32px] bg-white p-8 shadow-md">
        <p className="text-sm uppercase tracking-[0.18em] text-moss/70">Marketplace</p>
        <h1 className="mt-3 text-4xl font-semibold text-black">Source directly from farms and producer collectives.</h1>
        <p className="mt-3 max-w-2xl text-sm text-black/65">
          Filter by category, pricing, quality grade, deliverability, and seller readiness.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar categories={categories} />
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-black/60">{(data.meta as { total: number }).total} products</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(data.items as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
