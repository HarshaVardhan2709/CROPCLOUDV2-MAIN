import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductCard } from '../products/product-card';

export function ProductSection({
  title,
  subtitle,
  href,
  products,
}: {
  title: string;
  subtitle: string;
  href: string;
  products: Product[];
}) {
  return (
    <section className="container-shell mt-16">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-black">{title}</h2>
            <p className="mt-2 text-black/60">{subtitle}</p>
          </div>
          <Link href={href} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-moss/10 text-moss font-semibold hover:bg-moss/20 transition-colors">
            Explore all →
          </Link>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
