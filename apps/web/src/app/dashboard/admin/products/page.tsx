'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SecurePanel } from '@/components/dashboard/secure-panel';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  seller: { user: { fullName: string } };
  inventoryQuantity: number;
  category: { name: string };
}

export default function ProductsManagementPage() {
  const handleRemove = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      await fetch(`/api/v1/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Removed by admin' }),
      });
      alert('Product removed successfully');
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <DashboardShell
      title="Products Management"
      description="Monitor and moderate products on the platform."
      tabs={[
        { href: '/dashboard/admin', label: 'Overview' },
        { href: '/dashboard/admin/sellers', label: 'Sellers' },
        { href: '/dashboard/admin/products', label: 'Products' },
        { href: '/dashboard/admin/orders', label: 'Orders' },
      ]}
      active="/dashboard/admin/products"
    >
      <SecurePanel<{ data: Product[] }>
        path="/admin/products"
        render={(response) => (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <h2 className="text-xl font-semibold text-black mb-4">
                All Products ({response.data.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {response.data.slice(0, 15).map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    {product.images.length > 0 && (
                      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-black truncate">{product.name}</h3>
                    <p className="text-sm text-black/60">{product.category.name}</p>
                    <p className="text-sm text-black/60">By {product.seller.user.fullName}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold text-black">₹{product.price}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Stock: {product.inventoryQuantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="mt-3 w-full bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
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
