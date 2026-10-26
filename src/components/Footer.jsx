import { DASHBOARD_URL } from '../lib/urls.js'
// Footer columns. The "deep" cohort columns (Compare, Alternatives,
// Industries, Tools) are sitewide internal links — every page on the
// site funnels link equity into these via the footer, which is the
// single biggest SEO lever short of getting external backlinks.
//
// Each cohort points to (a) its hub/index page and (b) the top 3-4
// highest-conversion-intent slugs in that cohort. We deliberately
// don't dump every URL in the footer — that dilutes the signal and
// makes the page heavy. The hub pages are where every slug lives.
const columns = [
  {
    title: 'Product',
    links: [
      { label: 'APIs', href: '/#apis' },
      { label: 'Documentation', href: (DASHBOARD_URL + "/docs/") },
      { label: 'Video API', href: '/skills/text-to-video-api' },
      { label: 'Skills', href: '/skills' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Sign in', href: (DASHBOARD_URL + "/login/") },
    ],
  },
  {
    title: 'Compare',
    links: [
      { label: 'All comparisons', href: '/compare' },
      { label: 'Gathos vs ElevenLabs', href: '/compare/gathos-vs-elevenlabs' },
      { label: 'Gathos vs Midjourney', href: '/compare/gathos-vs-midjourney-api' },
      { label: 'Gathos vs Veo 3', href: '/compare/gathos-vs-veo-3' },
      { label: 'Gathos vs Seedance', href: '/compare/gathos-vs-seedance' },
    ],
  },
  {
    title: 'Alternatives',
    links: [
      { label: 'All roundups', href: '/alternatives' },
      { label: 'ElevenLabs alternatives', href: '/alternatives/elevenlabs' },
      { label: 'Midjourney alternatives', href: '/alternatives/midjourney' },
      { label: 'Nano Banana Pro alternatives', href: '/alternatives/nano-banana-pro' },
      { label: 'Fal.ai alternatives', href: '/alternatives/fal' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'All industries', href: '/industry' },
      { label: 'Audiobook narration', href: '/industry/audiobook-narration' },
      { label: 'Real estate listings', href: '/industry/real-estate-listings' },
      { label: 'Indie game assets', href: '/industry/indie-game-assets' },
      { label: 'Course creators', href: '/industry/course-creators' },
    ],
  },
  {
    title: 'Voices',
    links: [
      { label: 'All languages', href: '/voice' },
      { label: 'Hindi voice cloning', href: '/voice/hindi' },
      { label: 'Brazilian Portuguese', href: '/voice/brazilian-portuguese' },
      { label: 'Tamil voice cloning', href: '/voice/tamil' },
      { label: 'Arabic voice cloning', href: '/voice/arabic' },
    ],
  },
  {
    title: 'For Agents',
    links: [
      { label: 'Claude Code', href: '/for/claude-code' },
      { label: 'Cursor', href: '/for/cursor' },
      { label: 'Windsurf', href: '/for/windsurf' },
      { label: 'Gemini CLI', href: '/for/gemini-cli' },
      { label: 'GitHub Copilot', href: '/for/github-copilot' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'All tools', href: '/tools' },
      { label: 'Savings calculator', href: '/tools/savings-calculator' },
      { label: 'AI pricing tracker', href: '/tools/ai-pricing-tracker' },
      { label: 'AI watermark remover', href: '/tools/ai-watermark-remover' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'AI image text guide', href: '/blog/long-text-in-ai-images' },
      { label: 'Voice cloning guide', href: '/blog/zero-shot-voice-cloning-600-languages' },
      { label: 'News', href: 'https://news.gathos.com', external: true },
      { label: 'Partner Programme', href: 'https://affiliate.gathos.com', external: true },
      { label: 'About', href: '/legal?tab=about' },
      { label: 'FAQ', href: '/legal?tab=faq' },
      { label: 'Privacy', href: '/legal?tab=privacy' },
      { label: 'Terms', href: '/legal?tab=terms' },
      { label: 'Refund', href: '/legal?tab=refund' },
    ],
  },
]

function XIcon() {
  return (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M18.244 2H21l-6.522 7.455L22 22h-6.828l-4.77-6.235L4.8 22H2l7.01-8.012L2 2h6.914l4.31 5.7L18.244 2zm-2.39 18.188h1.79L7.25 3.71H5.328l10.526 16.478z"/>
    </svg>
  )
}

function isHubLink(label) {
  return /^All\b/i.test(label)
}

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-dashed border-oat mt-16">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-14 mb-14 border-b border-dashed border-oat">
          <div className="max-w-md">
            <a href="/" className="font-logo text-[2.25rem] leading-none text-black inline-block mb-4">
              Gathos
            </a>
            <p className="text-[0.95rem] text-warm-charcoal leading-relaxed">
              The API platform for AI agents. Image generation, image editing, TTS, voice cloning, and Creator video in one agent-native stack.
            </p>
          </div>
          <a
            href="https://x.com/Gathos_"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow @Gathos_ on X"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-pill border border-oat bg-white text-warm-charcoal hover:text-black hover:border-black transition-colors clay-hover self-start md:self-auto shrink-0"
          >
            <XIcon />
            <span className="text-[0.82rem] font-medium">@Gathos_</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[0.7rem] uppercase tracking-[0.14em] text-warm-silver font-semibold mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => {
                  const hub = isHubLink(link.label)
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={`group inline-flex items-center gap-1.5 text-[0.9rem] transition-colors ${
                          hub
                            ? 'text-black font-medium hover:opacity-80'
                            : 'text-warm-charcoal hover:text-black'
                        }`}
                      >
                        <span>{link.label}</span>
                        {hub && (
                          <span aria-hidden className="text-warm-silver group-hover:text-black group-hover:translate-x-0.5 transition-all">
                            →
                          </span>
                        )}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-dashed border-oat text-xs text-warm-silver">
          <span>© {new Date().getFullYear()} Gathos. All rights reserved.</span>
          <a href="mailto:hello@gathos.com" className="text-warm-charcoal hover:text-black transition-colors">
            hello@gathos.com
          </a>
        </div>
      </div>
    </footer>
  )
}
