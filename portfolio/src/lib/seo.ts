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

const roleKeywords = personalInfo.openToRoles.flatMap((role) => [
  role,
  `${role} India`,
  `Hire ${role}`,
])

const projectKeywords = projects
  .filter((project) => project.featured)
  .flatMap((project) => [project.title, project.category, ...project.tech.slice(0, 4)])

export const SEO_CONFIG = {
  siteName: `${personalInfo.name} Portfolio`,
  siteUrl: SITE_URL,
  defaultTitle: `${personalInfo.name} | AI Engineer, Full Stack Developer, ML Portfolio`,
  titleTemplate: `%s | ${personalInfo.name}`,
  description:
    `${personalInfo.name} is a B.Tech CSE student at GCE Kalahandi building AI, machine learning, data science, and full-stack web projects with Python, React, Next.js, Node.js, and deep learning tools.`,
  keywords: Array.from(
    new Set([
      personalInfo.name,
      personalInfo.title,
      'Anurag Swain portfolio',
      'AI engineer portfolio',
      'machine learning engineer portfolio',
      'full stack developer portfolio',
      'Next.js developer',
      'React developer',
      'Python developer',
      'data science portfolio',
      'deep learning engineer',
      'GCE Kalahandi',
      'Bhubaneswar developer',
      'Odisha developer',
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

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SEO_CONFIG.siteName,
    title: {
      default: title,
      template: SEO_CONFIG.titleTemplate,
    },
    description,
    keywords,
    authors: [{ name: SEO_CONFIG.author, url: `https://github.com/${SEO_CONFIG.github}` }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,
    alternates: {
      canonical,
    },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      shortcut: ['/icon.svg'],
    },
    manifest: '/manifest.webmanifest',
    category: 'technology',
    classification: 'Portfolio, AI Engineering, Software Development, Data Science',
    referrer: 'strict-origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
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
          alt: `${personalInfo.name} - AI Engineer and Full Stack Developer`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitter,
      creator: SEO_CONFIG.twitter,
      title,
      description,
      images: [ogImage],
    },
    verification: googleVerification ? { google: googleVerification } : undefined,
    other: {
      'geo.region': 'IN-OR',
      'geo.placename': personalInfo.location,
      'profile:first_name': personalInfo.firstName,
      'profile:last_name': personalInfo.lastName,
      'profile:username': SEO_CONFIG.github,
    },
  }
}

const sameAs = personalInfo.social.map((link) => link.url)

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: personalInfo.name,
  givenName: personalInfo.firstName,
  familyName: personalInfo.lastName,
  url: SITE_URL,
  image: absoluteUrl(personalInfo.avatar),
  email: personalInfo.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhubaneswar',
    addressRegion: 'Odisha',
    addressCountry: 'IN',
  },
  jobTitle: personalInfo.openToRoles,
  description: SEO_CONFIG.description,
  sameAs,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Government College of Engineering, Kalahandi',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kalahandi',
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
      'Full-Stack Development',
      'Data Science',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'TensorFlow',
      'PyTorch',
      ...projects.flatMap((project) => project.tech),
    ])
  ).slice(0, 40),
  mainEntityOfPage: `${SITE_URL}/#profile`,
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SEO_CONFIG.siteName,
  url: SITE_URL,
  description: SEO_CONFIG.description,
  inLanguage: 'en-IN',
  publisher: { '@id': `${SITE_URL}/#person` },
}

export const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: `${personalInfo.name} - AI Engineer and Full Stack Developer`,
  description: SEO_CONFIG.description,
  dateModified: new Date().toISOString(),
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
    ],
  },
}

export const projectItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#featured-projects`,
  name: `${personalInfo.name} featured projects`,
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
      },
    })),
}

export const blogItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#writing`,
  name: `${personalInfo.name} technical writing`,
  itemListElement: blogPosts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: post.title,
    description: post.excerpt,
  })),
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
