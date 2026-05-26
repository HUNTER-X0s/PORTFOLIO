import type { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_CONFIG.siteName,
    short_name: 'Anurag',
    description: SEO_CONFIG.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#020209',
    theme_color: '#020209',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
