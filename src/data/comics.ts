import { getCollection } from 'astro:content';
import experienceComic from '../assets/comics/2026-10-30-where-will-experience-come-from.png';

// Register approved final artwork here without changing the reviewed article.
// Titles, dates, summaries and publication state come from Friday Frame.
const comicArtwork = [
  {
    frameId: '2026-10-30-where-will-experience-come-from',
    image: experienceComic,
    alt: 'Six-panel Friday Frame comic about gaining experience as AI changes work, student mentoring, HydraCool’s win and UOB’s graduate hiring plans.',
    panels: [
      'We want experience. Where will people get it?',
      'AI can do the tasks. What replaces the learning?',
      'Make room to practise, question and learn.',
      'Congratulations, HydraCool! Grand Finale winners.',
      'UOB plans 1,000 graduate hires over a year.',
      'Read the full Friday Frame. Read more at adrianwatkins.com/writing.',
    ],
  },
];

export async function getPublishedComics() {
  const frames = await getCollection('fridayFrame');
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());

  return comicArtwork.flatMap((artwork) => {
    const frame = frames.find((entry) => entry.id === artwork.frameId);
    if (!frame) throw new Error(`Comic has no corresponding Friday Frame: ${artwork.frameId}`);
    if (frame.data.draft || frame.data.date.toISOString().slice(0, 10) > today) return [];
    return [{
      ...artwork,
      title: frame.data.title,
      summary: frame.data.summary,
      date: frame.data.date,
      href: `/writing/friday-frame/${frame.id}`,
    }];
  }).sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export type PublishedComic = Awaited<ReturnType<typeof getPublishedComics>>[number];
