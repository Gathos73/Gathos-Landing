import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { API_URL, DASHBOARD_URL, SITE_URL } from '../lib/urls.js'
import { DESKTOP_SESSION_KEY, desktopReturnUrl, validateDesktopRedirect, validateDesktopRequest } from '../lib/desktop-auth.js'

const INVALID_TITLE = 'Desktop sign-in request is invalid'
const INVALID_TEXT = 'Return to the Gathos desktop application and start sign-in again.'

function DesktopMark() {
  return <div aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-matcha-300 shadow-[3px_3px_0_0_rgba(0,0,0,.9)]"><svg viewBox="0 0 32 32" className="h-7 w-7" fill="none"><rect x="4" y="5" width="24" height="17" rx="2" stroke="currentColor" strokeWidth="2.5"/><path d="M12 27h8M16 22v5M9 11h14M9 15h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></div>
}

function Brand() {
  return <a href="/" className="font-logo text-2xl tracking-[-0.03em] italic text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-matcha-800">Gathos</a>
}

export default function DesktopLogin() {
  const { search } = useLocation()
  const queryRequest = useMemo(() => validateDesktopRequest(new URLSearchParams(search)), [search])
  const isResume = new URLSearchParams(search).get('resume') === '1'
  const [request, setRequest] = useState(queryRequest)
  const [phase, setPhase] = useState(queryRequest ? 'checking' : isResume ? 'restoring' : 'invalid')
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('')
  const [message, setMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')

  useEffect(() => {
    if (queryRequest) {
      setRequest(queryRequest)
      try { sessionStorage.setItem(DESKTOP_SESSION_KEY, JSON.stringify(queryRequest)) } catch { /* this visit remains usable */ }
      setPhase('checking')
      return
    }
    if (!isResume) { setRequest(null); setPhase('invalid'); return }
    try {
      const saved = JSON.parse(sessionStorage.getItem(DESKTOP_SESSION_KEY) || 'null')
      const restored = saved && validateDesktopRequest(new URLSearchParams(`callback_url=${encodeURIComponent(saved.callbackUrl)}&state=${encodeURIComponent(saved.state)}&source=${encodeURIComponent(saved.source)}`))
      if (restored) { setRequest(restored); setPhase('checking'); return }
    } catch { /* invalid or unavailable tab storage */ }
    setRequest(null)
    setPhase('invalid')
  }, [queryRequest, isResume])

  useEffect(() => {
    if (!request) return
    const controller = new AbortController()
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include', signal: controller.signal, headers: { accept: 'application/json' } })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) { setMessage('Your browser session expired. Sign in again to continue to Gathos Desktop.'); setPhase('signed-out'); return }
        if (!response.ok) throw new Error('session')
        const data = await response.json()
        if (data?.ok === false || !data?.user) { setPhase('signed-out'); return }
        setUser(data.user)
        setPlan(data.plan?.name || data.user.plan_name || data.user.plan || '')
        setPhase('ready')
      })
      .catch((error) => { if (error.name !== 'AbortError') { setMessage('Gathos could not verify your browser session. Please try again.'); setPhase('session-error') } })
    return () => controller.abort()
  }, [request])

  const signInUrl = useMemo(() => {
    const url = new URL('/login/', DASHBOARD_URL)
    url.searchParams.set('returnTo', desktopReturnUrl(SITE_URL))
    return url.toString()
  }, [])

  async function authorize() {
    if (!request || phase === 'loading') return
    setPhase('loading')
    setMessage('')
    try {
      const response = await fetch(`${API_URL}/api/auth/desktop-authorize`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ callback_url: request.callbackUrl, state: request.state, source: request.source }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || !validateDesktopRedirect(data.redirect_url, request.state)) throw new Error('rejected')
      setRedirectUrl(data.redirect_url)
      setPhase('fallback')
      window.location.assign(data.redirect_url)
    } catch {
      setMessage('Gathos could not prepare desktop access. Please try again.')
      setPhase('error')
    }
  }

  function cancel() {
    try { sessionStorage.removeItem(DESKTOP_SESSION_KEY) } catch { /* no-op */ }
    window.location.assign(SITE_URL)
  }

  const heading = phase === 'invalid' ? INVALID_TITLE : phase === 'fallback' ? 'Gathos Desktop should now be opening.' : 'Continue to Gathos Desktop'
  const alert = phase === 'invalid' ? INVALID_TEXT : phase === 'session-error' ? message : phase === 'error' ? message : ''
  return <main className="min-h-screen bg-cream text-black px-5 py-8 sm:px-8 flex flex-col">
    <header className="mx-auto w-full max-w-5xl"><Brand /></header>
    <div className="flex flex-1 items-center justify-center py-10">
      <section className="w-full max-w-lg rounded-[28px] border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,.9)] sm:p-10" aria-labelledby="desktop-title">
        <div className="mb-7 flex items-center gap-4"><DesktopMark /><div><p className="label-clay text-matcha-800">Gathos Desktop</p><p className="text-sm text-warm-charcoal">Secure browser authorization</p></div></div>
        <h1 id="desktop-title" className="font-editorial text-3xl leading-tight tracking-[-0.025em] sm:text-4xl">{heading}</h1>
        {phase === 'invalid' ? <p role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">{INVALID_TEXT}</p> : null}
        {alert && phase !== 'invalid' ? <p role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">{alert}</p> : null}
        {phase === 'signed-out' ? <><p className="mt-4 text-warm-charcoal">{message || 'Sign in to Gathos to connect your account to the desktop app.'}</p><a href={signInUrl} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-black bg-matcha-300 px-5 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Sign in to continue</a></> : null}
        {phase === 'restoring' || phase === 'checking' ? <p className="mt-5 text-warm-charcoal" aria-live="polite">{phase === 'restoring' ? 'Restoring your desktop sign-in request…' : 'Checking your Gathos session…'}</p> : null}
        {phase === 'ready' ? <>
          <p className="mt-4 leading-relaxed text-warm-charcoal">Connect this browser session to the Gathos desktop application. Your plan and media access will be synchronized securely.</p>
          <div className="mt-6 rounded-xl border border-oat bg-cream p-4"><p className="text-xs font-semibold uppercase tracking-wider text-warm-charcoal">Signed in as</p><p className="mt-1 break-words font-semibold">{user?.name || user?.email || 'Gathos account'}</p>{plan ? <p className="mt-1 text-sm text-warm-charcoal">{plan} plan</p> : null}</div>
          <p className="mt-5 text-sm leading-relaxed text-warm-charcoal">Gathos issues a one-time authorization code for this request. Your API keys and access tokens are never placed in the desktop callback URL.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={authorize} className="min-h-12 rounded-xl border-2 border-black bg-matcha-300 px-4 font-semibold clay-hover focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Open Gathos Desktop</button><button type="button" onClick={cancel} className="min-h-12 rounded-xl border-2 border-black bg-white px-4 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Cancel</button></div>
        </> : null}
        {phase === 'loading' ? <div className="mt-7" aria-live="polite"><p className="text-sm text-warm-charcoal">Preparing secure desktop access…</p><span className="sr-only" role="status">Loading</span></div> : null}
        {phase === 'fallback' ? <><p className="mt-4 text-warm-charcoal">If the app did not open, try again below.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => window.location.assign(redirectUrl)} className="min-h-12 rounded-xl border-2 border-black bg-matcha-300 px-4 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Open Gathos Desktop again</button><button type="button" onClick={cancel} className="min-h-12 rounded-xl border-2 border-black bg-white px-4 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Return to Gathos</button></div></> : null}
        {phase === 'error' ? <div className="mt-7 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={authorize} className="min-h-12 rounded-xl border-2 border-black bg-matcha-300 px-5 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Try again</button><button type="button" onClick={cancel} className="min-h-12 rounded-xl border-2 border-black bg-white px-5 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Cancel</button></div> : null}
        {phase === 'signed-out' ? <button type="button" onClick={cancel} className="mt-4 w-full py-2 text-sm text-warm-charcoal underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Cancel and return to Gathos</button> : null}
        {phase === 'session-error' ? <div className="mt-5 flex flex-col gap-3"><a href={signInUrl} className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-black bg-matcha-300 px-5 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Sign in again</a><button type="button" onClick={cancel} className="min-h-12 rounded-xl border-2 border-black bg-white px-5 font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-matcha-800">Cancel</button></div> : null}
      </section>
    </div>
  </main>
}
