// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: change back to 'https://trinityclassical.academy' after DNS cutover
  site: 'https://tcabham.netlify.app',
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});