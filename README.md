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

`npm run build` produces the browser assets in `dist/` and the React server renderer
in `dist-ssr/server/`. Deploy this project from **landing/** as the Vercel project
root. The checked-in `vercel.json` routes nested URLs through `api/render.mjs` and
`/sitemap.xml` through `api/sitemap.mjs`. Existing static assets are served directly.
This fixes direct visits and reloads at `/blog`, `/blog/<slug>`, and SEO routes.

Set server-only `CONTENT_API_URL` to the FastAPI origin (for example
`https://api.gathos.com`). It may point to a private origin reachable by the
renderer. Set `VITE_API_BASE_URL` to the public browser-accessible API origin;
the backend must allow the landing origin in CORS. These values must select the
same content database. `VITE_SITE_URL` sets canonical public URLs at build time.
Set backend `SITE_URL` to the same public origin, including for preview links.

For self-hosting, run `npm start` after building. It starts `server.mjs` on
`127.0.0.1:5173` (`PORT` and `HOST` override this). Keep the Node process behind
your HTTPS reverse proxy. Deploying only `dist/` omits server rendering and HTTP
status handling. Vite development and `npm run preview` remain browser-only;
use the production server when checking SEO or direct URL behavior.

The content API owns every article and SEO detail URL. Listing requests are
paginated; article requests fetch one slug. The server sends the article body,
canonical metadata, social tags, and JSON-LD in the initial HTML. Missing pages
return HTTP 404; backend failures return uncached HTTP 503. Publishing and
archiving become visible within the public cache's maximum 60-second lifetime.
Changed published slugs permanently redirect to their current URL.

Draft preview links expire after five minutes, are tied to a saved revision,
and return `noindex` and `no-store`. They are bearer links: only share them with
reviewers. Editing the saved draft invalidates earlier preview links.

The backend bundles the original 78 articles and imports missing records on
startup without overwriting existing drafts, edits, archives, or renamed URLs.
The old source catalogs are retained as export inputs; they no longer override
database content. `npm run export:editorial` explicitly refreshes the backend's
packaged catalog from these sources. Review its changes before deploying; it
is not part of the normal build. The backend package must include
`app/resources/editorial/`.

Run `npm run test:editorial` after building to verify initial HTML, metadata,
all migrated article templates, pagination, redirects, and HTTP failure behavior.
The test inventory reads the sibling backend catalog; production does not need
any sibling frontend or backend checkout.

Vercel function configuration follows the official
[Vite deployment](https://vercel.com/docs/frameworks/frontend/vite) and
[function packaging](https://vercel.com/docs/project-configuration/vercel-json)
documentation.

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
