'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientFetch } from '@/lib/client-api';
import { currency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '../ui/button';

export function CartPanel() {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['cart', token],
    queryFn: () => clientFetch<any>('/cart', undefined, token),
    enabled: Boolean(token),
  });

  const updateItem = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) =>
      clientFetch(
        '/cart/items',
        {
          method: 'POST',
          body: JSON.stringify({ productId, quantity }),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', token] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to update cart');
    },
  });

  const removeItem = useMutation({
    mutationFn: async (productId: string) =>
      clientFetch(`/cart/items/${productId}`, { method: 'DELETE' }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', token] });
      toast.success('Item removed');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to remove item');
    },
  });

  if (!token) return <div className="card-surface p-8 text-sm text-black/70">Login as a buyer to view your cart.</div>;
  if (query.isLoading) return <div className="card-surface p-8 text-sm text-black/70">Loading cart...</div>;
  if (query.error || !query.data) return <div className="card-surface p-8 text-sm text-red-600">Could not load cart.</div>;

  if (!query.data.items.length) {
    return <div className="card-surface p-8 text-sm text-black/70">Your cart is empty.</div>;
  }

  const total = query.data.items.reduce((sum: number, item: any) => sum + Number(item.product.price) * item.quantity, 0);

  return (
    <div className="space-y-5">
      {query.data.items.map((item: any) => (
        <div key={item.id} className="card-surface flex flex-col justify-between gap-4 p-6 md:flex-row">
          <div>
            <p className="text-lg font-semibold text-black">{item.product.name}</p>
            <p className="mt-2 text-sm text-black/65">{item.product.seller.businessName}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-[#f5f7ef] p-1">
              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-white"
                onClick={() => {
                  const nextQuantity = item.quantity - 1;
                  if (nextQuantity < 1) {
                    removeItem.mutate(item.productId);
                    return;
                  }
                  updateItem.mutate({ productId: item.productId, quantity: nextQuantity });
                }}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-black">{item.quantity}</span>
              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-white"
                onClick={() =>
                  updateItem.mutate({ productId: item.productId, quantity: item.quantity + 1 })
                }
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xl font-bold text-black">{currency(Number(item.product.price) * item.quantity)}</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-red-600"
              onClick={() => removeItem.mutate(item.productId)}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="card-surface flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-black/60">Estimated subtotal</p>
          <p className="text-2xl font-bold text-black">{currency(total)}</p>
        </div>
        <Link href="/checkout">
          <Button>Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
