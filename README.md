# adrianwatkins.com

Astro 5 rebuild of adrianwatkins.com. Pure SSG, no React SPA.

`astro-rebuild` is the live branch: it is both the GitHub default branch and
production. `main` was an earlier fork (the original Lovable-era scaffold)
kept for cutover comparison; that comparison is long over and `main` has been
retired. Push everything to `astro-rebuild`.

## Local

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # output to ./dist
npm run check        # astro typecheck
```

## Deploy

`.github/workflows/deploy.yml` deploys automatically on every push to
`astro-rebuild` via Cloudflare Pages (project `adrianwatkins-com-preview`,
which is where `adrianwatkins.com` is actually served from despite the name).
Don't run wrangler manually for routine changes; just push.

For a manual/local deploy:

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
