// Canonical Person schema for adrianwatkins.com.
//
// Single source of truth for the Person JSON-LD that every page emits via
// BaseLayout. Pages that need an additional schema (ProfilePage on /about,
// Article on Friday Frame posts, etc.) can reference the Person via the
// stable @id below.
//
// Why this matters for SEO:
//   - GSC shows adrianwatkins.com does not rank for "adrian watkins"
//     (133 impressions / 0 clicks / pos 20.22, last 3 months).
//   - Google was fuzzy-matching against other Watkins (Ariana, Sebastian,
//     etc.) because no structured Person entity was emitted.
//   - Emitting a consistent Person@id on every page gives Google a single
//     entity to anchor the brand query to.

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
    'Senior product and operating leader across Asia, Europe, and the US. 25 years, the last fifteen building and scaling digital products. Creator of the EDGE Framework for Applied Intelligence.',
  knowsAbout: [
    'Product strategy',
    'Applied intelligence',
    'EDGE Framework',
    'Cross-functional leadership',
    'M&A integration',
    'Go-to-market across Asia, Europe, and the US',
    'Owned-media strategy',
    'Board readiness',
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
    'https://aiinasia.com',
    'https://aiinarabia.com',
    'https://aiineurope.co',
    'https://promptandgo.ai',
    'https://democratising.ai',
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
    'Senior product and operating leadership for organisations adopting AI seriously. Creator of the EDGE Framework for Applied Intelligence.',
  publisher: { '@id': PERSON_ID },
  inLanguage: 'en-GB',
};

// Minimal reference to the Person entity, for use as mainEntity on
// ProfilePage and similar parent schemas.
export const personRef = { '@id': PERSON_ID };
