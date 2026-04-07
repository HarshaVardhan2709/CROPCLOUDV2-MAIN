'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Seller {
  id: string;
  businessName: string;
  user: { email: string };
  approvalStatus: string;
  ratingAverage: number;
  totalRatings: number;
}

export default function SellersManagementPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (sellerId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/admin/sellers/${sellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSellers((prev) =>
          prev.map((s) => (s.id === sellerId ? { ...s, approvalStatus: newStatus } : s)),
        );
      }
    } catch (error) {
      console.error('Error updating seller:', error);
    }
  };

  const handleSuspend = async (sellerId: string) => {
    if (!confirm('Are you sure you want to suspend this seller?')) return;
    try {
      const res = await fetch(`/api/v1/admin/sellers/${sellerId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSellers((prev) => prev.filter((s) => s.id !== sellerId));
      }
    } catch (error) {
      console.error('Error suspending seller:', error);
    }
  };

  return (
    <DashboardShell
      title="Seller Management"
      description="Approve, reject, or suspend sellers on the platform."
      tabs={[
        { href: '/dashboard/admin', label: 'Overview' },
        { href: '/dashboard/admin/sellers', label: 'Sellers' },
        { href: '/dashboard/admin/buyers', label: 'Buyers' },
        { href: '/dashboard/admin/products', label: 'Products' },
        { href: '/dashboard/admin/orders', label: 'Orders' },
      ]}
      active="/dashboard/admin/sellers"
    >
      <SecurePanel<{ data: Seller[] }>
        path="/admin/sellers"
        render={(response) => (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="card-surface p-6 text-center">
                <p className="text-sm text-black/60">Active</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {response.data.filter((s) => s.approvalStatus === 'APPROVED').length}
                </p>
              </div>
              <div className="card-surface p-6 text-center">
                <p className="text-sm text-black/60">Pending</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {response.data.filter((s) => s.approvalStatus === 'PENDING').length}
                </p>
              </div>
              <div className="card-surface p-6 text-center">
                <p className="text-sm text-black/60">Rejected</p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {response.data.filter((s) => s.approvalStatus === 'REJECTED').length}
                </p>
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="text-xl font-semibold text-black mb-4">All Sellers</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Business Name</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Rating</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.data.map((seller) => (
                      <tr key={seller.id} className="border-b hover:bg-[#f9faf7]">
                        <td className="py-3 px-4 font-semibold text-black">{seller.businessName}</td>
                        <td className="py-3 px-4">{seller.user.email}</td>
                        <td className="py-3 px-4">
                          ⭐ {seller.ratingAverage.toFixed(1)} ({seller.totalRatings})
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              seller.approvalStatus === 'APPROVED'
                                ? 'bg-green-100 text-green-700'
                                : seller.approvalStatus === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {seller.approvalStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          {seller.approvalStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(seller.id, 'APPROVED')}
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(seller.id, 'REJECTED')}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {seller.approvalStatus === 'APPROVED' && (
                            <button
                              onClick={() => handleSuspend(seller.id)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Suspend
                            </button>
                          )}
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
