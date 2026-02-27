import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RP & Associates - Custom Promotional Products & Marketing Solutions',
  description: 'Custom design, manufacturing, warehousing & distribution of promotional products. Over 25 years of experience serving major brands.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
