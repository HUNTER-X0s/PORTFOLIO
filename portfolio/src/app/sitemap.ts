// ============================================================
// src/app/sitemap.ts — Dynamic sitemap generator
// ============================================================

import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://anuragswain.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static sections (hash-based navigation)
  const sections = [
    { path: '/',           priority: 1.0, freq: 'weekly'  as const },
    { path: '/#about',     priority: 0.8, freq: 'monthly' as const },
    { path: '/#skills',    priority: 0.8, freq: 'monthly' as const },
    { path: '/#projects',  priority: 0.9, freq: 'weekly'  as const },
    { path: '/#experience',priority: 0.8, freq: 'monthly' as const },
    { path: '/#github',    priority: 0.7, freq: 'weekly'  as const },
    { path: '/#analytics', priority: 0.7, freq: 'monthly' as const },
    { path: '/#contact',   priority: 0.9, freq: 'weekly'  as const },
  ]

  return sections.map(({ path, priority, freq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }))
}

// ============================================================
// src/app/robots.ts — Robots.txt
// ============================================================

// export default function robots(): MetadataRoute.Robots {
//   const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://anuragswain.dev'
//   return {
//     rules: [
//       { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
//       { userAgent: 'Googlebot', allow: '/', crawlDelay: 2 },
//     ],
//     sitemap: `${BASE_URL}/sitemap.xml`,
//     host: BASE_URL,
//   }
// }
