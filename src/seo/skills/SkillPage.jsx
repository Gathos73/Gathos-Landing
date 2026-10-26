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

export default function SkillPage() {
  const { slug } = useParams()
  const { items: compares } = usePublicList('compare', 1, 4)
  const { item: page, loading: stillLoading, error } = usePublicItem('skill', slug)
  const { items: skills } = usePublicList('skill', 1, 100)
  const url = page ? `${SITE_URL}/skills/${page.slug}` : ''

  useEffect(() => {
    if (!page) return
    // Per-page OG card, server-rendered SVG. Skill page titles are
    // outcome-focused ("Bulk product shots for Shopify") — exactly
    // what a LinkedIn / Twitter share preview should show.
    const ogTitle = encodeURIComponent(page.h1 || page.metaTitle || '')
    const ogEyebrow = encodeURIComponent(page.eyebrow || 'Gathos Skill')
    const ogImage = `${API_URL}/og/og.svg?title=${ogTitle}&eyebrow=${ogEyebrow}`
    setPageMeta({ title: page.metaTitle, description: page.metaDesc, url, image: page.socialImage || ogImage })
    setJsonLd('gathos-skill-app-ld', softwareApplicationLd({ description: page.metaDesc, url }))
    setJsonLd('gathos-skill-bc-ld', breadcrumbLd([
      { name: 'Home', url: (SITE_URL) },
      { name: 'Skills', url: (SITE_URL + "/skills") },
      { name: page.h1.replace(/\.$/, ''), url },
    ]))
    if (page.faqs?.length) setJsonLd('gathos-skill-faq-ld', faqLd(page.faqs))
    // The SEO guide flags HowTo rich results as deprecated for this kind
    // of commercial page. Keep the visible step content, but avoid emitting
    // HowTo JSON-LD that can look like stale structured-data optimization.
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      removeJsonLd('gathos-skill-app-ld')
      removeJsonLd('gathos-skill-bc-ld')
      removeJsonLd('gathos-skill-faq-ld')
    }
  }, [page, url])

  if (stillLoading || error) return <ContentStatus error={error} />
  if (!page) return <NotFound />

  const relatedPages = (page.related || [])
    .map((s) => skills.find((x) => x.slug === s))
    .filter(Boolean)
    .slice(0, 3)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <header className="pt-32 pb-10 md:pt-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-matcha-300/40 text-matcha-800 mb-5">
            {page.eyebrow}
          </div>
          <h1 className="font-editorial text-[clamp(2.2rem,5.5vw,3.6rem)] tracking-[-0.025em] leading-[1.08] text-black mb-5 text-balance">
            {page.h1}
          </h1>
          <p className="text-warm-charcoal text-[1.1rem] leading-[1.6] max-w-[56ch] text-balance">
            {page.summary}
          </p>

          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Start 7-day free trial
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
            <Link
              to="/#pricing"
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-white text-black border-2 border-black/90 font-semibold clay-hover"
            >
              See pricing
            </Link>
          </div>

          {/* Install command — repeat the skill's name as the install slug so
              Perplexity and ChatGPT citing this page include the command */}
          <div className="mt-6 font-mono text-[0.78rem] text-warm-silver">
            curl -sL {SITE_URL}/skills/{page.slug}.md
          </div>
        </div>
      </header>

      {/* Problem explainer — keep paragraphs concrete, numbered facts */}
      <section className="pb-4">
        <div className="max-w-3xl mx-auto px-6">
          {page.problemParas.map((p, i) => (
            <p key={i} className="text-[1.02rem] leading-[1.7] text-warm-charcoal mb-5">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Sample prompt — editorial pull-quote style */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[0.62rem] uppercase tracking-[0.14em] text-matcha-800 font-semibold mb-2">
            Sample prompt
          </div>
          <blockquote className="p-6 rounded-2xl bg-white border-2 border-black/90 font-mono text-[0.9rem] leading-[1.6] text-warm-charcoal whitespace-pre-wrap">
            {page.samplePrompt}
          </blockquote>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-8">
            The 4-step workflow
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {page.workflowSteps.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-oat">
                <div className="font-editorial text-3xl italic text-matcha-800 mb-2">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="font-semibold text-black mb-1">{s.t}</div>
                <div className="text-[0.95rem] leading-[1.6] text-warm-charcoal">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price comparison table */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-4">
            Price, side-by-side
          </h2>
          <p className="text-[0.88rem] text-warm-silver mb-6">
            As of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Competitor prices from their public pricing pages.
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
                {page.priceTable.rows.map((row, i) => {
                  const isUs = row.some((cell) => typeof cell === 'string' && /gathos/i.test(cell))
                  return (
                    <tr key={i} className={`${i % 2 ? 'bg-oat-50/30' : ''} ${isUs ? '!bg-matcha-300/15' : ''}`}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-3.5 ${j === 0 ? 'pl-5 font-semibold text-black' : 'text-warm-charcoal'} ${isUs && j === 0 ? 'text-matcha-800' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cross-cohort links: every skill page should link to the most
          relevant compare page so the cluster's link graph compounds.
          Picks the top 3 compares (the cohort is small enough that all
          compares are usually relevant). */}
      {compares.length > 0 && (
        <section className="py-10">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-[0.62rem] uppercase tracking-[0.14em] text-warm-silver font-semibold mb-3">
              Compare Gathos
            </div>
            <div className="flex gap-2 flex-wrap">
              {compares.slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  to={`/compare/${c.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors"
                >
                  Gathos vs {c.competitor}
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

      {/* Related skills */}
      {relatedPages.length > 0 && (
        <section className="border-t border-oat bg-oat-50/40 py-16 mt-8">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-2xl tracking-[-0.02em] text-black mb-6">
              Other skills in the same workflow
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPages.map((r) => (
                <Link
                  key={r.slug}
                  to={`/skills/${r.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className="inline-block px-2 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-[0.12em] mb-2 bg-matcha-300/40 text-matcha-800">
                    {r.eyebrow}
                  </div>
                  <h3 className="font-editorial text-[1.05rem] leading-[1.2] text-black group-hover:text-matcha-800 transition-colors mb-1.5">
                    {r.h1}
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

      {/* Closing CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-editorial text-[clamp(1.8rem,4vw,2.5rem)] text-black mb-3">
            Try Gathos for <span className="italic text-matcha-800">7 days, free.</span>
          </h2>
          <p className="text-warm-charcoal mb-6 max-w-md mx-auto leading-[1.6]">
            One flat $18/month after the trial. No per-image fee, no per-character fee.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Start free
            </a>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-white text-black border-2 border-black/90 font-semibold clay-hover"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
