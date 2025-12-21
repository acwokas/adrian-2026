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
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
