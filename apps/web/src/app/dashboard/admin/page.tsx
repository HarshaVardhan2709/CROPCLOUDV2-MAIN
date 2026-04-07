'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import { currency } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      title="Admin Control Tower"
      description="Platform metrics, pending approvals, and comprehensive management controls."
      tabs={[
        { href: '/dashboard/admin', label: 'Admin Overview' },
        { href: '/dashboard/admin/create-admin', label: 'Create Admin' },
        { href: '/dashboard/admin/approvals', label: 'Admin Approvals' },
        { href: '/dashboard/admin/sellers', label: 'Sellers' },
        { href: '/dashboard/admin/buyers', label: 'Buyers' },
        { href: '/dashboard/admin/products', label: 'Products' },
        { href: '/dashboard/admin/orders', label: 'Orders' },
      ]}
      active="/dashboard/admin"
    >
      <SecurePanel<any>
        path="/admin/dashboard"
        render={(data) => (
          <div className="space-y-6">
            {/* KEY METRICS */}
            <div className="grid gap-5 md:grid-cols-4">
              <div className="card-surface p-6">
                <p className="text-sm text-black/60">👥 Total Users</p>
                <p className="mt-2 text-3xl font-bold text-black">{data.users}</p>
              </div>
              <div className="card-surface p-6">
                <p className="text-sm text-black/60">🏪 Active Sellers</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{data.activeSellers}</p>
              </div>
              <div className="card-surface p-6">
                <p className="text-sm text-black/60">📦 Total Orders</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{data.totalOrders}</p>
              </div>
              <div className="card-surface p-6">
                <p className="text-sm text-black/60">💰 GMV</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">{currency(data.gmv)}</p>
              </div>
            </div>

            {/* QUICK ACTION CARDS */}
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/dashboard/admin/approvals">
                <div className="card-surface p-6 hover:shadow-lg cursor-pointer transition border-2 border-purple-200 bg-purple-50">
                  <h3 className="text-lg font-semibold text-black">🔐 Admin Approvals</h3>
                  <p className="text-sm text-black/60 mt-2">
                    Approve or reject new admin accounts. Only primary admin can manage this.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-purple-600">Manage Access</p>
                </div>
              </Link>

              <Link href="/dashboard/admin/create-admin">
                <div className="card-surface p-6 hover:shadow-lg cursor-pointer transition border-2 border-indigo-200 bg-indigo-50">
                  <h3 className="text-lg font-semibold text-black">➕ Create Admin</h3>
                  <p className="text-sm text-black/60 mt-2">
                    Create a new admin account that requires your approval before activation.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-indigo-600">Add Admin</p>
                </div>
              </Link>

              <Link href="/dashboard/admin/sellers">
                <div className="card-surface p-6 hover:shadow-lg cursor-pointer transition">
                  <h3 className="text-lg font-semibold text-black">🏪 Manage Sellers</h3>
                  <p className="text-sm text-black/60 mt-2">
                    Approve, reject, or suspend seller accounts. View seller details and ratings.
                  </p>
                  <p className="mt-3 text-lg font-bold text-green-600">{data.activeSellers} Active</p>
                </div>
              </Link>

              <Link href="/dashboard/admin/buyers">
                <div className="card-surface p-6 hover:shadow-lg cursor-pointer transition">
                  <h3 className="text-lg font-semibold text-black">👥 Manage Buyers</h3>
                  <p className="text-sm text-black/60 mt-2">
                    Monitor buyer accounts, manage status, view purchase history, and activity.
                  </p>
                  <p className="mt-3 text-lg font-bold text-blue-600">{data.users} Registered</p>
                </div>
              </Link>

              <Link href="/dashboard/admin/products">
                <div className="card-surface p-6 hover:shadow-lg cursor-pointer transition">
                  <h3 className="text-lg font-semibold text-black">📦 Manage Products</h3>
                  <p className="text-sm text-black/60 mt-2">
                    View all products, moderate listings, and remove inappropriate content.
                  </p>
                  <p className="mt-3 text-lg font-bold text-cyan-600">Full Catalog</p>
                </div>
              </Link>

              <Link href="/dashboard/admin/orders">
                <div className="card-surface p-6 hover:shadow-lg cursor-pointer transition">
                  <h3 className="text-lg font-semibold text-black">📋 Manage Orders</h3>
                  <p className="text-sm text-black/60 mt-2">
                    Track orders by status, monitor delivery, resolve disputes, and analytics.
                  </p>
                  <p className="mt-3 text-lg font-bold text-indigo-600">{data.totalOrders} Orders</p>
                </div>
              </Link>
            </div>

            {/* PENDING SELLERS */}
            <div className="card-surface p-6">
              <h2 className="text-xl font-semibold text-black mb-4">⏳ Pending Seller Approvals</h2>
              {data.pendingSellers.length === 0 ? (
                <p className="text-black/60 py-4">No pending seller approvals.</p>
              ) : (
                <div className="space-y-3">
                  {data.pendingSellers.map((seller: any) => (
                    <Link
                      key={seller.id}
                      href="/dashboard/admin/sellers"
                      className="rounded-2xl bg-[#fffaf2] border border-yellow-200 p-4 hover:bg-[#fffbf0] transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-black">{seller.businessName}</p>
                          <p className="text-sm text-black/65">{seller.user.email}</p>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                          PENDING
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      />
    </DashboardShell>
  );
}
