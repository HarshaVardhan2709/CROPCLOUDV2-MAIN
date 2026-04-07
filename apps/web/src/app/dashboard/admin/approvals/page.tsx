'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AdminAccount {
  id: string;
  email: string;
  fullName: string;
  isPrimaryAdmin: boolean;
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  isActive: boolean;
  isApproved: boolean;
}

interface AdminListResponse {
  total: number;
  admins: AdminAccount[];
}

export default function AdminApprovalsPage() {
  const [allAdmins, setAllAdmins] = useState<AdminAccount[]>([]);
  const [pendingAdmins, setPendingAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch all admins and pending approvals in parallel
        const [allResponse, pendingResponse] = await Promise.all([
          fetch('/api/v1/admin/all-admins', {
            headers: { 'Cache-Control': 'no-cache' },
          }),
          fetch('/api/v1/admin/approvals/pending', {
            headers: { 'Cache-Control': 'no-cache' },
          }),
        ]);

        const allData: AdminListResponse = await allResponse.json();
        const pendingData = await pendingResponse.json();

        setAllAdmins(allData.admins || []);
        setPendingAdmins(pendingData.admins || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
    const interval = setInterval(fetchAdminData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (adminId: string) => {
    try {
      setApproving(adminId);
      const response = await fetch(`/api/v1/admin/approvals/${adminId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to approve admin');
      
      const result = await response.json();
      alert(result.message || 'Admin approved successfully');
      
      // Refresh data
      const allResponse = await fetch('/api/v1/admin/all-admins');
      const allData: AdminListResponse = await allResponse.json();
      setAllAdmins(allData.admins || []);
      
      const pendingResponse = await fetch('/api/v1/admin/approvals/pending');
      const pendingData = await pendingResponse.json();
      setPendingAdmins(pendingData.admins || []);
    } catch (error) {
      alert('Error approving admin: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (adminId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      setRejecting(adminId);
      const response = await fetch(`/api/v1/admin/approvals/${adminId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || undefined }),
      });

      if (!response.ok) throw new Error('Failed to reject admin');

      const result = await response.json();
      alert(result.message || 'Admin rejected successfully');

      // Refresh data
      const allResponse = await fetch('/api/v1/admin/all-admins');
      const allData: AdminListResponse = await allResponse.json();
      setAllAdmins(allData.admins || []);

      const pendingResponse = await fetch('/api/v1/admin/approvals/pending');
      const pendingData = await pendingResponse.json();
      setPendingAdmins(pendingData.admins || []);
    } catch (error) {
      alert('Error rejecting admin: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setRejecting(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading admin management...</div>;
  }

  return (
    <div className="p-6 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Approvals</h1>
            <p className="text-gray-600">
              Manage admin account approvals. Only the primary admin can approve or reject other admins.
            </p>
          </div>
          <Link
            href="/dashboard/admin/create-admin"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            ➕ Create Admin
          </Link>
        </div>

        {/* Pending Approvals Section */}
        {pendingAdmins.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Pending Approvals ({pendingAdmins.length})
            </h2>
            <div className="space-y-4">
              {pendingAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{admin.fullName}</p>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => handleApprove(admin.id)}
                      disabled={approving === admin.id}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition"
                    >
                      {approving === admin.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(admin.id)}
                      disabled={rejecting === admin.id}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition"
                    >
                      {rejecting === admin.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingAdmins.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">✓ No pending admin approvals</p>
          </div>
        )}

        {/* All Admins Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            All Admins ({allAdmins.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Role</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Active</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {allAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-gray-900">{admin.fullName}</td>
                    <td className="p-3 text-gray-600">{admin.email}</td>
                    <td className="p-3">
                      {admin.isPrimaryAdmin ? (
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          Primary Admin
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {admin.adminApprovalStatus === 'APPROVED' ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Approved
                        </span>
                      ) : admin.adminApprovalStatus === 'PENDING' ? (
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={admin.isActive ? 'text-green-600' : 'text-red-600'}>
                        {admin.isActive ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 text-xs">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How Admin Approval Works</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Only the <strong>primary admin</strong> can approve or reject new admin accounts</li>
            <li>New admin accounts start in <strong>PENDING</strong> status</li>
            <li>Admins must be <strong>APPROVED</strong> to access admin features</li>
            <li>The primary admin account is automatically approved and cannot be rejected</li>
          </ul>
        </div>
    </div>
  );
}
