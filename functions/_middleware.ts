/** Preserve genuine 404 responses; known legacy redirects live in public/_redirects. */
interface Env {}

// Crawler convenience: /sitemap.xml -> /sitemap-index.xml (Astro emits the
// index under -index.xml by default; many crawlers default to /sitemap.xml).
const SITEMAP_ALIASES = new Set(['/sitemap.xml', '/sitemap']);

const handleRequest: PagesFunction<Env> = async (context) => {
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
  // _headers does not survive the custom-domain edge for .pdf assets; the
  // middleware does, because it runs as the final response layer.
  if (['/documents/Adrian-Watkins-Executive-CV-2026.pdf', '/documents/AdrianWatkins_Executive-CV.pdf', '/documents/EDGE-Framework-Whitepaper.pdf'].includes(path)) {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
    return new Response([204, 304].includes(response.status) ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
};

/**
 * Indexing guard for *.pages.dev hostnames.
 *
 * The Pages project backing adrianwatkins.com is itself named
 * "adrianwatkins-com-preview", so its built-in subdomain
 * adrianwatkins-com-preview.pages.dev serves the *production* deployment.
 * Cloudflare auto-applies X-Robots-Tag: noindex to preview deployments
 * (<hash>.*.pages.dev and <branch>.*.pages.dev) but NOT to a project's
 * production subdomain, which left that host fully indexable: robots.txt
 * answered "Allow: /" and no noindex header was present. The canonical tag
 * limited the damage but did not close the host.
 *
 * This runs per-request and keys off the Host header, so the custom domains
 * (adrianwatkins.com / www.adrianwatkins.com) are untouched and stay fully
 * indexable, while every *.pages.dev hostname serving this project is
 * explicitly closed. It cannot be done in _headers, which is path-scoped,
 * not host-scoped.
 */
const PAGES_DEV_HOST = /(^|\.)pages\.dev$/i;

// 204/304 must not be reconstructed with a body; rewriting headers on them is
// unnecessary anyway since they carry no indexable content.
const BODYLESS = new Set([204, 304]);

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const isPagesDev = PAGES_DEV_HOST.test(url.hostname);

  // Permit crawling so search engines can discover the noindex response header.
  // Alias hosts do not advertise the production sitemap.
  if (isPagesDev && url.pathname === '/robots.txt') {
    return new Response(
      '# Preview/alias host. Not for indexing.\n# Canonical site: https://adrianwatkins.com\n\nUser-agent: *\nAllow: /\n',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  }

  const response = await handleRequest(context);

  if (!isPagesDev || BODYLESS.has(response.status)) return response;

  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
