import Image from 'next/image';
import Link from 'next/link';
import { HomepageData } from '@/lib/types';
import { safeImageUrl } from '@/lib/utils';

export function CategoryStrip({ categories }: Pick<HomepageData, 'categories'>) {
  return (
    <section className="container-shell mt-10">
      <div className="card-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title text-xl">Browse by Category</h2>
          <Link href="/shop" className="text-sm font-semibold text-moss">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group overflow-hidden rounded-[24px] bg-[#f4f7ef]"
            >
              <div className="relative aspect-[1.3/1]">
                <Image src={safeImageUrl(category.imageUrl)} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-black">{category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
