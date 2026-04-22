import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container-shell py-10">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-black/65 hover:text-[#2d6a4f] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-black/40" />
        <span className="font-semibold text-black">Contact</span>
      </nav>

      <div className="card-surface p-8">
        <h1 className="text-4xl font-semibold text-black">Contact</h1>
        <p className="mt-4 text-sm text-black/68">Email `support@cropcloud.dev` or reach the operations desk at `+91 98765 43210`.</p>
      </div>
    </div>
  );
}
