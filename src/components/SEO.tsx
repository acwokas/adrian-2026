import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  keywords?: string;
  breadcrumb?: { name: string; path: string }[];
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
  "description": "Executive advisor working with CEOs, founders, and boards on decision-making, alignment, and execution in complex environments across Asia Pacific.",
  "url": siteUrl,
  "image": `${siteUrl}/og-image.jpg`,
  "sameAs": [
    "https://www.linkedin.com/in/adrianwatkins",
    "https://aiinasia.com"
  ],
  "knowsAbout": [
    "Board Advisory",
    "Executive Decision Support",
    "Corporate Governance",
    "Business Strategy",
    "Operational Leadership", 
    "AI Implementation",
    "Fractional Leadership",
    "Commercial Strategy",
    "Organisational Alignment",
    "Digital Transformation",
    "Go-to-Market Strategy"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Executive Advisor",
    "occupationalCategory": "11-1011.00",
    "description": "Provides board-level advisory, executive decision support, and fractional leadership to organisations navigating complexity and change.",
    "skills": "Board Advisory, Executive Coaching, Strategic Planning, Operational Leadership, Governance"
  },
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
  "description": "Board-level advisory, executive decision support, and fractional leadership for organisations navigating complexity, change, and growth.",
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
    "Board Advisory",
    "Executive Decision Support",
    "Fractional Leadership",
    "Strategic Consulting",
    "Executive Mentoring",
    "Governance Advisory",
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
  "publisher": {
    "@type": "Person",
    "name": "Adrian Watkins"
  }
};

const generateBreadcrumbSchema = (breadcrumb: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    },
    ...breadcrumb.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.name,
      "item": `${siteUrl}${item.path}`
    }))
  ]
});

export function SEO({ 
  title, 
  description = defaultDescription,
  canonical,
  type = "website",
  keywords = defaultKeywords,
  breadcrumb
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
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Geographic targeting */}
      <meta name="geo.region" content="SG" />
      <meta name="geo.placename" content="Singapore" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Adrian Watkins" />
      <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/WwbjjCCBHmgFggBqcrAjJjg5VjS2/social-images/social-1766426260149-favicon (1).png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Adrian Watkins - Executive Advisor and Fractional Leader" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/WwbjjCCBHmgFggBqcrAjJjg5VjS2/social-images/social-1766426260149-favicon (1).png" />
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
      {breadcrumb && breadcrumb.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumb))}
        </script>
      )}
    </Helmet>
  );
}