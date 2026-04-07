'use client';

import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/client-api';
import { useAuthStore } from '@/store/auth-store';

export function SecurePanel<T>({
  path,
  render,
}: {
  path: string;
  render: (data: T) => ReactNode;
}) {
  const token = useAuthStore((state) => state.accessToken);
  const query = useQuery({
    queryKey: [path, token],
    queryFn: () => clientFetch<T>(path, undefined, token),
    enabled: Boolean(token),
  });

  if (!token) {
    return <div className="card-surface p-8 text-sm text-black/70">Login first to load this dashboard.</div>;
  }
  if (query.isLoading) {
    return <div className="card-surface p-8 text-sm text-black/70">Loading dashboard...</div>;
  }
  if (query.error || !query.data) {
    return <div className="card-surface p-8 text-sm text-red-600">Unable to load dashboard data.</div>;
  }

  return <>{render(query.data)}</>;
}
