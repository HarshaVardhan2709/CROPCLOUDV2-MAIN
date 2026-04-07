export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: string;
  unit: string;
  minOrderQuantity?: number;
  qualityGrade: string;
  organicCertified: boolean;
  originCity?: string | null;
  originState?: string | null;
  harvestDate?: string | null;
  featured: boolean;
  bestDeal: boolean;
  seasonal: boolean;
  images: { id?: string; url: string; alt?: string | null }[];
  inventory?: { availableQuantity: number };
  seller: {
    businessName: string;
    ratingAverage: number;
    totalRatings: number;
    user: { fullName: string };
  };
  category: { name: string; slug: string };
  reviews?: { rating: number }[];
  deliverability?: {
    deliverable: boolean;
    estimatedDays?: number;
    reason?: string;
  } | null;
};

export type HomepageData = {
  banners: Array<{
    id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    ctaLabel?: string;
    ctaLink?: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
  }>;
  featured: Product[];
  deals: Product[];
  seasonal: Product[];
  recent: Product[];
};
