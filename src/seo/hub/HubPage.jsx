import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SITE_URL } from '../../lib/urls.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { setPageMeta, setJsonLd, removeJsonLd, breadcrumbLd } from '../head.js'
const tools = [
  { path: 'savings-calculator', title: 'AI API Savings Calculator', summary: 'Estimate your image and TTS API costs and compare the alternatives.' },
  { path: 'ai-pricing-tracker', title: 'AI Pricing Tracker', summary: 'Compare image, voice, and video API pricing in one place.' },
]
export default function HubPage() {
  useEffect(() => {
    setPageMeta({ title: 'Free AI pricing tools · Gathos', description: 'Tools for estimating and comparing creative API costs.', url: `${SITE_URL}/tools` })
    setJsonLd('gathos-tools-bc-ld', breadcrumbLd([{ name: 'Home', url: SITE_URL }, { name: 'Tools', url: `${SITE_URL}/tools` }]))
    return () => removeJsonLd('gathos-tools-bc-ld')
  }, [])
  return <div className="bg-cream min-h-screen"><Navbar /><main className="max-w-5xl mx-auto px-6 pt-32 pb-24"><h1 className="font-editorial text-5xl mb-6">Free AI pricing tools</h1><p className="text-warm-charcoal mb-12">Tools for estimating and comparing creative API costs.</p><div className="grid md:grid-cols-2 gap-5">{tools.map(tool => <Link key={tool.path} to={`/tools/${tool.path}`} className="bg-white border border-oat rounded-3xl p-7 hover:border-black"><h2 className="font-editorial text-3xl mb-4">{tool.title}</h2><p className="text-warm-charcoal">{tool.summary}</p></Link>)}</div></main><Footer /></div>
}
