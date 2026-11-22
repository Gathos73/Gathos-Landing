import { DASHBOARD_URL } from '../lib/urls.js'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function SplitWords({ children, className = '' }) {
  const words = String(children).split(/(\s+)/)
  return (
    <>
      {words.map((w, i) =>
        /^\s+$/.test(w)
          ? <span key={i}>{w}</span>
          : <span key={i} className={`cta-word inline-block ${className}`}>{w}</span>
      )}
    </>
  )
}

export default function FinalCTA() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.from('.cta-badge', { y: 18, opacity: 0, duration: 0.6 })
        .from('.cta-word', {
          y: 60,
          opacity: 0,
          rotateX: -30,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.4)',
        }, '-=0.3')
        .from('.cta-underline', {
          strokeDashoffset: 600,
          duration: 1.0,
          ease: 'power3.inOut',
        }, '-=0.5')
        .from('.cta-sub', { y: 18, opacity: 0, duration: 0.6 }, '-=0.6')
        .from('.cta-buttons', { y: 18, opacity: 0, duration: 0.6 }, '-=0.4')
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-matcha-800 py-28 text-white md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="cta-badge mb-10 inline-flex items-center gap-2 rounded-pill border border-matcha-300/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-matcha-300">
            <span className="h-1.5 w-1.5 rounded-full bg-matcha-300" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Image editing, voice and video for agents
          </div>

          <h2 className="mb-7 text-balance font-editorial text-[clamp(2.4rem,5.5vw,3.75rem)] font-normal leading-[1.1] tracking-[-0.025em] text-white">
            <span className="block"><SplitWords>Your agent already thinks.</SplitWords></span>
            <span className="relative inline-block text-matcha-300 italic">
              <SplitWords>Now let it</SplitWords>{' '}
              <span className="relative inline-block">
                <SplitWords>create.</SplitWords>
                <svg
                  className="cta-underline-wrap pointer-events-none absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 320 14"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M 6 9 Q 80 2 160 7 T 314 6"
                    className="cta-underline"
                    fill="none"
                    stroke="#dad4c8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="600"
                  />
                </svg>
              </span>
            </span>
          </h2>

          <p className="cta-sub mx-auto mb-10 max-w-xl text-balance text-[1.08rem] leading-[1.6] text-matcha-300">
            Create an image key, i2i key, voice key, or Creator video key and ship the asset your agent planned.
          </p>

          <div className="cta-buttons flex flex-wrap items-center justify-center gap-4">
            <a href={(DASHBOARD_URL + "/login/")} data-cursor="magnet" className="clay-hover clay-hover-bold inline-flex h-12 items-center justify-center gap-1.5 rounded-pill bg-white px-7 text-[0.95rem] font-semibold text-black">
              Start building - free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
            <a href="#apis" data-cursor="magnet" className="clay-hover inline-flex h-12 items-center justify-center gap-1.5 rounded-pill border border-matcha-300/40 bg-transparent px-7 text-[0.95rem] font-semibold text-white">
              Read the docs
            </a>
          </div>
          <p className="mt-5 text-xs text-white/55">5 free generations per product · No expiry · No card required</p>
        </div>
      </div>
    </section>
  )
}
