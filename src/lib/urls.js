function canonicalGathosUrl(value) {
  const url = new URL(value)
  const migratedHosts = {
    'gathos.live': 'gathos.com',
    'www.gathos.live': 'www.gathos.com',
    'api.gathos.live': 'api.gathos.com',
    'dashboard.gathos.live': 'dashboard.gathos.com',
    'affiliate.gathos.live': 'affiliate.gathos.com',
  }
  url.hostname = migratedHosts[url.hostname.toLowerCase()] || url.hostname
  return url.toString().replace(/\/+$/, '')
}

export function configuredUrls(env = {}) {
  const site = canonicalGathosUrl(env.VITE_SITE_URL || 'https://gathos.com')
  const dashboard = canonicalGathosUrl(env.VITE_DASHBOARD_URL || 'https://dashboard.gathos.com')
  const siteUrl = new URL(site)
  const defaultApi = siteUrl.hostname === 'localhost' || siteUrl.hostname === '127.0.0.1'
    ? site
    : `${siteUrl.protocol}//api.${siteUrl.hostname.replace(/^www\./, '')}`
  const api = canonicalGathosUrl(env.VITE_API_BASE_URL || defaultApi)
  return { site, dashboard, api, siteHost: siteUrl.host, dashboardHost: new URL(dashboard).host }
}

const urls = configuredUrls(import.meta.env)
export const SITE_URL = urls.site
export const DASHBOARD_URL = urls.dashboard
export const API_URL = urls.api
export const SITE_HOST = urls.siteHost
export const DASHBOARD_HOST = urls.dashboardHost

// Used for static HTML and public text files during development/build.
export function replacePublicUrls(text, env) {
  const u = configuredUrls(env)
  return text.replace(/https:\/\/gathos\.com\/dashboard\?tab=(docs|skills)/g, (_, tab) => `${u.dashboard}/${tab}/`)
    .replace(/https:\/\/gathos\.com\/dashboard/g, u.dashboard)
    .replace(/https:\/\/gathos\.com\/login\/?/g, `${u.dashboard}/login/`)
    .replace(/https:\/\/dashboard\.gathos\.live/g, u.dashboard)
    .replace(/https:\/\/gathos\.com(?=\/api(?:\/|\b)|\/og\/|\/openapi\.json)/g, u.api)
    .replace(/https:\/\/gathos\.com\b/g, u.site)
}
