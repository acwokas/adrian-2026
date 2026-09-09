// Confirmed mentoring commitments for /singapore, grouped by programme.
//
// Two programmes, handled differently:
//   - SDG Open Hack entries carry a real `endDate` and drop out of
//     getUpcomingMentoring() automatically once that date has passed,
//     compared against the build date (same mechanism as the
//     upcoming/recent split in src/data/speaking.ts).
//   - The ASEAN Foundation entry has no fixed date: Adrian has been
//     selected and onboarding begins in September, but no session is
//     scheduled. `endDate` is null for exactly that reason (mirrors
//     speaking.ts's own `date: null` meaning open-ended/ongoing), so it is
//     never auto-expired. Give it a real `endDate` once an actual session
//     date exists, and it will start expiring like the others.
//
// A programme is dropped from the card entirely once every one of its
// entries has expired, rather than showing an empty group heading.
//
// Confirmed only. A Nanyang Polytechnic online session on 24 September 2026
// was invited but is not yet confirmed as of this writing; it is
// deliberately left out until it is. The ASEAN appointment is confirmed but
// no session has been delivered or scheduled: the entry says only that
// onboarding begins in September, nothing more.

export type MentoringEntry = {
  id: string;
  detail: string; // exact display text, Adrian's wording, unchanged
  endDate: string | null; // ISO 'YYYY-MM-DD', or null for no fixed date (never expires)
};

export type MentoringProgramme = {
  id: string;
  label: string;
  entries: MentoringEntry[];
};

const programmes: MentoringProgramme[] = [
  {
    id: 'sdg-open-hack',
    label: 'SDG Open Hack',
    entries: [
      { id: 'sdg-open-hack-social-impact-catalyst', detail: 'the Social Impact Catalyst edition on 12 September', endDate: '2026-09-12' },
      { id: 'sdg-open-hack-nanyang-polytechnic', detail: 'Nanyang Polytechnic on 23 September', endDate: '2026-09-23' },
      { id: 'sdg-open-hack-nus', detail: 'the National University of Singapore on 9 to 10 October', endDate: '2026-10-10' },
    ],
  },
  {
    id: 'asean-foundation',
    label: 'ASEAN Foundation',
    entries: [
      { id: 'asean-soar-together-2026', detail: 'SOAR Together 2026, onboarding from September', endDate: null },
    ],
  },
];

export function getUpcomingMentoring(todayISO: string): MentoringProgramme[] {
  return programmes
    .map((programme) => ({
      ...programme,
      entries: programme.entries.filter((entry) => entry.endDate === null || entry.endDate >= todayISO),
    }))
    .filter((programme) => programme.entries.length > 0);
}
