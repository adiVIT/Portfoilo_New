import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aditya Bajaj | Product Engineer & Founder-Minded Builder',
  description: 'Android Developer at PhonePe. I build products that are useful, thoughtful, and strong enough to survive outside demo videos.',
  keywords: ['Aditya Bajaj', 'Product Engineer', 'Founder', 'Android Developer', 'PhonePe', 'Restro AI', 'AI Products', 'Next.js', 'Kotlin'],
  authors: [{ name: 'Aditya Bajaj' }],
  creator: 'Aditya Bajaj',
  openGraph: {
    title: 'Aditya Bajaj | Product Engineer & Founder-Minded Builder',
    description: 'A product engineer with founder instincts, Android depth, and a taste for building things people actually use.',
    url: 'https://adityabajaj.me',
    siteName: 'Aditya Bajaj',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Bajaj | Product Engineer & Founder-Minded Builder',
    description: 'Android Developer at PhonePe. Building useful products with care, speed, and taste.',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon_new.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon_new.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon_new.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon_new.png',
    apple: [
      { url: '/favicon_new.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/favicon_new.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/favicon_new.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-50YY4S6JDH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-50YY4S6JDH');
          `}
        </Script>
        
        {children}
        <Analytics />
      </body>
    </html>
  )
}
