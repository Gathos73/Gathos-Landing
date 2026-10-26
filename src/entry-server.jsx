import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough } from 'node:stream'
import { MemoryRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { AppRoutes } from './App.jsx'
import { ContentProvider } from './content/store.jsx'
export { metadataFor, applyHead, serialize, PREFIX_KIND } from './content/metadata.js'
export { API_URL, SITE_URL } from './lib/urls.js'
export function render(path, seed) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough()
    const chunks = []
    output.on('data', chunk => chunks.push(chunk))
    output.on('end', () => { clearTimeout(timer); resolve(Buffer.concat(chunks).toString('utf8')) })
    output.on('error', reject)
    let failed = false
    const stream = renderToPipeableStream(<StrictMode><ContentProvider value={seed}><MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter></ContentProvider></StrictMode>, {
      onAllReady() { if (!failed) stream.pipe(output) },
      onShellError(error) { clearTimeout(timer); reject(error) },
      onError(error) { failed = true; clearTimeout(timer); reject(error) },
    })
    const timer = setTimeout(() => { stream.abort(); reject(new Error('Page rendering timed out')) }, 10000)
  })
}
