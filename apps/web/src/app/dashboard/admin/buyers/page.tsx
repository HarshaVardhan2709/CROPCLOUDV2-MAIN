'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import { currency } from '@/lib/utils';

interface User {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  buyerProfile?: any;
}

export default function BuyersManagementPage() {
  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        alert('User status updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <DashboardShell
      title="Buyers Management"
      description="Manage buyer accounts and their activities."
      tabs={[
        { href: '/dashboard/admin', label: 'Overview' },
        { href: '/dashboard/admin/sellers', label: 'Sellers' },
        { href: '/dashboard/admin/buyers', label: 'Buyers' },
        { href: '/dashboard/admin/products', label: 'Products' },
        { href: '/dashboard/admin/orders', label: 'Orders' },
      ]}
      active="/dashboard/admin/buyers"
    >
      <SecurePanel<{ data: User[] }>
        path="/admin/users"
        render={(response) => (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="card-surface p-6 text-center">
                <p className="text-sm text-black/60">Total Buyers</p>
                <p className="mt-2 text-3xl font-bold text-black">{response.data.length}</p>
              </div>
              <div className="card-surface p-6 text-center">
                <p className="text-sm text-black/60">Active</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {response.data.filter((u) => u.isActive).length}
                </p>
              </div>
              <div className="card-surface p-6 text-center">
                <p className="text-sm text-black/60">Inactive</p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {response.data.filter((u) => !u.isActive).length}
                </p>
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="text-xl font-semibold text-black mb-4">All Buyers</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Company</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Joined</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.data.map((buyer) => (
                      <tr key={buyer.id} className="border-b hover:bg-[#f9faf7]">
                        <td className="py-3 px-4 font-semibold text-black">{buyer.fullName}</td>
                        <td className="py-3 px-4 text-black/70">{buyer.email}</td>
                        <td className="py-3 px-4 text-black/70">
                          {buyer.buyerProfile?.companyName || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              buyer.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {buyer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-black/60">
                          {new Date(buyer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleStatusChange(buyer.id, buyer.isActive)}
                            className={`text-xs px-2 py-1 rounded text-white ${
                              buyer.isActive
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {buyer.isActive ? 'Suspend' : 'Activate'}
                          </button>
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
