// Canonical Person schema for adrianwatkins.com.
//
// Single source of truth for the Person JSON-LD that every page emits via
// BaseLayout. Pages that need an additional schema (ProfilePage on /about,
// Article on Friday Frame posts, etc.) can reference the Person via the
// stable @id below.
//
export const PERSON_ID = 'https://adrianwatkins.com/#person';
export const WEBSITE_ID = 'https://adrianwatkins.com/#website';
export const ORG_ID = 'https://adrianwatkins.com/#org';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Adrian Watkins',
  givenName: 'Adrian',
  familyName: 'Watkins',
  url: 'https://adrianwatkins.com',
  image: 'https://adrianwatkins.com/images/hero-portrait.jpg',
  jobTitle: 'SVP Commercial Operations and Governance',
  worksFor: {
    '@type': 'Organization',
    name: 'SQREEM Technologies',
    url: 'https://sqreem.com',
  },
  description:
    'Singapore-based commercial and operating leader at SQREEM Technologies, with data protection responsibilities (DPO). Creator of EDGE and builder of DARE by democratising.ai.',
  knowsAbout: [
    'Product strategy',
    'Applied intelligence',
    'EDGE Framework',
    'Cross-functional leadership',
    'M&A integration',
    'Go-to-market across Asia, Europe, and the US',
    'Owned-media strategy',
    'Commercial operations',
    'Data protection and privacy governance',
  ],
  alumniOf: [
    { '@type': 'Organization', name: 'AdColony / Digital Turbine' },
    { '@type': 'Organization', name: 'Tickled Media' },
    { '@type': 'Organization', name: 'PerformanceAsia' },
    { '@type': 'Organization', name: 'Virgin' },
    { '@type': 'Organization', name: 'News Corporate' },
    { '@type': 'Organization', name: 'CBS' },
  ],
  sameAs: [
    'https://www.linkedin.com/in/adrianwatkins/',
    'https://blackstormco.asia/personnel/adrian-watkins/',
    'https://mmaglobal.com/speakers/adrian-watkins',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Singapore',
    addressCountry: 'SG',
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: 'https://adrianwatkins.com',
  name: 'Adrian Watkins',
  description:
    'Commercial and operating leadership, governance, and practical perspectives from Adrian Watkins. Creator of EDGE, builder of DARE by democratising.ai, and contributor to student and founder programmes in Singapore.',
  publisher: { '@id': PERSON_ID },
  inLanguage: 'en-GB',
};

// Minimal reference to the Person entity, for use as mainEntity on
// ProfilePage and similar parent schemas.
export const personRef = { '@id': PERSON_ID };
