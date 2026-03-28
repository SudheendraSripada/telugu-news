'use client'
import { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import { supabase, Article } from '../../../lib/supabase'
import LocalNewsEditor from '../../../components/LocalNewsEditor'
import SocialNewsQueue from '../../../components/SocialNewsQueue'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, drafts: 0, socialPending: 0 })
  const [activeTab, setActiveTab] = useState<'overview' | 'local' | 'social'>('overview')

  useEffect(() => {
    async function loadStats() {
      const [art, social] = await Promise.all([
        supabase.from('articles').select('is_published'),
        supabase.from('social_posts').select('status').eq('status', 'pending')
      ])
      setStats({
        total: art.data?.length || 0,
        drafts: art.data?.filter(a => !a.is_published).length || 0,
        socialPending: social.data?.length || 0
      })
    }
    loadStats()
  }, [])

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '40px' }}>
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Admin Portal</h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Manage news, scrapers, and AI settings.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ background: '#1a1a3a', color: '#60a5fa', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>PRIVATE STATUS: ONLINE</span>
          </div>
        </header>

        <nav style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #1a1a2e', paddingBottom: '12px' }}>
          {['overview', 'local', 'social'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} style={{
              background: activeTab === t ? '#C8102E' : 'transparent',
              color: activeTab === t ? '#fff' : '#aaa',
              border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, textTransform: 'uppercase'
            }}>{t}</button>
          ))}
        </nav>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={statBox}>
              <div style={statLabel}>Total Articles</div>
              <div style={statValue}>{stats.total}</div>
            </div>
            <div style={statBox}>
              <div style={statLabel}>Drafts/Pending</div>
              <div style={statValue}>{stats.drafts}</div>
            </div>
            <div style={statBox}>
              <div style={statLabel}>Social Queue</div>
              <div style={statValue}>{stats.socialPending}</div>
            </div>
          </div>
        )}

        {activeTab === 'local' && <LocalNewsEditor />}
        {activeTab === 'social' && <SocialNewsQueue />}
      </div>
    </div>
  )
}

const statBox = { background: '#1a1a2e', padding: '24px', borderRadius: '8px', border: '1px solid #1a1a2e' }
const statLabel = { fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }
const statValue = { fontSize: '32px', fontWeight: 700, color: '#D4AF37' }
