import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aditya Bajaj Portfolio',
  description: 'Builder of things that don\'t break. Maker of ideas that actually ship. Full-stack developer with 3+ years of experience in Android, web development, and startup projects.',
  keywords: ['Aditya Bajaj', 'Portfolio', 'Full Stack Developer', 'Android Developer', 'React', 'Next.js', 'Flutter', 'Kotlin', 'Java'],
  authors: [{ name: 'Aditya Bajaj' }],
  creator: 'Aditya Bajaj',
  openGraph: {
    title: 'Aditya Bajaj Portfolio',
    description: 'Builder of things that don\'t break. Maker of ideas that actually ship.',
    url: 'https://adityabajaj.dev',
    siteName: 'Aditya Bajaj Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Bajaj Portfolio',
    description: 'Builder of things that don\'t break. Maker of ideas that actually ship.',
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
