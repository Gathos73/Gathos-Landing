import { API_URL, SITE_URL } from '../lib/urls.js'
import { assetUrl } from '../lib/assets.js'
import { usePublicItem, usePublicList } from '../content/store.jsx'
import ContentStatus from '../content/ContentStatus.jsx'
import NotFound from './NotFound.jsx'
import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DynamicBody from '../blog/DynamicBody'

const accentBadge = {
  matcha:      'bg-matcha-300/40 text-matcha-800',
  lemon:       'bg-lemon-400/45 text-lemon-800',
  slushie:     'bg-slushie-500/25 text-slushie-800',
  pomegranate: 'bg-pomegranate-400/25 text-pomegranate-400',
  ube:         'bg-ube-300/45 text-ube-800',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const { item: post, loading: stillLoading, error } = usePublicItem('blog', slug)
  const { items: posts } = usePublicList('blog', 1, 4)

  useEffect(() => {
    if (!post) return
    const seoTitle = stripTags(post.seoTitle || post.title)
    const metaDescription = post.metaDescription || post.summary
    document.title = `${seoTitle} · Gathos Blog`
    setMeta('description', metaDescription)
    setMeta('og:title', seoTitle, true)
    setMeta('og:description', metaDescription, true)
    setMeta('og:type', 'article', true)
    setMeta('og:url', `${SITE_URL}/blog/${post.slug}`, true)
    setMeta('article:published_time', post.publishedAt, true)
    // Per-post OG card — server-rendered SVG with this post's title +
    // eyebrow. Massively better social CTR than the generic shared
    // /og-image.png. Cached at Cloudflare edge for 24h.
    const ogTitle = encodeURIComponent(stripTags(post.ogTitle || post.title))
    const ogEyebrow = encodeURIComponent(post.eyebrow || 'Gathos · Blog')
    const ogImage = post.socialImage || `${API_URL}/og/og.svg?title=${ogTitle}&eyebrow=${ogEyebrow}`
    setMeta('og:image', ogImage, true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:image', ogImage)
    setMeta('twitter:title', seoTitle)
    setMeta('twitter:description', metaDescription)
    setCanonical(`${SITE_URL}/blog/${post.slug}`)
    setArticleJsonLd(post)
    if (post.faqs?.length) setFaqJsonLd(post.faqs)
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      removeArticleJsonLd()
      removeFaqJsonLd()
    }
  }, [post])

  // Related posts. Computed BEFORE the early-return guards below so the
  // hook count stays stable across renders (React enforces same-order
  // hooks; calling useMemo only on some renders crashes the component
  // tree, which manifests as a blank page).
  const related = useMemo(() => {
    if (!post) return []
    const others = posts.filter((p) => p.slug !== post.slug)
    const sameAccent = others.filter((p) => p.accent === post.accent)
    const seen = new Set()
    const ordered = [...sameAccent, ...others].filter((p) => {
      if (seen.has(p.slug)) return false
      seen.add(p.slug)
      return true
    })
    return ordered.slice(0, 3)
  }, [post, posts])

  if (stillLoading || error) return <ContentStatus error={error} />
  if (!post) return <NotFound />
  const Body = () => post.bodyHtml
    ? <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
    : <DynamicBody post={post} />

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* Header */}
      <header className="pt-32 pb-12 md:pt-36">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-[0.85rem] text-warm-silver hover:text-black transition-colors mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            All posts
          </Link>

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className={`inline-block px-2.5 py-1 rounded text-[0.62rem] font-bold uppercase tracking-[0.12em] ${accentBadge[post.accent] || accentBadge.matcha}`}>
              {post.eyebrow}
            </span>
            <span className="text-[0.78rem] text-warm-silver font-mono">
              {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'} · {post.readMinutes || 1} min read
            </span>
          </div>

          <h1 className="font-editorial text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.025em] leading-[1.1] text-black mb-5 text-balance">
            {post.title}
          </h1>
          <p className="text-warm-charcoal text-[1.1rem] leading-[1.6] text-balance">
            {post.summary}
          </p>

          {/* Byline — visible E-E-A-T signal. Both Google's quality raters
              and AI answer engines (Perplexity, ChatGPT search) look for an
              explicit author line. A missing byline reads as machine output
              and gets demoted in citation. */}
          {post.author && (
            <div className="flex items-center gap-2.5 mt-6 text-[0.82rem] text-warm-charcoal">
              {post.author.image && (
                <img
                  src={assetUrl(post.author.image)}
                  alt={`${post.author.name} avatar`}
                  width="28"
                  height="28"
                  className="w-7 h-7 rounded-full border border-oat"
                />
              )}
              <span>
                By <span className="font-semibold text-black">{post.author.name}</span>
                {post.author.title && (
                  <span className="text-warm-silver"> · {post.author.title}</span>
                )}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <article className="pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose-clay">
            <Body />
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-oat bg-oat-50/40 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-editorial text-2xl tracking-[-0.02em] text-black mb-6">
              Keep reading
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-oat hover:border-black/40 transition-colors"
                >
                  <div className={`inline-block px-2 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-[0.12em] mb-2 ${accentBadge[p.accent] || accentBadge.matcha}`}>
                    {p.eyebrow}
                  </div>
                  <h3 className="font-editorial text-[1.05rem] leading-[1.2] text-black group-hover:text-matcha-800 transition-colors mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-[0.82rem] text-warm-charcoal leading-[1.5] line-clamp-2">
                    {p.summary}
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

// ─────────────────────────────────────────────────────────────────────────
// SEO helpers — runtime <head> injection. JSON-LD Article schema is what
// makes the post eligible for Google rich results and AI answer engines.
// ─────────────────────────────────────────────────────────────────────────

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '').trim()
}

function setMeta(name, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setArticleJsonLd(post) {
  removeArticleJsonLd()
  // Author shape: prefer Person if the post specifies a personal author;
  // fall back to Organization for posts authored by the team. Person
  // schema is what Google's E-E-A-T scoring + AI answer engines look for.
  const author = post.author
    ? (post.author.name && post.author.name.toLowerCase().includes('team')
        ? { '@type': 'Organization', name: post.author.name, url: post.author.url || (SITE_URL) }
        : {
            '@type': 'Person',
            name: post.author.name,
            url: post.author.url,
            image: post.author.image,
            jobTitle: post.author.title,
            sameAs: post.author.twitter ? [`https://x.com/${post.author.twitter.replace(/^@/, '')}`] : undefined,
          })
    : { '@type': 'Organization', name: 'Gathos', url: (SITE_URL) }
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: stripTags(post.title),
    description: post.metaDescription || post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author,
    publisher: {
      '@type': 'Organization',
      name: 'Gathos',
      logo: { '@type': 'ImageObject', url: 'https://assets.vividai.in/icon-512.png' },
    },
    image: post.socialImage || `${API_URL}/og/og.svg?${new URLSearchParams({ title: stripTags(post.ogTitle || post.title), eyebrow: post.eyebrow || 'Gathos · Blog' })}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    keywords: post.keywords || post.eyebrow,
  }
  const tag = document.createElement('script')
  tag.type = 'application/ld+json'
  tag.id = 'gathos-article-jsonld'
  tag.textContent = JSON.stringify(data)
  document.head.appendChild(tag)
}

function removeArticleJsonLd() {
  const existing = document.getElementById('gathos-article-jsonld')
  if (existing) existing.remove()
}

function setFaqJsonLd(faqs) {
  removeFaqJsonLd()
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: typeof f.a === 'string' ? f.a : stripTags(String(f.a)) },
    })),
  }
  const tag = document.createElement('script')
  tag.type = 'application/ld+json'
  tag.id = 'gathos-faq-jsonld'
  tag.textContent = JSON.stringify(data)
  document.head.appendChild(tag)
}

function removeFaqJsonLd() {
  const existing = document.getElementById('gathos-faq-jsonld')
  if (existing) existing.remove()
}
