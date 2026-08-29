import type { Metadata } from 'next'
import { blogPosts, personalInfo, projects } from '@/data/portfolio'

type MetadataOverrides = Partial<{
  title: string
  description: string
  keywords: string[]
  path: string
  ogImage: string
}>

function normalizeSiteUrl(url?: string) {
  const fallback =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    'https://anuragswain.dev'

  return (url || fallback).replace(/\/+$/, '')
}

export const SITE_URL = normalizeSiteUrl()

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  return new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL).toString()
}

// ─── Comprehensive keyword matrix ──────────────────────────────────────────
const roleKeywords = personalInfo.openToRoles.flatMap((role) => [
  role,
  `${role} India`,
  `${role} Odisha`,
  `Hire ${role}`,
  `${role} fresher`,
])

const projectKeywords = projects
  .filter((project) => project.featured)
  .flatMap((project) => [project.title, project.category, ...project.tech.slice(0, 4)])

const intentKeywords = [
  // Name-based (brand)
  'Anurag Swain',
  'Anurag Swain portfolio',
  'Anurag Swain developer',
  'Anurag Swain AI engineer',
  'Anurag Swain GitHub',
  'HUNTER-X0s',
  // Role-based (generic)
  'AI engineer portfolio',
  'machine learning engineer portfolio',
  'full stack developer portfolio India',
  'deep learning engineer India',
  'data scientist portfolio India',
  'NLP engineer portfolio',
  'computer vision engineer',
  // Tech stack
  'Next.js developer India',
  'React developer Odisha',
  'Python developer Bhubaneswar',
  'TensorFlow developer',
  'PyTorch engineer',
  'LLM developer portfolio',
  'RAG chatbot developer',
  'FastAPI developer India',
  // College
  'GCE Kalahandi CSE student',
  'Government College of Engineering Kalahandi',
  // Location
  'Bhubaneswar developer',
  'Odisha software engineer',
  'India AI engineer',
  // Intent
  'hire AI engineer India',
  'hire full stack developer India',
  'best AI portfolio 2024',
  'AI ML portfolio website',
]

export const SEO_CONFIG = {
  siteName: `${personalInfo.name} Portfolio`,
  siteUrl: SITE_URL,
  defaultTitle: `${personalInfo.name} | AI Engineer & Full Stack Developer | ML Portfolio`,
  titleTemplate: `%s | ${personalInfo.name}`,
  description:
    `${personalInfo.name} — B.Tech CSE student at GCE Kalahandi specializing in AI, Machine Learning, Deep Learning, NLP, Computer Vision, and Full-Stack web development. 4+ industry internships. Open to SDE, AI/ML, and Data Science roles.`,
  keywords: Array.from(
    new Set([
      personalInfo.name,
      personalInfo.title,
      ...intentKeywords,
      ...roleKeywords,
      ...projectKeywords,
    ])
  ),
  author: personalInfo.name,
  twitter: '@Anurag_hunter07',
  github: 'HUNTER-X0s',
  linkedin: 'anurag-swain-cse07',
  locale: 'en_IN',
  ogImage: absoluteUrl('/opengraph-image'),
}

export function generateMetadata(overrides?: MetadataOverrides): Metadata {
  const title = overrides?.title || SEO_CONFIG.defaultTitle
  const description = overrides?.description || SEO_CONFIG.description
  const canonical = absoluteUrl(overrides?.path || '/')
  const ogImage = overrides?.ogImage ? absoluteUrl(overrides.ogImage) : SEO_CONFIG.ogImage
  const keywords = Array.from(new Set([...SEO_CONFIG.keywords, ...(overrides?.keywords || [])]))
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION
  const bingVerification = process.env.BING_SITE_VERIFICATION

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SEO_CONFIG.siteName,
    title: {
      default: title,
      template: SEO_CONFIG.titleTemplate,
    },
    description,
    keywords,
    authors: [
      { name: SEO_CONFIG.author, url: `https://github.com/${SEO_CONFIG.github}` },
      { name: SEO_CONFIG.author, url: `https://www.linkedin.com/in/${SEO_CONFIG.linkedin}/` },
    ],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,
    alternates: {
      canonical,
      languages: {
        'en-IN': canonical,
        'en-US': canonical,
      },
    },
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: ['/icon.svg'],
      apple: [
        { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/manifest.webmanifest',
    category: 'technology',
    classification: 'Portfolio, AI Engineering, Software Development, Data Science, Machine Learning',
    referrer: 'strict-origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'profile',
      locale: SEO_CONFIG.locale,
      url: canonical,
      siteName: SEO_CONFIG.siteName,
      title,
      description,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      username: SEO_CONFIG.github,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${personalInfo.name} - AI Engineer and Full Stack Developer | GCE Kalahandi`,
          type: 'image/png',
          secureUrl: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitter,
      creator: SEO_CONFIG.twitter,
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: `${personalInfo.name} - AI Engineer and Full Stack Developer`,
        },
      ],
    },
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {}),
    },
    other: {
      // Geo meta (Bing, Baidu, Yandex use these)
      'geo.region': 'IN-OR',
      'geo.placename': 'Bhubaneswar, Odisha, India',
      'geo.position': '20.2961;85.8189',
      ICBM: '20.2961, 85.8189',
      // Profile
      'profile:first_name': personalInfo.firstName,
      'profile:last_name': personalInfo.lastName,
      'profile:username': SEO_CONFIG.github,
      // Revisit
      revisit: '7 days',
      // Rating
      rating: 'general',
      // Language
      language: 'English',
      // Copyright
      copyright: `${personalInfo.name} ${new Date().getFullYear()}`,
    },
  }
}

// ─── Schema.org Structured Data ────────────────────────────────────────────

const sameAs = [
  ...personalInfo.social.map((link) => link.url),
  `https://github.com/${SEO_CONFIG.github}`,
  `https://www.linkedin.com/in/${SEO_CONFIG.linkedin}/`,
]

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: personalInfo.name,
  givenName: personalInfo.firstName,
  familyName: personalInfo.lastName,
  url: SITE_URL,
  image: {
    '@type': 'ImageObject',
    url: absoluteUrl(personalInfo.avatar),
    width: 400,
    height: 400,
    caption: `${personalInfo.name} - AI Engineer and Full Stack Developer`,
  },
  email: personalInfo.email,
  telephone: personalInfo.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhubaneswar',
    addressRegion: 'Odisha',
    addressCountry: 'IN',
    postalCode: '751001',
  },
  jobTitle: personalInfo.openToRoles[0],
  hasOccupation: personalInfo.openToRoles.map((role) => ({
    '@type': 'Occupation',
    name: role,
    occupationLocation: {
      '@type': 'Country',
      name: 'India',
    },
  })),
  description: SEO_CONFIG.description,
  sameAs,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Government College of Engineering, Kalahandi',
    url: 'https://gcek.ac.in',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bhawanipatna',
      addressRegion: 'Odisha',
      addressCountry: 'IN',
    },
  },
  knowsAbout: Array.from(
    new Set([
      'Artificial Intelligence',
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Large Language Models',
      'Retrieval-Augmented Generation',
      'Full-Stack Development',
      'Data Science',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'TensorFlow',
      'PyTorch',
      'FastAPI',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'Git',
      ...projects.flatMap((project) => project.tech),
    ])
  ).slice(0, 50),
  mainEntityOfPage: `${SITE_URL}/#profile`,
  worksFor: {
    '@type': 'Organization',
    name: 'Open to Opportunities',
  },
  seeks: {
    '@type': 'JobPosting',
    title: 'AI Engineer / Full Stack Developer / ML Engineer',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
  },
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SEO_CONFIG.siteName,
  alternateName: `${personalInfo.name} - AI Engineer Portfolio`,
  url: SITE_URL,
  description: SEO_CONFIG.description,
  inLanguage: ['en-IN', 'en-US'],
  publisher: { '@id': `${SITE_URL}/#person` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: `${personalInfo.name} - AI Engineer and Full Stack Developer Portfolio`,
  description: SEO_CONFIG.description,
  dateModified: new Date().toISOString(),
  datePublished: '2024-01-01T00:00:00Z',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  mainEntity: { '@id': `${SITE_URL}/#person` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: `${SITE_URL}/#projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Contact',
        item: `${SITE_URL}/#contact`,
      },
    ],
  },
}

export const projectItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#featured-projects`,
  name: `${personalInfo.name} — Featured Projects`,
  description: `AI and full-stack projects built by ${personalInfo.name}`,
  numberOfItems: projects.filter((p) => p.featured).length,
  itemListElement: projects
    .filter((project) => project.featured)
    .map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        '@id': `${SITE_URL}/#project-${project.id}`,
        name: project.title,
        description: project.description,
        codeRepository: project.githubUrl,
        url: project.liveUrl || project.githubUrl || SITE_URL,
        programmingLanguage: project.tech,
        author: { '@id': `${SITE_URL}/#person` },
        dateCreated: `${project.year}`,
      },
    })),
}

export const blogItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#writing`,
  name: `${personalInfo.name} — Technical Writing`,
  itemListElement: blogPosts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'BlogPosting',
      name: post.title,
      headline: post.title,
      description: post.excerpt,
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  })),
}

// FAQ Schema — boosts rich snippets in SERPs
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Anurag Swain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Anurag Swain is a B.Tech CSE student at Government College of Engineering, Kalahandi (GCE Kalahandi), Odisha, India. He specializes in Artificial Intelligence, Machine Learning, Deep Learning, and Full-Stack Web Development with 4+ industry internships. He is open to SDE, AI Engineer, ML Engineer, and Data Scientist roles.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What technologies does Anurag Swain work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Anurag Swain works with Python, React, Next.js, Node.js, TensorFlow, PyTorch, FastAPI, MongoDB, PostgreSQL, Docker, and various AI/ML frameworks. He has built RAG chatbots, computer vision pipelines, NLP models, and full-stack web applications.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Is Anurag Swain available for hire?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes, Anurag Swain is actively open to opportunities as an SDE, AI Engineer, ML Engineer, Full Stack Developer, Data Scientist, or Deep Learning Engineer. You can contact him through his portfolio at ${SITE_URL} or via email at ${personalInfo.email}.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Anurag Swain located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Anurag Swain is based in Bhubaneswar, Odisha, India. He is open to remote opportunities and relocation across India.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What are Anurag Swain\'s featured AI projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Anurag Swain has built ${projects.filter(p => p.featured).map(p => p.title).join(', ')}. These projects span AI, machine learning, computer vision, NLP, and full-stack web development.`,
      },
    },
  ],
}

export function projectSchema(project: {
  id: string
  title: string
  description: string
  liveUrl?: string
  githubUrl?: string
  tech: string[]
  year: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    '@id': `${SITE_URL}/#project-${project.id}`,
    name: project.title,
    description: project.description,
    url: project.liveUrl || project.githubUrl || SITE_URL,
    codeRepository: project.githubUrl,
    dateCreated: `${project.year}`,
    programmingLanguage: project.tech,
    author: { '@id': `${SITE_URL}/#person` },
  }
}
