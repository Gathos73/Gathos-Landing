import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const application = <StrictMode><App /></StrictMode>
if (window.__GATHOS_CONTENT__) hydrateRoot(root, application)
else createRoot(root).render(application)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// Analytics is optional and only loaded when a valid tag is configured.
const gaId = import.meta.env.VITE_GA_ID
if (!window.location.pathname.startsWith('/preview/') && /^(G-|UA-|GT-)[A-Z0-9]+$/.test(gaId || '') && !document.cookie.includes('ga-optout=1')) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', gaId, { anonymize_ip: true })
}
