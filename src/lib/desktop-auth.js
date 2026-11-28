export const DESKTOP_CALLBACK = 'gathos://auth/callback'
export const DESKTOP_SOURCES = ['desktop-mac']

export function validateDesktopRequest(params) {
  const allowed = new Set(['callback_url', 'state', 'source'])
  for (const key of new Set(params.keys())) {
    if (!allowed.has(key) || params.getAll(key).length !== 1) return null
  }
  if ([...allowed].some((key) => params.getAll(key).length !== 1)) return null
  const callbackUrl = params.get('callback_url')
  const state = params.get('state')
  const source = params.get('source')
  return callbackUrl === DESKTOP_CALLBACK && typeof state === 'string' && state.length >= 16 && state.length <= 512 && DESKTOP_SOURCES.includes(source)
    ? { callbackUrl, state, source }
    : null
}
export function dashboardDesktopLoginUrl(search, dashboardUrl) {
  const target = new URL('/desktop-login', dashboardUrl)
  const request = validateDesktopRequest(new URLSearchParams(search))
  if (request) target.search = new URLSearchParams(search).toString()
  return target.toString()
}

export function validateDesktopRedirect(value, state) {
  if (typeof value !== 'string' || !value.startsWith(`${DESKTOP_CALLBACK}?`)) return false
  try {
    const url = new URL(value)
    const keys = [...new Set(url.searchParams.keys())]
    return url.protocol === 'gathos:' && url.host === 'auth' && url.pathname === '/callback' && keys.length === 2 && keys.every((key) => ['state', 'code'].includes(key)) && url.searchParams.getAll('state').length === 1 && url.searchParams.get('state') === state && url.searchParams.getAll('code').length === 1 && Boolean(url.searchParams.get('code')?.trim())
  } catch { return false }
}
