import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Optimize for Vercel
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
