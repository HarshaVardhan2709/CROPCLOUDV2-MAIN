import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🌿 Green theme - replaces all ink/clay/moss/oat usage
        ink: '#1b4332',      // was dark navy - now deep forest green
        clay: '#2d6a4f',     // was orange - now medium green
        moss: '#2d6a4f',     // stays green
        oat: '#f0f7f4',      // was warm cream - now cool green-white
        grain: '#1b4332',    // was dark - now deep green
      },
      fontFamily: {
        manrope: ['var(--font-manrope)'],
        display: ['var(--font-space-grotesk)'],
      },
    },
  },
  plugins: [],
};

export default config;