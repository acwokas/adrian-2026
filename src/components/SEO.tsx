import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
}

const defaultTitle = "Adrian Watkins | Senior Commercial and Operational Leader";
const defaultDescription = "I help organisations and leaders make better decisions in complex environments. Advisory, fractional leadership, mentoring, and capability building.";
const siteUrl = "https://adrianwatkins.com";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Adrian Watkins",
  "jobTitle": "Senior Commercial and Operational Leader",
  "description": defaultDescription,
  "url": siteUrl,
  "sameAs": [
    "https://www.linkedin.com/in/adrianwatkins",
    "https://aiinasia.com"
  ],
  "knowsAbout": [
    "Business Strategy",
    "Operational Leadership",
    "AI Implementation",
    "Executive Advisory",
    "Mentoring",
    "Capability Building"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Adrian Watkins Advisory"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Adrian Watkins Advisory",
  "description": "Senior commercial and operational leadership across advisory, fractional roles, mentoring, and capability building.",
  "url": siteUrl,
  "founder": {
    "@type": "Person",
    "name": "Adrian Watkins"
  },
  "areaServed": "Asia Pacific",
  "serviceType": [
    "Advisory Sprints",
    "Fractional Leadership",
    "Mentoring and Capability Building",
    "Workshops and Bootcamps"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Adrian Watkins",
  "url": siteUrl,
  "description": defaultDescription
};

export function SEO({ 
  title, 
  description = defaultDescription,
  canonical,
  type = "website"
}: SEOProps) {
  const fullTitle = title ? `${title} | Adrian Watkins` : defaultTitle;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Adrian Watkins" />
      <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="640" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
}