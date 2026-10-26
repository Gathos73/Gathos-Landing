import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { render, metadataFor, applyHead, serialize } from '../dist-ssr/server/entry-server.js'
import handler, { loadPage } from '../api/render.mjs'
const catalog = JSON.parse(await readFile(new URL('../../backend/app/resources/editorial/catalog.json', import.meta.url), 'utf8'))
const prefixes = { blog: 'blog', compare: 'compare', skill: 'skills', agent: 'for', alternatives: 'alternatives', industry: 'industry', voice: 'voice' }
const response = data => ({ ok: true, status: 200, json: async () => data })
const unavailable = async () => { throw Error('offline') }

test('all migrated articles render actual content and page-specific metadata', async () => {
  assert.equal(catalog.length, 78)
  for (const { kind, data } of catalog) {
    const path = `/${prefixes[kind]}/${data.slug}`
    const seed = { key: `${kind}/${data.slug}`, item: data, kind, lists: {} }
    const html = await render(path, seed)
    assert.match(html, /<h1[ >]/, path)
    const meta = metadataFor(path, seed)
    assert.ok(meta.canonical.endsWith(path), path)
    assert.ok(meta.schemas.length, path)
    assert.equal(meta.robots.startsWith('index'), true)
  }
})

test('collection pagination and published detail use separate endpoints', async () => {
  const calls = []
  const request = async url => {
    calls.push(url)
    return response({ items: [{ slug: 'example', title: 'Example' }], total: 13 })
  }
  const page = await loadPage('/blog?page=2', request)
  assert.equal(page.status, 200)
  assert.equal(page.seed.lists['blog:2:12'].items[0].title, 'Example')
  assert.match(calls[0], /page=2&page_size=12$/)
  const missing = await loadPage('/blog/removed', async () => ({ ok: false, status: 404 }))
  assert.equal(missing.status, 404)
  assert.equal(missing.seed.item, null)
  const failure = await loadPage('/blog/available-later', unavailable)
  assert.equal(failure.status, 503)
  assert.ok(failure.seed.error)
})

test('old slugs are permanent redirects and invalid previews are not indexed', async () => {
  const redirected = await loadPage('/blog/old-name', async () => response({ redirect: 'new-name' }))
  assert.equal(redirected.status, 308)
  assert.equal(redirected.seed.redirect, '/blog/new-name')
  const preview = await loadPage('/preview/invalid-token', async () => ({ status: 404, ok: false }))
  assert.equal(preview.status, 404)
  assert.equal(preview.seed.previewError, true)
  assert.equal(metadataFor('/preview/invalid-token', preview.seed, 404).robots, 'noindex, nofollow')
})

test('head generation replaces stale tags and escapes user content and inline JSON', () => {
  const html = '<head><title>Old</title><meta name="description" content="Old"><meta property="og:title" content="Old"><link rel="canonical" href="/old"><script type="application/ld+json">{}</script></head>'
  const meta = { title: '<New>', description: '" onclick="bad', canonical: 'https://gathos.com/blog/test', image: 'https://example.com/card.png', type: 'article', robots: 'index, follow', schemas: [{ headline: '</script><script>bad</script>' }] }
  const rendered = applyHead(html, meta)
  assert.equal((rendered.match(/<title>/g) || []).length, 1)
  assert.equal((rendered.match(/name="description"/g) || []).length, 1)
  assert.ok(rendered.includes('&lt;New&gt;'))
  assert.equal(rendered.includes('</script><script>bad'), false)
  assert.equal(serialize({ text: '</script>' }).includes('<'), false)
})

test('HTTP adapter delivers initial article HTML and meaningful error statuses', async () => {
  const original = globalThis.fetch
  const blog = catalog.find(row => row.kind === 'blog').data
  globalThis.fetch = async url => url.includes(`/api/content/blog/${blog.slug}`)
    ? response({ item: blog })
    : response({ items: [], total: 0 })
  function capture() {
    return { status: 0, headers: {}, body: '', writeHead(status, headers) { this.status = status; this.headers = headers }, end(body = '') { this.body = body } }
  }
  try {
    const article = capture()
    await handler({ method: 'GET', url: `/api/render?path=blog/${blog.slug}` }, article)
    assert.equal(article.status, 200)
    assert.match(article.body, /<article/)
    assert.match(article.body, /window.__GATHOS_CONTENT__=/)
    assert.equal((article.body.match(/rel="canonical"/g) || []).length, 1)
    const missing = capture()
    await handler({ method: 'GET', url: '/api/render?path=unknown' }, missing)
    assert.equal(missing.status, 404)
    assert.equal(missing.headers['x-robots-tag'], 'noindex, nofollow')
    globalThis.fetch = unavailable
    const offline = capture()
    await handler({ method: 'GET', url: '/api/render?path=blog' }, offline)
    assert.equal(offline.status, 503)
    assert.match(offline.body, /Content temporarily unavailable/)
    assert.match(offline.headers['cache-control'], /no-store/)
  } finally { globalThis.fetch = original }
})

test('homepage and tools render on the server and retain their structured data', async () => {
  for (const path of ['/', '/tools', '/tools/savings-calculator', '/tools/ai-pricing-tracker']) {
    const html = await render(path, { lists: {} })
    assert.match(html, /<h1[ >]/)
    assert.ok(metadataFor(path, { lists: {} }).schemas.length)
  }
  const kind = 'blog', data = catalog.find(row => row.kind === kind).data
  const path = `/blog/${data.slug}?utm_source=test&ref=test`
  assert.equal(metadataFor(path, { kind, item: data }).canonical.includes('?'), false)
})
