import { WishlistPanel } from '@/components/dashboard/wishlist-panel';

export default function WishlistPage() {
  return (
    <div className="container-shell py-10">
      <h1 className="text-2xl  font-semibold text-black">Wishlist</h1>
      <p className="mt-3 text-sm text-black/65">Saved produce for later sourcing decisions.</p>
      <div className="mt-8">
        <WishlistPanel />
      </div>
    </div>
  );
}
