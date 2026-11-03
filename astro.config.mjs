// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://maya2234.github.io',
  base: '/portfolio/',
  integrations: [react()],
});