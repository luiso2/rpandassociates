import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/layout/BackToTop'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { QuoteCartProvider } from '@/components/cart/QuoteCartProvider'
import { CartDrawerProvider } from '@/components/cart/CartDrawerContext'
import './globals.css'

const heading = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'RP & Associates — Custom Promotional Products & Marketing Solutions',
    template: '%s | RP & Associates',
  },
  description:
    'Custom design, manufacturing, warehousing & distribution of promotional products. Over 35 years serving major brands in hospitality, beverage, retail, sports, and healthcare.',
  metadataBase: new URL('https://rpandassociates.com'),
  openGraph: {
    title: 'RP & Associates — Custom Promotional Products',
    description:
      'Custom promotional products, packaging & distribution for major brands worldwide.',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/images/RP_Logo_Small.jpg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        <QuoteCartProvider>
          <CartDrawerProvider>
            <Header />
            {children}
            <Footer />
            <BackToTop />
            <ChatWidget />
          </CartDrawerProvider>
        </QuoteCartProvider>
      </body>
    </html>
  )
}
