import { getCollection } from 'astro:content';
import pricingComic from '../assets/comics/2026-11-06-faster-work-same-price.png';
import experienceComic from '../assets/comics/2026-10-30-where-will-experience-come-from.png';

// Register approved final artwork here without changing the reviewed article.
// Titles, dates, summaries and publication state come from Friday Frame.
const comicArtwork = [
  {
    frameId: '2026-11-06-should-you-pay-for-how-long-it-used-to-take',
    image: pricingComic,
    alt: 'Faster work. Same price? A robot produces a mountain of reports, while a customer needs help choosing which project to fund.',
    panels: [
      'The robot presents a report. “Three days’ work.” Adrian holds the invoice. “Busy three minutes, then.”',
      'The robot says, “I’ve increased your output tenfold.” The customer, buried in reports, replies, “Yes. I noticed.”',
      '“What do we actually do?” asks the customer. Adrian replies, “Apparently, turn to page 147.”',
      'At the next steps workshop, Adrian says, “Oh good. A meeting about the meeting.” The customer replies, “I just need to know which project to fund.”',
      'An adviser points to three projects on one sheet. “Right. Let’s compare these and work out how to get the best one running.” Adrian replies, “Ah. That bit I’ll happily pay for.”',
      'Adrian says, “I don’t need it to take three days. I need it to be useful.” Read the full Friday Frame at adrianwatkins.com/writing.',
    ],
  },
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
