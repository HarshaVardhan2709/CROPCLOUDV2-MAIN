import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-b from-[#1b4332] to-[#0f2818] text-white">
      {/* Main Footer */}
      <div className="container-shell py-16">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-1">
            <div>
              <p className="text-2xl font-bold text-white">🌾 CropCloud</p>
              <p className="text-xs text-white/60 uppercase tracking-wider mt-1">Farm-Direct Marketplace</p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Connecting farmers directly with retailers, wholesalers, and institutional buyers for transparent, traceable commerce.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-moss transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-moss transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-moss transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-moss transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/90">Marketplace</h3>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className="text-sm text-white/70 hover:text-white transition-colors">🛒 Shop</Link></li>
              <li><Link href="/category/vegetables" className="text-sm text-white/70 hover:text-white transition-colors">🥬 Vegetables</Link></li>
              <li><Link href="/category/fruits" className="text-sm text-white/70 hover:text-white transition-colors">🍎 Fruits</Link></li>
              <li><Link href="/orders" className="text-sm text-white/70 hover:text-white transition-colors">📦 Orders</Link></li>
              <li><Link href="/wishlist" className="text-sm text-white/70 hover:text-white transition-colors">❤️ Wishlist</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/90">For Sellers</h3>
            <ul className="space-y-2.5">
              <li><Link href="/seller-onboarding" className="text-sm text-white/70 hover:text-white transition-colors">📝 Register Seller</Link></li>
              <li><Link href="/dashboard/seller" className="text-sm text-white/70 hover:text-white transition-colors">📊 Dashboard</Link></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">📚 Resources</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">🎓 Training</a></li>
            </ul>
          </div>


          {/* Created and Developed By */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/90">Created & Developed By</h3>
            <ul className="space-y-2.5">
              <li><p className="text-sm text-white font-medium">Harsha Vardhan</p></li>
              <li><p className="text-sm text-white font-medium">Apuroop Goud</p></li>
              <li><p className="text-sm text-white font-medium">Pardhiv Reddy</p></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-shell py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} CropCloud. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/50">
            <Link href="#" className="hover:text-white/80 transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white/80 transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/80 transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
