'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase, Article, ReporterSubmission } from '../../lib/supabase'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'telugu-news-admin-2026'

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: '#1a1a2e', border: `1px solid ${color}40`, borderRadius: 8, padding: '16px 20px' }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<'dashboard' | 'articles' | 'breaking' | 'submissions' | 'ai-writer'>('dashboard')
  const [articles, setArticles] = useState<Article[]>([])
  const [submissions, setSubmissions] = useState<ReporterSubmission[]>([])
  const [breaking, setBreaking] = useState<any[]>([])
  const [stats, setStats] = useState({ articles: 0, breaking: 0, submissions: 0, categories: 0 })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [newBreaking, setNewBreaking] = useState('')
  const [fetchResult, setFetchResult] = useState('')
  const [editArticle, setEditArticle] = useState<Article | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [a, b, s, c] = await Promise.all([
      supabase.from('articles').select('*, categories(name,slug,color)').order('published_at', { ascending: false }).limit(50),
      supabase.from('breaking_news').select('*').order('created_at', { ascending: false }),
      supabase.from('reporter_submissions').select('*').order('submitted_at', { ascending: false }).limit(50),
      supabase.from('categories').select('id'),
    ])
    setArticles((a.data || []) as Article[])
    setBreaking(b.data || [])
    setSubmissions((s.data || []) as ReporterSubmission[])
    setStats({ articles: a.data?.length || 0, breaking: b.data?.length || 0, submissions: s.data?.filter(x => x.status === 'pending').length || 0, categories: c.data?.length || 0 })
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function triggerFetch() {
    setFetchResult('Fetching news...')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/news-fetcher`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
      })
      const data = await res.json()
      setFetchResult(`✅ Done! Saved: ${data.saved || 0} | Skipped: ${data.skipped || 0}`)
      loadData()
    } catch (e: any) {
      setFetchResult(`❌ Error: ${e.message}`)
    }
  }

  async function togglePublish(article: Article) {
    await supabase.from('articles').update({ is_published: !article.is_published }).eq('id', article.id)
    setMsg(`Article ${!article.is_published ? 'published' : 'unpublished'}`)
    loadData()
    setTimeout(() => setMsg(''), 3000)
  }

  async function toggleBreaking(article: Article) {
    await supabase.from('articles').update({ is_breaking: !article.is_breaking }).eq('id', article.id)
    loadData()
  }

  async function deleteArticle(id: number) {
    if (!confirm('Delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    loadData()
  }

  async function addBreakingNews() {
    if (!newBreaking.trim()) return
    await supabase.from('breaking_news').insert({ headline: newBreaking, is_active: true })
    setNewBreaking('')
    loadData()
    setMsg('Breaking news added!')
    setTimeout(() => setMsg(''), 3000)
  }

  async function toggleBreakingNews(id: number, active: boolean) {
    await supabase.from('breaking_news').update({ is_active: !active }).eq('id', id)
    loadData()
  }

  async function approveSubmission(sub: ReporterSubmission) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'telugu').single()
    await supabase.from('articles').insert({
      title: sub.title,
      summary: sub.content.slice(0, 300),
      content: sub.content,
      slug: sub.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 70) + '-' + Date.now().toString(36),
      source_name: `Reporter: ${sub.reporter_name} (${sub.reporter_location})`,
      is_published: true,
      category_id: cat?.id || null,
    })
    await supabase.from('reporter_submissions').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', sub.id)
    loadData()
    setMsg('✅ Submission approved and published!')
    setTimeout(() => setMsg(''), 4000)
  }

  async function rejectSubmission(id: number) {
    await supabase.from('reporter_submissions').update({ status: 'rejected' }).eq('id', id)
    loadData()
  }

  async function runAI() {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiResult('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_KEY || '', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{ role: 'user', content: aiPrompt }]
        })
      })
      const data = await res.json()
      setAiResult(data?.content?.[0]?.text || 'No response')
    } catch (e: any) {
      setAiResult('Error: ' + e.message)
    }
    setAiLoading(false)
  }

  const tabStyle = (t: string) => ({
    padding: '10px 20px', background: tab === t ? '#C8102E' : 'transparent',
    color: tab === t ? '#fff' : '#aaa', border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 600, borderRadius: 6, transition: 'all 0.2s',
  })

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#0a0a15', borderBottom: '1px solid #1a1a2e', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#C8102E', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>ADMIN</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#D4AF37' }}>Telugu News Control Panel</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {msg && <span style={{ background: '#1a3a1a', color: '#4ade80', padding: '4px 12px', borderRadius: 4, fontSize: 12 }}>{msg}</span>}
          <button onClick={triggerFetch} style={{ background: '#1a3a1a', color: '#4ade80', border: '1px solid #4ade8040', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            Fetch News Now
          </button>
          <a href="/" target="_blank" style={{ background: '#1a1a3a', color: '#60a5fa', border: '1px solid #60a5fa40', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
            View Site
          </a>
        </div>
      </div>

      {fetchResult && (
        <div style={{ background: '#0a1a0a', borderBottom: '1px solid #1a2a1a', padding: '8px 24px', fontSize: 12, color: '#4ade80' }}>{fetchResult}</div>
      )}

      {/* Tabs */}
      <div style={{ background: '#0a0a15', borderBottom: '1px solid #1a1a2e', padding: '8px 24px', display: 'flex', gap: 4 }}>
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'articles', label: `Articles (${stats.articles})` },
          { key: 'breaking', label: `Breaking News (${stats.breaking})` },
          { key: 'submissions', label: `Reporter Submissions (${stats.submissions})` },
          { key: 'ai-writer', label: 'AI Writer' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={tabStyle(t.key)}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {loading && <div style={{ color: '#888', textAlign: 'center', padding: 40 }}>Loading...</div>}

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && !loading && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
              <StatCard label="Total Articles" value={stats.articles} color="#60a5fa" />
              <StatCard label="Breaking News" value={stats.breaking} color="#C8102E" />
              <StatCard label="Pending Submissions" value={stats.submissions} color="#D4AF37" />
              <StatCard label="Categories" value={stats.categories} color="#4ade80" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Latest articles */}
              <div style={{ background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 8, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Latest Articles</h3>
                {articles.slice(0, 8).map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a1a2e' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.4 }}>{a.title.slice(0, 60)}...</div>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>{a.source_name} · {a.categories?.name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: a.is_published ? '#1a3a1a' : '#3a1a1a', color: a.is_published ? '#4ade80' : '#f87171' }}>
                        {a.is_published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pending submissions */}
              <div style={{ background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 8, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Pending Submissions</h3>
                {submissions.filter(s => s.status === 'pending').slice(0, 5).map(s => (
                  <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid #1a1a2e' }}>
                    <div style={{ fontSize: 13, color: '#fff' }}>{s.title.slice(0, 60)}...</div>
                    <div style={{ fontSize: 11, color: '#D4AF37', marginTop: 3 }}>{s.reporter_name} · {s.reporter_location}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => approveSubmission(s)} style={{ padding: '4px 12px', background: '#1a3a1a', color: '#4ade80', border: '1px solid #4ade8040', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Approve & Publish</button>
                      <button onClick={() => rejectSubmission(s.id)} style={{ padding: '4px 12px', background: '#3a1a1a', color: '#f87171', border: '1px solid #f8717140', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Reject</button>
                    </div>
                  </div>
                ))}
                {submissions.filter(s => s.status === 'pending').length === 0 && <p style={{ color: '#666', fontSize: 13 }}>No pending submissions</p>}
              </div>
            </div>
          </div>
        )}

        {/* ARTICLES TAB */}
        {tab === 'articles' && !loading && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>All Articles</h2>
            </div>
            <div style={{ background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0d0d1a' }}>
                    {['Title', 'Category', 'Source', 'Status', 'Breaking', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1a1a2e' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, maxWidth: 300 }}>
                        <div style={{ color: '#fff', lineHeight: 1.4 }}>{a.title.slice(0, 70)}{a.title.length > 70 ? '...' : ''}</div>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>{new Date(a.published_at).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, background: '#1a1a3a', color: '#60a5fa' }}>{a.categories?.name || 'None'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#888' }}>{a.source_name.slice(0, 20)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => togglePublish(a)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 3, background: a.is_published ? '#1a3a1a' : '#3a1a1a', color: a.is_published ? '#4ade80' : '#f87171', border: 'none', cursor: 'pointer' }}>
                          {a.is_published ? 'Live' : 'Draft'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => toggleBreaking(a)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 3, background: a.is_breaking ? '#3a1a0a' : '#1a1a1a', color: a.is_breaking ? '#fb923c' : '#555', border: 'none', cursor: 'pointer' }}>
                          {a.is_breaking ? 'Breaking' : 'Normal'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <a href={`/article/${a.slug}`} target="_blank" style={{ fontSize: 11, padding: '3px 8px', background: '#1a1a3a', color: '#60a5fa', borderRadius: 3 }}>View</a>
                          <button onClick={() => deleteArticle(a.id)} style={{ fontSize: 11, padding: '3px 8px', background: '#3a1a1a', color: '#f87171', border: 'none', borderRadius: 3, cursor: 'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BREAKING NEWS TAB */}
        {tab === 'breaking' && !loading && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Breaking News Ticker</h2>
            <div style={{ background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, color: '#aaa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Breaking News</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={newBreaking} onChange={e => setNewBreaking(e.target.value)}
                  placeholder="Enter breaking news headline..."
                  onKeyDown={e => e.key === 'Enter' && addBreakingNews()}
                  style={{ flex: 1, padding: '10px 14px', background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: 6, color: '#fff', fontSize: 13, outline: 'none' }} />
                <button onClick={addBreakingNews} style={{ padding: '10px 20px', background: '#C8102E', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Add</button>
              </div>
            </div>
            <div style={{ background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 8, overflow: 'hidden' }}>
              {breaking.map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #1a1a2e' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#fff' }}>{b.headline}</div>
                    {b.headline_telugu && <div style={{ fontSize: 12, color: '#D4AF37', marginTop: 4 }}>{b.headline_telugu}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                    <button onClick={() => toggleBreakingNews(b.id, b.is_active)} style={{ padding: '5px 14px', background: b.is_active ? '#1a3a1a' : '#3a1a1a', color: b.is_active ? '#4ade80' : '#f87171', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                      {b.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              ))}
              {breaking.length === 0 && <p style={{ color: '#666', fontSize: 13, padding: 20 }}>No breaking news entries</p>}
            </div>
          </div>
        )}

        {/* REPORTER SUBMISSIONS TAB */}
        {tab === 'submissions' && !loading && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Reporter Submissions</h2>
            {submissions.map(s => (
              <div key={s.id} style={{ background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 8, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.title}</h3>
                    <div style={{ fontSize: 12, color: '#D4AF37' }}>{s.reporter_name} · {s.reporter_location} · {s.reporter_phone}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 3, background: s.status === 'pending' ? '#3a2a0a' : s.status === 'approved' ? '#1a3a1a' : '#3a1a1a', color: s.status === 'pending' ? '#fb923c' : s.status === 'approved' ? '#4ade80' : '#f87171' }}>
                    {s.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 12 }}>{s.content.slice(0, 300)}{s.content.length > 300 ? '...' : ''}</p>
                {s.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => approveSubmission(s)} style={{ padding: '8px 20px', background: '#1a3a1a', color: '#4ade80', border: '1px solid #4ade8040', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Approve & Publish</button>
                    <button onClick={() => rejectSubmission(s.id)} style={{ padding: '8px 20px', background: '#3a1a1a', color: '#f87171', border: '1px solid #f8717140', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Reject</button>
                  </div>
                )}
              </div>
            ))}
            {submissions.length === 0 && <p style={{ color: '#666' }}>No submissions yet</p>}
          </div>
        )}

        {/* AI WRITER TAB */}
        {tab === 'ai-writer' && (
          <div style={{ maxWidth: 800 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>AI Writing Studio</h2>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>Use Claude AI to write articles, translate to Telugu, generate headlines, or summarize news.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Write Article', prompt: 'Write a detailed news article about: [topic]. Include what happened, key details, impact on India/Telugu community, and a conclusion.' },
                { label: 'Translate to Telugu', prompt: 'Translate this news article to Telugu language:\n\n[paste article here]' },
                { label: 'Generate Headline', prompt: 'Generate 5 catchy news headlines for this story:\n\n[paste story here]' },
                { label: 'Summarize News', prompt: 'Summarize this news article in 3 sentences in simple English, then 3 sentences in Telugu:\n\n[paste article here]' },
                { label: 'SEO Meta Description', prompt: 'Write an SEO meta description (max 160 chars) for this news article:\n\n[paste article here]' },
                { label: 'Social Media Post', prompt: 'Write a Twitter/Facebook post in Telugu and English for this news:\n\n[paste article here]' },
              ].map(t => (
                <button key={t.label} onClick={() => setAiPrompt(t.prompt)} style={{ padding: '10px 14px', background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 6, color: '#60a5fa', cursor: 'pointer', fontSize: 12, textAlign: 'left', fontWeight: 500 }}>
                  {t.label}
                </button>
              ))}
            </div>
            <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              placeholder="Type your prompt here or click a template above..."
              rows={6} style={{ width: '100%', padding: '14px', background: '#0a0a15', border: '1px solid #1a1a2e', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: 12 }} />
            <button onClick={runAI} disabled={aiLoading} style={{ padding: '12px 28px', background: aiLoading ? '#555' : '#C8102E', color: '#fff', border: 'none', borderRadius: 6, cursor: aiLoading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
              {aiLoading ? 'Generating...' : 'Generate with Claude AI'}
            </button>
            {aiResult && (
              <div style={{ background: '#0a0a15', border: '1px solid #1a3a1a', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Response</span>
                  <button onClick={() => { navigator.clipboard.writeText(aiResult); setMsg('Copied!'); setTimeout(() => setMsg(''), 2000) }}
                    style={{ padding: '4px 12px', background: '#1a1a3a', color: '#60a5fa', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Copy</button>
                </div>
                <pre style={{ color: '#ccc', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{aiResult}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
