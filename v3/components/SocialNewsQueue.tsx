'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const BACKEND_URL = process.env.NEXT_PUBLIC_RENDER_BACKEND_URL || 'http://localhost:3001'
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'telugu-news-admin-2026'

export default function SocialNewsQueue() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function loadPosts() {
    const { data } = await supabase.from('social_posts').select('*').eq('status', 'pending').order('scraped_at', { ascending: false })
    setPosts(data || [])
  }

  useEffect(() => { loadPosts() }, [])

  async function processPostWithAI(post: any) {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/backend/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: post.content, secret: ADMIN_SECRET })
      })
      const data = await res.json()
      if (data.success) {
        // Synthesize data into an article
        const { error } = await supabase.from('articles').insert({
          title: `AI Synthesized: ${post.author_handle}`,
          summary: data.result.slice(0, 300),
          content: data.result,
          slug: `insta-${post.platform_id}-${Date.now().toString(36)}`,
          source_name: post.author_handle,
          source_platform: 'instagram',
          raw_social_id: post.platform_id,
          cover_image_url: post.media_url,
          is_published: true
        })
        if (!error) {
          await supabase.from('social_posts').update({ status: 'processed', processed_at: new Date().toISOString() }).eq('id', post.id)
          loadPosts()
        }
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function rejectPost(id: number) {
    await supabase.from('social_posts').update({ status: 'rejected' }).eq('id', id)
    loadPosts()
  }

  return (
    <div style={{ background: '#0a0a15', padding: '32px', borderRadius: '8px', border: '1px solid #1a1a2e' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '24px', color: '#D4AF37' }}>Social Review Queue (Insta Scraper)</h2>
      {posts.length === 0 && <p style={{ color: '#888' }}>Queue is empty. Posts from @vaibhavsisinty @techsixty etc will appear here.</p>}
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ background: '#0d0d1a', padding: '20px', borderRadius: '8px', border: '1px solid #1a1a2e', display: 'flex', gap: '20px' }}>
            {post.media_url && (
              <img src={post.media_url} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, color: '#60a5fa' }}>@{post.author_handle}</span>
                <span style={{ fontSize: '11px', color: '#666' }}>{new Date(post.scraped_at).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.5, marginBottom: '16px' }}>{post.content}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => processPostWithAI(post)} disabled={loading} style={{ padding: '8px 16px', background: '#1a3a1a', color: '#4ade80', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  {loading ? 'PROCESSING...' : 'PROCESS WITH MISTRAL AI'}
                </button>
                <button onClick={() => rejectPost(post.id)} style={{ padding: '8px 16px', background: '#3a1a1a', color: '#f87171', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>REJECT</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
