import type { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SEO_CONFIG.author} — AI Engineer & Full Stack Developer`,
    short_name: 'Anurag',
    description: SEO_CONFIG.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    background_color: '#020209',
    theme_color: '#020209',
    orientation: 'portrait-primary',
    lang: 'en-IN',
    dir: 'ltr',
    categories: ['portfolio', 'technology', 'developer'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'View Projects',
        short_name: 'Projects',
        description: 'Browse featured AI and full-stack projects',
        url: '/#projects',
        icons: [{ src: '/icon.svg', sizes: 'any' }],
      },
      {
        name: 'Contact Me',
        short_name: 'Contact',
        description: 'Get in touch with Anurag Swain',
        url: '/#contact',
        icons: [{ src: '/icon.svg', sizes: 'any' }],
      },
    ],
  }
}
