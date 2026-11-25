import test from 'node:test'
import assert from 'node:assert/strict'
import { DESKTOP_CALLBACK, desktopReturnUrl, validateDesktopRedirect, validateDesktopRequest } from '../src/lib/desktop-auth.js'

const valid = new URLSearchParams({ callback_url: DESKTOP_CALLBACK, state: '0123456789abcdef0123456789abcdef', source: 'desktop-mac' })

test('accepts the desktop app request and only the known desktop source', () => {
  assert.deepEqual(validateDesktopRequest(valid), { callbackUrl: DESKTOP_CALLBACK, state: valid.get('state'), source: 'desktop-mac' })
  const unknownSource = new URLSearchParams(valid)
  unknownSource.set('source', 'web')
  assert.equal(validateDesktopRequest(unknownSource), null)
})

test('rejects an unexpected callback and missing or out of range state', () => {
  const wrongCallback = new URLSearchParams(valid)
  wrongCallback.set('callback_url', 'https://attacker.example/callback')
  assert.equal(validateDesktopRequest(wrongCallback), null)
  const missingState = new URLSearchParams(valid)
  missingState.delete('state')
  assert.equal(validateDesktopRequest(missingState), null)
  const shortState = new URLSearchParams(valid)
  shortState.set('state', 'too-short')
  assert.equal(validateDesktopRequest(shortState), null)
})

test('accepts only backend-issued callback URLs with the same state and a code', () => {
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=${valid.get('state')}&code=once`, valid.get('state')), true)
  assert.equal(validateDesktopRedirect(`gathos://auth/callback.evil?state=${valid.get('state')}&code=once`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=changed&code=once`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect(`${DESKTOP_CALLBACK}?state=${valid.get('state')}`, valid.get('state')), false)
  assert.equal(validateDesktopRedirect('https://attacker.example/', valid.get('state')), false)
})

test('sign-in return URL contains only the same-origin resume path', () => {
  const url = new URL(desktopReturnUrl('https://gathos.com'))
  assert.equal(url.origin, 'https://gathos.com')
  assert.equal(url.pathname, '/desktop-login')
  assert.equal(url.search, '?resume=1')
})
