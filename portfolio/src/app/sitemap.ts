import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    // ── Root page (the entire single-page portfolio)
    // Hash fragment anchors (#about, #skills etc.) are NOT valid sitemap URLs
    // per Google's sitemap spec — only include real crawlable page paths.
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ── Explicit trailing-slash variant (canonical coverage)
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]
}
