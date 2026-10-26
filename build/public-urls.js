import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { replacePublicUrls } from '../src/lib/urls.js'

export function publicUrls(env) {
  let config
  let files = []
  async function collect(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = path.join(prefix, entry.name)
      if (entry.isDirectory()) await collect(path.join(directory, entry.name), relative)
      else if (/\.(txt|xml|md|sh)$/.test(entry.name)) files.push(relative)
    }
  }
  return {
    name: 'configured-public-urls',
    async configResolved(resolved) {
      config = resolved
      await collect(config.publicDir)
    },
    transformIndexHtml(html) {
      return replacePublicUrls(html, env)
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const file = (req.url || '').split('?')[0].replace(/^\//, '')
        if (!files.includes(file)) return next()
        try {
          const source = await readFile(path.join(config.publicDir, file), 'utf8')
          res.setHeader('Content-Type', file.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8')
          res.end(replacePublicUrls(source, env))
        } catch (error) { next(error) }
      })
    },
    async writeBundle() {
      if (config.build.ssr) return
      for (const file of files) {
        const output = path.resolve(config.root, config.build.outDir, file)
        const source = await readFile(output, 'utf8')
        await writeFile(output, replacePublicUrls(source, env))
      }
    },
  }
}
