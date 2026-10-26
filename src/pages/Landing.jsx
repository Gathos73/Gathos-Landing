import { DASHBOARD_URL } from '../lib/urls.js'
import { useEffect } from 'react'
import Background from '../components/Background'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ResultsShowcase from '../components/ResultsShowcase'
import UserVideoShowcase from '../components/UserVideoShowcase'
import TrustBar from '../components/TrustBar'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import OpenSource from '../components/OpenSource'
import Comparison from '../components/Comparison'
import AskAgents from '../components/AskAgents'
import Pricing from '../components/Pricing'
import AffiliateSection from '../components/AffiliateSection'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'
import ScrollProgress from '../components/ScrollProgress'
import NewsletterPopup from '../components/NewsletterPopup'
import CustomCursor from '../components/CustomCursor'

// Homepage-only FAQ schema. This used to live in index.html but was
// duplicating with the per-page FAQs on /blog, /compare, /skills since
// index.html ships with every SPA route. Now it's only injected when
// the Landing component is mounted, so blog/compare/skill pages emit
// only their own page-specific FAQPage block.
import { HOMEPAGE_FAQS } from '../content/home-faqs.js'

export default function Landing() {
  useEffect(() => {
    // Inject FAQPage JSON-LD into <head> only when the Landing component
    // is mounted. Cleanup removes it on unmount so navigating to a
    // different route never leaves a stray homepage FAQPage behind.
    const existing = document.getElementById('gathos-home-faq-jsonld')
    if (existing) existing.remove()
    const tag = document.createElement('script')
    tag.type = 'application/ld+json'
    tag.id = 'gathos-home-faq-jsonld'
    tag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: HOMEPAGE_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
    document.head.appendChild(tag)
    return () => {
      const t = document.getElementById('gathos-home-faq-jsonld')
      if (t) t.remove()
    }
  }, [])

  return (
    <>
      <ScrollProgress />
      <NewsletterPopup />
      <Background />
      <CustomCursor />
      <Navbar />
      <Hero />
      <UserVideoShowcase />
      <TrustBar />
      <Comparison />
      <AskAgents />
      <HowItWorks />
      <ResultsShowcase />
      <Features />
      <OpenSource />
      <Pricing />
      <AffiliateSection />
      <FinalCTA />
      <Footer />
    </>
  )
}
