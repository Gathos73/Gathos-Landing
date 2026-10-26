import { API_URL, DASHBOARD_URL, SITE_URL } from '../../lib/urls.js'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  setPageMeta,
  setJsonLd,
  removeJsonLd,
  softwareApplicationLd,
  breadcrumbLd,
  faqLd,
} from '../head.js'
import { usePublicItem, usePublicList } from '../../content/store.jsx'
import ContentStatus from '../../content/ContentStatus.jsx'
import NotFound from '../../pages/NotFound.jsx'

export default function ComparePage() {
  const { slug } = useParams()
  const { items: skills } = usePublicList('skill', 1, 4)
  const { item: page, loading: stillLoading, error } = usePublicItem('compare', slug)
  const { items: compares } = usePublicList('compare', 1, 100)
  const url = page ? `${SITE_URL}/compare/${page.slug}` : ''

  useEffect(() => {
    if (!page) return
    // Per-page OG card. Title = "Gathos vs <competitor>", eyebrow =
    // category. Servers a unique 1200x630 SVG with the comparison
    // framing baked in — much better social-share CTR than the
    // generic Gathos OG card.
    const ogTitle = encodeURIComponent(`Gathos vs ${page.competitor}`)
    const ogEyebrow = encodeURIComponent(page.category || 'Comparison')
    const ogImage = `${API_URL}/og/og.svg?title=${ogTitle}&eyebrow=${ogEyebrow}`
    setPageMeta({ title: page.metaTitle, description: page.metaDesc, url, image: page.socialImage || ogImage })
    setJsonLd('gathos-cmp-app-ld', softwareApplicationLd({ description: page.metaDesc, url }))
    setJsonLd('gathos-cmp-bc-ld', breadcrumbLd([
      { name: 'Home', url: (SITE_URL) },
      { name: 'Compare', url: (SITE_URL + "/compare") },
      { name: `Gathos vs ${page.competitor}`, url },
    ]))
    if (page.faqs?.length) setJsonLd('gathos-cmp-faq-ld', faqLd(page.faqs))
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      removeJsonLd('gathos-cmp-app-ld')
      removeJsonLd('gathos-cmp-bc-ld')
      removeJsonLd('gathos-cmp-faq-ld')
    }
  }, [page, url])

  if (stillLoading || error) return <ContentStatus error={error} />
  if (!page) return <NotFound />

  const related = compares.filter((c) => c.slug !== page.slug).slice(0, 3)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <header className="pt-32 pb-10 md:pt-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-lemon-400/45 text-lemon-800 mb-5">
            {page.category}
          </div>
          <h1 className="font-editorial text-[clamp(2.2rem,5.5vw,3.6rem)] tracking-[-0.025em] leading-[1.08] text-black mb-5 text-balance">
            {page.h1}
          </h1>
          <p className="text-warm-charcoal text-[1.1rem] leading-[1.6] max-w-[56ch] text-balance">
            {page.summary}
          </p>
        </div>
      </header>

      {/* TL;DR — lets LLMs pull a 2-sentence answer from the page */}
      <section className="py-6">
        <div className="max-w-3xl mx-auto px-6">
          <div className="p-6 rounded-2xl bg-white border-2 border-black/90">
            <div className="text-[0.62rem] uppercase tracking-[0.14em] text-matcha-800 font-semibold mb-3">
              TL;DR
            </div>
            <ul className="space-y-3">
              {page.tldr.map((item, i) => (
                <li key={i} className="flex gap-3 text-[0.98rem] leading-[1.65] text-warm-charcoal">
                  <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-matcha-600 flex-shrink-0" />
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Price comparison table — the section readers jump to */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-3">
            Pricing, side-by-side
          </h2>
          <p className="text-[0.88rem] text-warm-silver mb-6">
            As of {page.priceTable.asOf}. Pulled from each product's public pricing page. We update this page quarterly.
          </p>
          <div className="overflow-x-auto rounded-2xl border-2 border-black/90 bg-white">
            <table className="w-full text-[0.92rem] min-w-[640px]">
              <thead>
                <tr className="border-b border-oat">
                  {page.priceTable.headers.map((h, i) => (
                    <th key={i} className={`text-left px-4 py-3 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold ${i === 0 ? 'pl-5' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.priceTable.rows.map((row, i) => (
                  <tr key={i} className={i % 2 ? 'bg-oat-50/30' : ''}>
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-3.5 ${j === 0 ? 'pl-5 font-semibold text-black' : 'text-warm-charcoal'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feature matrix */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-6">
            Feature matrix
          </h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-black/90 bg-white">
            <table className="w-full text-[0.92rem] min-w-[640px]">
              <thead>
                <tr className="border-b border-oat">
                  {page.featureMatrix.headers.map((h, i) => (
                    <th key={i} className={`text-left px-4 py-3 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold ${i === 0 ? 'pl-5' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.featureMatrix.rows.map((row, i) => (
                  <tr key={i} className={i % 2 ? 'bg-oat-50/30' : ''}>
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-3.5 ${j === 0 ? 'pl-5 font-semibold text-black' : 'text-warm-charcoal'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Switcher story — pull-quote, fictional composite labeled as such */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="p-7 rounded-2xl bg-matcha-300/15 border border-matcha-600/30">
            <h2 className="font-editorial text-[1.45rem] tracking-[-0.02em] text-black mb-4">
              {page.switcherStory.heading}
            </h2>
            <blockquote className="font-editorial italic text-[1.1rem] leading-[1.6] text-black mb-3">
              "{page.switcherStory.body}"
            </blockquote>
            <div className="text-[0.78rem] text-warm-silver font-mono">
              — {page.switcherStory.attribution}
            </div>
          </div>
        </div>
      </section>

      {/* Cross-cohort: link compare → skills so users who came in via a
          competitor query find the actual jobs they can do with Gathos.
          Picks 4 skill pages, biased toward the page's category. */}
      {skills.length > 0 && (
        <section className="py-10">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-[0.62rem] uppercase tracking-[0.14em] text-warm-silver font-semibold mb-3">
              Skills you can install
            </div>
            <div className="flex gap-2 flex-wrap">
              {skills.slice(0, 4).map((s) => (
                <Link
                  key={s.slug}
                  to={`/skills/${s.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors"
                >
                  {s.eyebrow}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-6">
            Frequently asked questions
          </h2>
          <div className="rounded-2xl border-2 border-black/90 bg-white divide-y divide-oat overflow-hidden">
            {page.faqs.map((f, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer px-5 py-4 flex items-start justify-between gap-4 hover:bg-oat-50/60 transition-colors list-none">
                  <span className="font-semibold text-black text-[0.98rem] leading-[1.45]">{f.q}</span>
                  <span className="text-warm-silver mt-0.5 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <div className="px-5 pb-5 text-[0.95rem] text-warm-charcoal leading-[1.65]">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related comparisons */}
      {related.length > 0 && (
        <section className="border-t border-oat bg-oat-50/40 py-16 mt-8">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-2xl tracking-[-0.02em] text-black mb-6">
              Other Gathos comparisons
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/compare/${r.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className="inline-block px-2 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-[0.12em] mb-2 bg-lemon-400/45 text-lemon-800">
                    {r.category}
                  </div>
                  <h3 className="font-editorial text-[1.05rem] leading-[1.2] text-black group-hover:text-matcha-800 transition-colors mb-1.5">
                    Gathos vs {r.competitor}
                  </h3>
                  <p className="text-[0.82rem] text-warm-charcoal leading-[1.5] line-clamp-2">
                    {r.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-editorial text-[clamp(1.8rem,4vw,2.5rem)] text-black mb-3">
            Try Gathos <span className="italic text-matcha-800">free for 7 days.</span>
          </h2>
          <p className="text-warm-charcoal mb-6 max-w-md mx-auto leading-[1.6]">
            No credit card. Cancel anytime. Flat $18/month if you keep it.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Start free
            </a>
            <Link
              to="/#pricing"
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-white text-black border-2 border-black/90 font-semibold clay-hover"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
