/**
 * Pages middleware: catch unmatched paths and 301 WordPress-style article slugs to /writing.
 *
 * Why: CF Pages free tier caps _redirects at 100 rules. The full WP long-tail
 * (~80 article slugs with 4-7 GA4 views each, plus many more with <4) exceeds
 * that. This function pattern-matches the leftover WP-shaped slugs at root
 * level and 301s them, while letting bot-scan probes fall through to the 404
 * page.
 */

interface Env {}

const ASTRO_PAGES = new Set([
  '/', '/about', '/edge', '/speaking', '/writing', '/now', '/contact',
  '/writing/friday-frame', '/404',
  // Specific essay slugs
  '/writing/your-ai-earning-its-energy', '/writing/japan-slow-bet',
  '/writing/singapore-at-60', '/writing/singapore-quiet-sovereign',
  '/writing/tech-translators', '/writing/year-of-the-horse',
  '/writing/ai-literacy-events', '/writing/friday-frame/welcome',
]);

// Crawler convenience: /sitemap.xml -> /sitemap-index.xml (Astro emits the
// index under -index.xml by default; many crawlers default to /sitemap.xml).
const SITEMAP_ALIASES = new Set(['/sitemap.xml', '/sitemap']);

const ASSET_EXT = /\.(html|xml|txt|pdf|png|jpe?g|gif|svg|webp|ico|css|js|woff2?|ttf|mp4|json|map|webmanifest)$/i;
const KNOWN_ASSET_DIRS = /^\/(images|documents|_astro|favicon|robots|sitemap|llms|ai|edge-framework|\.well-known|api)/;

// WP-style article slug: starts with /, only lowercase letters / digits / dash /
// underscore, no further slashes, at least 6 chars (avoids matching short bot
// probes like /env, /admin, /test).
const WP_SLUG = /^\/[a-z0-9][a-z0-9_-]{6,}\/?$/;

// Bot-scan patterns (must remain 404)
const BOT_PATTERNS = [
  /^\/(env|admin|administrator|adminer|wordpress|register|signup|login|graphql|healthz|metrics|test|checkout|magento_version|server-info|x)\/?$/,
  /^\/(admin|backend|config|aws|s3|root|public|vendor|service|my_env|storage|etc)\//,
  /^\/\.[a-z]/,
  /\.(yml|yaml|py|properties|secret|key|bak|cfg|tfstate(\.backup)?|sql|env|sqlite3?|json5?)$/i,
  /\/wp-(cron|login|admin|json|content)/,
];

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Crawler-friendly sitemap alias. Run BEFORE static-asset lookup so it
  // always wins and doesn't depend on a 404 first.
  if (SITEMAP_ALIASES.has(path)) {
    return new Response(null, {
      status: 301,
      headers: { Location: '/sitemap-index.xml' },
    });
  }

  // Try to serve the request normally first (static assets, _redirects, etc.)
  const response = await context.next();

  // Force a short Cache-Control on the CV PDF. The Pages custom-domain layer
  // otherwise applies a 4-hour default to .pdf which makes new versions
  // invisible to returning visitors until their browser revalidates.
  // _headers does not survive the custom-domain edge for .pdf assets — the
  // middleware does, because it runs as the final response layer.
  if (path === '/documents/AdrianWatkins_Executive-CV.pdf') {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Only intercept 404s
  if (response.status !== 404) return response;

  // Don't intercept known Astro pages (shouldn't 404 anyway, defensive)
  if (ASTRO_PAGES.has(path) || ASTRO_PAGES.has(path.replace(/\/$/, ''))) {
    return response;
  }

  // Don't intercept asset-like paths or known asset directories
  if (ASSET_EXT.test(path) || KNOWN_ASSET_DIRS.test(path)) {
    return response;
  }

  // Don't intercept bot scan paths - let them 404
  for (const pat of BOT_PATTERNS) {
    if (pat.test(path)) return response;
  }

  // WP-style root-level article slug → 301 to /writing
  if (WP_SLUG.test(path)) {
    return new Response(null, {
      status: 301,
      headers: { Location: '/writing' },
    });
  }

  // Everything else (random typos etc.) → return the 404 page
  return response;
};
