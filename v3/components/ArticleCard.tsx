'use client'
import Link from 'next/link'
import { Article } from '../lib/supabase'

const CAT_COLORS: Record<string, string> = {
  ai: '#0057b7', business: '#1a6b2e', telugu: '#b5451b',
  politics: '#8b1a1a', technology: '#5a2d82', world: '#333', sports: '#0a5c36',
}

export default function ArticleCard({ article, size = 'medium' }: { article: Article; size?: 'hero' | 'large' | 'small' | 'medium' }) {
  const catSlug = article.categories?.slug || ''
  const catName = article.categories?.name || 'News'
  const catColor = article.categories?.color || CAT_COLORS[catSlug] || 'var(--red)'
  const img = article.cover_image_url || ''

  if (size === 'hero') return (
    <Link href={`/article/${article.slug}`}>
      <div style={{ position: 'relative', height: '460px', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', background: '#1a1a1a' }}>
        {img
          ? <img src={img} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' }} />
        }
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.92),rgba(0,0,0,0.5) 60%,transparent)', padding: '40px 28px 28px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {article.is_breaking && <span style={{ background: 'var(--red)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>Breaking</span>}
            <span style={{ background: catColor, color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>{catName}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: '10px' }}>{article.title}</h2>
          <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.5, marginBottom: '10px' }}>{article.summary}</p>
          <span style={{ color: '#999', fontSize: '12px' }}>{article.source_name}</span>
        </div>
      </div>
    </Link>
  )

  if (size === 'large') return (
    <Link href={`/article/${article.slug}`}>
      <div style={{ borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--white)', height: '100%', transition: 'box-shadow 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
        <div style={{ height: '200px', background: '#e8e0d4', overflow: 'hidden' }}>
          {img ? <img src={img} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', opacity: 0.2 }}>📰</div>}
        </div>
        <div style={{ padding: '16px' }}>
          <span style={{ background: catColor, color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '2px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '8px' }}>{catName}</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: '8px' }}>{article.title}</h3>
          <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.5, marginBottom: '10px' }}>{article.summary?.slice(0, 120)}...</p>
          <span style={{ color: 'var(--muted-light)', fontSize: '11px' }}>{article.source_name}</span>
        </div>
      </div>
    </Link>
  )

  return (
    <Link href={`/article/${article.slug}`}>
      <div style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
        onMouseEnter={e => { const h = e.currentTarget.querySelector('h4') as HTMLElement; if (h) h.style.color = 'var(--red)' }}
        onMouseLeave={e => { const h = e.currentTarget.querySelector('h4') as HTMLElement; if (h) h.style.color = 'var(--ink)' }}>
        {img && <img src={img} alt={article.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <span style={{ color: catColor, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>{catName}</span>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, transition: 'color 0.2s' }}>{article.title}</h4>
          <span style={{ color: 'var(--muted-light)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{article.source_name}</span>
        </div>
      </div>
    </Link>
  )
}
