'use client';

import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clientFetch } from '@/lib/client-api';

type Suggestion = {
  id: string;
  name: string;
  slug: string;
};

export function SearchBar({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nextQuery = searchParams.get('search') ?? '';
    setQuery(nextQuery);
  }, [searchParams]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await clientFetch<Suggestion[]>(
          `/search/suggestions?q=${encodeURIComponent(query.trim())}`,
        );
        setSuggestions(results);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    setOpen(false);
    router.push(value ? `/shop?search=${encodeURIComponent(value)}` : '/shop');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-md ${mobile ? '' : 'w-full'}`}
    >
      <Search className="h-5 w-5 text-black/45" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setOpen(Boolean(suggestions.length))}
        placeholder="Search produce, categories, farms, lots..."
        className="w-full bg-transparent text-sm outline-none"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            setSuggestions([]);
            setOpen(false);
          }}
          className="rounded-full p-1 text-black/45"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      {open && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-[24px] border border-ink/10 bg-white p-2 shadow-md">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion.id}
              href={`/product/${suggestion.slug}`}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm text-black/75 transition hover:bg-[#f4f7ef] hover:text-black"
            >
              {suggestion.name}
            </Link>
          ))}
        </div>
      ) : null}
    </form>
  );
}
