import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { runInstagramScraper } from './scraper'
import { processWithMistral, synthesizeArticle } from './mistral'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// Cron Trigger (for Render Cron Jobs or GitHub Actions)
app.get('/api/cron/scrape', async (req, res) => {
  const auth = req.headers.authorization
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) return res.status(401).json({ error: 'Unauthorized' })
  
  try {
    const result = await runInstagramScraper()
    res.json({ success: true, ...result })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// Manual Scrape Trigger (Admin Portal)
app.post('/api/backend/scrape', async (req, res) => {
  const { secret } = req.body
  if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' })
  
  try {
    const result = await runInstagramScraper()
    res.json({ success: true, ...result })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// AI Processing & Synthesis Endpoints
app.post('/api/backend/ai-process', async (req, res) => {
  const { prompt, context, secret } = req.body
  if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const result = await processWithMistral(prompt, context)
    res.json({ success: true, result })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/backend/synthesize', async (req, res) => {
  const { content, secret } = req.body
  if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const result = await synthesizeArticle(content)
    res.json({ success: true, result })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Telugu News Render Backend live on port ${PORT}`))
