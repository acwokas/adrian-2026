import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  keywords?: string;
}

const defaultTitle = "Adrian Watkins | Executive Advisor & Fractional Leader | Asia Pacific";
const defaultDescription = "Senior commercial and operational leader helping organisations navigate complexity. Advisory sprints, fractional COO/CCO roles, executive mentoring, and capability building across Asia Pacific.";
const siteUrl = "https://adrianwatkins.com";
const defaultKeywords = "executive advisor, fractional leadership, fractional COO, fractional CCO, business strategy, operational leadership, AI implementation, executive coaching, Asia Pacific, Singapore, leadership development";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Adrian Watkins",
  "jobTitle": "Senior Commercial and Operational Leader",
  "description": "Executive advisor and fractional leader helping organisations make better decisions in complex environments across Asia Pacific.",
  "url": siteUrl,
  "image": `${siteUrl}/og-image.jpg`,
  "sameAs": [
    "https://www.linkedin.com/in/adrianwatkins",
    "https://aiinasia.com"
  ],
  "knowsAbout": [
    "Business Strategy",
    "Operational Leadership", 
    "AI Implementation",
    "Executive Advisory",
    "Fractional Leadership",
    "Mentoring",
    "Capability Building",
    "Digital Transformation",
    "Go-to-Market Strategy"
  ],
  "alumniOf": {
    "@type": "Organization",
    "name": "Various Global Enterprises"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Adrian Watkins Advisory"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Adrian Watkins Advisory",
  "description": "Executive advisory and fractional leadership services for organisations navigating complexity, change, and growth.",
  "url": siteUrl,
  "image": `${siteUrl}/og-image.jpg`,
  "founder": {
    "@type": "Person",
    "name": "Adrian Watkins"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 1.3521,
      "longitude": 103.8198
    },
    "geoRadius": "5000"
  },
  "serviceType": [
    "Executive Advisory",
    "Fractional Leadership",
    "Strategic Consulting",
    "Executive Mentoring",
    "Leadership Development",
    "Capability Building Workshops"
  ],
  "priceRange": "$$$$"
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Adrian Watkins",
  "alternateName": "Adrian Watkins Advisory",
  "url": siteUrl,
  "description": defaultDescription,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${siteUrl}/?s={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export function SEO({ 
  title, 
  description = defaultDescription,
  canonical,
  type = "website",
  keywords = defaultKeywords
}: SEOProps) {
  const fullTitle = title ? `${title} | Adrian Watkins` : defaultTitle;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Adrian Watkins" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Adrian Watkins" />
      <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Adrian Watkins - Executive Advisor and Fractional Leader" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} />
      <meta name="twitter:image:alt" content="Adrian Watkins - Executive Advisor and Fractional Leader" />

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