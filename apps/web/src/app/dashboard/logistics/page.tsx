'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import { formatDate } from '@/lib/utils';

export default function LogisticsDashboardPage() {
  return (
    <DashboardShell
      title="Logistics Panel"
      description="Operational visibility into confirmed and in-transit orders."
      tabs={[
        { href: '/dashboard/logistics', label: 'Logistics Overview' },
        { href: '/dashboard/admin', label: 'Admin' },
        { href: '/orders', label: 'Orders' },
      ]}
      active="/dashboard/logistics"
    >
      <SecurePanel<any>
        path="/dashboard/logistics"
        render={(data) => (
          <div className="space-y-5">
            {data.orders.map((order: any) => (
              <div key={order.id} className="card-surface p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-moss/70">{order.orderNumber}</p>
                    <h3 className="mt-1 text-xl font-semibold text-black">{order.status}</h3>
                    <p className="mt-2 text-sm text-black/65">{order.address.city}, {order.address.state}</p>
                  </div>
                  <p className="text-sm text-black/65">Created {formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      />
    </DashboardShell>
  );
}
