import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

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
