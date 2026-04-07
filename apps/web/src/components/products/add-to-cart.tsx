'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { clientFetch } from '@/lib/client-api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '../ui/button';

export function AddToCart({
  productId,
  minQuantity = 1,
}: {
  productId: string;
  minQuantity?: number;
}) {
  const token = useAuthStore((state) => state.accessToken);
  const [quantity, setQuantity] = useState(Math.max(1, minQuantity));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-[24px] border border-ink/10 bg-[#f5f7ef] p-2">
        <button
          type="button"
          className="rounded-full p-3 text-black transition hover:bg-white"
          onClick={() => setQuantity((value) => Math.max(minQuantity, value - 1))}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-black/45">Quantity</p>
          <p className="text-lg font-semibold text-black">{quantity}</p>
        </div>
        <button
          type="button"
          className="rounded-full p-3 text-black transition hover:bg-white"
          onClick={() => setQuantity((value) => value + 1)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        className="w-full"
        onClick={async () => {
          if (!token) {
            toast.error('Login as a buyer first');
            return;
          }
          try {
            await clientFetch(
              '/cart/items',
              {
                method: 'POST',
                body: JSON.stringify({ productId, quantity }),
              },
              token,
            );
            toast.success('Added to cart');
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not add to cart');
          }
        }}
      >
        Add {quantity} to Cart
      </Button>
    </div>
  );
}
