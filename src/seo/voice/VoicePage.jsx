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

export default function VoicePage() {
  const { slug } = useParams()
  const { item: page, loading: stillLoading, error } = usePublicItem('voice', slug)
  const { items: languages } = usePublicList('voice', 1, 100)
  const url = page ? `${SITE_URL}/voice/${page.slug}` : ''

  useEffect(() => {
    if (!page) return
    setPageMeta({ title: page.metaTitle, description: page.metaDesc, url, image: page.socialImage })
    setJsonLd('gathos-voice-app-ld', softwareApplicationLd({ description: page.metaDesc, url }))
    setJsonLd('gathos-voice-bc-ld', breadcrumbLd([
      { name: 'Home', url: (SITE_URL) },
      { name: 'Voices', url: (SITE_URL + "/voice") },
      { name: page.language, url },
    ]))
    if (page.faqs?.length) setJsonLd('gathos-voice-faq-ld', faqLd(page.faqs))
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      removeJsonLd('gathos-voice-app-ld')
      removeJsonLd('gathos-voice-bc-ld')
      removeJsonLd('gathos-voice-faq-ld')
    }
  }, [page, url])

  if (stillLoading || error) return <ContentStatus error={error} />
  if (!page) return <NotFound />

  const otherLanguages = languages.filter((l) => l.slug !== page.slug).slice(0, 4)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <header className="pt-32 pb-10 md:pt-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-ube-300/45 text-ube-800 mb-5">
            {page.language} · {page.nativeName} · {page.iso.toUpperCase()}
          </div>
          <h1 className="font-editorial text-[clamp(2.2rem,5.5vw,3.6rem)] tracking-[-0.025em] leading-[1.08] text-black mb-5 text-balance">
            {page.h1}
          </h1>
          <p className="text-warm-charcoal text-[1.1rem] leading-[1.6] max-w-[60ch] text-balance">
            {page.speakers} speakers across {page.region}. Native cadence. Clone your voice from a 30-second sample. Flat $18/month for unlimited generation across {page.language} and 600+ other languages on the same key.
          </p>

          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Start free trial
            </a>
            <Link
              to="/skills/ai-voiceover-loom"
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-white text-black border-2 border-black/90 font-semibold clay-hover"
            >
              See workflow
            </Link>
          </div>
        </div>
      </header>

      {/* Sample script */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[0.62rem] uppercase tracking-[0.14em] text-matcha-800 font-semibold mb-3">
            Sample {page.language} script
          </div>
          <blockquote className="p-6 rounded-2xl bg-white border-2 border-black/90">
            <div className="font-editorial text-[1.15rem] leading-[1.6] text-black mb-3" lang={page.iso} dir={page.iso === 'ar' ? 'rtl' : 'ltr'}>
              {page.sampleScript}
            </div>
            {page.sampleScriptTransliteration && (
              <div className="text-[0.85rem] text-warm-silver italic font-mono">
                {page.sampleScriptTransliteration}
              </div>
            )}
          </blockquote>
        </div>
      </section>

      {/* Value props */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-6">
            Why Gathos for {page.language}
          </h2>
          <ul className="space-y-3">
            {page.valueProps?.map((v, i) => (
              <li key={i} className="flex gap-3 text-[1.02rem] leading-[1.65] text-warm-charcoal">
                <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-matcha-600 flex-shrink-0" />
                <span className="flex-1">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-6">
            Use cases
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {page.useCases?.map((u, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-oat">
                <div className="font-semibold text-black mb-1.5">{u.t}</div>
                <div className="text-[0.92rem] leading-[1.6] text-warm-charcoal">{u.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-cohort links: every voice page funnels into the industry
          pages where that voice gets used. Builds the link graph from
          /voice → /industry and pulls audiobook/course readers into the
          right industry pitch. */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[0.62rem] uppercase tracking-[0.14em] text-warm-silver font-semibold mb-3">
            {page.language} works for
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/industry/audiobook-narration" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Audiobook narration
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/industry/course-creators" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Course creators
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/skills/ai-voiceover-loom" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Loom voiceover
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/skills/auto-dub-videos" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-white border border-oat hover:border-black/40 text-[0.85rem] text-warm-charcoal hover:text-black transition-colors">
              Auto-dub videos
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

      {/* Other languages */}
      {otherLanguages.length > 0 && (
        <section className="border-t border-oat bg-oat-50/40 py-16 mt-8">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-2xl tracking-[-0.02em] text-black mb-6">
              Other languages
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {otherLanguages.map((l) => (
                <Link
                  key={l.slug}
                  to={`/voice/${l.slug}`}
                  className="group p-4 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className="font-editorial text-[1.05rem] text-black group-hover:text-matcha-800 transition-colors mb-1">
                    {l.language}
                  </div>
                  <div className="text-[0.78rem] text-warm-silver" lang={l.iso}>
                    {l.nativeName} · {l.speakers}
                  </div>
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
            Clone your voice. Speak <span className="italic text-matcha-800">{page.language}</span> at native quality.
          </h2>
          <a
            href={(DASHBOARD_URL + "/login/")}
            className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
          >
            Start 7-day free trial
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
