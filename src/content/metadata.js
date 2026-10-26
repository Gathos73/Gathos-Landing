import { SITE_URL, API_URL } from '../lib/urls.js'
import { HUBS } from './config.js'
import { HOMEPAGE_FAQS } from './home-faqs.js'
import { PRICING_FAQS } from './tool-faqs.js'
import { articleLd, breadcrumbLd, faqLd, softwareApplicationLd } from '../seo/head.js'
export const PREFIX_KIND = Object.fromEntries(Object.entries(HUBS).map(([kind, cfg]) => [cfg.path, kind]))
export function metadataFor(path, seed, status = 200) {
  const url = new URL(path, SITE_URL)
  const parts = url.pathname.split('/').filter(Boolean)
  const kind = seed.kind || PREFIX_KIND[parts[0]]
  const item = seed.item
  const cfg = HUBS[kind]
  const pageNumber = Math.max(1, Number.parseInt(url.searchParams.get('page'), 10) || 1)
  const canonicalQuery = cfg && parts.length === 1 && pageNumber > 1 ? `?page=${pageNumber}` : url.pathname === '/legal' && url.searchParams.has('tab') ? `?tab=${encodeURIComponent(url.searchParams.get('tab'))}` : ''
  const canonical = seed.preview && item ? `${SITE_URL}/${cfg.path}/${item.slug}` : `${SITE_URL}${url.pathname}${canonicalQuery}`
  let title = 'Gathos · AI Image, TTS + Video APIs for Agents'
  let description = 'AI image generation, voice cloning, and video APIs for agents.'
  let image = 'https://assets.vividai.in/og-image.png'
  const schemas = []
  if (status === 404) { title = 'Page not found · Gathos'; description = 'The page you were looking for does not exist.' }
  else if (status === 503) { title = 'Content temporarily unavailable · Gathos'; description = 'Please try again shortly.' }
  else if (item && cfg) {
    title = kind === 'blog' ? `${item.seoTitle || item.title} · Gathos Blog` : item.metaTitle || `${item.h1} · Gathos`
    description = item.metaDescription || item.metaDesc || item.summary || description
    image = item.socialImage || `${API_URL}/og/og.svg?${new URLSearchParams({ title: item.ogTitle || item.title || item.h1, eyebrow: item.eyebrow || cfg.title })}`
    if (kind === 'blog') {
      const article = articleLd({ title: item.title, description, url: canonical, datePublished: item.publishedAt, dateModified: item.updatedAt })
      if (item.author?.name) article.author = { '@type': item.author.name.toLowerCase().includes('team') ? 'Organization' : 'Person', name: item.author.name, url: item.author.url || SITE_URL }
      article.image = image
      schemas.push(article)
    } else schemas.push(softwareApplicationLd({ description, url: canonical }))
    schemas.push(breadcrumbLd([{ name: 'Home', url: SITE_URL }, { name: cfg.title, url: `${SITE_URL}/${cfg.path}` }, { name: item.title || item.h1, url: canonical }]))
    if (item.faqs?.length) schemas.push(faqLd(item.faqs))
    if (kind === 'alternatives') schemas.push({ '@context': 'https://schema.org', '@type': 'ItemList', name: item.h1, itemListElement: item.items.map(it => ({ '@type': 'ListItem', position: it.rank, name: it.name, url: it.url })) })
  } else if (cfg) {
    const page = Number.parseInt(url.searchParams.get('page'), 10) || 1
    title = `${cfg.title}${page > 1 ? ` · Page ${page}` : ''} · Gathos`; description = cfg.intro
    const list = seed.lists?.[`${kind}:${page}:12`]
    if (list) schemas.push({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: list.items.map((it, i) => ({ '@type': 'ListItem', position: (page-1)*12+i+1, name: it.title, url: `${SITE_URL}/${cfg.path}/${it.slug}` })) })
  }
  if (status === 200 && url.pathname === '/') schemas.push(softwareApplicationLd({ description, url: SITE_URL }), faqLd(HOMEPAGE_FAQS), { '@context': 'https://schema.org', '@type': 'Organization', name: 'Gathos', url: SITE_URL, logo: 'https://assets.vividai.in/icon-512.png' })
  if (status === 200 && url.pathname === '/tools/ai-pricing-tracker') schemas.push(faqLd(PRICING_FAQS))
  if (status === 200 && url.pathname.startsWith('/tools')) {
    const titles = { '/tools': 'Free AI pricing tools · Gathos', '/tools/savings-calculator': 'AI API Savings Calculator · Gathos vs Everyone Else', '/tools/ai-pricing-tracker': 'AI API Pricing Tracker 2026: Image, TTS & Video Costs' }
    title = titles[url.pathname] || title
    description = 'Tools for estimating and comparing AI image, voice, and video API costs.'
    schemas.push(softwareApplicationLd({ description, url: canonical }), breadcrumbLd([{ name: 'Home', url: SITE_URL }, { name: 'Tools', url: `${SITE_URL}/tools` }]))
  }
  return { title, description, image, canonical, schemas, type: kind === 'blog' && item ? 'article' : 'website', robots: seed.preview || status !== 200 ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' }
}
export function serialize(value) { return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') }
export function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }
export function applyHead(html, meta) {
  const e = escapeHtml
  let result = html.replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+[^>]*(?:name|property)=["'](?:description|robots|twitter:[^"']+|og:[^"']+|article:[^"']+)["'][^>]*>/gi, '')
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
  const tags = `<title>${e(meta.title)}</title><meta name="description" content="${e(meta.description)}"><meta name="robots" content="${e(meta.robots)}"><link rel="canonical" href="${e(meta.canonical)}">` +
    Object.entries({ title: meta.title, description: meta.description, image: meta.image, url: meta.canonical, type: meta.type }).map(([key, value]) => `<meta property="og:${key}" content="${e(value)}">`).join('') +
    Object.entries({ card: 'summary_large_image', title: meta.title, description: meta.description, image: meta.image }).map(([key, value]) => `<meta name="twitter:${key}" content="${e(value)}">`).join('') +
    `<script id="gathos-server-jsonld" type="application/ld+json">${serialize(meta.schemas)}</script>`
  result = result.replace('</head>', `${tags}</head>`)
  return result
}
