import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 py-16 text-white" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #1b4332 100%)' }}>
      <div className="container-shell grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <p className="text-2xl font-bold">CropCloud</p>
          <p className="max-w-sm text-sm text-white/70">
            Farm-direct commerce for retailers, wholesalers, exporters, processors, and institutional buyers.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Marketplace</p>
          <div className="flex flex-col space-y-3 text-sm text-white/80">
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/orders" className="hover:text-white transition-colors">Orders</Link>
            <Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Company</p>
          <div className="flex flex-col space-y-3 text-sm text-white/80">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Developed by</p>
          <div className="flex flex-col space-y-3 text-sm text-white/80">
            <p>Harsha Vardhan</p>
            <p>Apuroop Goud</p>
            <p>Pardhiv Reddy</p>
          </div>
        </div>
      </div>
      <div className="container-shell mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} CropCloud. All rights reserved.
      </div>
    </footer>
  );
}
