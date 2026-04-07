'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { clientFetch } from '@/lib/client-api';
import { currency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { TraceabilityTimeline } from '@/components/products/traceability-timeline';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const token = useAuthStore((state) => state.accessToken);
  const query = useQuery({
    queryKey: ['order', params.id, token],
    queryFn: () => clientFetch<any>(`/orders/${params.id}`, undefined, token),
    enabled: Boolean(token && params.id),
  });

  if (!token) return <div className="container-shell py-10">Login to view this order.</div>;
  if (query.isLoading) return <div className="container-shell py-10">Loading order...</div>;
  if (!query.data) return <div className="container-shell py-10">Order unavailable.</div>;

  return (
    <div className="container-shell py-10">
      <div className="card-surface p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-moss/70">{query.data.orderNumber}</p>
        <h1 className="mt-2 text-4xl font-semibold text-black">{query.data.status}</h1>
        <p className="mt-3 text-sm text-black/65">Estimated delivery {formatDate(query.data.estimatedDeliveryAt)}</p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {query.data.items.map((item: any) => (
            <div key={item.id} className="card-surface p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-black">{item.product.name}</h3>
                  <p className="mt-2 text-sm text-black/65">Quantity {item.quantity}</p>
                </div>
                <p className="text-xl font-bold text-black">{currency(item.totalPrice)}</p>
              </div>
              <div className="mt-5">
                <TraceabilityTimeline events={item.product.batches?.[0]?.traceabilityEvents ?? []} />
              </div>
            </div>
          ))}
        </div>
        <div className="card-surface h-fit p-6 text-sm text-black/70">
          <p className="font-semibold text-black">Payment</p>
          <p className="mt-2">{query.data.payments?.[0]?.status}</p>
          <p className="mt-4 font-semibold text-black">Ship to</p>
          <p className="mt-2">{query.data.address.line1}</p>
          <p>{query.data.address.city}, {query.data.address.state} {query.data.address.pincode}</p>
        </div>
      </div>
    </div>
  );
}
