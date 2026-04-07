'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { clientFetch } from '@/lib/client-api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '../ui/button';
import { currency } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const addressSchema = z.object({
  label: z.string().min(2),
  line1: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
});

export function CheckoutPanel() {
  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Warehouse',
      line1: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const cartQuery = useQuery({
    queryKey: ['cart-checkout', token],
    queryFn: () => clientFetch<any>('/cart', undefined, token),
    enabled: Boolean(token),
  });
  const userQuery = useQuery({
    queryKey: ['user-me', token],
    queryFn: () => clientFetch<any>('/users/me', undefined, token),
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (!selectedAddressId && userQuery.data?.addresses?.length) {
      setSelectedAddressId(userQuery.data.addresses[0].id);
    }
  }, [userQuery.data, selectedAddressId]);

  const previewQuery = useQuery({
    queryKey: ['order-preview', token, selectedAddressId],
    queryFn: () =>
      clientFetch<any>(
        '/orders/preview',
        {
          method: 'POST',
          body: JSON.stringify({ addressId: selectedAddressId }),
        },
        token,
      ),
    enabled: Boolean(token && selectedAddressId && cartQuery.data?.items?.length),
    retry: false,
  });

  const addAddress = useMutation({
    mutationFn: async (values: z.infer<typeof addressSchema>) =>
      clientFetch(
        '/users/me/address',
        {
          method: 'PATCH',
          body: JSON.stringify(values),
        },
        token,
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['user-me', token] });
      const latestAddress = data.addresses?.[data.addresses.length - 1];
      if (latestAddress?.id) {
        setSelectedAddressId(latestAddress.id);
      }
      addressForm.reset({ label: 'Warehouse', line1: '', city: '', state: '', pincode: '' });
      toast.success('Address added');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Could not add address');
    },
  });

  const handleCheckout = async (paymentMethod: 'COD' | 'RAZORPAY') => {
    try {
      if (!token || !selectedAddressId) {
        toast.error('Select a delivery address');
        return;
      }
      if (!previewQuery.data?.deliverable) {
        toast.error('This cart is not deliverable to the selected pincode');
        return;
      }
      const order = await clientFetch<any>(
        '/orders',
        {
          method: 'POST',
          body: JSON.stringify({
            addressId: selectedAddressId,
            paymentMethod,
          }),
        },
        token,
      );

      if (paymentMethod === 'RAZORPAY') {
        const payment = await clientFetch<any>(
          '/payments/create-order',
          {
            method: 'POST',
            body: JSON.stringify({ orderId: order.id }),
          },
          token,
        );

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: payment.amount,
          currency: payment.currency,
          name: 'CropCloud',
          description: 'Marketplace order',
          order_id: payment.razorpayOrderId,
          handler: async (response: any) => {
            await clientFetch(
              '/payments/verify',
              {
                method: 'POST',
                body: JSON.stringify({
                  orderId: order.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              },
              token,
            );
            toast.success('Payment verified');
            router.push(`/orders/${order.id}`);
          },
        };
        if (!window.Razorpay) {
          toast.error('Razorpay script not available');
          return;
        }
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return;
      }

      toast.success('Order placed');
      router.push(`/orders/${order.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
    }
  };

  if (!token) return <div className="card-surface p-8 text-sm text-black/70">Login as a buyer to continue.</div>;
  if (cartQuery.isLoading || userQuery.isLoading) return <div className="card-surface p-8 text-sm text-black/70">Preparing checkout...</div>;
  if (!cartQuery.data || !userQuery.data) return <div className="card-surface p-8 text-sm text-red-600">Unable to load checkout data.</div>;

  const subtotal = cartQuery.data.items.reduce((sum: number, item: any) => sum + Number(item.product.price) * item.quantity, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="card-surface p-8">
          <h2 className="text-2xl font-semibold text-black">Delivery Address</h2>
          <div className="mt-4 space-y-3">
            {userQuery.data.addresses?.map((address: any) => (
              <label
                key={address.id}
                className={`block rounded-[24px] border p-5 text-sm ${
                  selectedAddressId === address.id
                    ? 'border-moss bg-[#eef5ea]'
                    : 'border-ink/10 bg-[#f5f7ef] text-black/70'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mr-3"
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                />
                <span className="font-semibold text-black">{address.label}</span>
                <p className="mt-2">{address.line1}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
              </label>
            ))}
          </div>
        </div>
        <div className="card-surface p-8">
          <h2 className="text-2xl font-semibold text-black">Add Address</h2>
          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={addressForm.handleSubmit((values) => addAddress.mutate(values))}
          >
            <input placeholder="Label" className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" {...addressForm.register('label')} />
            <input placeholder="Pincode" className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" {...addressForm.register('pincode')} />
            <input placeholder="Address line 1" className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none md:col-span-2" {...addressForm.register('line1')} />
            <input placeholder="City" className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" {...addressForm.register('city')} />
            <input placeholder="State" className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" {...addressForm.register('state')} />
            <Button type="submit" className="md:col-span-2">
              Add Address
            </Button>
          </form>
        </div>
        <div className="card-surface p-8">
          <h2 className="text-xl font-semibold text-black">Deliverability Check</h2>
          <div className="mt-4 text-sm text-black/70">
            {!selectedAddressId ? (
              <p>Select an address to validate pincode deliverability.</p>
            ) : previewQuery.isLoading ? (
              <p>Checking delivery serviceability...</p>
            ) : previewQuery.error ? (
              <p className="text-red-600">Selected pincode is not deliverable for one or more items.</p>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-moss">
                  Deliverable to pincode {previewQuery.data?.pincode} in about {previewQuery.data?.estimatedDays} day(s)
                </p>
                {previewQuery.data?.itemChecks?.map((item: any) => (
                  <p key={item.productId}>
                    {item.productName}: {item.deliverable ? 'Deliverable' : item.reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-surface h-fit p-8">
        <h2 className="text-xl font-semibold text-black">Order Summary</h2>
        <div className="mt-4 space-y-3 text-sm text-black/70">
          <div className="flex justify-between"><span>Subtotal</span><span>{currency(previewQuery.data?.subtotal ?? subtotal)}</span></div>
          <div className="flex justify-between"><span>Platform fee</span><span>{currency(previewQuery.data?.platformFee ?? 0)}</span></div>
          <div className="flex justify-between"><span>Delivery fee</span><span>{currency(previewQuery.data?.deliveryFee ?? 0)}</span></div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold text-black"><span>Total</span><span>{currency(previewQuery.data?.total ?? subtotal)}</span></div>
        </div>
        <div className="mt-6 space-y-3">
          <Button className="w-full" disabled={!previewQuery.data?.deliverable} onClick={() => handleCheckout('RAZORPAY')}>Pay with Razorpay</Button>
          <Button className="w-full bg-ink hover:bg-ink/90" disabled={!previewQuery.data?.deliverable} onClick={() => handleCheckout('COD')}>Place COD Order</Button>
        </div>
      </div>
    </div>
  );
}
