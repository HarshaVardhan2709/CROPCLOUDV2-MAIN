import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { WishlistPanel } from '@/components/dashboard/wishlist-panel';

export default function WishlistPage() {
  return (
    <div className="container-shell py-10">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-black/65 hover:text-[#2d6a4f] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-black/40" />
        <Link href="/shop" className="text-black/65 hover:text-[#2d6a4f] transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4 text-black/40" />
        <span className="font-semibold text-black">Wishlist</span>
      </nav>

      <h1 className="text-2xl  font-semibold text-black">Wishlist</h1>
      <p className="mt-3 text-sm text-black/65">Saved produce for later sourcing decisions.</p>
      <div className="mt-8">
        <WishlistPanel />
      </div>
    </div>
  );
}
