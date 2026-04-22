import Image from 'next/image';
import Link from 'next/link';
import { HomepageData } from '@/lib/types';
import { safeImageUrl } from '@/lib/utils';

export function CategoryStrip({ categories }: Pick<HomepageData, 'categories'>) {
  return (
    <section className="container-shell mt-16">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-black">🌾 Browse by Category</h2>
          <p className="text-black/60">Explore our wide selection of fresh, traceable produce</p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-black/5 hover:border-moss/20"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f5f7ef] to-[#eef4e8]">
                <Image 
                  src={safeImageUrl(category.imageUrl)} 
                  alt={category.name} 
                  fill 
                  className="object-cover transition duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Label */}
              <div className="absolute inset-0 flex items-end justify-start p-4">
                <div>
                  <p className="font-bold text-white text-lg drop-shadow-lg">{category.name}</p>
                  <p className="text-white/90 text-xs drop-shadow-lg">Browse products →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
