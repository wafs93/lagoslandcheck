import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LagosLandCheck — Verify Lagos Land Before You Buy',
  description: 'AI-powered pre-screening tool for Lagos land verification. Check gazette acquisitions, flood risk, fraud zones, litigation, LUC status and satellite imagery in under 2 minutes.',
  keywords: 'Lagos land verification, property check Nigeria, gazette acquisition, land fraud Lagos, diaspora property Nigeria',
  openGraph: {
    title: 'LagosLandCheck',
    description: 'Verify Lagos land before you lose a kobo.',
    url: 'https://lagoslandcheck.com',
    siteName: 'LagosLandCheck',
    locale: 'en_NG',
    type: 'website',
  },
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
