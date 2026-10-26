import { API_URL, DASHBOARD_URL } from './lib/urls.js'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import Landing from './pages/Landing'
import { ContentProvider } from './content/store.jsx'
import RouteHead from './content/RouteHead.jsx'
const ContentHub = lazy(() => import('./content/ContentHub.jsx'))
const PreviewPage = lazy(() => import('./content/PreviewPage.jsx'))

const Legal      = lazy(() => import('./pages/Legal'))
const BlogPost   = lazy(() => import('./pages/BlogPost'))
const SkillPage  = lazy(() => import('./seo/skills/SkillPage'))
const ComparePage = lazy(() => import('./seo/compare/ComparePage'))
const AgentPage  = lazy(() => import('./seo/agents/AgentPage'))
const AlternativesPage = lazy(() => import('./seo/alternatives/AlternativesPage'))
const IndustryPage = lazy(() => import('./seo/industry/IndustryPage'))
const VoicePage = lazy(() => import('./seo/voice/VoicePage'))
const SavingsCalculator = lazy(() => import('./seo/tools/SavingsCalculator'))
const PricingTracker = lazy(() => import('./seo/tools/PricingTracker'))
const HubPage = lazy(() => import('./seo/hub/HubPage'))
const DataDeletion = lazy(() => import('./pages/DataDeletion'))
const DataDeletionStatus = lazy(() => import('./pages/DataDeletion').then(m => ({ default: m.DataDeletionStatus })))
const NotFound   = lazy(() => import('./pages/NotFound'))

function DashboardRedirect() {
  useEffect(() => {
    window.location.replace((DASHBOARD_URL + "/login/"))
  }, [])
  return <a href={(DASHBOARD_URL + "/login/")}>Continue to Gathos</a>
}

function ReferralAttribution() {
  const { search } = useLocation()

  useEffect(() => {
    const code = new URLSearchParams(search).get('ref')?.trim().toUpperCase()
    if (!code || !/^[A-Z0-9_-]{2,80}$/.test(code)) return

    // Keep this request alive when a visitor immediately follows a CTA to the
    // dashboard. The backend owns validation, first-touch semantics and the
    // shared-domain referral cookie.
    void fetch(`${API_URL}/api/affiliate/click?ref=${encodeURIComponent(code)}`, {
      credentials: 'include',
      keepalive: true,
    }).then((response) => {
      if (!response.ok) throw new Error(`Referral capture failed (${response.status})`)
    }).catch((error) => {
      if (import.meta.env.DEV) console.warn(error)
    })
  }, [search])
  return null
}

export function AppRoutes() {
  return (
    <>
      <RouteHead />
      <ReferralAttribution />
      <Suspense fallback={<div className="min-h-screen bg-cream" />}>
        <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/blog" element={<ContentHub kind="blog" />} />
              <Route path="/skills" element={<ContentHub kind="skill" />} />
              <Route path="/for" element={<ContentHub kind="agent" />} />
              <Route path="/preview/:slug" element={<PreviewPage />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/skills/:slug" element={<SkillPage />} />
              <Route path="/compare" element={<ContentHub kind="compare" />} />
              <Route path="/compare/:slug" element={<ComparePage />} />
              <Route path="/for/:slug" element={<AgentPage />} />
              <Route path="/alternatives" element={<ContentHub kind="alternatives" />} />
              <Route path="/alternatives/:slug" element={<AlternativesPage />} />
              <Route path="/industry" element={<ContentHub kind="industry" />} />
              <Route path="/industry/:slug" element={<IndustryPage />} />
              <Route path="/voice" element={<ContentHub kind="voice" />} />
              <Route path="/voice/:slug" element={<VoicePage />} />
              <Route path="/tools" element={<HubPage kind="tools" />} />
              <Route path="/tools/savings-calculator" element={<SavingsCalculator />} />
              <Route path="/tools/ai-pricing-tracker" element={<PricingTracker />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/data-deletion/status" element={<DataDeletionStatus />} />
              <Route path="*" element={<NotFound />} />
          <Route path="/login/*" element={<DashboardRedirect />} />
          <Route path="/signup/*" element={<DashboardRedirect />} />
          <Route path="/dashboard/*" element={<DashboardRedirect />} />
          <Route path="/business/checkout/*" element={<DashboardRedirect />} />
        </Routes>
      </Suspense>
    </>
  )
}

function BrowserContent() {
  const location = useLocation()
  const [initialLocation] = useState(location.key)
  const [seed, setSeed] = useState(() => window.__GATHOS_CONTENT__ || {})
  useEffect(() => {
    if (location.key !== initialLocation) setSeed({})
  }, [location.key, initialLocation])
  // SSR data is for the initial navigation only; returning later fetches current publication state.
  return <ContentProvider value={location.key === initialLocation ? seed : {}}><AppRoutes /></ContentProvider>
}
export default function App() {
  return <BrowserRouter><BrowserContent /></BrowserRouter>
}
