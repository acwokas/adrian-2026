// Confirmed upcoming SDG Open Hack mentoring dates for /singapore.
//
// Update procedure: once a date has passed, move its entry out of
// `upcomingMentoring` and into `completedMentoring` (or fold it into the
// programme's own H3 write-up on the page, as done for Ngee Ann Polytechnic
// and NTU). Update `mentoringAsOf` / `mentoringAsOfHuman` at the same time.
// This list is intentionally small and hand-maintained rather than
// date-bucketed like src/data/speaking.ts, since these are single mentoring
// dates rather than a recurring calendar.
//
// Confirmed only. A Nanyang Polytechnic online session on 24 September 2026
// was invited but is not yet confirmed as of this writing; it is
// deliberately left out until it is.

export const mentoringAsOf = '2026-09-08';
export const mentoringAsOfHuman = '8 September 2026';

export type MentoringDate = {
  id: string;
  programme: string;
  when: string;
};

export const upcomingMentoring: MentoringDate[] = [
  { id: 'sdg-open-hack-social-impact-catalyst', programme: 'the Social Impact Catalyst edition', when: '12 September' },
  { id: 'sdg-open-hack-nanyang-polytechnic', programme: 'Nanyang Polytechnic', when: '23 September' },
  { id: 'sdg-open-hack-nus', programme: 'the National University of Singapore', when: '9 to 10 October' },
];

export const completedMentoring: MentoringDate[] = [];
