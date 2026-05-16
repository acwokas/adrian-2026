import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const siteUrl = context.site?.toString() || 'https://adrianwatkins-com-preview.pages.dev';

  return rss({
    title: 'Adrian Watkins. Writing.',
    description: 'Long-form essays, the Friday Note, and field notes from Asia-Pacific. Operators, governance, applied intelligence.',
    site: siteUrl,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/writing/${post.id}`,
      categories: post.data.tags,
      author: 'Adrian Watkins',
    })),
    customData: '<language>en-GB</language>',
  });
}
