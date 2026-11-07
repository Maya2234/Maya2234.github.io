// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// pages that only redirect somewhere else (the old /projects address): keep them out of the sitemap
const redirects = ['/projects/', '/es/projects/', '/it/projects/'];

// https://astro.build/config
export default defineConfig({
  site: 'https://mayatomarchio.com',
  base: '/',
  integrations: [
    react(),
    // sitemap-index.xml for Google, with each page linked to its English, Spanish and Italian versions
    sitemap({
      filter: (page) => !redirects.includes(new URL(page).pathname),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es', it: 'it' },
      },
    }),
  ],
});
