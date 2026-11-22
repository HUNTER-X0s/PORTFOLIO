import type { Metadata, Viewport } from 'next'
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import '@/app/globals.css'
import {
  blogItemListSchema,
  faqSchema,
  generateMetadata,
  personSchema,
  profilePageSchema,
  projectItemListSchema,
  websiteSchema,
} from '@/lib/seo'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = generateMetadata()

export const viewport: Viewport = {
  themeColor: '#020209',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const structuredData = JSON.stringify([
  websiteSchema,
  personSchema,
  profilePageSchema,
  projectItemListSchema,
  blogItemListSchema,
  faqSchema,
]).replace(/</g, '\\u003c')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icon.svg?v=2026" type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href="/icon.svg?v=2026" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg?v=2026" />
      </head>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
