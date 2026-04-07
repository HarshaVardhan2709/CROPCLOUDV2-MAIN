'use client';

import { Heart } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientFetch } from '@/lib/client-api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export function WishlistButton({
  productId,
  className,
  showLabel = false,
}: {
  productId: string;
  className?: string;
  showLabel?: boolean;
}) {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist', token],
    queryFn: () => clientFetch<any>('/wishlist', undefined, token),
    enabled: Boolean(token),
  });

  const toggleMutation = useMutation({
    mutationFn: async (saved: boolean) => {
      if (saved) {
        return clientFetch(`/wishlist/items/${productId}`, { method: 'DELETE' }, token);
      }
      return clientFetch(
        '/wishlist/items',
        {
          method: 'POST',
          body: JSON.stringify({ productId }),
        },
        token,
      );
    },
    onSuccess: (_data, saved) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', token] });
      toast.success(saved ? 'Removed from wishlist' : 'Added to wishlist');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Wishlist update failed');
    },
  });

  const saved = Boolean(
    wishlistQuery.data?.items?.some((item: { productId?: string; product?: { id: string } }) =>
      (item.productId ?? item.product?.id) === productId,
    ),
  );

  return (
    <button
      type="button"
      disabled={!token || toggleMutation.isPending}
      onClick={() => {
        if (!token) {
          toast.error('Login first to use wishlist');
          return;
        }
        toggleMutation.mutate(saved);
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white/90 p-3 text-black transition hover:bg-white disabled:opacity-60',
        saved ? 'text-clay' : '',
        className,
      )}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn('h-5 w-5', saved ? 'fill-clay text-clay' : '')} />
      {showLabel ? <span className="text-sm font-medium">{saved ? 'Wishlisted' : 'Add to Wishlist'}</span> : null}
    </button>
  );
}
