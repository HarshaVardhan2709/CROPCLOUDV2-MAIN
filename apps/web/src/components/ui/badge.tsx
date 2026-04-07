import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex rounded-full bg-leaf px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-moss', className)}>
      {children}
    </span>
  );
}
