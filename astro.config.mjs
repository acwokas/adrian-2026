import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

// SITE_URL defaults to the apex (adrianwatkins.com) so canonical, sitemap, and
// OG URLs all resolve to the live host LinkedIn / X crawlers actually fetch.
// Override at build time with SITE_URL=https://adrianwatkins-com-preview.pages.dev
// only when you specifically want a self-canonical preview build.
const SITE_URL = process.env.SITE_URL || 'https://adrianwatkins.com';

// Syndicated copies keep their source canonical but do not compete in our sitemap.
const writingDir = new URL('./src/content/writing/', import.meta.url);
const syndicatedPaths = new Set(readdirSync(writingDir).flatMap((file) => {
  if (!/\.mdx?$/.test(file)) return [];
  const frontmatter = readFileSync(new URL(file, writingDir), 'utf8').split(/^---\s*$/m)[1] || '';
  const match = frontmatter.match(/^canonical:\s*["']?(https?:\/\/[^\s"']+)["']?\s*$/m);
  return match && new URL(match[1]).origin !== new URL(SITE_URL).origin
    ? [`/writing/${file.replace(/\.mdx?$/, '')}`] : [];
}));

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [sitemap({ filter: (page) => !/\/404(?:\.html)?\/?$/.test(page) && !syndicatedPaths.has(new URL(page).pathname.replace(/\/$/, '')) })],
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
