'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import { SellerProductManager } from '@/components/dashboard/seller-product-manager';
import { currency } from '@/lib/utils';

export default function SellerDashboardPage() {
  return (
    <DashboardShell
      title="Seller Operations"
      description="Inventory, incoming orders, low stock alerts, and payout readiness."
      tabs={[
        { href: '/dashboard/seller', label: 'Seller Overview' },
        { href: '/orders', label: 'Incoming Orders' },
        { href: '/shop', label: 'Storefront' },
      ]}
      active="/dashboard/seller"
    >
      <SecurePanel<any>
        path="/dashboard/seller"
        render={(data) => (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="card-surface p-6"><p className="text-sm text-black/60">Revenue</p><p className="mt-2 text-3xl font-bold text-black">{currency(data.revenue)}</p></div>
              <div className="card-surface p-6"><p className="text-sm text-black/60">Products</p><p className="mt-2 text-3xl font-bold text-black">{data.products.length}</p></div>
              <div className="card-surface p-6"><p className="text-sm text-black/60">Low stock alerts</p><p className="mt-2 text-3xl font-bold text-black">{data.lowStock.length}</p></div>
            </div>
            <div className="card-surface p-6">
              <h2 className="text-xl font-semibold text-black">Inventory snapshot</h2>
              <div className="mt-4 space-y-3">
                {data.products.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between rounded-2xl bg-[#f5f7ef] p-4">
                    <div>
                      <p className="font-semibold text-black">{product.name}</p>
                      <p className="text-sm text-black/65">{product.inventory?.availableQuantity ?? 0} units available</p>
                    </div>
                    <p className="font-semibold text-moss">{currency(product.price)}</p>
                  </div>
                ))}
              </div>
            </div>
            <SellerProductManager products={data.products} />
          </div>
        )}
      />
    </DashboardShell>
  );
}
