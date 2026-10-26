import { DASHBOARD_URL } from '../lib/urls.js'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Button from './Button'

const links = [
  { label: 'APIs', id: 'apis' },
  { label: 'Docs', href: (DASHBOARD_URL + "/docs/") },
  { label: 'Use Cases', href: '/industry' },
  { label: 'Skills', href: '/skills' },
  { label: 'Compare', href: '/compare' },
  { label: 'Pricing', id: 'pricing' },
  // External-style link kept in the same array; href is honored when set
  // because `handleNavClick` short-circuits non-anchor entries.
  { label: 'Blog', href: '/blog' },
  { label: 'News', href: 'https://news.gathos.com' },
]

function handleNavClick(e, link) {
  if (link.href) return // let the browser navigate normally
  e.preventDefault()
  const el = document.getElementById(link.id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  window.location.href = '/#' + link.id
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-200 ${
        scrolled
          ? 'bg-cream/85 backdrop-blur-md border-b border-oat'
          : 'bg-cream/70 backdrop-blur border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="font-logo text-[1.75rem] leading-none text-black"
        >
          Gathos
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href || `/#${l.id}`}
              onClick={(e) => handleNavClick(e, l)}
              className="text-[0.92rem] text-warm-charcoal hover:text-black transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}

          <div className="flex items-center gap-3">
              <a href={(DASHBOARD_URL + "/login/")} className="text-[0.92rem] text-warm-charcoal hover:text-black transition-colors font-medium">
                Sign in
              </a>
              <Button href={(DASHBOARD_URL + "/login/")} size="sm">
                Start free
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </Button>
            </div>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-5 h-0.5 bg-black rounded transition-transform duration-200 ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black rounded my-1 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black rounded transition-transform duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-cream border-b border-oat px-6 py-4"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href || `/#${l.id}`}
                  onClick={(e) => { handleNavClick(e, l); setMobileOpen(false) }}
                  className="py-2.5 text-warm-charcoal hover:text-black"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-3 mt-2 border-t border-oat-50">
                <a href={(DASHBOARD_URL + "/login/")} className="py-2.5 text-warm-charcoal hover:text-black">Sign in</a>
                <Button href={(DASHBOARD_URL + "/login/")} size="sm" className="ml-auto">
                  Start free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
