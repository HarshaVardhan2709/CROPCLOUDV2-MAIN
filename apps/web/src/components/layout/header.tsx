'use client';
import Link from 'next/link';
import { LogOut, Menu, ShoppingCart, User, Heart } from 'lucide-react';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getDashboardPath } from '@/lib/auth';
import { clientFetch } from '@/lib/client-api';
import { useAuthStore } from '@/store/auth-store';
import { SearchBar } from './search-bar';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/category/vegetables', label: 'Vegetables' },
  { href: '/category/fruits', label: 'Fruits' },
  { href: '/dashboard/buyer', label: 'Buyer' },
  { href: '/dashboard/seller', label: 'Seller' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = async () => {
    try {
      if (token) {
        await clientFetch('/auth/logout', { method: 'POST' }, token);
      }
    } catch {
      // Ignore logout transport failures and clear local state.
    } finally {
      // 🧹 Clear all session data
      document.cookie = 'token=; path=/; max-age=0';
      localStorage.removeItem('cropcloud-auth');
      localStorage.removeItem('cropcloud-token');
      clearSession();
      router.push('/login');
    }
  };

  return (
    <>
      {/* ✅ Top Banner */}
      <div style={{ background: 'linear-gradient(90deg, #1b4332 0%, #2d6a4f 50%, #1b4332 100%)' }}>
        <div className="container-shell flex items-center justify-between gap-4 py-2.5 text-xs uppercase tracking-widest text-white/90">
          <span className="hidden sm:inline">✓ Verified farmers • Transparent pricing • Traceable lots</span>
          <span className="sm:hidden">✓ Verified farmers</span>
          <span className="hidden md:inline">🚛 Bulk-ready delivery across regions</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container-shell py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="rounded-lg border border-black/10 p-2.5 lg:hidden hover:bg-black/5 transition-colors"
              onClick={() => setOpen((value) => !value)}
            >
              <Menu className="h-5 w-5 text-black/70" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-moss hover:text-moss/90 transition">
              <span>🌾</span>
              <span>CropCloud</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden flex-1 lg:block">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-black/70 transition round hover:text-moss hover:bg-moss/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Wishlist */}
              <Link 
                href="/wishlist" 
                className="rounded-lg border border-black/10 p-2.5 hover:bg-red-50 hover:border-red-200 transition-all group"
                title="Wishlist"
              >
                <Heart className="h-5 w-5 text-black/60 group-hover:text-red-500 transition" />
              </Link>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="rounded-lg border border-black/10 p-2.5 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 text-black/60 group-hover:text-blue-600 transition" />
              </Link>

              {/* User Menu */}
              {user ? (
                <>
                  <Link
                    href={getDashboardPath(user.role)}
                    className="hidden sm:flex rounded-lg border border-black/10 px-4 py-2.5 text-sm font-semibold text-moss bg-moss/5 hover:bg-moss/10 transition-all items-center gap-2"
                  >
                    👤 {user.fullName.split(' ')[0]}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-black/10 p-2.5 hover:bg-red-50 hover:border-red-200 transition-all group"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5 text-black/60 group-hover:text-red-500 transition" />
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="rounded-lg border border-black/10 p-2.5 hover:bg-green-50 hover:border-green-200 transition-all group"
                  title="Login"
                >
                  <User className="h-5 w-5 text-black/60 group-hover:text-moss transition" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-3 lg:hidden">
            <Suspense fallback={null}>
              <SearchBar mobile />
            </Suspense>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={cn('overflow-hidden transition-all lg:hidden', open ? 'max-h-56 pt-4' : 'max-h-0')}>
            <nav className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-moss/5 to-moss/10 p-4 border border-moss/10">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="px-4 py-2.5 text-sm font-medium text-black/70 hover:text-moss hover:bg-white/50 rounded-lg transition"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
