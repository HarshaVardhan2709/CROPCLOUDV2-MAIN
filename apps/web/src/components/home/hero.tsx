'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { HomepageData } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';
import { clientFetch } from '@/lib/client-api';

export function Hero({ banners }: Pick<HomepageData, 'banners'>) {
  const [active, setActive] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((value) => (value + 1) % Math.max(banners.length, 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (!token) return;
    clientFetch('/admin/logins')
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load login stats:', err));
  }, [token]);

  const banner = banners[active];
  if (!banner) return null;

  return (
    <section className="container-shell pt-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* LEFT SIDE (Hero Banner) */}
        <div className="relative overflow-hidden rounded-[36px] bg-grain p-8 text-white shadow-md md:p-10" style={{ minHeight: '420px' }}>
          {/* Background image - full opacity, darkened with overlay */}
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover"
            priority
          />
          {/* Dark green overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b4332]/90 via-[#2d6a4f]/75 to-[#1b4332]/40" />

          {/* Content */}
          <div className="relative z-10 max-w-xl space-y-5">
            <p className="text-sm uppercase tracking-[0.22em] text-white/80">
              Harvest intelligence marketplace
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {banner.title}
            </h1>
            <p className="text-lg text-white/85">
              {banner.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={banner.ctaLink ?? '/shop'}
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#1b4332] px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                {banner.ctaLabel ?? 'Explore marketplace'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/seller"
                className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Start selling
              </Link>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2 pt-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="grid gap-6">
          {/* WHY BUYERS SWITCH */}
          <div className="card-surface bg-[#fffaf2] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-moss/70">
              Why buyers switch
            </p>
            <div className="mt-5 space-y-4 text-sm text-black/70">
              <p>Live seller zones and deliverability checks before checkout.</p>
              <p>Lot-level traceability from harvest to delivery milestone.</p>
              <p>Tiered pricing, approvals, and payment verification ready.</p>
            </div>
          </div>

          {/* LOGIN STATS CARD */}
          <div className="card-surface bg-[#eef5ea] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-moss/70">
              Login Insights
            </p>
            <div className="mt-4 text-sm text-black/80">
              {!stats ? (
                <p>Loading login stats...</p>
              ) : (
                <div className="space-y-2">
                  <p>🔓 Total logins: <strong>{stats.total}</strong></p>
                  <p>📅 Today: <strong>{stats.daily}</strong></p>
                  <p>📈 This month: <strong>{stats.monthly}</strong></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
