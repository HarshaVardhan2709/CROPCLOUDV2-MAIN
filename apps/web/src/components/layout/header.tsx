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
      {/* ✅ Green top strip */}
      <div style={{ background: 'linear-gradient(90deg, #1b4332 0%, #2d6a4f 50%, #1b4332 100%)' }}>
        <div className="container-shell flex items-center justify-between gap-4 py-2 text-xs uppercase tracking-[0.18em] text-white/90">
          <span>Verified farmers. Transparent pricing. Traceable lots.</span>
          <span>Bulk-ready delivery across serviceable regions</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#2d6a4f]/10 bg-oat/90 backdrop-blur">
        <div className="container-shell py-4">
          <div className="flex items-center gap-4">
            <button
              className="rounded-full border border-[#2d6a4f]/20 p-3 lg:hidden hover:bg-[#2d6a4f]/5 transition-colors"
              onClick={() => setOpen((value) => !value)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="text-2xl font-bold tracking-tight text-moss">
              CropCloud
            </Link>
            <div className="hidden flex-1 lg:block">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
            <nav className="hidden items-center gap-5 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-black/75 transition hover:text-[#2d6a4f]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/wishlist" className="rounded-full border border-[#2d6a4f]/20 p-3 hover:bg-[#2d6a4f]/5 transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
              <Link href="/cart" className="rounded-full border border-[#2d6a4f]/20 p-3 hover:bg-[#2d6a4f]/5 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              {user ? (
                <>
                  <Link
                    href={getDashboardPath(user.role)}
                    className="rounded-full border border-[#2d6a4f]/20 px-4 py-3 text-sm font-medium hover:bg-[#2d6a4f]/5 transition-colors"
                  >
                    {user.fullName.split(' ')[0]}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-[#2d6a4f]/20 p-3 hover:bg-[#2d6a4f]/5 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link href="/login" className="rounded-full border border-[#2d6a4f]/20 p-3 hover:bg-[#2d6a4f]/5 transition-colors">
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
          <div className="mt-3 lg:hidden">
            <Suspense fallback={null}>
              <SearchBar mobile />
            </Suspense>
          </div>
          <div className={cn('overflow-hidden transition-all lg:hidden', open ? 'max-h-40 pt-4' : 'max-h-0')}>
            <nav className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-md">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-black/75 hover:text-[#2d6a4f]">
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
