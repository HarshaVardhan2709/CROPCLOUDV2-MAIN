import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6';
const BROKEN_IMAGE_URLS = new Set([
  'https://images.unsplash.com/photo-1622205313162-be1d5712a43e',
]);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value: number | string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatDate(value?: string | Date | null) {
  if (!value) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export function safeImageUrl(value?: string | null) {
  if (!value || BROKEN_IMAGE_URLS.has(value)) {
    return FALLBACK_IMAGE;
  }
  return value;
}
