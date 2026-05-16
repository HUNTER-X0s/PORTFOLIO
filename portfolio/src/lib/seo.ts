// ============================================================
// SEO SYSTEM — Complete implementation for portfolio
// File: src/lib/seo.ts
// ============================================================

import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://anuragswain.dev'

// ── Core SEO config ──────────────────────────────────────────
export const SEO_CONFIG = {
  siteName: 'Anurag Swain — AI Engineer & Full-Stack Developer',
  siteUrl: BASE_URL,
  defaultTitle: 'Anurag Swain | AI Engineer · Full-Stack Developer · Data Scientist',
  titleTemplate: '%s | Anurag Swain',
  description:
    'Anurag Swain — B.Tech CSE student at GCE Kalahandi with 5 professional internships (Infosys, IBM, MicroGenesis Bangalore). Expert in AI/ML, Deep Learning, React/Next.js, and Python. CGPA 8.10. Open to hire.',
  keywords: [
    'Anurag Swain', 'AI Engineer India', 'ML Engineer', 'Full Stack Developer India',
    'Deep Learning Engineer', 'Data Scientist India', 'React Developer India',
    'Next.js Developer', 'Python Developer India', 'Hire AI Developer India',
    'GCE Kalahandi', 'Infosys Intern', 'Machine Learning Portfolio',
    'AI Portfolio India', 'Computer Vision Engineer', 'NLP Engineer',
    'Full Stack Developer Portfolio', 'AI Engineer Portfolio', 'Hire Machine Learning Engineer',
    'PyTorch Developer', 'TensorFlow Developer', 'IBM Watson', 'AICTE Intern',
    'Bhubaneswar Developer', 'Odisha Developer', 'Fresher AI Engineer',
  ],
  author: 'Anurag Swain',
  twitter: '@Anurag_hunter07',
  github: 'HUNTER-X0s',
  linkedin: 'anurag-swain-cse07',
  locale: 'en_IN',
  ogImage: `${BASE_URL}/og-image.jpg`,
}

// ── Generate page metadata ────────────────────────────────────
export function generateMetadata(overrides?: Partial<{
  title: string
  description: string
  keywords: string[]
  path: string
  ogImage: string
}>): Metadata {
  const title     = overrides?.title     || SEO_CONFIG.defaultTitle
  const desc      = overrides?.description || SEO_CONFIG.description
  const url       = `${BASE_URL}${overrides?.path || ''}`
  const ogImage   = overrides?.ogImage   || SEO_CONFIG.ogImage
  const keywords  = [...SEO_CONFIG.keywords, ...(overrides?.keywords || [])].join(', ')

  return {
    metadataBase: new URL(BASE_URL),
    title: { default: title, template: SEO_CONFIG.titleTemplate },
    description: desc,
    keywords,
    authors: [{ name: SEO_CONFIG.author, url: `https://github.com/${SEO_CONFIG.github}` }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,

    // Robots
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },

    // Open Graph
    openGraph: {
      type: 'profile',
      firstName: 'Anurag',
      lastName: 'Swain',
      username: SEO_CONFIG.github,
      gender: 'male',
      locale: SEO_CONFIG.locale,
      url,
      siteName: SEO_CONFIG.siteName,
      title,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title, type: 'image/jpeg' }],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitter,
      creator: SEO_CONFIG.twitter,
      title,
      description: desc,
      images: [ogImage],
    },

    // Alternates
    alternates: { canonical: url },

    // App-specific
    applicationName: SEO_CONFIG.siteName,
    category: 'technology',
    classification: 'Portfolio, AI Engineering, Software Development',

    // Verification (replace with actual tokens)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || '',
    },

    // Other
    other: {
      'geo.region': 'IN-OR',
      'geo.placename': 'Bhubaneswar, Odisha, India',
      'profile:first_name': 'Anurag',
      'profile:last_name': 'Swain',
      'profile:username': SEO_CONFIG.github,
    },
  }
}

// ── JSON-LD Structured Data ───────────────────────────────────
export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Anurag Swain',
  url: BASE_URL,
  image: `${BASE_URL}/images/anurag.png`,
  email: 'anurag.swain35@gmail.com',
  telephone: '+91-7008973337',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhubaneswar',
    addressRegion: 'Odisha',
    addressCountry: 'IN',
    postalCode: '751002',
  },
  jobTitle: 'AI Engineer & Full-Stack Developer',
  description: 'B.Tech CSE student at GCE Kalahandi. AI/ML Engineer with 5 internships at Infosys, MicroGenesis TechSoft, Edunet Foundation, EISystems Technologies. Expert in Python, React, Deep Learning.',
  sameAs: [
    `https://github.com/${SEO_CONFIG.github}`,
    `https://linkedin.com/in/${SEO_CONFIG.linkedin}`,
    `https://x.com/Anurag_hunter07`,
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Government College of Engineering, Kalahandi',
    url: 'https://gcek.ac.in',
    address: { '@type': 'PostalAddress', addressLocality: 'Kalahandi', addressRegion: 'Odisha', addressCountry: 'IN' },
  },
  knowsAbout: [
    'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Natural Language Processing',
    'Computer Vision', 'React.js', 'Next.js', 'Node.js', 'Python', 'TensorFlow', 'PyTorch',
    'Full-Stack Development', 'Data Science', 'IBM Watson', 'OpenCV',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Software Engineer',
    occupationalCategory: 'Software Development',
    skills: 'Python, JavaScript, React, Next.js, Machine Learning, Deep Learning, NLP, Computer Vision',
  },
  award: [
    'AICTE Internship Cycle-2 Certificate',
    'IBM Skills Build AI & Cloud Technologies Certificate',
    'Infosys Virtual Internship 2.0 Certificate',
    'MicroGenesis TechSoft Deep Learning Certificate',
  ],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SEO_CONFIG.siteName,
  url: BASE_URL,
  description: SEO_CONFIG.description,
  author: { '@type': 'Person', name: 'Anurag Swain' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: personSchema,
  dateModified: new Date().toISOString(),
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }],
  },
}

// Generate project schema
export function projectSchema(project: {
  id: string; title: string; description: string; url: string; tech: string[]; year: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: project.url,
    author: { '@type': 'Person', name: 'Anurag Swain' },
    dateCreated: `${project.year}`,
    programmingLanguage: project.tech,
    operatingSystem: 'Web',
    applicationCategory: 'WebApplication',
  }
}
