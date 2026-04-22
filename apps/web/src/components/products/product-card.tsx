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
    <Link href={`/product/${product.slug}`} className="group h-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-moss/20">
      {/* Image Container */}
      <div className="relative aspect-[1.2/1] overflow-hidden bg-gradient-to-br from-[#f5f7ef] to-[#eef4e8]">
        <Image
          src={safeImageUrl(product.images[0]?.url)}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2 flex-wrap">
          {product.bestDeal && <Badge className="bg-red-500 text-white shadow-md">🔥 Best Deal</Badge>}
          {product.organicCertified && <Badge className="bg-green-600 text-white shadow-md"><Leaf className="mr-1 h-3 w-3" />Organic</Badge>}
          {product.featured && <Badge className="bg-moss text-white shadow-md">⭐ Featured</Badge>}
        </div>
        
        {/* Wishlist Button */}
        <div className="absolute right-3 top-3 transition-transform duration-300 group-hover:scale-110">
          <WishlistButton productId={product.id} />
        </div>
      </div>
      
      {/* Content Container */}
      <div className="flex flex-col justify-between p-5 h-full space-y-3">
        {/* Category */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-moss/70">{product.category.name}</p>
          
          {/* Product Name */}
          <h3 className="line-clamp-2 text-base font-bold text-black group-hover:text-moss transition-colors">{product.name}</h3>
          
          {/* Description */}
          <p className="line-clamp-2 text-sm text-black/60">{product.shortDescription ?? product.description}</p>
        </div>
        
        {/* Price and Seller Rating */}
        <div className="space-y-3 pt-2 border-t border-black/5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-black/50">Starting from</p>
              <p className="text-2xl font-bold text-moss">{currency(product.price)}</p>
              <p className="text-xs text-black/50">per {product.unit}</p>
            </div>
            
            {/* Rating Badge */}
            <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-2 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 font-bold text-amber-900">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                {rating ? rating.toFixed(1) : 'New'}
              </div>
              <p className="text-xs font-medium text-amber-800 mt-1">{product.qualityGrade}</p>
            </div>
          </div>
          
          {/* Origin and CTA */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-black/60">📍 {product.originCity}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-moss group-hover:gap-2 transition-all">
              View
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
