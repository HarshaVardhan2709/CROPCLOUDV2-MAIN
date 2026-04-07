import { CartPanel } from '@/components/dashboard/cart-panel';

export default function CartPage() {
  return (
    <div className="container-shell py-10">
      <h1 className="text-4xl font-semibold text-black">Cart</h1>
      <p className="mt-3 text-sm text-black/65">Review selected lots before checkout.</p>
      <div className="mt-8">
        <CartPanel />
      </div>
    </div>
  );
}
