import { ProductCard } from '@/components/products/product-card';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await api.products(`?category=${slug}`);

  return (
    <div className="container-shell py-10">
      <h1 className="text-4xl font-semibold capitalize text-black">{slug.replace('-', ' ')}</h1>
      <p className="mt-3 text-sm text-black/65">Curated product listings for this category.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {(data.items as Product[]).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
