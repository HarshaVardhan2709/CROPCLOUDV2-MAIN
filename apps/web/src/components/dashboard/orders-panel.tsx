'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/client-api';
import { currency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

export function OrdersPanel() {
  const token = useAuthStore((state) => state.accessToken);
  const query = useQuery({
    queryKey: ['orders', token],
    queryFn: () => clientFetch<any[]>('/orders', undefined, token),
    enabled: Boolean(token),
  });

  if (!token) return <div className="card-surface p-8 text-sm text-black/70">Login to view orders.</div>;
  if (query.isLoading) return <div className="card-surface p-8 text-sm text-black/70">Loading orders...</div>;
  if (!query.data) return <div className="card-surface p-8 text-sm text-red-600">Could not load orders.</div>;

  return (
    <div className="space-y-5">
      {query.data.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`} className="card-surface block p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-moss/70">{order.orderNumber}</p>
              <h3 className="mt-1 text-xl font-semibold text-black">{order.status}</h3>
              <p className="mt-2 text-sm text-black/65">Placed {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-black">{currency(order.total)}</p>
              <p className="text-sm text-black/65">{order.items.length} line items</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
