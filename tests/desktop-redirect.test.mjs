import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/render.mjs'

async function request(url) {
  const response = { headers: {}, writeHead(status, headers) { this.status = status; Object.assign(this.headers, headers) }, end() {} }
  await handler({ method: 'GET', url }, response)
  return response
}

test('server redirects a validated request to the dashboard with the full request', async () => {
  const query = new URLSearchParams({ callback_url: 'gathos://auth/callback', state: '0123456789abcdef0123456789abcdef', source: 'desktop-mac' })
  const response = await request(`/desktop-login?${query}`)
  assert.equal(response.status, 307)
  const target = new URL(response.headers.location)
  assert.equal(target.origin, 'https://dashboard.gathos.com')
  assert.equal(target.pathname, '/desktop-login')
  assert.equal(target.searchParams.get('callback_url'), 'gathos://auth/callback')
  assert.equal(target.searchParams.get('state'), query.get('state'))
  assert.equal(target.searchParams.get('source'), 'desktop-mac')
  assert.equal(response.headers['cache-control'], 'no-store')
  assert.equal(response.headers['referrer-policy'], 'no-referrer')
})

test('server never forwards invalid or arbitrary query parameters', async () => {
  const response = await request('/desktop-login?callback_url=https%3A%2F%2Fevil.example&state=invalid&source=desktop-mac&returnTo=https%3A%2F%2Fevil.example')
  assert.equal(response.status, 307)
  const target = new URL(response.headers.location)
  assert.equal(target.origin, 'https://dashboard.gathos.com')
  assert.equal(target.pathname, '/desktop-login')
  assert.equal(target.search, '')
})
