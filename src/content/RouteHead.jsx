import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL } from '../lib/urls.js'
import { setPageMeta, setMeta } from '../seo/head.js'
export default function RouteHead() {
  const { pathname, search } = useLocation()
  useLayoutEffect(() => {
    // Clear route-owned metadata before the new page's passive effects run.
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(node => node.remove())
    document.head.querySelectorAll('meta[property^="article:"]').forEach(node => node.remove())
    setPageMeta({ title: 'Gathos · AI Image, TTS + Video APIs for Agents', description: 'AI image generation, voice cloning, and video APIs for agents.', url: `${SITE_URL}${pathname}${pathname === '/legal' ? search : ''}` })
    setMeta('robots', pathname.startsWith('/preview/') ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
  }, [pathname, search])
  return null
}
