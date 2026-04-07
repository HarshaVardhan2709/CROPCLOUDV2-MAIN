import Script from 'next/script';
import { CheckoutPanel } from '@/components/forms/checkout-panel';

export default function CheckoutPage() {
  return (
    <div className="container-shell py-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-2xl font-semibold text-black">Checkout</h1>
      <p className="mt-3 text-sm text-black/65">Deliverability is validated against the selected address before order creation.</p>
      <div className="mt-8">
        <CheckoutPanel />
      </div>
    </div>
  );
}
