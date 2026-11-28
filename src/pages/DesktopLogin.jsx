import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DASHBOARD_URL } from '../lib/urls.js'
import { dashboardDesktopLoginUrl } from '../lib/desktop-auth.js'

export default function DesktopLoginRedirect() {
  const { search } = useLocation()

  useEffect(() => {
    window.location.replace(dashboardDesktopLoginUrl(search, DASHBOARD_URL))
  }, [search])

  return <main className="min-h-screen bg-cream px-5 py-8 text-black" aria-live="polite">
    <h1 className="sr-only">Continue to Gathos Desktop</h1>
    <p className="mx-auto mt-24 max-w-md text-center text-warm-charcoal">Opening secure desktop sign-in…</p>
  </main>
}
