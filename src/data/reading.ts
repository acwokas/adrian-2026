// Single source of truth for the Reading list. Every surface that mentions
// what Adrian is reading renders from `readingItems`:
//   - now.astro's "Reading." section       -> fullReadingParagraph()
//   - the homepage "Reading list." card    -> currentCardLine()
//   - the homepage /now digest teaser      -> digestReadingLine()
// No reading name should appear as a literal string anywhere else; the
// build-time check in scripts/check-data-sourcing.mjs fails if one does.
//
// Pickup dates: the card copy used to say "with the date I picked them up"
// but no item here actually carries one. Git history only shows when each
// name was first added to the site's copy (5 of the 6 landed together in
// the initial Astro rebuild, 2026-05-16), which is a website-edit date, not
// a real reading-pickup date, so it isn't stored as one here. `pickupDate`
// exists so a real date can be added later without another refactor; until
// then it's null for everyone and the card copy doesn't claim otherwise.

export type ReadingItem = {
  id: string;
  fullName: string; // e.g. 'Rory Sutherland', 'the EU AI Act'
  surname?: string; // books only; used in the homepage card's terse list
  label: string; // sentence fragment (no trailing period) for now.astro's Reading paragraph
  isBook: boolean; // false for the EU AI Act
  current: boolean; // true = part of the homepage card's "five books a quarter" rotation
  cardOrder?: number; // display order within the homepage card; only used when current
  digestNote?: string; // connective phrase for the homepage digest teaser; name comes from fullName
  pickupDate: string | null; // ISO date, when known; not currently established for anyone
};

export const readingItems: ReadingItem[] = [
  {
    id: 'sutherland',
    fullName: 'Rory Sutherland',
    surname: 'Sutherland',
    label: 'Anything by Rory Sutherland, for fun',
    isBook: true,
    current: true,
    cardOrder: 5,
    digestNote: 'for fun',
    pickupDate: null,
  },
  {
    id: 'heffernan',
    fullName: 'Margaret Heffernan',
    surname: 'Heffernan',
    label: 'Margaret Heffernan on uncertainty',
    isBook: true,
    current: false,
    pickupDate: null,
  },
  {
    id: 'levinson',
    fullName: 'Marc Levinson',
    surname: 'Levinson',
    label: 'Marc Levinson on the box',
    isBook: true,
    current: true,
    cardOrder: 1,
    pickupDate: null,
  },
  {
    id: 'slouka',
    fullName: 'Mark Slouka',
    surname: 'Slouka',
    label: "Mark Slouka's older essays",
    isBook: true,
    current: true,
    cardOrder: 2,
    pickupDate: null,
  },
  {
    id: 'tett',
    fullName: 'Gillian Tett',
    surname: 'Tett',
    label: "Gillian Tett's Anthro-Vision, again",
    isBook: true,
    current: true,
    cardOrder: 3,
    pickupDate: null,
  },
  {
    id: 'mcgilchrist',
    fullName: 'Iain McGilchrist',
    surname: 'McGilchrist',
    label: 'Iain McGilchrist on attention',
    isBook: true,
    current: true,
    cardOrder: 4,
    pickupDate: null,
  },
  {
    id: 'eu-ai-act',
    fullName: 'the EU AI Act',
    label: 'The EU AI Act, to work out its global impact',
    isBook: false,
    current: false,
    digestNote: 'to work out its global impact',
    pickupDate: null,
  },
];

export const readingClosing = 'The Patrick Collison reading list is still the bar.';

export function fullReadingParagraph(): string {
  const sentences = readingItems.map((item) => `${item.label}.`);
  sentences.push(readingClosing);
  return sentences.join(' ');
}

function isCurrentBook(item: ReadingItem): item is ReadingItem & { surname: string } {
  return item.isBook && item.current;
}

export function currentCardLine(): string {
  const names = readingItems
    .filter(isCurrentBook)
    .sort((a, b) => (a.cardOrder ?? 0) - (b.cardOrder ?? 0))
    .map((item) => item.surname);
  return `Current: ${names.join(', ')}.`;
}

function joinWithAnd(phrases: string[]): string {
  if (phrases.length <= 1) return phrases.join('');
  return `${phrases.slice(0, -1).join(', ')}, and ${phrases[phrases.length - 1]}`;
}

// Compact "Reading: ..." teaser for the homepage /now digest. Only items
// with a `digestNote` are surfaced here; the rest still appear in the fuller
// now.astro paragraph via fullReadingParagraph().
export function digestReadingLine(): string {
  const phrases = readingItems
    .filter((item) => item.digestNote)
    .map((item) => `${item.fullName} ${item.digestNote}`);
  return `Reading: ${joinWithAnd(phrases)}.`;
}
