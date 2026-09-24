// Confirmed mentoring and judging commitments for /singapore, grouped by programme.
//
// Dated commitments drop out at build time after their endDate.
// ASEAN SOAR remains ongoing following the September kickoff.
// The separate NYP online invitation for 24 September is not confirmed.

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
      { id: 'sdg-open-hack-nus', detail: 'Judge, National University of Singapore edition on 10 October', endDate: '2026-10-10' },
    ],
  },
  {
    id: 'asean-foundation',
    label: 'ASEAN Foundation',
    entries: [
      { id: 'asean-soar-together-2026', detail: 'SOAR Together 2026, ongoing mentoring following the September kickoff', endDate: null },
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
