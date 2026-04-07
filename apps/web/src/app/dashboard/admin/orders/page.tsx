'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import { currency } from '@/lib/utils';

interface Order {
  id: string;
  buyer: { fullName: string; email: string };
  status: string;
  total: number;
  items: any[];
  createdAt: string;
}

export default function OrdersManagementPage() {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PAYMENT_PENDING: 'bg-orange-100 text-orange-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      PROCESSING: 'bg-purple-100 text-purple-700',
      READY_FOR_DISPATCH: 'bg-cyan-100 text-cyan-700',
      IN_TRANSIT: 'bg-indigo-100 text-indigo-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardShell
      title="Orders Management"
      description="Monitor all orders on the platform."
      tabs={[
        { href: '/dashboard/admin', label: 'Overview' },
        { href: '/dashboard/admin/sellers', label: 'Sellers' },
        { href: '/dashboard/admin/products', label: 'Products' },
        { href: '/dashboard/admin/orders', label: 'Orders' },
      ]}
      active="/dashboard/admin/orders"
    >
      <SecurePanel<{ data: Order[] }>
        path="/admin/orders"
        render={(response) => (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5 mb-6">
              <div className="card-surface p-4 text-center">
                <p className="text-xs text-black/60 uppercase">Total Orders</p>
                <p className="text-2xl font-bold text-black">{response.data.length}</p>
              </div>
              <div className="card-surface p-4 text-center">
                <p className="text-xs text-black/60 uppercase">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {response.data.filter((o) => o.status === 'PENDING').length}
                </p>
              </div>
              <div className="card-surface p-4 text-center">
                <p className="text-xs text-black/60 uppercase">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {response.data.filter((o) => o.status === 'CONFIRMED').length}
                </p>
              </div>
              <div className="card-surface p-4 text-center">
                <p className="text-xs text-black/60 uppercase">In Transit</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {response.data.filter((o) => o.status === 'IN_TRANSIT').length}
                </p>
              </div>
              <div className="card-surface p-4 text-center">
                <p className="text-xs text-black/60 uppercase">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {response.data.filter((o) => o.status === 'DELIVERED').length}
                </p>
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="text-xl font-semibold text-black mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Order ID</th>
                      <th className="text-left py-2 px-4">Customer</th>
                      <th className="text-left py-2 px-4">Items</th>
                      <th className="text-left py-2 px-4">Total</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.data.slice(0, 20).map((order) => (
                      <tr key={order.id} className="border-b hover:bg-[#f9faf7]">
                        <td className="py-3 px-4 font-mono text-xs text-black/70">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-black">{order.buyer.fullName}</p>
                            <p className="text-xs text-black/60">{order.buyer.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs">{order.items.length} items</td>
                        <td className="py-3 px-4 font-bold text-black">{currency(order.total)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-black/60">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      />
    </DashboardShell>
  );
}
