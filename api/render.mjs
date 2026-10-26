// Vercel function and self-hosted adapter. No legacy frontend/server required.
import { readFile } from 'node:fs/promises'
import { render, metadataFor, applyHead, serialize, PREFIX_KIND, API_URL } from '../dist-ssr/server/entry-server.js'
const template = readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
const paths = { blog: 'blog', compare: 'compare', skill: 'skills', agent: 'for', alternatives: 'alternatives', industry: 'industry', voice: 'voice' }
const nonContent = new Set(['/', '/legal', '/tools', '/tools/savings-calculator', '/tools/ai-pricing-tracker', '/data-deletion', '/data-deletion/status'])
function apiBase() {
  const base = process.env.CONTENT_API_URL || API_URL
  const url = new URL(base)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid CONTENT_API_URL')
  return base.replace(/\/$/, '')
}
export async function loadPage(path, request = fetch) {
  const url = new URL(path, 'https://landing.invalid')
  const parts = url.pathname.split('/').filter(Boolean)
  const kind = PREFIX_KIND[parts[0]]
  const seed = { lists: {} }
  let status = 200
  async function get(endpoint) {
    const response = await request(`${apiBase()}${endpoint}`, { signal: AbortSignal.timeout(8000), headers: { accept: 'application/json' } })
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Content API unavailable (${response.status})`)
    return response.json()
  }
  try {
    if (parts[0] === 'preview' && parts.length === 2) {
      const data = await get(`/api/content/preview?token=${encodeURIComponent(parts[1])}`)
      if (!data) return { seed: { previewError: true, lists: {} }, status: 404, renderPath: path }
      Object.assign(seed, data, { preview: true })
    } else if (kind && parts.length === 2) {
      seed.key = `${kind}/${decodeURIComponent(parts[1])}`; seed.kind = kind
      const data = await get(`/api/content/${kind}/${encodeURIComponent(decodeURIComponent(parts[1]))}`)
      if (data?.redirect) return { seed: { redirect: `/${paths[kind]}/${encodeURIComponent(data.redirect)}` }, status: 308, renderPath: path }
      seed.item = data?.item || null
      if (!seed.item) status = 404
    } else if (kind && parts.length === 1) {
      const page = Math.max(1, Number.parseInt(url.searchParams.get('page'), 10) || 1)
      const data = await get(`/api/content?kind=${kind}&page=${page}&page_size=12`)
      if (!data) throw new Error('Content list unavailable')
      seed.lists[`${kind}:${page}:12`] = data
      if (page > 1 && !data.items.length) status = 404
    } else if (!nonContent.has(url.pathname)) status = 404
    // Include current related cards in the initial HTML, without loading bodies.
    if (seed.item) {
      const currentKind = kind || seed.kind
      const kinds = [currentKind, ...(['compare', 'skill', 'agent'].includes(kind || seed.kind) ? ['skill', 'compare'] : [])]
      for (const related of new Set(kinds)) {
        const size = related === 'blog' ? 4 : related === currentKind || related === 'skill' && currentKind === 'agent' ? 100 : 4
        try {
          const data = await get(`/api/content?kind=${related}&page=1&page_size=${size}`)
          if (data) seed.lists[`${related}:1:${size}`] = data
        } catch { /* Related cards are optional; the article is authoritative. */ }
      }
    }
  } catch {
    status = 503
    seed.error = 'Content is temporarily unavailable. Please try again.'
    seed.key = kind && parts.length === 2 ? `${kind}/${decodeURIComponent(parts[1])}` : undefined
    if (kind && parts.length === 1) {
      const page = Math.max(1, Number.parseInt(url.searchParams.get('page'), 10) || 1)
      seed.lists[`${kind}:${page}:12`] = { items: [], total: 0, error: seed.error }
    }
  }
  return { seed, status, renderPath: status === 404 ? '/404' : path }
}
export default async function handler(req, res) {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { allow: 'GET, HEAD' }); res.end(); return }
    const requestUrl = new URL(req.url, 'https://landing.invalid')
    const rawPath = requestUrl.searchParams.get('path')
    // Rewrite query parameters are excluded from canonical public URLs.
    requestUrl.searchParams.delete('path')
    const pathname = rawPath !== null ? `/${rawPath.replace(/^\/+/, '')}` : requestUrl.pathname
    const path = pathname + requestUrl.search
    if (/^\/(login|signup|dashboard|business\/checkout)(\/|$)/.test(pathname)) {
      const target = process.env.DASHBOARD_URL || 'https://dashboard.gathos.com'
      res.writeHead(308, { location: `${target.replace(/\/$/, '')}/login/` }); res.end(); return
    }
    const { seed, status, renderPath } = await loadPage(path)
    if (seed.redirect) { res.writeHead(308, { location: seed.redirect, "cache-control": "public, max-age=60" }); res.end(); return }
    const markup = await render(renderPath, seed)
    const html = applyHead(await template, metadataFor(path, seed, status))
      .replace('<div id="root"></div>', `<div id="root">${markup}</div><script>window.__GATHOS_CONTENT__=${serialize(seed)}</script>`)
    const privatePage = pathname.startsWith('/preview/')
    res.writeHead(status, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': privatePage || status !== 200 ? 'private, no-store' : 'public, max-age=0, s-maxage=60, must-revalidate',
      ...(privatePage || status !== 200 ? { 'x-robots-tag': 'noindex, nofollow' } : {}),
      ...(status === 503 ? { 'retry-after': '60' } : {}),
      'referrer-policy': privatePage ? 'no-referrer' : 'strict-origin-when-cross-origin',
    })
    res.end(req.method === 'HEAD' ? undefined : html)
  } catch (error) {
    console.error('Landing rendering failed:', error.message)
    res.writeHead(503, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'retry-after': '60', 'x-robots-tag': 'noindex' })
    res.end('<!doctype html><title>Temporarily unavailable</title><h1>Temporarily unavailable</h1><p>Please try again shortly.</p>')
  }
}
