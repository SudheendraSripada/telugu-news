import { notFound } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import BreakingTicker from '../../../components/BreakingTicker'
import ArticleCard from '../../../components/ArticleCard'
import { getArticleBySlug, getArticles } from '../../../lib/supabase'

export const revalidate = 60

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [article, allArticles] = await Promise.all([getArticleBySlug(slug), getArticles(10)])
  if (!article) notFound()

  const related = allArticles.filter(a => a.slug !== slug && a.category_id === article.category_id).slice(0, 4)
  const catName = article.categories?.name || 'News'
  const catColor = article.categories?.color || '#C8102E'
  const pubDate = article.published_at ? new Date(article.published_at).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return (
    <>
      <Navbar />
      <BreakingTicker />
      <main style={{ background: 'var(--paper)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '28px', paddingBottom: '48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }} className="art-layout">
            <article>
              {/* Breadcrumb */}
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                <a href="/" style={{ color: 'var(--muted)' }}>Home</a> › <a href={`/${article.categories?.slug}`} style={{ color: catColor, fontWeight: 600, textTransform: 'uppercase', fontSize: '11px' }}>{catName}</a>
              </div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {article.is_breaking && <span style={{ background: 'var(--red)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '2px', textTransform: 'uppercase' }}>Breaking</span>}
                <span style={{ background: catColor, color: '#fff', fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '2px', textTransform: 'uppercase' }}>{catName}</span>
              </div>
              {/* Title */}
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 700, lineHeight: 1.2, color: 'var(--ink)', marginBottom: '12px' }}>{article.title}</h1>
              {article.title_telugu && (
                <h2 className="telugu" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--muted)', lineHeight: 1.4, marginBottom: '16px', borderLeft: '3px solid var(--red)', paddingLeft: '12px' }}>{article.title_telugu}</h2>
              )}
              {/* Meta */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{pubDate}</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Source: {article.source_name}</span>
                {article.source_url && <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#0057b7' }}>Read original →</a>}
              </div>
              {/* Cover image */}
              {article.cover_image_url && (
                <div style={{ marginBottom: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={article.cover_image_url} alt={article.title} style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
                </div>
              )}
              {/* Summary box */}
              <div style={{ background: 'var(--section-bg)', borderLeft: '4px solid var(--red)', padding: '16px 20px', marginBottom: '24px', borderRadius: '0 4px 4px 0' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '6px' }}>Summary</div>
                <p style={{ fontSize: '15px', lineHeight: 1.65 }}>{article.summary}</p>
                {article.summary_telugu && <p className="telugu" style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', marginTop: '8px' }}>{article.summary_telugu}</p>}
              </div>
              {/* Body */}
              {article.content
                ? <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--ink)' }} className="art-body" dangerouslySetInnerHTML={{ __html: article.content }} />
                : <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', fontStyle: 'italic' }}>Full article at <a href={article.source_url} target="_blank" rel="noopener" style={{ color: '#0057b7' }}>{article.source_name}</a></p>
              }
              {/* Share */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Share:</span>
                {['Twitter', 'WhatsApp', 'Facebook'].map(s => (
                  <button key={s} style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 600, background: 'var(--section-bg)', border: '1px solid var(--border)', borderRadius: '3px', cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
            </article>

            {/* SIDEBAR */}
            <aside style={{ position: 'sticky', top: '80px' }}>
              {related.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ borderTop: '3px solid var(--red)', paddingTop: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)' }}>Related Stories</span>
                  </div>
                  {related.map(a => <ArticleCard key={a.id} article={a} size="small" />)}
                </div>
              )}
              <div style={{ background: 'var(--ink)', borderRadius: '4px', padding: '20px', color: '#fff' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>AI Daily Digest</div>
                <p style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.6, marginBottom: '14px' }}>Top 5 stories every morning in Telugu & English.</p>
                <input type="email" placeholder="Your email" style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', color: '#fff', fontSize: '13px', marginBottom: '8px', outline: 'none' }} />
                <button style={{ width: '100%', padding: '8px', background: 'var(--red)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 700, borderRadius: '3px', cursor: 'pointer', textTransform: 'uppercase' }}>Subscribe Free</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <style>{`
        .art-body h2{font-family:var(--font-display);font-size:22px;font-weight:700;margin:28px 0 12px;border-bottom:1px solid var(--border);padding-bottom:8px}
        .art-body p{margin-bottom:18px}
        .art-body a{color:#0057b7;text-decoration:underline}
        .art-body ul,.art-body ol{margin:16px 0 16px 24px}
        .art-body li{margin-bottom:8px;line-height:1.7}
        .art-body .video-embed{margin:24px 0}
        @media(max-width:900px){.art-layout{grid-template-columns:1fr!important}}
      `}</style>
    </>
  )
}
