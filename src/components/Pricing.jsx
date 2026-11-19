import { DASHBOARD_URL } from '../lib/urls.js'
import { publicFetch } from '../lib/public-api.js'
import { useEffect, useState } from 'react'
import { loadPublicPlans } from '../lib/plan-catalog.js'
import SectionHeader from './SectionHeader'
import RevealOnScroll from './RevealOnScroll'
import Button from './Button'

function BusinessCard() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await publicFetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.ok !== true) { setStatus('error'); setError(data.error || 'Could not send.'); return }
      setStatus('sent')
      setForm({ name: '', email: '', company: '', message: '', website: '' })
    } catch {
      setStatus('error')
      setError('Network error. Email hello@gathos.com directly.')
    }
  }

  const input = "w-full h-10 px-3 rounded-lg bg-cream border-2 border-black/20 text-[0.88rem] text-black placeholder:text-warm-silver focus:outline-none focus:border-black/70 transition-colors"

  return (
    <div className="relative h-full rounded-[28px] bg-white border-2 border-black/90 p-8 flex flex-col">
      <div className="mb-6">
        <div className="inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] bg-slushie-500/20 text-slushie-800 mb-4">
          Enterprise
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-black">For Businesses</h3>
        <p className="text-sm text-warm-silver mt-1">Volume, white-label, on-prem, SLA</p>
      </div>

      <p className="text-[0.93rem] text-warm-charcoal leading-[1.6] mb-6">
        Higher rate limits, dedicated support, white-label APIs, private-cloud or on-prem deployment,
        and volume pricing. For teams embedding Gathos into their product.
      </p>

      <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2 mb-7">
        {['Custom rate limits & SLAs','White-label API + skills','Private-cloud / on-prem','Dedicated Slack channel','Volume & annual pricing','Security review & DPA'].map((f) => (
          <li key={f} className="flex items-start gap-2 text-[0.85rem] text-warm-charcoal">
            <svg className="flex-shrink-0 mt-0.5 text-matcha-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            {f}
          </li>
        ))}
      </ul>

      {status === 'sent' ? (
        <div className="p-6 rounded-xl bg-matcha-300/30 border border-matcha-600/30 text-center mt-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#078a52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><polyline points="20 6 9 17 4 12" /></svg>
          <p className="text-matcha-800 font-semibold mb-1">Message sent</p>
          <p className="text-sm text-warm-charcoal">We'll reply within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 mt-auto">
          <input type="text" name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} />
          <div className="grid sm:grid-cols-2 gap-3">
            <input type="text" name="name" value={form.name} onChange={onChange} required placeholder="Your name" className={input} />
            <input type="email" name="email" value={form.email} onChange={onChange} required placeholder="Work email" className={input} />
          </div>
          <input type="text" name="company" value={form.company} onChange={onChange} placeholder="Company (optional)" className={input} />
          <textarea name="message" value={form.message} onChange={onChange} required rows={3} placeholder="Use case, volume, timeline." className={`${input} h-auto py-2.5 resize-none`} />
          {status === 'error' && error && <p className="text-xs text-pomegranate-400 px-1">{error}</p>}
          <Button type="submit" disabled={status === 'sending'} className="w-full">
            {status === 'sending' ? 'Sending…' : 'Send enquiry'}
          </Button>
        </form>
      )}
    </div>
  )
}

function PlanCard({ plan, windowHours }) {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency })
  const price = plan.display_price_label || formatter.format(
    plan.price_minor / 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2),
  )
  const cadence = plan.billing_label || ({
    none: 'one-time payment', month: '/month', quarter: '/quarter', year: '/year',
  }[plan.billing_interval] || plan.billing_interval)
  const requestLimit = plan.fixed_window_limit
  const features = [
    ...(requestLimit === null ? [] : [`${requestLimit.toLocaleString()} requests per ${windowHours}-hour window`]),
    ...(plan.concurrency_limit === null ? [] : [`${plan.concurrency_limit} concurrent requests`]),
    ...(plan.priority_support ? ['Priority support'] : []),
  ]

  return (
    <article className="h-full rounded-clay-feature bg-white border-2 border-black/90 shadow-clay p-8 flex flex-col">
      <h3 className="text-2xl font-semibold tracking-tight text-black">{plan.display_name}</h3>
      <div className="flex flex-wrap items-baseline gap-2 mt-4">
        <span className="text-4xl font-semibold tracking-tightest text-black">{price}</span>
        <span className="text-sm text-warm-silver">{cadence}</span>
      </div>
      {plan.description && <p className="text-sm text-warm-charcoal mt-3">{plan.description}</p>}
      <ul className="space-y-2 my-6 text-sm text-warm-charcoal">
        {features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      {plan.products.length > 0 && (
        <details className="mb-6 text-sm text-warm-charcoal">
          <summary className="cursor-pointer font-semibold">Included services &amp; limits</summary>
          <ul className="mt-3 space-y-2">
            {plan.products.map((product) => (
              <li key={product.code}>
                {product.name}{product.fixed_window_limit === null
                  ? ''
                  : ` · ${product.fixed_window_limit.toLocaleString()} requests / ${windowHours} hours`}
              </li>
            ))}
          </ul>
        </details>
      )}
      <Button href={DASHBOARD_URL + '/login?plan=' + encodeURIComponent(plan.code)} className="w-full mt-auto">
        Choose {plan.display_name}
      </Button>
    </article>
  )
}

export default function Pricing() {
  const [catalog, setCatalog] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setError('')
    void loadPublicPlans().then((result) => {
      if (active) setCatalog(result)
    }).catch(() => {
      if (active) setError('Plans could not be loaded. Please try again.')
    })
    return () => { active = false }
  }, [attempt])

  return (
    <section id="pricing" className="py-24 md:py-32 bg-oat-50/50 border-y border-oat">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          center
          eyebrow="Pricing"
          title={<>Choose your plan.<br/><span className="italic text-ube-800">Make room to create.</span></>}
          subtitle="Compare generation limits and included services. Usage resets on fixed windows."
        />
        {error ? (
          <div role="alert" className="text-center mb-6">
            <p>{error}</p>
            <Button onClick={() => setAttempt((value) => value + 1)} className="mt-3">Try again</Button>
          </div>
        ) : !catalog ? (
          <p role="status" className="text-center">Loading plans…</p>
        ) : catalog.plans.length === 0 ? (
          <p className="text-center">No public plans are currently available.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {catalog.plans.map((plan) => (
                <PlanCard key={plan.code} plan={plan} windowHours={catalog.window_seconds / 3600} />
              ))}
            </div>
            <p className="text-center text-sm text-warm-silver mt-6">
              Request limits reset every {catalog.window_seconds / 3600} hours on a fixed UTC schedule.
              Applicable taxes are shown at checkout.
            </p>
          </>
        )}
        <div className="mt-10 max-w-3xl mx-auto"><BusinessCard /></div>
      </div>
    </section>
  )
}
