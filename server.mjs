// Self-hosted equivalent of the Vercel function. Run after npm run build.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import handler from './api/render.mjs'
import sitemap from './api/sitemap.mjs'
const root = path.resolve('dist')
const mime = { '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.md': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.sh': 'text/plain' }
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { allow: 'GET, HEAD' }); res.end(); return }
  if (url.pathname === '/sitemap.xml') return sitemap(req, res)
  let file
  try { file = path.resolve(root, '.' + decodeURIComponent(url.pathname)) } catch { res.writeHead(400); res.end(); return }
  if (file.startsWith(root + path.sep) && path.extname(file)) {
    try {
      if ((await stat(file)).isFile()) {
        res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'cache-control': url.pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache' })
        res.end(req.method === 'HEAD' ? undefined : await readFile(file)); return
      }
    } catch { /* Unknown paths receive a real rendered 404 below. */ }
  }
  return handler(req, res)
}).listen(Number(process.env.PORT || 5173), process.env.HOST || '127.0.0.1', () => console.log('Landing SSR server ready'))
