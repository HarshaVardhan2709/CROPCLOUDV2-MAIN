import 'server-only';
import { HomepageData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path}`);
  }

  return response.json();
}

export const api = {
  homepage: () => apiFetch<HomepageData>('/home'),
  categories: () => apiFetch<Array<{ id: string; name: string; slug: string; imageUrl?: string; _count?: { products: number } }>>('/categories'),
  products: (query = '') => apiFetch<{ items: unknown[]; meta: unknown }>(`/products${query}`),
  product: (slug: string, query = '') => apiFetch<any>(`/products/${slug}${query}`),
  searchSuggestions: (q: string) => apiFetch<Array<{ id: string; name: string; slug: string }>>(`/search/suggestions?q=${encodeURIComponent(q)}`),
};
