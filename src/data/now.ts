// Shared source for /now and the home page /now teaser.
// Edit this file when the underlying facts change. Both surfaces re-render.

export const lastUpdated = '2026-08-17';
export const lastUpdatedHuman = '17 August 2026';

// Three short paragraphs the home page renders as the /now digest.
// /now itself renders the same facts in expanded sections below.
export const digestParagraphs: string[] = [
  'Q3 2026. Building EDGE Diagnostic v2, a 25-minute structured conversation that produces a board-ready AI capability snapshot. Advising two businesses, both anonymous on the public site: a catering business in Singapore where I am also an investor, and a professional services firm in Malaysia. Drafting the EDGE field manual for nominating committees, due this quarter.',
  'SDG Open Hack 2026 NP Edition mentorship is underway. Moderating Ortus Club executive roundtables on a rolling basis. Standing panellist work continues across business strategy, operational implementation, and AI. Reading: Rory Sutherland for fun, and the EU AI Act to work out its global impact.',
  `Last updated ${lastUpdatedHuman}.`,
];
