// Shared source for /now and the home page /now teaser.
// Edit this file when the underlying facts change. Both surfaces re-render.

import { digestReadingLine } from './reading';

export const lastUpdated = '2026-08-25';
export const lastUpdatedHuman = '25 August 2026';

// Three short paragraphs the home page renders as the /now digest.
// /now itself renders the same facts in expanded sections below.
// The reading mention in paragraph one is templated from src/data/reading.ts
// (digestReadingLine()) rather than hand-written, so it can't drift from the
// Reading section or the homepage reading card the way it did before.
export const digestParagraphs: string[] = [
  `Q3 2026. SDG Open Hack 2026 NP Edition mentorship is underway. Moderating Ortus Club executive roundtables on a rolling basis. Standing panellist work continues across business strategy, operational implementation, and AI. ${digestReadingLine()}`,
  'Leading commercial operations and governance day to day at SQREEM Technologies. Building out the AIinASIA family: AIinASIA.com, AIinArabia, and AIinEurope. Advising two businesses, both anonymous on the public site: a catering business in Singapore where I am also an investor, and a professional services firm in Malaysia. Spending real time this quarter on what comes next.',
  `Last updated ${lastUpdatedHuman}.`,
];
