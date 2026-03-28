import Navbar from '../components/Navbar'
import BreakingTicker from '../components/BreakingTicker'
import ArticleCard from '../components/ArticleCard'
import { getArticles, getBreakingNews } from '../lib/supabase'

const TRENDING = [
  'ChatGPT vs Claude: Which is better for Telugu content?',
  'NSE Nifty crosses 28,000 for first time',
  'ISRO launches AI-powered satellite tracking system',
  'TDP government unveils 100-day digital plan',
  'OpenAI opens Hyderabad office with 500 jobs',
]

export const revalidate = 60

export default async function Home() {
  const [articles, breaking] = await Promise.all([getArticles(20), getBreakingNews()])
  const hero = articles[0]
  const topStories = articles.slice(1, 6)
  const gridStories = articles.slice(1, 4)
  const aiStories = articles.filter(a => a.categories?.slug === 'ai').slice(0, 3)
  const bizStories = articles.filter(a => a.categories?.slug === 'business').slice(0, 2)
  const breakingTexts = breaking.length > 0 ? breaking.map(b => b.headline) : [
    'BREAKING: Anthropic releases Claude 4',
    'AI startup funding hits record $50B in Q1 2026',
    'Hyderabad emerges as top AI hub in South Asia',
    'SEBI introduces new rules for algorithmic trading',
  ]

  if (!hero) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'var(--font-display)' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Setting up Telugu News...</h2>
        <p style={{ color: 'var(--muted)' }}>Articles will appear here automatically.</p>
      </div>
    </>
  )

  return (
    <>
      <Navbar />
      <BreakingTicker items={breakingTexts} />
      <main style={{ background: 'var(--paper)' }}>

        {/* HERO */}
        <section style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px', paddingTop: '20px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }} className="hero-grid">
              <ArticleCard article={hero} size="hero" />
              <aside>
                <div style={{ borderTop: '3px solid var(--red)', paddingTop: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)' }}>Top Stories</span>
                </div>
                {topStories.map(a => <ArticleCard key={a.id} article={a} size="small" />)}
              </aside>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0 16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Latest News</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
        </div>

        {/* MAIN GRID */}
        <section style={{ paddingBottom: '40px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 280px', gap: '20px', alignItems: 'start' }} className="main-grid">
              {gridStories.map(a => <ArticleCard key={a.id} article={a} size="large" />)}
              <aside style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ borderTop: '3px solid var(--ink)', paddingTop: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trending</span>
                  </div>
                  {TRENDING.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                      <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--border)', fontFamily: 'var(--font-display)', lineHeight: 1, minWidth: '24px' }}>{i + 1}</span>
                      <span style={{ fontSize: '13px', fontFamily: 'var(--font-display)', lineHeight: 1.4 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--ink)', borderRadius: '4px', padding: '18px', color: '#fff' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>AI Daily Digest</div>
                  <p style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.6, marginBottom: '14px' }}>Top 5 stories every morning in Telugu & English.</p>
                  <input type="email" placeholder="Your email" style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', color: '#fff', fontSize: '13px', marginBottom: '8px', outline: 'none' }} />
                  <button style={{ width: '100%', padding: '8px', background: 'var(--red)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 700, borderRadius: '3px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Subscribe Free</button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* AI SECTION */}
        {aiStories.length > 0 && (
          <section style={{ background: 'var(--section-bg)', borderTop: '1px solid var(--border)', padding: '28px 0' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '4px', height: '22px', background: '#0057b7', borderRadius: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>AI & Technology</span>
                </div>
                <a href="/ai" style={{ fontSize: '12px', fontWeight: 600, color: '#0057b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View All →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }} className="ai-grid">
                {aiStories.map(a => <ArticleCard key={a.id} article={a} size="large" />)}
              </div>
            </div>
          </section>
        )}

        {/* BUSINESS SECTION */}
        {bizStories.length > 0 && (
          <section style={{ padding: '28px 0', borderTop: '1px solid var(--border)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '4px', height: '22px', background: '#1a6b2e', borderRadius: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Business & Markets</span>
                </div>
                <a href="/business" style={{ fontSize: '12px', fontWeight: 600, color: '#1a6b2e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View All →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }} className="biz-grid">
                {bizStories.map(a => <ArticleCard key={a.id} article={a} size="large" />)}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background: 'var(--ink)', color: '#aaa', padding: '36px 0 20px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Telugu News</div>
              <div style={{ fontFamily: 'var(--font-telugu)', fontSize: '13px', color: 'var(--gold)', marginBottom: '10px' }}>తెలుగు వార్తలు</div>
              <p style={{ fontSize: '12px', lineHeight: 1.7 }}>AI-powered news in Telugu and English. Serving AP, Telangana and the global Telugu community.</p>
            </div>
            {[
              { title: 'Sections', links: ['AI News', 'Business', 'Politics', 'Sports', 'World'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Advertise', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', marginBottom: '12px' }}>{col.title}</div>
                {col.links.map(l => <div key={l} style={{ fontSize: '13px', marginBottom: '6px', cursor: 'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span>© 2026 Telugu News. All rights reserved.</span>
            <span>Powered by Supabase + Next.js · Built with AI</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media(max-width:1024px){.hero-grid,.main-grid{grid-template-columns:1fr!important}.ai-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:768px){.ai-grid,.biz-grid{grid-template-columns:1fr!important}}
      `}</style>
    </>
  )
}
