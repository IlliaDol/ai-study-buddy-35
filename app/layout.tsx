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
  title: 'CoffeeOracle - AI-Powered Coffee Ground Divination',
  description: 'Discover your future through the ancient art of coffee ground reading. Upload a photo and receive personalized prophecies powered by AI. Entertainment only - not medical or financial advice.',
  keywords: 'coffee reading, coffee ground divination, tasseography, AI prophecy, mystical app, coffee oracle, fortune telling, daily guidance',
  authors: [{ name: 'CoffeeOracle Team' }],
  creator: 'CoffeeOracle',
  publisher: 'CoffeeOracle',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://coffeeoracle.org',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'CoffeeOracle - AI-Powered Coffee Ground Divination',
    description: 'Discover your future through the ancient art of coffee ground reading. Get personalized prophecies powered by AI.',
    url: 'https://coffeeoracle.org',
    siteName: 'CoffeeOracle',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://coffeeoracle.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CoffeeOracle - Mystical Coffee Ground Divination',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoffeeOracle - AI-Powered Coffee Ground Divination',
    description: 'Discover your future through the ancient art of coffee ground reading. Get personalized prophecies powered by AI.',
    images: ['https://coffeeoracle.org/og-image.jpg'],
    creator: '@coffeeoracle',
    site: '@coffeeoracle',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <body className={`${inter.className} bg-gradient-to-br from-cream-50 to-coffee-50 min-h-screen`} suppressHydrationWarning={true}>
        {/* ⚠️ This is entertainment, not medical or financial advice */}
        <div style={{ display: 'none' }} aria-hidden="true">
          ⚠️ This is entertainment, not medical or financial advice
        </div>
        {children}
      </body>
    </html>
  )
}
