'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function FilterSidebar({
  categories,
}: {
  categories: Array<{ id: string; name: string; slug: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? '';
  const currentCategory = searchParams.get('category') ?? '';
  const currentOrganic = searchParams.get('organic') === 'true';
  const currentQualityGrade = searchParams.get('qualityGrade') ?? '';
  const currentMinPrice = searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ['category', 'organic', 'qualityGrade', 'minPrice', 'maxPrice', 'sort'].forEach((key) =>
      params.delete(key),
    );
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <aside className="card-surface h-fit p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black">Filters</h3>
        <button type="button" onClick={clearFilters} className="text-sm font-medium text-moss">
          Clear
        </button>
      </div>
      <div className="mt-4 space-y-5 text-sm text-black/70">
        <div>
          <p className="font-semibold text-black">Category</p>
          <select
            value={currentCategory}
            onChange={(event) => updateQuery('category', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-3 py-2 outline-none"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="font-semibold text-black">Quality</p>
          <select
            value={currentQualityGrade}
            onChange={(event) => updateQuery('qualityGrade', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-3 py-2 outline-none"
          >
            <option value="">All grades</option>
            <option value="A">A Grade</option>
            <option value="Premium">Premium</option>
            <option value="Export">Export</option>
          </select>
        </div>
        <div>
          <p className="font-semibold text-black">Production</p>
          <label className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentOrganic}
              onChange={(event) => updateQuery('organic', event.target.checked ? 'true' : '')}
            />
            Organic only
          </label>
        </div>
        <div>
          <p className="font-semibold text-black">Price range</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              value={currentMinPrice}
              onChange={(event) => updateQuery('minPrice', event.target.value)}
              placeholder="Min"
              className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2 outline-none"
            />
            <input
              value={currentMaxPrice}
              onChange={(event) => updateQuery('maxPrice', event.target.value)}
              placeholder="Max"
              className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2 outline-none"
            />
          </div>
        </div>
        <div>
          <p className="font-semibold text-black">Sort</p>
          <select
            value={currentSort}
            onChange={(event) => updateQuery('sort', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-3 py-2 outline-none"
          >
            <option value="">Featured</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
