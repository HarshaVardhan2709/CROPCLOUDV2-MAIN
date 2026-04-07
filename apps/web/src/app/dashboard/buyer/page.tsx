'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import { currency } from '@/lib/utils';

export default function BuyerDashboardPage() {
  return (
    <DashboardShell
      title="Buyer Command Center"
      description="Track orders, spend, wishlist activity, and sourcing alerts."
      tabs={[
        { href: '/dashboard/buyer', label: 'Buyer Overview' },
        { href: '/orders', label: 'Orders' },
        { href: '/cart', label: 'Cart' },
      ]}
      active="/dashboard/buyer"
    >
      <SecurePanel<any>
        path="/dashboard/buyer"
        render={(data) => (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="card-surface p-6"><p className="text-sm text-black/60">Total spend</p><p className="mt-2 text-3xl font-bold text-black">{currency(data.spent)}</p></div>
              <div className="card-surface p-6"><p className="text-sm text-black/60">Orders</p><p className="mt-2 text-3xl font-bold text-black">{data.orders.length}</p></div>
              <div className="card-surface p-6"><p className="text-sm text-black/60">Wishlist items</p><p className="mt-2 text-3xl font-bold text-black">{data.wishlist?.items?.length ?? 0}</p></div>
            </div>
            <div className="card-surface p-6">
              <h2 className="text-xl font-semibold text-black">Recent notifications</h2>
              <div className="mt-4 space-y-3">
                {data.notifications.map((note: any) => (
                  <div key={note.id} className="rounded-2xl bg-[#f5f7ef] p-4">
                    <p className="font-semibold text-black">{note.title}</p>
                    <p className="mt-1 text-sm text-black/65">{note.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      />
    </DashboardShell>
  );
}
