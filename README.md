# Gathos landing

Standalone React/Vite project extracted from `../gathos`. Includes the marketing
homepage, blog, SEO pages, calculators, legal pages, and showcase assets. Sign-in,
free-trial, and paid-plan CTAs go to https://dashboard.gathos.com/login/.
Legacy `/login`, `/signup`, `/dashboard`, and `/business/checkout` paths also redirect
there. Authentication and billing are owned by the separate dashboard project.

## Development

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Vite serves the site on port 5173 and proxies `/api` to the existing Python backend
on port 8000. Override `API_PROXY_TARGET` to use another backend.

```sh
npm run lint
npm run build
npm run preview
```

## Deployment

Build from this directory and publish `dist/`. Configure the static host to serve
`index.html` for frontend routes (including nested blog and SEO URLs). Route `/api/*`
to the backend before the SPA fallback: newsletter, contact, dynamic content, and
data-deletion status use these public endpoints. The frontend does not need the
legacy `gathos/server` or Supabase/auth environment variables.

Alternatively set `VITE_API_BASE_URL` to the public backend origin at build time
and allow the landing origin in backend CORS. The Vite proxy is development-only;
`npm run preview` also requires a reachable `VITE_API_BASE_URL` for API features.
For an up-to-date sitemap including generated content, proxy `/sitemap.xml` to the
backend; a static sitemap is included as a fallback.

Public images, posters, audio, and videos use `https://assets.vividai.in` by
default, preserving paths such as `/showcase/usecases/videos/final_podcast.mp4`.
The hero deck, use-case cards, results gallery, logos, favicons, and social preview
images all use this host. No R2 credentials are exposed to the frontend.
`VITE_ASSET_BASE_URL` optionally overrides the runtime media base at build time;
static favicon, manifest icon, and social-preview URLs use the production host.
The manifest, service worker, and application bundles remain on the site origin.

## Public forms and affiliates

- Newsletter: `POST /api/newsletter/subscribe` saves the address through the
  backend's audience service in the `newsletter` program. This endpoint captures
  subscriptions; it does not itself send a newsletter.
- Business enquiry: `POST /api/contact/` validates the message and emails
  `CONTACT_INBOX` (default `hello@gathos.com`) with the sender as Reply-To.
  The backend needs working SMTP settings. This endpoint does not store an enquiry
  record or start checkout.
- Affiliates: a valid `?ref=CODE` visit calls the public affiliate click endpoint.
  The backend records one first-touch click and sets an HTTP-only `gathos_ref`
  cookie for `.gathos.com`, which is then consumed by email or social signup on
  the dashboard. The affiliate portal is hosted separately at
  `https://affiliate.gathos.com`.

For the `.com` flow, deploy the backend at `https://api.gathos.com`, include
`https://gathos.com` in credentialed CORS, and set `COOKIE_DOMAIN=.gathos.com`.
OAuth callbacks must also use the `.com` API host so social-signup attribution
receives the shared referral cookie.

The forms require the production API routing described above; deploying only the
static files does not deploy these services. Both forms require an explicit
`{ "ok": true }` backend response before displaying success.

`npm run check:assets` inventories the showcase media. CDN files do not need to
exist locally; remote availability is checked separately from the build. The old
`VITE_SHOWCASE_CDN_BASE_URL` setting is no longer used.

## Public URLs

Set `VITE_SITE_URL` to the landing origin and `VITE_DASHBOARD_URL` to the
dashboard origin in `.env.local` or the build environment. Trailing slashes are
normalized. Signup redirects append `/login/` to the dashboard origin.
`VITE_API_BASE_URL` also controls the API and OpenAPI URLs shown in examples.
When empty, production URLs default to the `api.` subdomain of the configured
site origin (for example `https://api.gathos.com`).

These settings apply to React content, canonical and social URLs, JSON-LD,
`index.html`, and served/built public text files (sitemap, robots, LLM files,
skills, and installer). Rebuild after changing them. Email addresses and separate
news, affiliate, and social subdomains are not derived from these settings.
