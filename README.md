# adrianwatkins.com - Astro rebuild

Phase 1 build of the new adrianwatkins.com. Pure SSG, Astro 5, no React SPA.
Branch `astro-rebuild`. The Lovable export remains on `main` for cutover comparison.

## Local

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # output to ./dist
npm run check        # astro typecheck
```

## Deploy (preview only)

Preview deploys go to `adrianwatkins-com-preview.pages.dev`. The live
`adrianwatkins.com` domain still points at the Lovable build until explicit cutover.

```bash
npm run build
npm run deploy:preview
```

Wrangler authenticates via the existing OAuth session on this machine.

## Environment

Copy `.env.example` to `.env` and fill in:

- `SITE_URL` - canonical URL used for OG tags, sitemap, and JSON-LD. Defaults to the preview URL.
- `GTM_ID` - Google Tag Manager container ID. Leave blank to skip injection.

## Photo slots

See `public/images/README.md`. Drop a JPG with the documented filename into
`public/images/` and the `<PhotoSlot>` component swaps the hatched placeholder
for the real photo on the next build.

## House rules

- Pure SSG. No React SPA. Add React islands only if a feature genuinely needs interactivity.
- No em or en dashes anywhere. Hyphens or restructure.
- British English.
- Every external `<a>` gets `target="_blank" rel="noopener noreferrer"`.
- The 8-item AI visibility baseline (`/llms.txt`, `/ai.txt`, `/.well-known/security.txt`,
  `/robots.txt`, per-page OG, canonical, Schema.org Person on home and about,
  alt text on every image) is mandatory before any deploy.
