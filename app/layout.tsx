import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://adityabajaj.me'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aditya Bajaj',
  url: siteUrl,
  image: `${siteUrl}/favicon_new.png`,
  jobTitle: 'Android Developer and Product Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'PhonePe',
  },
  description:
    'Aditya Bajaj is an Android developer at PhonePe and a product-minded software builder working across fintech, AI products, mobile apps, and restaurant technology.',
  sameAs: [
    'https://www.linkedin.com/in/aditya-bajaj-6128811b6/',
    'https://github.com/adiVIT',
    'https://restro-ai.com',
  ],
  knowsAbout: [
    'Android development',
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
      'The personal portfolio of Aditya Bajaj, an Android developer, product engineer, and independent builder.',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Aditya Bajaj',
  title: 'Aditya Bajaj - Building thoughtful software',
  description:
    'Aditya Bajaj is an Android developer at PhonePe and a product-minded software builder working on fintech, AI tools, mobile apps, and Restro AI.',
  keywords: [
    'Aditya Bajaj',
    'Aditya Bajaj portfolio',
    'Android developer PhonePe',
    'Product engineer India',
    'Kotlin Android developer',
    'fintech product engineer',
    'AI product builder',
    'Restro AI founder',
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
    title: 'Aditya Bajaj - Building thoughtful software',
    description:
      'Android developer at PhonePe, product engineer, and independent builder working across fintech, AI tools, mobile apps, and Restro AI.',
    url: siteUrl,
    siteName: 'Aditya Bajaj',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Bajaj - Building thoughtful software',
    description:
      'Android developer at PhonePe and product-minded builder working on fintech, AI tools, mobile apps, and Restro AI.',
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
