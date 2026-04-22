import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const faqs = [
  ['How does deliverability work?', 'Each seller defines service zones by pincode or radius. Checkout validates the selected address before order creation.'],
  ['When is an order confirmed?', 'COD orders confirm immediately. Razorpay orders confirm only after backend signature verification.'],
  ['Can traceability be extended?', 'Yes. The schema and UI already support batch-based events and can be expanded for audits, warehouse scans, and cold-chain milestones.'],
];

export default function FaqPage() {
  return (
    <div className="container-shell py-10">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-black/65 hover:text-[#2d6a4f] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-black/40" />
        <span className="font-semibold text-black">FAQ</span>
      </nav>

      <div className="space-y-5">
        <h1 className="text-4xl font-semibold text-black">FAQ</h1>
        {faqs.map(([title, body]) => (
          <div key={title} className="card-surface p-6">
            <h2 className="text-xl font-semibold text-black">{title}</h2>
            <p className="mt-3 text-sm text-black/68">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
