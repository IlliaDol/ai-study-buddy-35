import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Кавомант - Пророцтва з кавової гущі',
  description: 'Завантаж фото кавової гущі та отримай персоналізоване пророцтво на день. AI-powered coffee reading app.',
  keywords: 'кава, пророцтва, гуща, тассеографія, AI, розваги',
  authors: [{ name: 'KAWA Team' }],
  openGraph: {
    title: 'Кавомант - Пророцтва з кавової гущі',
    description: 'AI-powered coffee reading app',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" className={`${inter.variable} ${crimsonText.variable}`}>
      <body className={`${inter.className} bg-gradient-to-br from-cream-50 to-coffee-50 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
