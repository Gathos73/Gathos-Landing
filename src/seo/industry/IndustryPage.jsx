import { DASHBOARD_URL, SITE_URL } from '../../lib/urls.js'
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

export default function IndustryPage() {
  const { slug } = useParams()
  const { item: page, loading: stillLoading, error } = usePublicItem('industry', slug)
  const { items: industries } = usePublicList('industry', 1, 100)
  const url = page ? `${SITE_URL}/industry/${page.slug}` : ''

  useEffect(() => {
    if (!page) return
    setPageMeta({ title: page.metaTitle, description: page.metaDesc, url, image: page.socialImage })
    setJsonLd('gathos-ind-app-ld', softwareApplicationLd({ description: page.metaDesc, url }))
    setJsonLd('gathos-ind-bc-ld', breadcrumbLd([
      { name: 'Home', url: (SITE_URL) },
      { name: 'Industries', url: (SITE_URL + "/industry") },
      { name: page.industryName, url },
    ]))
    if (page.faqs?.length) setJsonLd('gathos-ind-faq-ld', faqLd(page.faqs))
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      removeJsonLd('gathos-ind-app-ld')
      removeJsonLd('gathos-ind-bc-ld')
      removeJsonLd('gathos-ind-faq-ld')
    }
  }, [page, url])

  if (stillLoading || error) return <ContentStatus error={error} />
  if (!page) return <NotFound />

  const related = industries.filter((i) => i.slug !== page.slug).slice(0, 3)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <header className="pt-32 pb-10 md:pt-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-slushie-500/25 text-slushie-800 mb-5">
            For {page.industryName}
          </div>
          <h1 className="font-editorial text-[clamp(2.2rem,5.5vw,3.6rem)] tracking-[-0.025em] leading-[1.08] text-black mb-5 text-balance">
            {page.h1}
          </h1>
          <p className="text-warm-charcoal text-[1.1rem] leading-[1.6] max-w-[60ch] text-balance">
            {page.summary}
          </p>

          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Start free trial
            </a>
            <Link
              to="/#pricing"
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-white text-black border-2 border-black/90 font-semibold clay-hover"
            >
              See pricing
            </Link>
          </div>
        </div>
      </header>

      {/* Key stats · pulls AI-citation-friendly numbers above the fold */}
      {page.keyStats?.length > 0 && (
        <section className="py-6">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid sm:grid-cols-3 gap-3">
              {page.keyStats.map((s, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border-2 border-black/90 text-center">
                  <div className="font-editorial text-3xl italic text-matcha-800 mb-1">
                    {s.value}
                  </div>
                  <div className="text-[0.85rem] text-warm-charcoal">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The pitch · 3 paragraphs of why this fits the industry */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          {page.pitch?.map((p, i) => (
            <p key={i} className="text-[1.02rem] leading-[1.7] text-warm-charcoal mb-5">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-8">
            How the workflow runs
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {page.workflow?.map((w, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-oat">
                <div className="font-editorial text-3xl italic text-matcha-800 mb-2">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="font-semibold text-black mb-1.5">{w.t}</div>
                <div className="text-[0.95rem] leading-[1.6] text-warm-charcoal">{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-cohort: industry pages link out to the skills and voice
          pages most relevant to that industry. Tightens the link graph
          and pushes vertical-search visitors toward the right next page. */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[0.62rem] uppercase tracking-[0.14em] text-warm-silver font-semibold mb-3">
            Related on Gathos
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/skills/ai-voiceover-loom" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              AI voiceover skill
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/voice/hindi" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Hindi voice
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/voice/brazilian-portuguese" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Brazilian Portuguese voice
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/tools/savings-calculator" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Savings calculator
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-6">
            Frequently asked questions
          </h2>
          <div className="rounded-2xl border-2 border-black/90 bg-white divide-y divide-oat overflow-hidden">
            {page.faqs?.map((f, i) => (
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

      {/* Related industries */}
      {related.length > 0 && (
        <section className="border-t border-oat bg-oat-50/40 py-16 mt-8">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-2xl tracking-[-0.02em] text-black mb-6">
              Other industries on Gathos
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/industry/${r.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className="inline-block px-2 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-[0.12em] mb-2 bg-slushie-500/25 text-slushie-800">
                    {r.industryName}
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

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-editorial text-[clamp(1.8rem,4vw,2.5rem)] text-black mb-3">
            Try Gathos for <span className="italic text-matcha-800">7 days, free.</span>
          </h2>
          <p className="text-warm-charcoal mb-6 max-w-md mx-auto leading-[1.6]">
            Flat $18/month after the trial. Built for {page.industryName.toLowerCase()}.
          </p>
          <a
            href={(DASHBOARD_URL + "/login/")}
            className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
          >
            Start free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
