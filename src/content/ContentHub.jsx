import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { SITE_URL } from '../lib/urls.js'
import { setPageMeta, setJsonLd, removeJsonLd, breadcrumbLd } from '../seo/head.js'
import { usePublicList } from './store.jsx'
import ContentStatus from './ContentStatus.jsx'
import { HUBS } from './config.js'
import NotFound from '../pages/NotFound.jsx'
export default function ContentHub({ kind }) {
  const cfg = HUBS[kind]
  const [query] = useSearchParams()
  const page = Math.max(1, Number.parseInt(query.get('page'), 10) || 1)
  const { items, total, loading, error } = usePublicList(kind, page, 12)
  const url = `${SITE_URL}/${cfg.path}${page > 1 ? `?page=${page}` : ''}`
  useEffect(() => {
    setPageMeta({ title: `${cfg.title}${page > 1 ? ` · Page ${page}` : ''} · Gathos`, description: cfg.intro, url })
    setJsonLd('gathos-hub-bc-ld', breadcrumbLd([{ name: 'Home', url: SITE_URL }, { name: cfg.title, url }]))
    return () => removeJsonLd('gathos-hub-bc-ld')
  }, [cfg, page, url])
  if (loading || error) return <ContentStatus error={error} />
  if (page > 1 && !items.length) return <NotFound />
  return <div className="bg-cream min-h-screen"><Navbar /><main className="pt-32 pb-24 px-6 max-w-6xl mx-auto"><header className="max-w-3xl mx-auto text-center mb-14"><h1 className="font-editorial text-5xl mb-5">{cfg.title}</h1><p className="text-warm-charcoal text-lg">{cfg.intro}</p></header>
    {items.length === 0 ? <p className="text-center">No published pages on this page.</p> : <div className="grid md:grid-cols-2 gap-5">{items.map(item => <Link key={item.slug} to={`/${cfg.path}/${item.slug}`} className="block rounded-3xl bg-white border border-oat p-7 hover:border-black"><p className="text-xs uppercase tracking-widest text-matcha-800 mb-3">{item.eyebrow || item.category || cfg.title}</p><h2 className="font-editorial text-3xl mb-3">{item.title}</h2><p className="text-warm-charcoal">{item.summary}</p>{item.publishedAt && <p className="text-xs text-warm-silver mt-5">{new Date(item.publishedAt).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })}</p>}</Link>)}</div>}
    <nav aria-label="Pagination" className="flex justify-center items-center gap-6 mt-12">{page > 1 && <Link to={`/${cfg.path}${page === 2 ? '' : `?page=${page-1}`}`}>← Previous</Link>}<span>Page {page}</span>{page*12 < total && <Link to={`/${cfg.path}?page=${page+1}`}>Next →</Link>}</nav>
  </main><Footer /></div>
}
