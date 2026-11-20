// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Static pages; only /api/chat runs as a serverless function.
export default defineConfig({
  site: 'https://yuvambhargav.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap({ filter: (page) => !page.includes('/duvi') })],
});
