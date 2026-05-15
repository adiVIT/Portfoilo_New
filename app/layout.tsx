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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon_new.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon_new.png',
    apple: '/favicon_new.png',
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
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
