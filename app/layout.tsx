import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Telugu News | తెలుగు వార్తలు',
  description: 'Breaking AI & Business news in Telugu and English. Latest updates from Andhra Pradesh, Telangana and the world.',
  keywords: 'Telugu news, AI news, business news, Andhra Pradesh, Telangana, తెలుగు వార్తలు',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="te" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
