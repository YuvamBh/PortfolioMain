// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static pages; only /api/chat runs as a serverless function.
export default defineConfig({
  site: 'https://yuvambhargav.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/duvi'),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
  // Tailwind v4 for React components in src/components/ui (utilities only; see src/styles/tailwind.css).
  vite: { plugins: [tailwindcss()] },
  // The dev-only toolbar overlay is off; it sits over the page and its audit module errors after cache clears.
  devToolbar: { enabled: false },
});
