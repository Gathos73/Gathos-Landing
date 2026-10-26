import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ContentContext, ContentProvider } from './store.jsx'
import { publicFetch } from '../lib/public-api.js'
import BlogPost from '../pages/BlogPost.jsx'
import ComparePage from '../seo/compare/ComparePage.jsx'
import SkillPage from '../seo/skills/SkillPage.jsx'
import AgentPage from '../seo/agents/AgentPage.jsx'
import AlternativesPage from '../seo/alternatives/AlternativesPage.jsx'
import IndustryPage from '../seo/industry/IndustryPage.jsx'
import VoicePage from '../seo/voice/VoicePage.jsx'
import ContentStatus from './ContentStatus.jsx'
import NotFound from '../pages/NotFound.jsx'
const PAGES = { blog: BlogPost, compare: ComparePage, skill: SkillPage, agent: AgentPage, alternatives: AlternativesPage, industry: IndustryPage, voice: VoicePage }
export default function PreviewPage() {
  const { slug: token } = useParams()
  const seed = useContext(ContentContext)
  const [result, setResult] = useState(seed.preview ? { ...seed, token } : null)
  const [error, setError] = useState('')
  useEffect(() => {
    if (seed.preview || seed.previewError || seed.error) return
    const abort = new AbortController()
    publicFetch(`/api/content/preview?token=${encodeURIComponent(token)}`, { signal: abort.signal }).then(async response => {
      if (!response.ok) throw new Error('Preview expired or incomplete. Save the page and create a new preview.')
      return response.json()
    }).then(data => setResult({ ...data, preview: true, token })).catch(e => { if (!abort.signal.aborted) setError(e.message) })
    return () => abort.abort()
  }, [seed.preview, token])
  const Page = result?.token === token ? PAGES[result.kind] : null
  if (seed.previewError) return <NotFound />
  if (!Page) return <ContentStatus error={seed.error || error} />
  return <ContentProvider value={result}><div className="fixed bottom-4 left-4 z-[200] bg-black text-white px-4 py-2 rounded-full text-sm">Draft preview · expires in five minutes</div><Page /></ContentProvider>
}
