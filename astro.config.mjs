import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

// SITE_URL is set per-environment in Cloudflare Pages. On the apex cutover deploy
// set SITE_URL=https://adrianwatkins.com so canonical, sitemap, and OG URLs all
// resolve to apex. Preview deploys leave it unset and self-canonical to the
// preview hostname.
const SITE_URL = process.env.SITE_URL || 'https://adrianwatkins-com-preview.pages.dev';

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
