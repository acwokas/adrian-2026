import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const siteUrl = (context.site?.toString() || 'https://adrianwatkins-com-preview.pages.dev').replace(/\/$/, '');
  const body = [
    '# adrianwatkins.com - robots.txt',
    '# Default rule: allow all crawlers.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
