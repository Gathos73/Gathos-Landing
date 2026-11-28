import test from 'node:test'
import assert from 'node:assert/strict'
import { DESKTOP_CALLBACK, dashboardDesktopLoginUrl, validateDesktopRedirect, validateDesktopRequest } from '../src/lib/desktop-auth.js'

const valid = new URLSearchParams({ callback_url: DESKTOP_CALLBACK, state: '0123456789abcdef0123456789abcdef', source: 'desktop-mac' })

test('accepts the desktop app request and only the known desktop source', () => {
  assert.deepEqual(validateDesktopRequest(valid), { callbackUrl: DESKTOP_CALLBACK, state: valid.get('state'), source: 'desktop-mac' })
  const shortestAllowedState = new URLSearchParams(valid)
  shortestAllowedState.set('state', 'x'.repeat(16))
  assert.ok(validateDesktopRequest(shortestAllowedState))
  const unknownSource = new URLSearchParams(valid)
  unknownSource.set('source', 'web')
  assert.equal(validateDesktopRequest(unknownSource), null)
})
test('rejects an unexpected callback and missing or out of range state', () => {
  const wrongCallback = new URLSearchParams(valid)
  wrongCallback.set('callback_url', 'https://attacker.example/callback')
  assert.equal(validateDesktopRequest(wrongCallback), null)
  for (const callback of ['gathos://evil/callback', 'gathos://auth/other', 'gathosx://auth/callback']) {
    const params = new URLSearchParams(valid)
    params.set('callback_url', callback)
    assert.equal(validateDesktopRequest(params), null)
  }
  const missingState = new URLSearchParams(valid)
  missingState.delete('state')
  assert.equal(validateDesktopRequest(missingState), null)
  const emptyState = new URLSearchParams(valid)
  emptyState.set('state', '')
  assert.equal(validateDesktopRequest(emptyState), null)
  const shortState = new URLSearchParams(valid)
  shortState.set('state', 'too-short')
  assert.equal(validateDesktopRequest(shortState), null)
  const longState = new URLSearchParams(valid)
  longState.set('state', 'x'.repeat(513))
  assert.equal(validateDesktopRequest(longState), null)
})

test('rejects duplicated security parameters and unknown query parameters', () => {
  const duplicate = new URLSearchParams(valid)
  duplicate.append('state', 'a'.repeat(32))
  assert.equal(validateDesktopRequest(duplicate), null)
  const extra = new URLSearchParams(valid)
  extra.set('returnTo', 'https://evil.example')
  assert.equal(validateDesktopRequest(extra), null)
})

test('builds dashboard redirect with only a fully validated request', () => {
  const url = new URL(dashboardDesktopLoginUrl(valid.toString(), 'https://dashboard.gathos.com'))
  assert.equal(url.origin, 'https://dashboard.gathos.com')
  assert.equal(url.pathname, '/desktop-login')
  assert.equal(url.searchParams.get('callback_url'), DESKTOP_CALLBACK)
  assert.equal(url.searchParams.get('source'), 'desktop-mac')
  assert.equal(url.searchParams.get('state'), valid.get('state'))

  const invalid = new URLSearchParams(valid)
  invalid.set('destination', 'https://evil.example')
  const safe = new URL(dashboardDesktopLoginUrl(invalid.toString(), 'https://dashboard.gathos.com'))
  assert.equal(safe.origin, 'https://dashboard.gathos.com')
  assert.equal(safe.pathname, '/desktop-login')
  assert.equal(safe.search, '')
})

test('accepts only backend-issued callback URLs with the same state and a code', () => {
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=${valid.get('state')}&code=once`, valid.get('state')), true)
  assert.equal(validateDesktopRedirect(`gathos://auth/callback.evil?state=${valid.get('state')}&code=once`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=changed&code=once`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=${valid.get('state')}`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=${valid.get('state')}&code=once&api_key=secret`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=${valid.get('state')}&code=%20%20`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=${valid.get('state')}&state=${valid.get('state')}&code=once`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect('https://attacker.example/', valid.get('state')), false)
})
