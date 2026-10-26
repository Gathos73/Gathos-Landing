import { DASHBOARD_URL, SITE_HOST, SITE_URL } from '../../lib/urls.js'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
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

// Live AI pricing tracker.
//
// This is the static, hand-curated version. Each provider's most recent
// public price + last-changed date is recorded. The page is positioned as
// a citable reference for blog posts and AI answer engines: "as of [date],
// X charges Y for Z."
//
// Future: replace this with a scraped + automated pipeline. For now,
// editorial discipline (update quarterly) is the play.

const LAST_UPDATED = '2026-04-25'

import { PRICING_FAQS } from '../../content/tool-faqs.js'

const IMAGE_PROVIDERS = [
  {
    name: 'Gathos',
    plan: 'Pro',
    price: '$18 / month flat',
    unit: 'unlimited',
    notes: 'Image + TTS bundled, 6-hour fair-use window',
    sourceUrl: (SITE_URL + "/#pricing"),
    sourceLabel: (SITE_HOST),
    lastChanged: '2025-12-01',
  },
  {
    name: 'Midjourney',
    plan: 'Standard',
    price: '$30 / month',
    unit: '~900 images included',
    notes: 'No first-class API, Discord-only workflow',
    sourceUrl: 'https://midjourney.com/explore?tab=pricing',
    sourceLabel: 'midjourney.com',
    lastChanged: '2025-09-12',
  },
  {
    name: 'Nano Banana Pro (Gemini 3 Pro Image)',
    plan: 'Per-call API',
    price: '$0.134 / image',
    unit: '1K-2K resolution',
    notes: '$0.24/image at 4K. Top of LMArena, April 2026.',
    sourceUrl: 'https://ai.google.dev/pricing',
    sourceLabel: 'ai.google.dev',
    lastChanged: '2026-01-15',
  },
  {
    name: 'GPT-Image-2',
    plan: 'Per-call API',
    price: '$0.040 / image',
    unit: '1024×1024',
    notes: 'New April 21, 2026 release. ~70% cheaper than NB Pro.',
    sourceUrl: 'https://platform.openai.com/docs/pricing',
    sourceLabel: 'platform.openai.com',
    lastChanged: '2026-04-21',
  },
  {
    name: 'Imagen 4 Ultra',
    plan: 'Per-call API',
    price: '$0.040 / image',
    unit: 'standard resolution',
    notes: 'Google Vertex platform. LMArena #2.',
    sourceUrl: 'https://ai.google.dev/pricing',
    sourceLabel: 'ai.google.dev',
    lastChanged: '2026-02-01',
  },
  {
    name: 'Fal.ai (FLUX-dev)',
    plan: 'Per-second',
    price: '~$0.025 / image',
    unit: 'amortized',
    notes: 'Per-GPU-second meter. Varies by model.',
    sourceUrl: 'https://fal.ai/pricing',
    sourceLabel: 'fal.ai',
    lastChanged: '2026-03-01',
  },
  {
    name: 'Replicate (FLUX-dev)',
    plan: 'Per-second',
    price: '~$0.030 / image',
    unit: 'amortized',
    notes: 'Per-GPU-second meter. 200+ models available.',
    sourceUrl: 'https://replicate.com/pricing',
    sourceLabel: 'replicate.com',
    lastChanged: '2026-02-15',
  },
  {
    name: 'Ideogram',
    plan: 'Plus',
    price: '$48 / month',
    unit: '4,000 images',
    notes: 'Class-leading text-in-image accuracy.',
    sourceUrl: 'https://ideogram.ai/pricing',
    sourceLabel: 'ideogram.ai',
    lastChanged: '2025-11-01',
  },
  {
    name: 'Leonardo.ai',
    plan: 'Apprentice',
    price: '$10 / month',
    unit: '8,500 tokens',
    notes: 'Token-based credit system.',
    sourceUrl: 'https://leonardo.ai/pricing',
    sourceLabel: 'leonardo.ai',
    lastChanged: '2025-10-01',
  },
]

const TTS_PROVIDERS = [
  {
    name: 'Gathos',
    plan: 'Pro',
    price: '$18 / month flat',
    unit: 'unlimited, 600+ languages, voice cloning included',
    notes: 'Image + TTS bundled',
    sourceUrl: (SITE_URL + "/#pricing"),
    sourceLabel: (SITE_HOST),
    lastChanged: '2025-12-01',
  },
  {
    name: 'ElevenLabs',
    plan: 'Pro',
    price: '$99 / month',
    unit: '500k characters',
    notes: 'Industry-leading English voice quality. 32 languages.',
    sourceUrl: 'https://elevenlabs.io/pricing',
    sourceLabel: 'elevenlabs.io',
    lastChanged: '2026-01-08',
  },
  {
    name: 'PlayHT',
    plan: 'Pro',
    price: '$31.20 / month',
    unit: '600k characters',
    notes: '142 languages. Strong web Studio.',
    sourceUrl: 'https://play.ht/pricing',
    sourceLabel: 'play.ht',
    lastChanged: '2025-12-15',
  },
  {
    name: 'Cartesia',
    plan: 'Pro',
    price: '$50 / month',
    unit: 'real-time optimized',
    notes: '~40ms time-to-first-audio. 15 languages.',
    sourceUrl: 'https://cartesia.ai/pricing',
    sourceLabel: 'cartesia.ai',
    lastChanged: '2026-02-20',
  },
  {
    name: 'OpenAI TTS',
    plan: 'gpt-4o-mini-tts',
    price: '$0.015 / minute',
    unit: 'per-call API',
    notes: 'No voice cloning. Preset voices only.',
    sourceUrl: 'https://platform.openai.com/docs/pricing',
    sourceLabel: 'platform.openai.com',
    lastChanged: '2026-03-10',
  },
  {
    name: 'Murf',
    plan: 'Business',
    price: '$49 / month / user',
    unit: '~3 hours of audio per seat',
    notes: 'Web-Studio-first. 20+ languages.',
    sourceUrl: 'https://murf.ai/pricing',
    sourceLabel: 'murf.ai',
    lastChanged: '2026-01-30',
  },
  {
    name: 'Resemble.ai',
    plan: 'Custom',
    price: 'Enterprise',
    unit: 'opaque',
    notes: 'Strong character voice fidelity. Enterprise sales motion.',
    sourceUrl: 'https://resemble.ai/pricing',
    sourceLabel: 'resemble.ai',
    lastChanged: '2025-11-15',
  },
]

function freshness(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (24 * 60 * 60 * 1000))
  if (days < 30) return { label: `${days}d ago`, color: 'text-matcha-800' }
  if (days < 90) return { label: `${days}d ago`, color: 'text-warm-charcoal' }
  return { label: `${days}d ago`, color: 'text-warm-silver' }
}

function PricingTable({ title, providers, kind }) {
  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-3">
          {title}
        </h2>
        <p className="text-[0.88rem] text-warm-silver mb-6">
          Prices verified against each provider's public pricing page. Click the source for the live page.
        </p>
        <div className="overflow-x-auto rounded-2xl border-2 border-black/90 bg-white">
          <table className="w-full text-[0.92rem]">
            <thead>
              <tr className="border-b border-oat">
                <th className="text-left px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold">Provider</th>
                <th className="text-left px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold">Plan</th>
                <th className="text-right px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold">Price</th>
                <th className="text-left px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold">Includes</th>
                <th className="text-right px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold">Last changed</th>
                <th className="text-right px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.12em] text-warm-silver font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, i) => {
                const isUs = p.name === 'Gathos'
                const fresh = freshness(p.lastChanged)
                return (
                  <tr key={p.name} className={`${i % 2 ? 'bg-oat-50/30' : ''} ${isUs ? '!bg-matcha-300/15' : ''}`}>
                    <td className="px-5 py-3.5 align-top">
                      <div className={`font-semibold ${isUs ? 'text-matcha-800' : 'text-black'}`}>{p.name}</div>
                      <div className="text-[0.78rem] text-warm-silver mt-0.5">{p.notes}</div>
                    </td>
                    <td className="px-5 py-3.5 text-warm-charcoal align-top">{p.plan}</td>
                    <td className="px-5 py-3.5 text-right align-top">
                      <div className="font-semibold text-black tabular-nums">{p.price}</div>
                    </td>
                    <td className="px-5 py-3.5 text-warm-charcoal align-top">{p.unit}</td>
                    <td className={`px-5 py-3.5 text-right align-top tabular-nums ${fresh.color}`}>{fresh.label}</td>
                    <td className="px-5 py-3.5 text-right align-top">
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.82rem] text-matcha-800 hover:underline"
                      >
                        {p.sourceLabel} ↗
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default function PricingTracker() {
  const url = (SITE_URL + "/tools/ai-pricing-tracker")
  useEffect(() => {
    setPageMeta({
      title: 'AI API Pricing Tracker 2026: Image, TTS & Video Costs',
      description: 'Compare Gathos, Midjourney, GPT-Image-2, Nano Banana Pro, ElevenLabs, PlayHT, and more by AI image, TTS, and video API pricing.',
      url,
    })
    setJsonLd('gathos-tracker-app-ld', softwareApplicationLd({ description: 'AI pricing tracker', url }))
    setJsonLd('gathos-tracker-faq-ld', faqLd(PRICING_FAQS))
    setJsonLd('gathos-tracker-bc-ld', breadcrumbLd([
      { name: 'Home', url: (SITE_URL) },
      { name: 'Tools', url: (SITE_URL + "/tools") },
      { name: 'AI pricing tracker', url },
    ]))
    return () => {
      removeJsonLd('gathos-tracker-app-ld')
      removeJsonLd('gathos-tracker-faq-ld')
      removeJsonLd('gathos-tracker-bc-ld')
    }
  }, [])

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <header className="pt-32 pb-10 md:pt-36">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-lemon-400/45 text-lemon-800 mb-5">
            Reference · Updated quarterly
          </div>
          <h1 className="font-editorial text-[clamp(2.2rem,5.5vw,3.6rem)] tracking-[-0.025em] leading-[1.08] text-black mb-5 text-balance">
            AI image, TTS, and Creator API pricing tracker.
          </h1>
          <p className="text-warm-charcoal text-[1.1rem] leading-[1.6] max-w-[60ch] text-balance">
            One reference page for what major AI image and TTS APIs charge as of {LAST_UPDATED}, plus how Gathos Creator changes the stack when you add text-to-video with generated audio.
          </p>

          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <Link
              to="/tools/savings-calculator"
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-lavender text-black border-2 border-black/90 font-semibold clay-hover clay-hover-bold"
            >
              Calculate your savings
            </Link>
            <a
              href={(DASHBOARD_URL + "/login/")}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-pill bg-white text-black border-2 border-black/90 font-semibold clay-hover"
            >
              Try Gathos free
            </a>
          </div>
        </div>
      </header>

      <PricingTable title="Image generation" providers={IMAGE_PROVIDERS} kind="image" />
      <PricingTable title="Text-to-speech" providers={TTS_PROVIDERS} kind="tts" />

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="p-5 rounded-2xl bg-oat-50/40 border border-oat text-[0.88rem] text-warm-charcoal leading-[1.65]">
            <strong className="text-black">Methodology.</strong> Prices are recorded from each provider's public pricing page on the date listed in the table. Per-unit rates are calculated from tier prices (e.g., ElevenLabs Pro at $99 for 500k characters = $0.000200 per character). We do not include enterprise custom-quoted prices, free-tier credits, or promotional discounts. We update this page quarterly. If a price has changed and we have not updated, email hello@gathos.com.
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-editorial text-[clamp(1.7rem,3.5vw,2.3rem)] tracking-[-0.02em] text-black mb-5">
            Questions teams ask before choosing an AI API.
          </h2>
          <div className="space-y-3">
            {PRICING_FAQS.map((item) => (
              <div key={item.q} className="p-5 rounded-2xl bg-white border border-oat">
                <h3 className="text-[1rem] font-semibold text-black mb-2">{item.q}</h3>
                <p className="text-[0.9rem] text-warm-charcoal leading-[1.65]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-editorial text-[clamp(1.8rem,4vw,2.5rem)] text-black mb-3">
            Pro is $18. Creator adds video at <span className="italic text-matcha-800">$45/month.</span>
          </h2>
          <p className="text-warm-charcoal mb-6 max-w-md mx-auto leading-[1.6]">
            Use Pro for image and TTS, then move to Creator when video belongs in the same API stack.
          </p>
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
