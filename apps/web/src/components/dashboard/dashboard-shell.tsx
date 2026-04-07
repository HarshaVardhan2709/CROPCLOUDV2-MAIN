import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function DashboardShell({
  title,
  description,
  tabs,
  active,
  children,
}: {
  title: string;
  description: string;
  tabs: { href: string; label: string }[];
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="container-shell py-10">
      {/* Green banner */}
      <div
        className="mb-8 rounded-[32px] p-8 text-white shadow-md"
        style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)' }}
      >
        <p className="text-sm uppercase tracking-[0.18em] text-white/65">Dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card-surface h-fit p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'block rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                  active === tab.href
                    ? 'text-white'
                    : 'bg-[#f4f7ef] text-black/75 hover:bg-[#e8f0e9]',
                )}
                style={active === tab.href ? { background: 'linear-gradient(135deg, #1b4332, #2d6a4f)' } : {}}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
