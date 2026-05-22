import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

// SITE_URL defaults to the apex (adrianwatkins.com) so canonical, sitemap, and
// OG URLs all resolve to the live host LinkedIn / X crawlers actually fetch.
// Override at build time with SITE_URL=https://adrianwatkins-com-preview.pages.dev
// only when you specifically want a self-canonical preview build.
const SITE_URL = process.env.SITE_URL || 'https://adrianwatkins.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          protocols: ['http', 'https'],
        },
      ],
    ],
  },
});
