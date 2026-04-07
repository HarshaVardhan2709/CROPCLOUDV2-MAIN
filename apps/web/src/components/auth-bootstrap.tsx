'use client';

import { useEffect } from 'react';
import { clientFetch } from '@/lib/client-api';
import { useAuthStore } from '@/store/auth-store';

export function AuthBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!hydrated || !refreshToken || accessToken) {
        return;
      }

      try {
        const response = await clientFetch<{
          accessToken: string;
          refreshToken: string;
          user?: { id: string; email: string; fullName: string; role: string };
        }>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });

        if (!cancelled) {
          setSession({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            role: response.user?.role ?? null,
            user: response.user ?? null,
          });
          // After setSession(...) in auth-bootstrap.tsx
localStorage.setItem('cropcloud-token', response.accessToken);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [accessToken, clearSession, hydrated, refreshToken, setSession]);

  return null;
}
