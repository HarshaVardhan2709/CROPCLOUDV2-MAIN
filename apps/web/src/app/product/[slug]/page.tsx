import Image from 'next/image';
import { AddToCart } from '@/components/products/add-to-cart';
import { ProductCard } from '@/components/products/product-card';
import { TraceabilityTimeline } from '@/components/products/traceability-timeline';
import { WishlistButton } from '@/components/products/wishlist-button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { currency, formatDate, safeImageUrl } from '@/lib/utils';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.product(slug);

  return (
    <div className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="relative aspect-[1.1/1] overflow-hidden rounded-[32px] bg-white shadow-md">
            <Image src={safeImageUrl(product.images[0]?.url)} alt={product.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.slice(1).map((image: { url: string }, index: number) => (
              <div key={index} className="relative aspect-[1.2/1] overflow-hidden rounded-[24px] bg-white shadow-md">
                <Image src={safeImageUrl(image.url)} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="card-surface p-7">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge>{product.category.name}</Badge>
              <Badge className="bg-[#fff0e3] text-clay">{product.qualityGrade} Grade</Badge>
              {product.organicCertified && <Badge>Organic</Badge>}
            </div>
            <h1 className="text-4xl font-semibold text-black">{product.name}</h1>
            <p className="mt-3 text-sm text-black/68">{product.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-[28px] bg-[#f4f7ef] p-5 text-sm text-black/70">
              <div><p className="font-semibold text-black">Price</p><p>{currency(product.price)} / {product.unit}</p></div>
              <div><p className="font-semibold text-black">Inventory</p><p>{product.inventory?.availableQuantity ?? 0} units</p></div>
              <div><p className="font-semibold text-black">Harvest date</p><p>{formatDate(product.harvestDate)}</p></div>
              <div><p className="font-semibold text-black">Origin</p><p>{product.originCity}, {product.originState}</p></div>
            </div>
            <div className="mt-5 rounded-[28px] border border-ink/10 p-5 text-sm text-black/70">
              <p className="font-semibold text-black">{product.seller.businessName}</p>
              <p className="mt-2">Managed by {product.seller.user.fullName}</p>
              <p className="mt-2">Seller rating: {Number(product.seller.ratingAverage ?? 0).toFixed(1)} ({product.seller.totalRatings} reviews)</p>
              <p className="mt-2">
                Deliverability:{' '}
                {product.deliverability?.deliverable
                  ? `Deliverable in ~${product.deliverability.estimatedDays} days`
                  : 'Check at checkout with your address'}
              </p>
            </div>
            <div className="mt-6">
              <AddToCart productId={product.id} minQuantity={product.minOrderQuantity ?? 1} />
            </div>
            <div className="mt-3">
              <WishlistButton productId={product.id} showLabel className="w-full rounded-[24px] px-5 py-3" />
            </div>
          </div>
          <div className="card-surface p-7">
            <h2 className="text-xl font-semibold text-black">Traceability Timeline</h2>
            <div className="mt-4">
              <TraceabilityTimeline events={product.batches?.[0]?.traceabilityEvents ?? []} />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="section-title">Related Products</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {product.relatedProducts.map((item: any) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
