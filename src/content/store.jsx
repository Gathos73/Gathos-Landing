import { createContext, useContext, useEffect, useState } from 'react'
import { publicFetch } from '../lib/public-api.js'
import { HUBS } from './config.js'

export const ContentContext = createContext({})
export function ContentProvider({ value, children }) { return <ContentContext.Provider value={value || {}}>{children}</ContentContext.Provider> }
const keyFor = (kind, page, size) => `${kind}:${page}:${size}`
export function usePublicItem(kind, slug) {
  const seed = useContext(ContentContext)
  const key = `${kind}/${slug}`
  const initial = seed.preview && seed.kind === kind ? seed.item : seed.key === key ? seed.item : undefined
  const initialError = seed.key === key ? seed.error : null
  const [state, setState] = useState({ key, item: initial, error: initialError })
  useEffect(() => {
    if (initial !== undefined || initialError) return
    const abort = new AbortController()
    publicFetch(`/api/content/${kind}/${encodeURIComponent(slug)}`, { signal: abort.signal })
      .then(async response => {
        if (response.status === 404) return { item: null }
        if (!response.ok) throw new Error('Content is temporarily unavailable. Please try again.')
        return response.json()
      }).then(result => {
        if (result.redirect) { window.location.replace(`/${HUBS[kind].path}/${encodeURIComponent(result.redirect)}`); return }
        setState({ key, item: result.item, error: null })
      })
      .catch(error => { if (!abort.signal.aborted) setState({ key, item: null, error: error.message }) })
    return () => abort.abort()
  }, [key, kind, slug, initial, initialError])
  const current = initial !== undefined || initialError ? { item: initial, error: initialError } : state.key === key ? state : { item: undefined }
  return { item: current.item, loading: current.item === undefined && !current.error, error: current.error }
}
export function usePublicList(kind, page = 1, size = 25) {
  const seed = useContext(ContentContext)
  const key = keyFor(kind, page, size)
  const initial = seed.lists?.[key]
  const [state, setState] = useState({ key, data: initial })
  useEffect(() => {
    if (initial) return
    const abort = new AbortController()
    publicFetch(`/api/content?${new URLSearchParams({ kind, page, page_size: size })}`, { signal: abort.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Content is temporarily unavailable. Please try again.')
        return response.json()
      }).then(data => setState({ key, data }))
      .catch(error => { if (!abort.signal.aborted) setState({ key, data: { items: [], total: 0, error: error.message } }) })
    return () => abort.abort()
  }, [initial, key, kind, page, size])
  const data = initial || (state.key === key ? state.data : undefined)
  return { items: data?.items || [], total: data?.total || 0, loading: !data, error: data?.error }
}
