import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  schemaJson?: Record<string, unknown> | Record<string, unknown>[];
}

const siteUrl = "https://adrianwatkins.com";
const defaultTitle = "Adrian Watkins | Executive Advisor & Fractional Leader | Asia Pacific";
const defaultDescription =
  "Senior commercial and operational leader helping organisations navigate complexity. Advisory sprints, fractional COO/CCO roles, executive mentoring, and capability building across Asia Pacific.";
const defaultOgImage =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/WwbjjCCBHmgFggBqcrAjJjg5VjS2/social-images/social-1766426260149-favicon (1).png";

export function SEOHead({
  title,
  description = defaultDescription,
  canonical,
  ogImage,
  noIndex = false,
  schemaJson,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | Adrian Watkins` : defaultTitle;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const image = ogImage || defaultOgImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Adrian Watkins" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Adrian Watkins - Executive Advisor and Fractional Leader"
      />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta
        name="twitter:image:alt"
        content="Adrian Watkins - Executive Advisor and Fractional Leader"
      />

      {/* JSON-LD Structured Data */}
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(schemaJson) ? schemaJson : schemaJson
          )}
        </script>
      )}
    </Helmet>
  );
}
