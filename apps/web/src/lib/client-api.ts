'use client';

import { useAuthStore } from '@/store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  const { refreshToken, setSession, clearSession, user } = useAuthStore.getState();
  if (!refreshToken) {
    clearSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Refresh failed');
        }
        return response.json();
      })
      .then((response: { accessToken: string; refreshToken: string; user?: typeof user }) => {
        setSession({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          role: response.user?.role ?? user?.role ?? null,
          user: response.user ?? user ?? null,
        });
        return response.accessToken;
      })
      .catch(() => {
        clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function clientFetch<T>(path: string, init?: RequestInit, token?: string | null): Promise<T> {
  const activeToken = token ?? useAuthStore.getState().accessToken;
  let response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/signup' && path !== '/auth/refresh') {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshedToken}`,
          ...(init?.headers ?? {}),
        },
      });
    }
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed for ${path}`);
  }

  return response.json();
}
