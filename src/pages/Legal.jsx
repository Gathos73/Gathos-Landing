import { SITE_HOST } from '../lib/urls.js'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const COMPANY = 'VIVIDGENAI PRIVATE LIMITED'
const ADDRESS = 'G-2 Ground Floor, 70 Kanak Vihar, Bhankrota, Jaipur – 302026, Rajasthan, India'
const EMAIL = 'hello@gathos.com'
const SITE = (SITE_HOST)
const PRODUCT = 'Gathos'
const UPDATED = 'April 16, 2026'

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'refund', label: 'Cancellation & Refund' },
]

function PrivacyPolicy() {
  return (
    <div className="prose-section">
      <h2>Privacy Policy</h2>
      <p className="meta">Last updated: {UPDATED}</p>

      <p>{COMPANY} ("Company", "we", "us", "our"), operating <strong>{PRODUCT}</strong> ({SITE}), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

      <h3>1. Information We Collect</h3>
      <h4>Personal Information</h4>
      <p>When you create an account or subscribe, we collect:</p>
      <ul>
        <li>Name and email address (via Google OAuth or email registration)</li>
        <li>Payment information (processed securely via Dodo Payments — we do not store card details)</li>
        <li>Profile picture (if provided via Google OAuth)</li>
      </ul>

      <h4>Usage Data</h4>
      <ul>
        <li>API call logs (timestamps, endpoints, response codes)</li>
        <li>Generation counts and usage metrics</li>
        <li>Device information, browser type, IP address</li>
      </ul>

      <h4>Content Data</h4>
      <ul>
        <li>Text prompts submitted to our Image Generation API</li>
        <li>Text and audio files submitted to our TTS Voice Cloning API</li>
        <li>Generated images and audio outputs</li>
      </ul>
      <p>We log prompts and outputs to detect abuse, improve service quality, and ensure platform safety. Prompts are retained for up to 180 days.</p>

      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>To provide, maintain, and improve our API services</li>
        <li>To process payments and manage subscriptions</li>
        <li>To monitor usage, enforce rate limits, and prevent abuse</li>
        <li>To send service-related communications (account updates, billing)</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h3>3. Data Storage & Security</h3>
      <ul>
        <li>Data is stored on secure cloud infrastructure (AWS, Supabase, Cloudflare R2)</li>
        <li>SSL/TLS encryption for all data in transit</li>
        <li>API keys are stored as SHA-256 hashes — we never store plaintext keys</li>
        <li>Voice samples uploaded for TTS are stored in Cloudflare R2 with signed URLs (1-hour expiry)</li>
        <li>Payment processing is handled by Dodo Payments — we do not store sensitive payment details</li>
      </ul>

      <h3>4. Data Retention</h3>
      <ul>
        <li>Account information: retained until you delete your account</li>
        <li>API prompts and outputs: retained for up to 180 days</li>
        <li>Voice samples: retained until you delete them or close your account</li>
        <li>Payment records: retained as required by law</li>
        <li>Usage logs: retained for 1 year</li>
      </ul>

      <h3>5. Third-Party Services</h3>
      <p>We use the following third-party services:</p>
      <ul>
        <li><strong>WorkOS</strong> — authentication (Google OAuth)</li>
        <li><strong>Supabase</strong> — database</li>
        <li><strong>Cloudflare</strong> — CDN, DNS, R2 storage</li>
        <li><strong>Dodo Payments</strong> — payment processing</li>
        <li><strong>AWS</strong> — server infrastructure</li>
        <li><strong>Meta Platforms (Facebook, Instagram)</strong> — Pages API and Instagram Graph API, used by Gathos (social.gathos.com) when you connect a Facebook Page or Instagram Business account so that posts you create can be published on your behalf</li>
      </ul>

      <h3>5a. Meta (Facebook / Instagram) Data</h3>
      <p>If you connect a Facebook Page or Instagram Business account to Gathos (social.gathos.com), we store the Meta user ID, encrypted access tokens, Page IDs, Instagram Business account IDs, and posts you scheduled or published through us. We use this data only to publish content you create and to display the connection status in your account.</p>
      <p>You can remove this data at any time by disconnecting from inside Gathos (social.gathos.com), by removing the app from your Facebook account, or by following the steps on our <a href="/data-deletion">User Data Deletion</a> page.</p>

      <h3>6. Your Rights</h3>
      <ul>
        <li>Access your personal data</li>
        <li>Request deletion of your account and data</li>
        <li>Export your data</li>
        <li>Opt out of non-essential communications</li>
      </ul>
      <p>To exercise these rights, contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>

      <h3>7. Children's Privacy</h3>
      <p>Our services are not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.</p>

      <h3>8. Changes to This Policy</h3>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated "Last Updated" date.</p>

      <h3>9. Contact Us</h3>
      <p><strong>{COMPANY}</strong><br />{ADDRESS}<br />Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
    </div>
  )
}

function TermsConditions() {
  return (
    <div className="prose-section">
      <h2>Terms & Conditions</h2>
      <p className="meta">Last updated: {UPDATED}</p>

      <p>These Terms & Conditions ("Terms") govern your use of the {PRODUCT} platform ({SITE}) operated by {COMPANY}. By accessing or using our services, you agree to be bound by these Terms.</p>

      <h3>1. Account Registration</h3>
      <ul>
        <li>You must provide accurate and complete information when creating an account</li>
        <li>You are responsible for maintaining the security of your account credentials and API keys</li>
        <li>You must be at least 13 years old to use our services</li>
        <li>One person or entity per account — shared accounts are not permitted</li>
      </ul>

      <h3>2. API Usage</h3>
      <ul>
        <li>API keys are personal and non-transferable</li>
        <li>You must not share, sell, or redistribute your API keys</li>
        <li>You are responsible for all activity under your API keys</li>
        <li>We reserve the right to revoke API keys that violate these terms</li>
      </ul>

      <h3>3. Acceptable Use</h3>
      <p>You agree NOT to use {PRODUCT} to:</p>
      <ul>
        <li>Generate illegal, harmful, or abusive content</li>
        <li>Create deepfakes or impersonate real individuals without consent</li>
        <li>Infringe on intellectual property rights</li>
        <li>Attempt to reverse-engineer, decompile, or extract our models</li>
        <li>Circumvent rate limits, usage caps, or security measures</li>
        <li>Use the service for spam, fraud, or deceptive purposes</li>
        <li>Clone voices without the consent of the voice owner</li>
      </ul>

      <h3>4. Subscription & Billing</h3>
      <ul>
        <li>Pro subscriptions are billed monthly at the current rate ($18/month)</li>
        <li>Trial accounts receive 24 hours of access with 20 generations</li>
        <li>Subscriptions auto-renew unless cancelled</li>
        <li>Prices may change with 30 days' notice</li>
      </ul>

      <h3>5. Usage Limits</h3>
      <ul>
        <li>Pro accounts are subject to daily and 6-hour window usage limits</li>
        <li>Trial accounts are limited to 20 generations within 24 hours</li>
        <li>We reserve the right to adjust limits to maintain service quality</li>
      </ul>

      <h3>6. Intellectual Property</h3>
      <ul>
        <li>You retain ownership of your input content (prompts, voice samples)</li>
        <li>You receive a non-exclusive license to use generated outputs</li>
        <li>The {PRODUCT} platform, brand, and technology remain our intellectual property</li>
      </ul>

      <h3>7. Service Availability</h3>
      <ul>
        <li>We strive for 99.9% uptime but do not guarantee uninterrupted service</li>
        <li>We may perform maintenance with or without notice</li>
        <li>We are not liable for losses due to service interruptions</li>
      </ul>

      <h3>8. Limitation of Liability</h3>
      <p>To the maximum extent permitted by law, {COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of {PRODUCT}.</p>

      <h3>9. Termination</h3>
      <ul>
        <li>You may delete your account at any time</li>
        <li>We may suspend or terminate accounts that violate these Terms</li>
        <li>Upon termination, your API keys are revoked and data is deleted within 30 days</li>
      </ul>

      <h3>10. Governing Law</h3>
      <p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.</p>

      <h3>11. Contact</h3>
      <p><strong>{COMPANY}</strong><br />{ADDRESS}<br />Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
    </div>
  )
}

function RefundPolicy() {
  return (
    <div className="prose-section">
      <h2>Cancellation & Refund Policy</h2>
      <p className="meta">Last updated: {UPDATED}</p>

      <h3>1. Subscription Cancellation</h3>
      <ul>
        <li>You may cancel your Pro subscription at any time</li>
        <li>Cancellation takes effect at the end of the current billing period</li>
        <li>You will retain access to Pro features until the end of your paid period</li>
        <li>After cancellation, your account reverts to the Free plan</li>
        <li>Your API keys remain but will stop working when the subscription expires</li>
      </ul>

      <h3>2. Refund Policy</h3>
      <ul>
        <li><strong>Within 48 hours of purchase:</strong> Full refund if no more than 5 API generations have been used</li>
        <li><strong>After 48 hours:</strong> No refund is available for the current billing cycle</li>
        <li><strong>Trial accounts:</strong> Trial is free — no refund applicable</li>
        <li><strong>Service issues:</strong> If the platform is unavailable for more than 24 consecutive hours due to our fault, you may request a pro-rated refund for the affected period</li>
      </ul>

      <h3>3. How to Request a Refund</h3>
      <p>To request a refund, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with:</p>
      <ul>
        <li>Your registered email address</li>
        <li>Date of purchase</li>
        <li>Reason for refund request</li>
      </ul>
      <p>Refunds are processed within 5-7 business days to the original payment method.</p>

      <h3>4. Chargebacks</h3>
      <p>If you initiate a chargeback without first contacting us, we reserve the right to suspend your account immediately. Please contact us first — we're happy to resolve any issues.</p>

      <h3>5. Price Changes</h3>
      <p>If we increase subscription prices, existing subscribers will be notified at least 30 days in advance. You may cancel before the new price takes effect.</p>

      <h3>6. Contact</h3>
      <p><strong>{COMPANY}</strong><br />{ADDRESS}<br />Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="prose-section">
      <h2>About Gathos</h2>

      <p><strong>Gathos</strong> is an API platform built for developers, creators, and AI agents. We provide two core APIs — <strong>Image Generation</strong> and <strong>TTS Voice Cloning</strong> — that can be plugged into any application, workflow, or AI agent with a single API key.</p>

      <h3>Our Mission</h3>
      <p>We believe AI-powered content generation should be accessible to every developer. Not locked behind complex SDKs, vendor lock-in, or opaque pricing. Gathos provides simple, transparent APIs that work everywhere — Claude Code, ChatGPT, Cursor, Windsurf, LangChain, or plain curl.</p>

      <h3>What We Offer</h3>
      <ul>
        <li><strong>Image Generation API</strong> — Generate images from text prompts. Supports multiple resolutions, prompt enhancement, and reproducible seeds.</li>
        <li><strong>TTS Voice Cloning API</strong> — Clone any voice with a reference audio sample, or use preset voices. Convert text to natural-sounding speech in seconds.</li>
      </ul>

      <h3>Agent Skills</h3>
      <p>Sign in to your dashboard to install our pre-built agent skills (Idea-to-Presentation, YouTube Video Factory, Script-to-Reel). Each skill is a prompt file scoped to your API key, ready to drop into Claude Code, Cursor, Windsurf, or any shell-capable agent.</p>

      <h3>The Company</h3>
      <p>Gathos is a product of <strong>{COMPANY}</strong>, a software company registered in India focused on building AI-powered developer tools and creative platforms.</p>

      <h3>Contact</h3>
      <p><strong>{COMPANY}</strong><br />{ADDRESS}<br />Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
    </div>
  )
}

function FAQPage() {
  const faqs = [
    {
      q: 'What is Gathos?',
      a: 'Gathos is an API platform that provides Image Generation and TTS Voice Cloning APIs. You get API keys from our dashboard and use them in any application or AI agent.',
    },
    {
      q: 'How does the free trial work?',
      a: 'Every new account gets 5 free generations per product with no expiry and no card required. Your first recurring subscription also includes a 7-day trial after adding a payment method through Dodo Payments; billing starts after those 7 days unless cancelled.',
    },
    {
      q: 'How much does the Pro plan cost?',
      a: 'The Pro plan is $18/month with unlimited image generation and TTS voice cloning API calls. You can create multiple API keys per service.',
    },
    {
      q: 'What AI agents work with Gathos?',
      a: 'Any AI agent that can make HTTP requests. This includes Claude Code, ChatGPT, Cursor, Windsurf, Gemini CLI, LangChain, CrewAI, OpenClaw, and any tool that can call APIs.',
    },
    {
      q: 'How does voice cloning work?',
      a: 'Send a reference audio file (5-30 seconds of clear speech) along with the text you want spoken. Our API clones the voice and generates speech in that voice. You can also use preset voices (koko, josh, pixxy, prof, rochie, spraky) without uploading audio.',
    },
    {
      q: 'What image formats and resolutions are supported?',
      a: 'Generated images are returned as base64-encoded PNG. Supported resolutions include 1024x1024, 1264x848, 848x1264, and more. Width and height must be divisible by 16.',
    },
    {
      q: 'Are my API keys secure?',
      a: 'Yes. We store API keys as SHA-256 hashes — the plaintext key is only shown once when created. Keys are validated on every request. You can revoke keys at any time from the dashboard.',
    },
    {
      q: 'What are the usage limits?',
      a: 'Pro users get unlimited daily generations with a 6-hour fair-use window of 75 calls (~12.5/hour sustained). The window cap exists to prevent runaway scripts from overloading shared GPU capacity, not to throttle real usage. New accounts get 5 free generations per product with no expiry. The free allowance never resets and ends permanently when subscription access starts. Limits reset automatically and an admin can adjust limits per user.',
    },
    {
      q: 'Can I cancel my subscription?',
      a: 'Yes, you can cancel anytime. You keep access until the end of your billing period. After that, your account reverts to the Free plan. See our Cancellation & Refund policy for details.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'Yes, within 48 hours of purchase if you have used fewer than 5 generations. After 48 hours, no refund is available for the current billing cycle. See our Refund Policy for full details.',
    },
    {
      q: 'Is the source code open source?',
      a: 'The API platform is proprietary. Pre-built agent skills are available to subscribers from the dashboard and install into any shell-capable agent.',
    },
    {
      q: 'How do I get support?',
      a: `Email us at ${EMAIL}. We typically respond within 24 hours.`,
    },
  ]

  return (
    <div className="prose-section">
      <h2>Frequently Asked Questions</h2>
      <div className="space-y-4 mt-6">
        {faqs.map((f, i) => (
          <details key={i} className="group rounded-xl border border-border-subtle overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-text-primary hover:bg-white/[0.02] transition-colors">
              {f.q}
              <svg className="w-4 h-4 text-text-tertiary group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            </summary>
            <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

const tabContent = {
  about: AboutPage,
  faq: FAQPage,
  privacy: PrivacyPolicy,
  terms: TermsConditions,
  refund: RefundPolicy,
}

export default function Legal() {
  const [params, setParams] = useSearchParams()
  const activeTab = params.get('tab') || 'privacy'

  const TabComponent = tabContent[activeTab] || PrivacyPolicy

  return (
    <div className="min-h-screen relative z-1 bg-cream text-black">
      {/* Nav */}
      <header className="border-b border-oat bg-white">
        <div className="max-w-[900px] mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="font-logo text-2xl tracking-[-0.03em] italic text-black">Gathos</a>
          <a href="/" className="text-sm text-warm-charcoal hover:text-black transition-colors">Back to home</a>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white border-2 border-black/90 mb-10 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setParams({ tab: t.id })}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-black text-white'
                  : 'text-warm-charcoal hover:text-black hover:bg-oat-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <TabComponent />
      </main>

      {/* Simple CSS for prose */}
      <style>{`
        .prose-section h2 { font-family: 'EB Garamond', Georgia, serif; font-size: 2.25rem; margin-bottom: 0.5rem; letter-spacing: -0.02em; color: #0a0a0a; }
        .prose-section h3 { font-size: 1.1rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; color: #0a0a0a; }
        .prose-section h4 { font-size: 0.95rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #55534e; }
        .prose-section p { color: #55534e; line-height: 1.7; margin-bottom: 1rem; font-size: 0.92rem; }
        .prose-section .meta { color: #9f9b93; font-size: 0.82rem; margin-bottom: 1.5rem; }
        .prose-section ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-section li { color: #55534e; line-height: 1.7; margin-bottom: 0.25rem; font-size: 0.92rem; }
        .prose-section a { color: #02492a; text-decoration: underline; }
        .prose-section a:hover { text-decoration: none; color: #078a52; }
        .prose-section strong { color: #0a0a0a; }
      `}</style>
    </div>
  )
}
