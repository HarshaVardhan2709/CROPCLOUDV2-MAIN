'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientFetch } from '@/lib/client-api';
import { currency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

export function WishlistPanel() {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['wishlist', token],
    queryFn: () => clientFetch<any>('/wishlist', undefined, token),
    enabled: Boolean(token),
  });

  const removeItem = useMutation({
    mutationFn: async (productId: string) =>
      clientFetch(`/wishlist/items/${productId}`, { method: 'DELETE' }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', token] });
      toast.success('Removed from wishlist');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Could not remove item');
    },
  });

  const addToCart = useMutation({
    mutationFn: async (productId: string) =>
      clientFetch(
        '/cart/items',
        {
          method: 'POST',
          body: JSON.stringify({ productId, quantity: 1 }),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', token] });
      toast.success('Added to cart');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Could not add to cart');
    },
  });

  if (!token) return <div className="card-surface p-8 text-sm text-black/70">Login to view your wishlist.</div>;
  if (query.isLoading) return <div className="card-surface p-8 text-sm text-black/70">Loading wishlist...</div>;
  if (!query.data) return <div className="card-surface p-8 text-sm text-red-600">Could not load wishlist.</div>;
  if (!query.data.items.length) return <div className="card-surface p-8 text-sm text-black/70">Your wishlist is empty.</div>;

  return (
    <div className="space-y-5">
      {query.data.items.map((item: any) => (
        <div key={item.id} className="card-surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link href={`/product/${item.product.slug}`} className="text-lg font-semibold text-black">
                {item.product.name}
              </Link>
              <p className="mt-2 text-sm text-black/65">{item.product.seller.businessName}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xl font-bold text-black">{currency(item.product.price)}</p>
              <button
                type="button"
                onClick={() => addToCart.mutate(item.product.id)}
                className="inline-flex items-center gap-2 text-sm font-medium text-moss"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => removeItem.mutate(item.product.id)}
                className="inline-flex items-center gap-2 text-sm font-medium text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
