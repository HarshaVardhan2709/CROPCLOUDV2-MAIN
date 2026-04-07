import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { currency, safeImageUrl } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { WishlistButton } from './wishlist-button';

export function ProductCard({ product }: { product: Product }) {
  const rating =
    product.reviews && product.reviews.length
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : product.seller.ratingAverage;

  return (
    <Link href={`/product/${product.slug}`} className="group card-surface overflow-hidden">
      <div className="relative aspect-[1.2/1] overflow-hidden bg-[#eef4e8]">
        <Image
          src={safeImageUrl(product.images[0]?.url)}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {product.bestDeal && <Badge className="bg-clay text-white">Deal</Badge>}
          {product.organicCertified && <Badge><Leaf className="mr-1 h-3 w-3" />Organic</Badge>}
        </div>
        <div className="absolute right-4 top-4">
          <WishlistButton productId={product.id} />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-moss/70">{product.category.name}</p>
          <h3 className="line-clamp-2 text-lg font-semibold text-black">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-black/70">{product.shortDescription ?? product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-black">{currency(product.price)}</p>
            <p className="text-sm text-black/60">per {product.unit}</p>
          </div>
          <div className="rounded-2xl bg-[#f2f5ed] px-3 py-2 text-right text-xs text-black/75">
            <div className="flex items-center justify-end gap-1 font-semibold text-black">
              <Star className="h-3 w-3 fill-clay text-clay" />
              {rating ? rating.toFixed(1) : 'New'}
            </div>
            <p>{product.qualityGrade} grade</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-black/65">
          <span>{product.originCity}, {product.originState}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-moss">
            View
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
