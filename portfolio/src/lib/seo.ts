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
    'https://anuragswain.vercel.app'

  return (url || fallback).replace(/\/+$/, '')
}

export const SITE_URL = normalizeSiteUrl()

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  return new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL).toString()
}

// ─── High-Impact Targeted SEO Keywords ─────────────────────────────────────
const primaryBrandKeywords = [
  'Anurag',
  'anurag',
  'Anurag portfolio',
  'anurag portfolio',
  'Anurag Portfolio',
  'Anurag Swain',
  'anurag swain',
  'Anurag Swain portfolio',
  'anurag swain portfolio',
  'Anurag Swain AI Engineer',
  'Anurag Swain Full Stack Developer',
  'Anurag Swain ML Engineer',
  'Anurag developer',
  'anurag developer',
  'Anurag website',
  'anurag website',
  'Anurag Swain website',
  'Anurag Swain portfolio website',
  'anurag swain portfolio website',
  'Anurag Swain official website',
  'anurag swain official website',
  'Anurag Swain AI',
  'Anurag Swain machine learning',
  'anurag swain developer',
  'anurag swain engineer',
  'anurag swain bhubaneswar',
  'anurag swain odisha',
  'anurag swain gcek',
  'anurag swain gce kalahandi',
  'anurag swain cse',
  'anurag swain github',
  'anurag swain linkedin',
  'anuragswain',
  'anuragswain.vercel.app',
  'https://anuragswain.vercel.app',
  'Anurag07',
  'anurag07',
  'anurag07.vercel.app',
  'HUNTER-X0s',
  'HUNTER-X0s portfolio',
]

const roleKeywords = personalInfo.openToRoles.flatMap((role) => [
  role,
  `${role} portfolio`,
  `Anurag ${role}`,
  `${role} India`,
  `${role} Odisha`,
  `Hire ${role}`,
  `${role} fresher`,
])

const projectKeywords = projects
  .filter((project) => project.featured)
  .flatMap((project) => [
    project.title,
    `Anurag ${project.title}`,
    project.category,
    ...project.tech.slice(0, 4),
  ])

const intentKeywords = [
  // Generic high-intent tech search terms
  'AI engineer portfolio',
  'machine learning engineer portfolio',
  'full stack developer portfolio India',
  'deep learning engineer India',
  'data scientist portfolio India',
  'NLP engineer portfolio',
  'computer vision engineer portfolio',
  'Next.js 14 developer portfolio',
  'React developer Odisha',
  'Python AI developer Bhubaneswar',
  'RAG chatbot developer portfolio',
  'Three.js 3D web portfolio',
  'Jarvis AI voice assistant portfolio',
  'GCE Kalahandi CSE student',
  'Government College of Engineering Kalahandi',
  'Bhubaneswar developer',
  'Odisha software engineer',
  'hire AI engineer India',
  'hire full stack developer India',
  'best AI developer portfolio 2026',
]

export const SEO_CONFIG = {
  siteName: 'Anurag Portfolio',
  siteUrl: SITE_URL,
  defaultTitle: 'Anurag Portfolio — Anurag Swain | AI Engineer & Full Stack Developer',
  titleTemplate: '%s | Anurag Portfolio',
  description:
    'Official portfolio of Anurag Swain (Anurag). B.Tech CSE student at GCE Kalahandi and AI Engineer, Full-Stack Developer, and ML Engineer. Explore Anurag\'s AI projects, resume, skills, research, and interactive Jarvis voice assistant.',
  keywords: Array.from(
    new Set([
      ...primaryBrandKeywords,
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
      { name: 'Anurag Swain (Anurag)', url: `https://github.com/${SEO_CONFIG.github}` },
      { name: 'Anurag Swain', url: `https://www.linkedin.com/in/${SEO_CONFIG.linkedin}/` },
    ],
    creator: 'Anurag Swain',
    publisher: 'Anurag Swain',
    alternates: {
      canonical,
      languages: {
        'en-IN': canonical,
        'en-US': canonical,
        'x-default': canonical,
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
    classification: 'Anurag Portfolio, Anurag Swain, AI Engineering, Full Stack Development, Data Science, Machine Learning',
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
      title: 'Anurag Portfolio — Anurag Swain | AI Engineer & Full Stack Developer',
      description,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      username: SEO_CONFIG.github,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Anurag Portfolio — Anurag Swain AI Engineer and Full Stack Developer',
          type: 'image/png',
          secureUrl: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitter,
      creator: SEO_CONFIG.twitter,
      title: 'Anurag Portfolio — Anurag Swain | AI Engineer & Full Stack Developer',
      description,
      images: [
        {
          url: ogImage,
          alt: 'Anurag Portfolio — Anurag Swain AI Engineer and Full Stack Developer',
        },
      ],
    },
    verification: {
      google: googleVerification || 'EsgM4LaT0JqZyOACJWk-zAHUF9biyb7oOgvcBD93Xo0',
      ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {}),
    },
    other: {
      'geo.region': 'IN-OR',
      'geo.placename': 'Bhubaneswar, Odisha, India',
      'geo.position': '20.2961;85.8189',
      ICBM: '20.2961, 85.8189',
      'profile:first_name': personalInfo.firstName,
      'profile:last_name': personalInfo.lastName,
      'profile:username': SEO_CONFIG.github,
      revisit: '3 days',
      rating: 'general',
      language: 'English',
      copyright: `Anurag Swain (Anurag) ${new Date().getFullYear()}`,
      'author': 'Anurag Swain',
      'owner': 'Anurag Swain',
      'subject': 'Anurag Portfolio - AI Engineer, Machine Learning, and Full Stack Web Development',
    },
  }
}

// ─── Schema.org Structured Data ────────────────────────────────────────────

const sameAs = [
  ...personalInfo.social.map((link) => link.url),
  `https://github.com/${SEO_CONFIG.github}`,
  `https://www.linkedin.com/in/${SEO_CONFIG.linkedin}/`,
  `https://x.com/Anurag_hunter07`,
  `https://anuragswain.vercel.app`,
  `https://anurag07.vercel.app`,
]

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Anurag Swain',
  alternateName: ['Anurag', 'Anurag Portfolio', 'HUNTER-X0s', 'Anurag Swain Portfolio', 'Anurag Developer'],
  givenName: personalInfo.firstName,
  familyName: personalInfo.lastName,
  url: SITE_URL,
  image: {
    '@type': 'ImageObject',
    url: absoluteUrl(personalInfo.avatar),
    width: 400,
    height: 400,
    caption: 'Anurag Swain (Anurag) — AI Engineer and Full Stack Developer',
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
  jobTitle: 'AI Engineer & Full Stack Developer',
  hasOccupation: personalInfo.openToRoles.map((role) => ({
    '@type': 'Occupation',
    name: role,
    occupationLocation: {
      '@type': 'Country',
      name: 'India',
    },
  })),
  description: 'Anurag Swain (Anurag) is a B.Tech CSE student at GCE Kalahandi, AI Engineer, and Full-Stack Developer with 4+ industry internships across deep learning, NLP, computer vision, and scalable web apps.',
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
  name: 'Anurag Portfolio',
  alternateName: [
    'Anurag',
    'Anurag Portfolio',
    'anurag portfolio',
    'Anurag Swain Portfolio',
    'anurag swain portfolio',
    'Anurag Swain Website',
    'anurag swain website',
    'Anurag AI Portfolio',
    'anuragswain',
    'anuragswain.vercel.app',
    'anurag07',
    'anurag07.vercel.app',
  ],
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
  name: 'Anurag Portfolio — Anurag Swain Official Website',
  headline: 'Anurag Swain — AI Engineer, ML Engineer & Full Stack Developer Portfolio',
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
        name: 'Projects',
        item: `${SITE_URL}/#projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Skills',
        item: `${SITE_URL}/#skills`,
      },
      {
        '@type': 'ListItem',
        position: 4,
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
  name: 'Anurag Swain Featured AI and Full Stack Projects',
  description: 'AI, machine learning, computer vision, and full-stack projects engineered by Anurag Swain (Anurag).',
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
  name: 'Anurag Swain Technical Blog & Research Articles',
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

// ─── FAQ Schema for Google Search Rich Snippets ───────────────────────────
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Anurag\'s official portfolio website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'https://anuragswain.vercel.app is the official portfolio website of Anurag Swain. It features interactive 3D graphics, real-time RAG AI chatbot (Jarvis voice mode), full-stack and AI/ML projects, and a downloadable resume. Anurag Swain is a B.Tech CSE student at GCE Kalahandi, India.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is Anurag Swain (Anurag)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anurag Swain (Anurag) is an AI/ML Engineer, Full-Stack Developer, and B.Tech CSE student at Government College of Engineering, Kalahandi (GCEK), Odisha, India. He has completed 4+ industry internships across deep learning, NLP, computer vision, and web technologies.',
      },
    },
    {
      '@type': 'Question',
      name: 'What technologies does Anurag specialize in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anurag specializes in Python, Next.js 14, React, Node.js, TensorFlow, PyTorch, FastAPI, MongoDB, Docker, ChromaDB vector databases, and Large Language Model (LLM) RAG systems.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact or hire Anurag Swain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact Anurag Swain directly via the contact form on his portfolio at https://anuragswain.vercel.app, via email at anurag.swain35@gmail.com, or through LinkedIn at https://www.linkedin.com/in/anurag-swain-cse07/.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I view Anurag\'s AI and software projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All featured AI, machine learning, and full-stack projects by Anurag Swain are hosted with live demos and GitHub source code on his portfolio: https://anuragswain.vercel.app/#projects.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the website of Anurag Swain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The official website of Anurag Swain is https://anuragswain.vercel.app — an AI-powered portfolio featuring RAG chatbot, Jarvis voice assistant, 3D Three.js visuals, and showcasing his AI, ML, and full-stack engineering work.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find Anurag Swain online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anurag Swain can be found at: Portfolio: https://anuragswain.vercel.app | GitHub: https://github.com/HUNTER-X0s | LinkedIn: https://www.linkedin.com/in/anurag-swain-cse07/ | Email: anurag.swain35@gmail.com',
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
