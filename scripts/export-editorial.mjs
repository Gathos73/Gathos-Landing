// Explicit, repeatable export of legacy JSX bodies and every SEO catalog.
import { build } from 'vite'
import { pathToFileURL } from 'node:url'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
await build({ build: { ssr: 'src/content/export.jsx', outDir: 'dist-ssr/export', emptyOutDir: true }, ssr: { noExternal: true } })
try {
  const { exportCatalog } = await import(pathToFileURL(path.resolve('dist-ssr/export/export.js')))
  const catalog = exportCatalog()
  const destination = path.resolve(process.argv[2] || '../backend/app/resources/editorial/catalog.json')
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, JSON.stringify(catalog, null, 2) + '\n')
  console.log(`Exported ${catalog.length} articles to ${destination}`)
} finally { /* The export never opens a listener or database connection. */ }
