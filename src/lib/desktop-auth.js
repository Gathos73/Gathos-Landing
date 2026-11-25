export const DESKTOP_CALLBACK = 'gathos://auth/callback'
export const DESKTOP_SOURCES = ['desktop-mac']
export const DESKTOP_SESSION_KEY = 'gathos_desktop_login_v1'

export function validateDesktopRequest(params) {
  const callbackUrl = params.get('callback_url')
  const state = params.get('state')
  const source = params.get('source')
  return callbackUrl === DESKTOP_CALLBACK && typeof state === 'string' && state.length >= 16 && state.length <= 512 && DESKTOP_SOURCES.includes(source)
    ? { callbackUrl, state, source }
    : null
}

export function validateDesktopRedirect(value, state) {
  if (typeof value !== 'string' || !value.startsWith(`${DESKTOP_CALLBACK}?`)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'gathos:' && url.host === 'auth' && url.pathname === '/callback' && url.searchParams.get('state') === state && Boolean(url.searchParams.get('code'))
  } catch { return false }
}

export function desktopReturnUrl(siteUrl) {
  const url = new URL('/desktop-login?resume=1', siteUrl)
  return url.toString()
}
