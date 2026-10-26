import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { posts } from '../blog/posts.jsx'
import { compares } from '../seo/compare/data.js'
import { skills } from '../seo/skills/data.js'
import { agents } from '../seo/agents/data.js'
import { alternatives } from '../seo/alternatives/data.js'
import { industries } from '../seo/industry/data.js'
import { languages } from '../seo/voice/data.js'
export function exportCatalog() {
  return [
    ...posts.map(({ body, ...data }) => ({ kind: 'blog', data: { ...data, bodyHtml: renderToStaticMarkup(createElement(MemoryRouter, null, createElement(body))) } })),
    ...Object.entries({ compare: compares, skill: skills, agent: agents, alternatives, industry: industries, voice: languages })
      .flatMap(([kind, rows]) => rows.map(data => ({ kind, data }))),
  ]
}
