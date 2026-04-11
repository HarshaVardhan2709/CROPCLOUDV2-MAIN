import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  compress: true,
  poweredByHeader: false,
  // Disable static optimization to prevent build-time issues with dynamic pages
  staticPageGenerationTimeout: 0,
};

export default nextConfig;
