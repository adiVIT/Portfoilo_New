import type { Metadata } from 'next'
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
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
