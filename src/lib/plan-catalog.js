import { publicFetch } from './public-api.js'

// Short-lived presentation cache. Failed loads are discarded so retry can recover.
const FRESH_MS = 60_000
let entry = null

export function loadPublicPlans() {
  if (entry && entry.expires > Date.now()) return entry.promise

  const next = { expires: Infinity, promise: null }
  next.promise = publicFetch('/api/plans', { cache: 'no-store', credentials: 'omit' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Plan catalog unavailable')
      const payload = await response.json()
      if (!Array.isArray(payload.plans) || !(payload.window_seconds > 0)) {
        throw new Error('Invalid plan catalog')
      }
      next.expires = Date.now() + FRESH_MS
      return payload
    })
    .catch((error) => {
      if (entry === next) entry = null
      throw error
    })
  entry = next
  return next.promise
}
