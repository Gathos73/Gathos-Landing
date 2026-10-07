export function configuredUrls(env = {}) {
  const site = (env.VITE_SITE_URL || 'https://gathos.live').replace(/\/+$/, '')
  const dashboard = (env.VITE_DASHBOARD_URL || 'https://dashboard.gathos.live').replace(/\/+$/, '')
  return { site, dashboard, api: (env.VITE_API_BASE_URL || site).replace(/\/+$/, ''), siteHost: new URL(site).host, dashboardHost: new URL(dashboard).host }
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
