// Confirmed SDG Open Hack mentoring dates for /singapore.
//
// Entries drop out of getUpcomingMentoring() automatically once `endDate`
// has passed, compared against the build date exactly like the
// upcoming/recent split in src/data/speaking.ts. So the "Next mentoring
// dates" card can never show a date that has already gone, and there is no
// separate "as of" label to keep in sync by hand. If every entry has
// expired, the returned list is empty and singapore.astro hides the card
// rather than rendering it empty.
//
// A date range ("9 to 10 October") uses its last day as `endDate`, so the
// entry stays visible through the final day of the event.
//
// Confirmed only. A Nanyang Polytechnic online session on 24 September 2026
// was invited but is not yet confirmed as of this writing; it is
// deliberately left out until it is.

export type MentoringDate = {
  id: string;
  programme: string;
  when: string; // human-readable, as it reads in copy
  endDate: string; // ISO 'YYYY-MM-DD', last day the entry still counts as upcoming
};

const allMentoring: MentoringDate[] = [
  { id: 'sdg-open-hack-social-impact-catalyst', programme: 'the Social Impact Catalyst edition', when: '12 September', endDate: '2026-09-12' },
  { id: 'sdg-open-hack-nanyang-polytechnic', programme: 'Nanyang Polytechnic', when: '23 September', endDate: '2026-09-23' },
  { id: 'sdg-open-hack-nus', programme: 'the National University of Singapore', when: '9 to 10 October', endDate: '2026-10-10' },
];

export function getUpcomingMentoring(todayISO: string): MentoringDate[] {
  return allMentoring.filter((m) => m.endDate >= todayISO);
}
