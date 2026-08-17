// Single source of truth for the Reading list, read by now.astro's
// "Reading." section and by the homepage's "Reading list." card.
//
// Pickup dates: the card copy says "with the date I picked them up" but no
// item here actually carries one. Git history only shows when each name was
// first added to the site's copy (5 of the 6 landed together in the initial
// Astro rebuild, 2026-05-16), which is a website-edit date, not a real
// reading-pickup date, so it isn't stored as one here. `pickupDate` exists so
// a real date can be added later without another refactor; until then it's
// null for everyone and the card copy doesn't claim otherwise.

export type ReadingItem = {
  surname: string;
  label: string; // fuller phrase for now.astro's Reading paragraph
  current: boolean; // true = part of the homepage card's "five books a quarter" rotation
  cardOrder?: number; // display order within the homepage card; only used when current
  pickupDate: string | null; // ISO date, when known; not currently established for anyone
};

export const readingItems: ReadingItem[] = [
  { surname: 'Sutherland', label: 'Anything by Rory Sutherland, for fun', current: true, cardOrder: 5, pickupDate: null },
  { surname: 'Heffernan', label: 'Margaret Heffernan on uncertainty', current: false, pickupDate: null },
  { surname: 'Levinson', label: 'Marc Levinson on the box', current: true, cardOrder: 1, pickupDate: null },
  { surname: 'Slouka', label: "Mark Slouka's older essays", current: true, cardOrder: 2, pickupDate: null },
  { surname: 'Tett', label: "Gillian Tett's Anthro-Vision, again", current: true, cardOrder: 3, pickupDate: null },
  { surname: 'McGilchrist', label: 'Iain McGilchrist on attention', current: true, cardOrder: 4, pickupDate: null },
];

// Not a book, so excluded from the homepage card's "Current:" rotation, but
// still part of the fuller Reading paragraph on /now.
export const readingAside = 'The EU AI Act, to work out its global impact.';

export const readingClosing = 'The Patrick Collison reading list is still the bar.';

export function fullReadingParagraph(): string {
  const sentences = readingItems.map((item) => `${item.label}.`);
  sentences.push(`${readingAside}`);
  sentences.push(readingClosing);
  return sentences.join(' ');
}

export function currentCardLine(): string {
  const names = readingItems
    .filter((item) => item.current)
    .sort((a, b) => (a.cardOrder ?? 0) - (b.cardOrder ?? 0))
    .map((item) => item.surname);
  return `Current: ${names.join(', ')}.`;
}
