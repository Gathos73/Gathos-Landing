import { API_URL } from './urls.js'

export function publicFetch(path, options) {
  return fetch(`${API_URL}${path}`, options)
}
