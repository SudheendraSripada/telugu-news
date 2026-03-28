'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const BACKEND_URL = process.env.NEXT_PUBLIC_RENDER_BACKEND_URL || 'http://localhost:3001'
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'telugu-news-admin-2026'

export default function LocalNewsEditor() {
  const [form, setForm] = useState({
    title: '', title_telugu: '', summary: '', summary_telugu: '',
    content: '', category_id: 1, is_breaking: false
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleAIWriter() {
    if (!form.content) return alert('Add some content first!')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/backend/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: form.content, secret: ADMIN_SECRET })
      })
      const data = await res.json()
      if (data.success) {
        setMsg('✨ AI suggested headlines and summaries!')
        // Expecting data.result to be parsed or raw text. For now, we show it.
        console.log('AI Result:', data.result)
        // In a real app, parse data.result and update state
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 70) + '-' + Date.now().toString(36)
    
    const { error } = await supabase.from('articles').insert({
      ...form, slug, source_name: 'Admin Manual', source_platform: 'manual', is_published: true, published_at: new Date().toISOString()
    })

    if (!error) {
      setMsg('✅ Article published successfully!')
      setForm({ title: '', title_telugu: '', summary: '', summary_telugu: '', content: '', category_id: 1, is_breaking: false })
    } else { setMsg(`❌ Error: ${error.message}`) }
    setLoading(false)
    setTimeout(() => setMsg(''), 5000)
  }

  return (
    <div style={{ background: '#0a0a15', padding: '32px', borderRadius: '8px', border: '1px solid #1a1a2e' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', color: '#D4AF37' }}>Local News Editor</h2>
        <button type="button" onClick={handleAIWriter} disabled={loading} style={aiBtnStyle}>
          {loading ? 'Thinking...' : '✨ USE MISTRAL AI ASSISTANT'}
        </button>
      </header>

      {msg && <div style={{ background: '#1a3a1a', color: '#4ade80', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{msg}</div>}
      
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Headline (English) *</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Headline (Telugu) *</label>
          <input required value={form.title_telugu} onChange={e => setForm({ ...form, title_telugu: e.target.value })} className="telugu" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Summary (English)</label>
          <textarea rows={3} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Summary (Telugu)</label>
          <textarea rows={3} value={form.summary_telugu} onChange={e => setForm({ ...form, summary_telugu: e.target.value })} className="telugu" style={inputStyle} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Main Content / Body</label>
          <textarea rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={btnStyle}>PUBLISH ARTICLE</button>
      </form>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.05em' }
const inputStyle = { width: '100%', padding: '12px', background: '#0d0d1a', border: '1px solid #1a1a2e', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '14px' }
const btnStyle = { gridColumn: 'span 2', padding: '14px', background: '#C8102E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }
const aiBtnStyle = { background: '#1a1a3a', color: '#60a5fa', border: '1px solid #60a5fa40', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }
