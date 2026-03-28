import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions'

export async function processWithMistral(prompt: string, context: string = '') {
  if (!MISTRAL_API_KEY) {
    console.warn('MISTRAL_API_KEY is missing. Returning placeholder.')
    return `[Mistral AI Placeholder] Processing: ${prompt.slice(0, 50)}...`
  }

  try {
    const response = await axios.post(MISTRAL_URL, {
      model: 'mistral-medium-latest',
      messages: [
        {
          role: 'system',
          content: 'You are the Telugu News AI Editor. You specialize in summarizing tech news and providing perfect Telugu translations. Return clear, punchy news content.'
        },
        { role: 'user', content: `${prompt}\n\nContext: ${context}` }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${MISTRAL_API_KEY}`, 'Content-Type': 'application/json' }
    })

    return response.data.choices[0].message.content
  } catch (err: any) {
    console.error('Mistral error:', err.response?.data || err.message)
    return `AI Processing Error: ${err.message}`
  }
}

// Specialized function for article synthesis
export async function synthesizeArticle(rawContent: string) {
  const prompt = `Synthesize a news article from this raw data. Provide:
  1. English Headline
  2. Telugu Headline
  3. English Summary (2 sentences)
  4. Telugu Summary (2 sentences)
  5. Full Content (3-4 paragraphs in English)
  
  Raw Data: ${rawContent}`

  return await processWithMistral(prompt)
}
