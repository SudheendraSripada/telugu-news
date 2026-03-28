import { createClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(URL, KEY)

export type Article = {
  id: number
  title: string
  title_telugu: string
  summary: string
  summary_telugu: string
  content: string
  slug: string
  source_url: string
  source_name: string
  cover_image_url: string
  is_breaking: boolean
  is_published: boolean
  category_id: number
  published_at: string
  categories?: { name: string; slug: string; color: string }
}

export type BreakingNews = {
  id: number
  headline: string
  headline_telugu: string
  link_url: string
  is_active: boolean
}

export type ReporterSubmission = {
  id: number
  reporter_name: string
  reporter_phone: string
  reporter_location: string
  title: string
  content: string
  status: string
  submitted_at: string
}

export async function getArticles(limit = 20) {
  const { data } = await supabase
    .from('articles')
    .select('*, categories(name,slug,color)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  return (data || []) as Article[]
}

export async function getArticlesByCategory(slug: string, limit = 12) {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', slug).single()
  if (!cat) return []
  const { data } = await supabase
    .from('articles')
    .select('*, categories(name,slug,color)')
    .eq('category_id', cat.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  return (data || []) as Article[]
}

export async function getArticleBySlug(slug: string) {
  const { data } = await supabase
    .from('articles')
    .select('*, categories(name,slug,color)')
    .eq('slug', slug)
    .single()
  return data as Article | null
}

export async function getBreakingNews() {
  const { data } = await supabase
    .from('breaking_news')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(10)
  return (data || []) as BreakingNews[]
}
