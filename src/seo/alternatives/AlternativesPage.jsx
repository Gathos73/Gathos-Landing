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

// ItemList JSON-LD: tells Google + AI engines this is a ranked roundup,
// which is the format that earns rich-result eligibility for "best X"
// queries. Each item in the list is a Product reference.
function itemListLd(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.h1,
    itemListElement: page.items.map((it) => ({
      '@type': 'ListItem',
      position: it.rank,
      item: {
        '@type': 'Product',
        name: it.name,
        url: it.url,
        description: it.verdict,
      },
    })),
  }
}

export default function AlternativesPage() {
  const { slug } = useParams()
  const { item: page, loading: stillLoading, error } = usePublicItem('alternatives', slug)
  const { items: alternatives } = usePublicList('alternatives', 1, 100)
  const url = page ? `${SITE_URL}/alternatives/${page.slug}` : ''

  useEffect(() => {
    if (!page) return
    setPageMeta({ title: page.metaTitle, description: page.metaDesc, url, image: page.socialImage })
    setJsonLd('gathos-alt-app-ld', softwareApplicationLd({ description: page.metaDesc, url }))
    setJsonLd('gathos-alt-bc-ld', breadcrumbLd([
      { name: 'Home', url: (SITE_URL) },
      { name: 'Alternatives', url: (SITE_URL + "/alternatives") },
      { name: page.competitor, url },
    ]))
    setJsonLd('gathos-alt-list-ld', itemListLd(page))
    if (page.faqs?.length) setJsonLd('gathos-alt-faq-ld', faqLd(page.faqs))
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      removeJsonLd('gathos-alt-app-ld')
      removeJsonLd('gathos-alt-bc-ld')
      removeJsonLd('gathos-alt-list-ld')
      removeJsonLd('gathos-alt-faq-ld')
    }
  }, [page, url])

  if (stillLoading || error) return <ContentStatus error={error} />
  if (!page) return <NotFound />

  const related = alternatives.filter((a) => a.slug !== page.slug).slice(0, 3)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <header className="pt-32 pb-10 md:pt-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-pomegranate-400/25 text-pomegranate-400 mb-5">
            {page.category} · Alternatives roundup
          </div>
          <h1 className="font-editorial text-[clamp(2.2rem,5.5vw,3.6rem)] tracking-[-0.025em] leading-[1.08] text-black mb-5 text-balance">
            {page.h1}
          </h1>
          <p className="text-warm-charcoal text-[1.1rem] leading-[1.6] max-w-[60ch] text-balance">
            {page.intro}
          </p>
        </div>
      </header>

      {/* Ranked list — each item is its own card */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 space-y-5">
          {page.items.map((it) => {
            const isUs = it.name.toLowerCase() === 'gathos'
            return (
              <div
                key={it.rank}
                className={`p-6 rounded-2xl border-2 ${isUs ? 'bg-matcha-300/15 border-matcha-600/50' : 'bg-white border-black/90'}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={`font-editorial text-3xl italic ${isUs ? 'text-matcha-800' : 'text-black'}`}>
                      #{it.rank}
                    </div>
                    <div>
                      <h2 className="font-editorial text-[1.6rem] tracking-[-0.02em] text-black leading-[1.1]">
                        {it.name}
                      </h2>
                      <div className="text-[0.85rem] text-warm-silver mt-0.5">
                        Best for: {it.bestFor}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[0.92rem] font-mono text-warm-charcoal">{it.pricing}</div>
                    {!isUs && it.url && (
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.82rem] text-warm-silver hover:text-black underline"
                      >
                        Visit
                      </a>
                    )}
                    {isUs && (
                      <a
                        href={(DASHBOARD_URL + "/login/")}
                        className="inline-flex items-center gap-1 h-9 px-4 rounded-pill bg-lavender text-black border-2 border-black/90 text-sm font-semibold clay-hover clay-hover-bold"
                      >
                        Try free
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-matcha-800 font-semibold mb-1.5">
                      Pros
                    </div>
                    <ul className="space-y-1.5">
                      {it.pros.map((p, i) => (
                        <li key={i} className="text-[0.9rem] text-warm-charcoal leading-[1.5] flex gap-2">
                          <span className="mt-[7px] w-1 h-1 rounded-full bg-matcha-600 flex-shrink-0" />
                          <span className="flex-1">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold mb-1.5">
                      Cons
                    </div>
                    <ul className="space-y-1.5">
                      {it.cons.map((c, i) => (
                        <li key={i} className="text-[0.9rem] text-warm-charcoal leading-[1.5] flex gap-2">
                          <span className="mt-[7px] w-1 h-1 rounded-full bg-warm-silver flex-shrink-0" />
                          <span className="flex-1">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-[0.92rem] leading-[1.55] text-black italic font-editorial border-t border-oat pt-3">
                  {it.verdict}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Fit table */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-6">
            Pick by job-to-be-done
          </h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-black/90 bg-white">
            <table className="w-full text-[0.95rem]">
              <thead>
                <tr className="border-b border-oat">
                  {page.fitTable.headers.map((h, i) => (
                    <th key={i} className={`text-left px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.fitTable.rows.map((row, i) => {
                  const isUs = row.some((c) => /gathos/i.test(c))
                  return (
                    <tr key={i} className={`${i % 2 ? 'bg-oat-50/30' : ''} ${isUs ? '!bg-matcha-300/15' : ''}`}>
                      {row.map((c, j) => (
                        <td key={j} className={`px-5 py-3.5 ${j === 0 ? 'text-warm-charcoal' : 'font-semibold text-black'} ${isUs && j === 1 ? 'text-matcha-800' : ''}`}>
                          {c}
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

      {/* Cross-cohort: alternatives → direct compare + tools. Funnels
          listicle-readers into the higher-conversion comparison page and
          the savings calculator. */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[0.62rem] uppercase tracking-[0.14em] text-warm-silver font-semibold mb-3">
            Go deeper
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to={`/compare/gathos-vs-${page.slug}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Direct compare: Gathos vs {page.competitor}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/tools/savings-calculator" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Calculate your savings
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/tools/ai-pricing-tracker" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              AI pricing tracker
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

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-editorial text-[clamp(1.8rem,4vw,2.5rem)] text-black mb-3">
            Try Gathos <span className="italic text-matcha-800">free for 7 days.</span>
          </h2>
          <p className="text-warm-charcoal mb-6 max-w-md mx-auto leading-[1.6]">
            Flat $18/month after the trial. No per-character meter to babysit.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Start free
            </a>
            <Link
              to={`/compare/gathos-vs-${page.slug}`}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-white text-black border-2 border-black/90 font-semibold clay-hover"
            >
              Direct comparison: Gathos vs {page.competitor}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-oat py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-2xl tracking-[-0.02em] text-black mb-6">
              Other alternative roundups
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/alternatives/${r.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className="inline-block px-2 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-[0.12em] mb-2 bg-pomegranate-400/25 text-pomegranate-400">
                    {r.category}
                  </div>
                  <h3 className="font-editorial text-[1.05rem] leading-[1.2] text-black group-hover:text-matcha-800 transition-colors mb-1.5">
                    {r.h1}
                  </h3>
                  <p className="text-[0.82rem] text-warm-charcoal leading-[1.5] line-clamp-2">
                    {r.intro}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
