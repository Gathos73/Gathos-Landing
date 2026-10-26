import { API_URL } from '../dist-ssr/server/entry-server.js'
export default async function handler(req, res) {
  try {
    const base = (process.env.CONTENT_API_URL || API_URL).replace(/\/$/, '')
    const upstream = await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(8000) })
    if (!upstream.ok) throw new Error('Sitemap unavailable')
    res.writeHead(200, { 'content-type': 'application/xml', 'cache-control': 'public, max-age=0, s-maxage=60' })
    res.end(req.method === 'HEAD' ? undefined : await upstream.text())
  } catch {
    res.writeHead(503, { 'cache-control': 'no-store', 'retry-after': '60' }); res.end('Sitemap temporarily unavailable')
  }
}
