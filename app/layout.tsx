import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import './experience.css'

const siteUrl = 'https://adityabajaj.online'

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aditya Bajaj',
  url: siteUrl,
  image: `${siteUrl}/images/aditya-portrait.webp`,
  jobTitle: 'Cofounder of Restro AI and Mobile Product Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Synthiolabs',
  },
  description:
    'Aditya Bajaj is the cofounder of Restro AI and builds across mobile, AI, and the web. Explore his projects, experiments, and the person behind them.',
  sameAs: [
    'https://www.linkedin.com/in/aditya-bajaj-6128811b6/',
    'https://github.com/adiVIT',
  ],
  knowsAbout: [
    'Mobile development',
    'Kotlin',
    'Product engineering',
    'Fintech products',
    'AI products',
    'Next.js',
    'TypeScript',
    'Restaurant software',
    'Mobile user experience',
  ],
  owns: {
    '@type': 'WebSite',
    name: 'Aditya Bajaj',
    url: siteUrl,
    description:
      'The personal portfolio of Aditya Bajaj, a mobile product engineer and cofounder of Restro AI.',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Aditya Bajaj',
  title: 'Aditya Bajaj — Code, products & a human side',
  description:
    'Aditya Bajaj is the cofounder of Restro AI and builds across mobile, AI, and the web. Projects, experiments, and the person behind them.',
  keywords: [
    'Aditya Bajaj',
    'Aditya Bajaj portfolio',
    'Aditya Bajaj Synthiolabs',
    'Product engineer India',
    'Kotlin mobile developer',
    'fintech product engineer',
    'AI product builder',
    'Next.js developer',
    'TypeScript developer',
    'mobile app developer',
  ],
  authors: [{ name: 'Aditya Bajaj' }],
  creator: 'Aditya Bajaj',
  publisher: 'Aditya Bajaj',
  category: 'personal portfolio',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Aditya Bajaj — Code, products & a human side',
    description:
      'Aditya Bajaj is the cofounder of Restro AI and builds across mobile, AI, and the web. Projects, experiments, and the person behind them.',
    url: siteUrl,
    siteName: 'Aditya Bajaj',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Bajaj — Code, products & a human side',
    description:
      'Aditya Bajaj is the cofounder of Restro AI and builds across mobile, AI, and the web. Projects, experiments, and the person behind them.',
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

export const viewport: Viewport = {
  themeColor: '#10110f',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${jetbrainsMono.variable} dark`}>
      <body className="antialiased">
        <Script
          id="person-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

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
