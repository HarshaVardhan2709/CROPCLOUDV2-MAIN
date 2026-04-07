import { OrdersPanel } from '@/components/dashboard/orders-panel';

export default function OrdersPage() {
  return (
    <div className="container-shell py-10">
      <h1 className="text-4xl font-semibold text-black">Orders</h1>
      <p className="mt-3 text-sm text-black/65">Track order status, payment state, and lot-level progress.</p>
      <div className="mt-8">
        <OrdersPanel />
      </div>
    </div>
  );
}
