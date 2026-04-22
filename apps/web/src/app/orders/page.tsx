import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { OrdersPanel } from '@/components/dashboard/orders-panel';

export default function OrdersPage() {
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
        <span className="font-semibold text-black">Orders</span>
      </nav>

      <h1 className="text-4xl font-semibold text-black">Orders</h1>
      <p className="mt-3 text-sm text-black/65">Track order status, payment state, and lot-level progress.</p>
      <div className="mt-8">
        <OrdersPanel />
      </div>
    </div>
  );
}
