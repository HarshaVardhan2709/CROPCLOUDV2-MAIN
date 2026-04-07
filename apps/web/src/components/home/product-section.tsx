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
    <section className="container-shell mt-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="mt-2 text-sm text-black/65">{subtitle}</p>
        </div>
        <Link href={href} className="text-sm font-semibold text-moss">
          Explore all
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
