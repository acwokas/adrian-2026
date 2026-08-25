// Single source of truth for speaking-calendar entries.
//
// speaking.astro renders every entry; the homepage renders the entries
// that carry a `homepage` override, using their shorter copy.
//
// Upcoming vs Recent is computed from `date`, not hand-labelled:
//   - date === null   -> open-ended (ongoing mentorship, standing panel work),
//                        always sits in Upcoming and ongoing.
//   - date is set      -> compared against today at build time. Once the
//                        date has passed, the entry moves to Recent on its
//                        own, on the next deploy. This is what a manually
//                        sorted list can't do: an entry can't go stale
//                        by sitting in the wrong bucket after its date passes.
//   - Month-only dates (no confirmed day) use the 1st of that month as the
//     comparison point, so the bucket can flip a few weeks before the
//     actual (unconfirmed) day arrives. Acceptable for a month-precision
//     entry; worth knowing if a real day-level date lands on that boundary.

export type SpeakingEntry = {
  id: string;
  when: string;
  date: string | null; // ISO 'YYYY-MM-DD', or null for open-ended/ongoing
  titleHtml: string;
  bodyHtml: string;
  extraHtml?: string; // replaces the default <h3> when present (e.g. logo + heading row)
  homepage?: {
    when?: string; // defaults to `when` if omitted
    titleHtml: string;
    bodyHtml: string;
  };
};

export const speakingEntries: SpeakingEntry[] = [
  {
    id: 'sdg-open-hack-np',
    when: 'Since May 2026',
    date: null,
    titleHtml: 'SDG Open Hack 2026, Ngee Ann Polytechnic Edition.',
    bodyHtml:
      'Mentor. Working with student teams across the NP edition of the hack as they build toward the UN Sustainable Development Goals. Running across the hack window and beyond.',
    homepage: {
      titleHtml: 'SDG Open Hack 2026, NP Edition.',
      bodyHtml:
        'Mentor on the Ngee Ann Polytechnic edition of SDG Open Hack 2026. Running across the hack window and beyond.',
    },
  },
  {
    id: 'beyond4',
    when: 'Since May 2026',
    date: null,
    titleHtml: 'Beyond4.',
    bodyHtml:
      'Mentor. Working with a disruptive travel marketplace in Malaysia on strategy and growth as the business scales.',
  },
  {
    id: 'entrepreneurial-journey',
    when: 'September 2026',
    date: '2026-09-01',
    titleHtml: 'The Entrepreneurial Journey: Scaling and Strategy.',
    bodyHtml:
      'Panel. Transitioning roles, operational discipline through growth, and the realities of starting and scaling a business.',
  },
  {
    id: 'sdg-open-hack-ntu',
    when: 'September 2026 · NTU Campus',
    date: '2026-09-01',
    titleHtml: 'SDG Open Hack 2026, NTU Campus Edition.',
    bodyHtml:
      'Mentor. Coaching and discussion sessions across the NTU Campus edition of the hack. Providing feedback and guidance to help student teams strengthen their solution and business pitches, working toward the UN Sustainable Development Goals.',
    homepage: {
      titleHtml: 'SDG Open Hack 2026, NTU Campus Edition.',
      bodyHtml:
        'Mentor. Coaching and discussion sessions across the NTU Campus edition. Feedback and guidance to help student teams strengthen their solution and business pitches, working toward the UN Sustainable Development Goals.',
    },
  },
  {
    id: 'panels',
    when: 'Ongoing',
    date: null,
    titleHtml: 'Panels.',
    bodyHtml:
      'Frequent panellist and judge across business strategy, operational implementation, playbooks, and frameworks, including the trade press circuit. Increasingly with an AI overlay, often the entry point back to EDGE.',
  },
  {
    id: 'moderation',
    when: 'Ongoing',
    date: null,
    titleHtml: 'Moderation.',
    bodyHtml:
      'Regular moderator and facilitator for executive roundtables and closed-door discussions, including Ortus Club, Beyond4, and others. Typically strategy, AI, and operational leadership themes.',
  },
  {
    id: 'entreboss-competitive-edge',
    when: 'Tuesday 12 August 2026, 9pm SGT · Online',
    date: '2026-08-12',
    titleHtml:
      '<a href="https://entrebosshub.com/event/the-competitive-edge-mastering-strategy-and-executive-performance/" target="_blank" rel="noopener noreferrer">The Competitive Edge: Mastering Strategy and Executive Performance</a>. EntreBoss Hub panel.',
    bodyHtml:
      'Panel with Victor Chan (physical preparation), Mark Gaynor (lead generation) and Paddy Tan (business restructuring), moderated by Darius Chang. My seat: moving AI initiatives out of scattered pilots and into disciplined, embedded decision-making. The EDGE Govern pillar in the room.',
    homepage: {
      when: '12 August 2026 · Online',
      titleHtml:
        '<a href="https://entrebosshub.com/event/the-competitive-edge-mastering-strategy-and-executive-performance/" target="_blank" rel="noopener noreferrer">The Competitive Edge</a>. EntreBoss Hub panel.',
      bodyHtml:
        'Panel with Victor Chan, Mark Gaynor and Paddy Tan, moderated by Darius Chang. My seat: moving AI initiatives out of scattered pilots and into disciplined, embedded decision-making.',
    },
  },
  {
    id: 'sales-engines-smes',
    when: '5 August 2026',
    date: '2026-08-05',
    titleHtml: 'Building Sustainable Sales Engines for SMEs.',
    bodyHtml:
      'Panel. Developing structural sales frameworks, hiring and talent strategy, and keeping organisational health intact while scaling.',
  },
  {
    id: 'ortus-club-roundtable-2026-05',
    when: 'May 2026',
    date: '2026-05-01',
    extraHtml:
      '<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:6px"><img src="/images/logos/ortus-club.png" alt="Ortus Club logo" width="44" height="44" style="flex:0 0 44px;width:44px;height:44px;border-radius:6px;background:#000;display:block"><h3 style="margin:0">The Era of Services Delivery. <a href="https://www.ortusclub.com/moderator/why-is-democratising-the-room-the-most-underrated-skill-in-executive-moderation-adrian-watkins-sqreem-technologies/" target="_blank" rel="noopener noreferrer">Ortus Club</a> roundtable.</h3></div>',
    titleHtml: '',
    bodyHtml:
      'Moderated a closed-door senior executive roundtable for the <a href="https://www.ortusclub.com/moderator/why-is-democratising-the-room-the-most-underrated-skill-in-executive-moderation-adrian-watkins-sqreem-technologies/" target="_blank" rel="noopener noreferrer">Ortus Club</a> on services delivery and the impact of artificial intelligence. Off-the-record, Chatham House format.',
  },
  {
    id: 'launch-bootcamp-3',
    when: 'March 2026',
    date: '2026-03-01',
    titleHtml: 'Launch Entrepreneurship Bootcamp 3.',
    bodyHtml:
      'National Library Board, Singapore, with BlackStorm Group. Workshop and keynote on governance discipline for AI-native founders. Second year running the interactive Sales and Marketing session at Launch.',
  },
  {
    id: 'smart-living-2025',
    when: 'November 2025',
    date: '2025-11-01',
    titleHtml: 'Smart Living, Sustainable Future 2025.',
    bodyHtml:
      'Guest of Taipei City Government. Opened the event with "Democratising Intelligence for a Sustainable Future", then moderated the startup panel with Jameson Hsu (886 Studios) and Debbie Chien (Vulcanest). Adrian\'s post-event reflection: <a href="https://www.linkedin.com/pulse/your-ai-earning-its-energy-taiwan-has-left-me-adrian-watkins-uzvgc/" target="_blank" rel="noopener noreferrer">Is your AI earning its energy?</a>',
    homepage: {
      titleHtml: 'Smart Living, Sustainable Future 2025.',
      bodyHtml:
        'Guest of Taipei City Government. Opened the event with "Democratising Intelligence for a Sustainable Future" and moderated the startup panel. <a href="https://www.linkedin.com/pulse/your-ai-earning-its-energy-taiwan-has-left-me-adrian-watkins-uzvgc/" target="_blank" rel="noopener noreferrer">Post-event reflection on LinkedIn Pulse.</a>',
    },
  },
  {
    id: 'mma-global-prior',
    when: '2024 and earlier',
    date: '2024-01-01',
    titleHtml: 'MMA Global and prior panels.',
    bodyHtml:
      'Listed speaker, MMA Global. Earlier industry panels in the Mumbrella, Branding in Asia, MartechAsia, and The Drum (Agencies4Growth) circuits.',
  },
];

export type SpeakingBucket = 'upcoming' | 'recent';

export function bucketOf(entry: SpeakingEntry, todayISO: string): SpeakingBucket {
  if (entry.date === null) return 'upcoming';
  return entry.date <= todayISO ? 'recent' : 'upcoming';
}

export function entriesByBucket(bucket: SpeakingBucket, todayISO: string): SpeakingEntry[] {
  return speakingEntries.filter((entry) => bucketOf(entry, todayISO) === bucket);
}

export type HomepageSpeakingEntry = SpeakingEntry & {
  homepage: NonNullable<SpeakingEntry['homepage']>;
};

function hasHomepageCopy(entry: SpeakingEntry): entry is HomepageSpeakingEntry {
  return Boolean(entry.homepage);
}

// Homepage excerpt: first N per bucket, in the same order as the full calendar,
// restricted to entries curated for the homepage via `homepage`.
export function homepageEntries(
  bucket: SpeakingBucket,
  todayISO: string,
  limit = 2,
): HomepageSpeakingEntry[] {
  return entriesByBucket(bucket, todayISO).filter(hasHomepageCopy).slice(0, limit);
}
