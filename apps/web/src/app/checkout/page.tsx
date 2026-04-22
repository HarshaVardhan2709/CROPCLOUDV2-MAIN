import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Script from 'next/script';
import { CheckoutPanel } from '@/components/forms/checkout-panel';

export default function CheckoutPage() {
  return (
    <div className="container-shell py-10">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-black/65 hover:text-[#2d6a4f] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-black/40" />
        <Link href="/shop" className="text-black/65 hover:text-[#2d6a4f] transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4 text-black/40" />
        <Link href="/cart" className="text-black/65 hover:text-[#2d6a4f] transition-colors">
          Cart
        </Link>
        <ChevronRight className="h-4 w-4 text-black/40" />
        <span className="font-semibold text-black">Checkout</span>
      </nav>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-2xl font-semibold text-black">Checkout</h1>
      <p className="mt-3 text-sm text-black/65">Deliverability is validated against the selected address before order creation.</p>
      <div className="mt-8">
        <CheckoutPanel />
      </div>
    </div>
  );
}
