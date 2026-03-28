'use client'
import { useState } from 'react'
import Navbar from '../../components/Navbar'

const CITIES = [
  'Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Warangal', 
  'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 
  'Nizamabad', 'Anantapur', 'Karimnagar', 'Ramagundam', 'Khammam'
]

export default function ReporterPage() {
  const [form, setForm] = useState({ name: '', phone: '', city: 'Hyderabad', title: '', content: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/reporter-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporter_name: form.name,
          reporter_phone: form.phone,
          reporter_location: form.city,
          title: form.title,
          content: form.content
        })
      })
      if (res.ok) setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (submitted) return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '40px', background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
        <h2 className="telugu" style={{ color: 'var(--red)', marginBottom: '16px', fontSize: '24px' }}>ధన్యవాదాలు!</h2>
        <p className="telugu" style={{ fontSize: '18px', color: 'var(--ink)', lineHeight: 1.6 }}>మీ వార్త విజయవంతంగా పంపబడింది. మా ఎడిటర్లు దీనిని సమీక్షించి త్వరలో ప్రచురిస్తారు.</p>
        <button onClick={() => window.location.href = '/'} style={{ marginTop: '30px', padding: '12px 24px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Back to Home</button>
      </div>
    </>
  )

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--paper)', minHeight: 'calc(100vh - 100px)', paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ background: 'var(--white)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ borderLeft: '4px solid var(--red)', paddingLeft: '20px', marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)' }}>Reporter Submission Portal</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>Submit local news and updates directly to the Telugu News editorial team.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--muted)' }}>Your Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--muted)' }}>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--muted)' }}>Location / City *</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none', background: 'white' }}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--muted)' }}>News Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--muted)' }}>Description / Full Content *</label>
                <textarea required rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none', fontFamily: 'inherit' }} />
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '16px', letterSpacing: '0.05em' }}>
                {loading ? 'SUBMITTING...' : 'SUBMIT NEWS'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
