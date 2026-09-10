import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  const frames = await getCollection('fridayFrame', ({ data, id }) => !data.draft && id !== 'welcome');
  const sorted = [
    ...posts.map((post) => ({ ...post, link: `/writing/${post.id}` })),
    ...frames.map((post) => ({ ...post, link: `/writing/friday-frame/${post.id}` })),
  ].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const siteUrl = context.site?.toString() || 'https://adrianwatkins.com';

  return rss({
    title: 'Adrian Watkins. Writing.',
    description: 'Essays and the Friday Frame on business leadership, technology and governance across Asia and globally.',
    site: siteUrl,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: post.link,
      categories: 'tags' in post.data ? post.data.tags : [],
      author: 'Adrian Watkins',
    })),
    customData: '<language>en-GB</language>',
  });
}
