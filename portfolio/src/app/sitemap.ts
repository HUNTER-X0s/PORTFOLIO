import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { projects, blogPosts } from '@/data/portfolio'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Section anchors — treated as virtual pages for SEO signal distribution
  const sections = [
    { id: 'about',           priority: 0.9,  changeFrequency: 'monthly'  as const },
    { id: 'skills',          priority: 0.85, changeFrequency: 'monthly'  as const },
    { id: 'projects',        priority: 0.95, changeFrequency: 'weekly'   as const },
    { id: 'experience',      priority: 0.85, changeFrequency: 'monthly'  as const },
    { id: 'education',       priority: 0.75, changeFrequency: 'yearly'   as const },
    { id: 'certifications',  priority: 0.75, changeFrequency: 'monthly'  as const },
    { id: 'blog',            priority: 0.85, changeFrequency: 'weekly'   as const },
    { id: 'contact',         priority: 0.9,  changeFrequency: 'monthly'  as const },
  ]

  return [
    // ── Root (highest priority)
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ── Section anchors
    ...sections.map(({ id, priority, changeFrequency }) => ({
      url: `${SITE_URL}/#${id}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),

    // ── Individual featured project entries (for rich indexing)
    ...projects
      .filter((p) => p.featured && (p.liveUrl || p.githubUrl))
      .map((project) => ({
        url: project.liveUrl || project.githubUrl || SITE_URL,
        lastModified: new Date(project.year, 0, 1),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),

    // ── Blog/writing entries
    ...blogPosts.map((post, i) => ({
      url: `${SITE_URL}/#blog-post-${i}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ]
}
