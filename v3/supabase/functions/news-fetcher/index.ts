import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || ''

const FEEDS = [
  'https://techcrunch.com/feed/',
  'https://venturebeat.com/feed/',
  'https://www.theverge.com/rss/index.xml',
  'https://openai.com/news/rss.xml',
  'https://blog.google/technology/ai/rss/',
  'https://www.reutersagency.com/feed/',
  'https://economictimes.indiatimes.com/news/economy/rssfeeds/1286551815.cms',
  'https://www.livemint.com/rss/news',
  'https://feeds.feedburner.com/ndtvnews-india-news',
  'https://timesofindia.indiatimes.com/rssfeeds/2950627.cms', // Hyderabad
  'https://economictimes.indiatimes.com/news/politics/rssfeeds/10527328.cms'
]

async function translateToTelugu(text: string) {
  if (!ANTHROPIC_API_KEY) return null
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Translate this news text to professional Telugu language. Return only the translated text, no other comments.\n\nText: ${text}`
        }]
      })
    })
    const data = await res.json()
    return data?.content?.[0]?.text || null
  } catch (err) {
    console.error('Translation error:', err)
    return null
  }
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  
  let saved = 0
  let skipped = 0

  for (const url of FEEDS) {
    try {
      const res = await fetch(url)
      const xml = await res.text()
      // Simple regex parser for titles/links/desc (since RSS/Atom vary)
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || xml.match(/<entry>([\s\S]*?)<\/entry>/g) || []
      
      for (const item of items.slice(0, 3)) {
        const title = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || item.match(/<title>([\s\S]*?)<\/thitle>/)?.[1] || ''
        const link = item.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/)?.[1] || item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || item.match(/href="([\s\S]*?)"/)?.[1] || ''
        const desc = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || item.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || ''
        
        if (!title || !link) continue

        // Check if exists
        const { data: existing } = await supabase.from('articles').select('id').eq('slug', link.split('/').pop()?.slice(0, 100)).single()
        if (existing) {
          skipped++
          continue
        }

        // Translate
        const titleTelugu = await translateToTelugu(title)
        const descTelugu = await translateToTelugu(desc.slice(0, 500))

        // Save
        const { error } = await supabase.from('articles').insert({
          title,
          title_telugu: titleTelugu,
          summary: desc.replace(/<[^>]*>/g, '').slice(0, 400),
          summary_telugu: descTelugu,
          slug: link.split('/').pop()?.slice(0, 100) || Math.random().toString(36).slice(2),
          source_url: link,
          source_name: url.split('/')[2],
          is_published: true,
          category_id: url.includes('ai') ? 1 : 2
        })

        if (!error) saved++
      }
    } catch (err) {
      console.error(`Feed ${url} failed:`, err)
    }
  }

  return new Response(JSON.stringify({ saved, skipped }), { headers: { 'Content-Type': 'application/json' } })
})
