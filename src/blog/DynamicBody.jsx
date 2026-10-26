// Dynamic blog post renderer.
//
// Static posts in src/blog/posts.jsx ship a `body: () => JSX` function
// because they're written by hand and authors want full control. Posts
// generated via the admin Content Generator can't ship JSX (we'd be
// loading arbitrary code from the DB), so they ship as a structured
// `sections` array. This component maps that array back to the same
// prose components static posts use, so generated posts are visually
// identical to handwritten ones.
//
// Section types match what server/content-gen.js asks Gemini to emit.
// Unknown types are silently dropped (validateBlogDraft also filters
// these on write, this is just defense in depth).

import { Lead, H2, P, UL, Quote, Stat, CalloutSkill, FAQ, CTAFooter, Code } from './prose'

export default function DynamicBody({ post }) {
  const sections = Array.isArray(post?.sections) ? post.sections : []
  return (
    <>
      {sections.map((s, i) => {
        switch (s.type) {
          case 'html':
            return <div key={i} dangerouslySetInnerHTML={{ __html: s.html }} />
          case 'image':
            return <figure key={i} className="my-8"><img src={s.src} alt={s.alt} loading="lazy" className="rounded-2xl w-full" /></figure>
          case 'code':
            return <Code key={i}>{s.text}</Code>
          case 'lead':
            return <Lead key={i}>{s.text}</Lead>
          case 'h2':
            return <H2 key={i}>{s.text}</H2>
          case 'p':
            return <P key={i}>{s.text}</P>
          case 'ul':
            return (
              <UL key={i}>
                {(Array.isArray(s.items) ? s.items : []).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </UL>
            )
          case 'stat':
            return <Stat key={i} value={s.value} label={s.label} source={s.source} />
          case 'quote':
            return <Quote key={i}>{s.text}</Quote>
          case 'callout-skill':
            return (
              <CalloutSkill
                key={i}
                name={s.name}
                description={s.description}
                slug={s.slug}
              />
            )
          default:
            return null
        }
      })}
      {Array.isArray(post.faqs) && post.faqs.length > 0 && <FAQ items={post.faqs} />}
      <CTAFooter />
    </>
  )
}
