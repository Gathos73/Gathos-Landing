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

export default function AgentPage() {
  const { slug } = useParams()
  const { items: skills } = usePublicList('skill', 1, 100)
  const { item: page, loading: stillLoading, error } = usePublicItem('agent', slug)
  const { items: agents } = usePublicList('agent', 1, 100)
  const url = page ? `${SITE_URL}/for/${page.slug}` : ''

  useEffect(() => {
    if (!page) return
    setPageMeta({ title: page.metaTitle, description: page.metaDesc, url, image: page.socialImage })
    setJsonLd('gathos-agent-app-ld', softwareApplicationLd({ description: page.metaDesc, url }))
    setJsonLd('gathos-agent-bc-ld', breadcrumbLd([
      { name: 'Home', url: (SITE_URL) },
      { name: 'For', url: (SITE_URL + "/for") },
      { name: page.agentName, url },
    ]))
    if (page.faqs?.length) setJsonLd('gathos-agent-faq-ld', faqLd(page.faqs))
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      removeJsonLd('gathos-agent-app-ld')
      removeJsonLd('gathos-agent-bc-ld')
      removeJsonLd('gathos-agent-faq-ld')
    }
  }, [page, url])

  if (stillLoading || error) return <ContentStatus error={error} />
  if (!page) return <NotFound />

  const otherAgents = agents.filter((a) => a.slug !== page.slug)
  const topSkillCards = (page.topSkills || [])
    .map((s) => ({ slug: s.slug, title: s.title, meta: skills.find(item => item.slug === s.slug) }))
    .filter((s) => s.meta)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <header className="pt-32 pb-10 md:pt-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-ube-300/45 text-ube-800 mb-5">
            {page.agentName} · {page.agentTagline}
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
      </header>

      {/* Install command — above the fold, copy-ready */}
      <section className="py-6">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[0.62rem] uppercase tracking-[0.14em] text-matcha-800 font-semibold mb-2">
            Install
          </div>
          <pre className="p-5 rounded-2xl bg-[#0E0E1A] border-2 border-black/90 overflow-x-auto font-mono text-[0.88rem] text-[#E8ECF4]">
            {page.installCommand}
          </pre>
        </div>
      </section>

      {/* Sample session */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-6">
            A sample session
          </h2>
          <div className="rounded-2xl bg-white border-2 border-black/90 overflow-hidden divide-y divide-oat">
            {page.sampleSession.map((line, i) => (
              <div key={i} className={`p-4 ${line.who === 'you' ? 'bg-oat-50/40' : ''}`}>
                <div className="text-[0.6rem] uppercase tracking-[0.14em] text-warm-silver font-semibold mb-1">
                  {line.who === 'you' ? 'You' : page.agentName}
                </div>
                <div className="text-[0.95rem] leading-[1.6] text-black font-mono whitespace-pre-wrap">
                  {line.say}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why sections */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-8">
            Why pair Gathos with {page.agentName}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {page.whySections.map((w, i) => (
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

      {/* Top skills for this agent */}
      {topSkillCards.length > 0 && (
        <section className="py-12 border-t border-oat bg-oat-50/40">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-2">
              Skills most teams install first
            </h2>
            <p className="text-warm-charcoal mb-6">
              Each is a single curl command. Install one, install all five.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topSkillCards.map((s) => (
                <Link
                  key={s.slug}
                  to={`/skills/${s.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className="inline-block px-2 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-[0.12em] mb-2 bg-matcha-300/40 text-matcha-800">
                    {s.meta.eyebrow}
                  </div>
                  <h3 className="font-editorial text-[1.1rem] leading-[1.2] text-black group-hover:text-matcha-800 transition-colors mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[0.82rem] text-warm-charcoal leading-[1.5] line-clamp-2">
                    {s.meta.summary}
                  </p>
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

      {/* Other agents */}
      {otherAgents.length > 0 && (
        <section className="border-t border-oat py-16 mt-8">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-2xl tracking-[-0.02em] text-black mb-6">
              Using a different agent?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {otherAgents.map((a) => (
                <Link
                  key={a.slug}
                  to={`/for/${a.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className="inline-block px-2 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-[0.12em] mb-2 bg-ube-300/45 text-ube-800">
                    {a.agentName}
                  </div>
                  <h3 className="font-editorial text-[1.05rem] leading-[1.2] text-black group-hover:text-matcha-800 transition-colors mb-1.5">
                    {a.h1}
                  </h3>
                  <p className="text-[0.82rem] text-warm-charcoal leading-[1.5] line-clamp-2">
                    {a.summary}
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
            Plug Gathos into {page.agentName} in <span className="italic text-matcha-800">one command.</span>
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Start 7-day free trial
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
