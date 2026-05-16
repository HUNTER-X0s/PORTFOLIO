// ============================================================
// CORE TYPES — AI Portfolio Platform
// ============================================================

export type RoleId =
  | 'fullstack'
  | 'frontend'
  | 'backend'
  | 'cloud'
  | 'data_analyst'
  | 'data_scientist'
  | 'ml_engineer'
  | 'dl_engineer'
  | 'ai_engineer'

export interface Role {
  id: RoleId
  label: string
  shortLabel: string
  icon: string
  color: string
  gradient: string
  description: string
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'ai_ml'
  | 'data_science'
  | 'cloud'
  | 'tools'
  | 'languages'

export interface Skill {
  name: string
  level: number // 0–100
  category: SkillCategory
  icon?: string
  color?: string
  yearsExp?: number
  highlighted?: boolean
}

export interface SkillGroup {
  category: SkillCategory
  label: string
  icon: string
  color: string
  skills: Skill[]
}

export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  problem: string
  solution: string
  architecture: string[]
  challenges: string[]
  results: string[]
  impact: string
  tech: string[]
  liveUrl: string
  githubUrl?: string
  imageUrl: string
  videoUrl?: string
  featured: boolean
  status: 'live' | 'in-progress' | 'archived'
  roles: RoleId[]
  year: number
  category: string
}

export interface ExperienceItem {
  id: string
  company: string
  companyUrl?: string
  role: string
  duration: string
  startDate: string
  endDate: string | 'Present'
  location: string
  type: 'internship' | 'full-time' | 'part-time' | 'freelance' | 'contract'
  description: string[]
  tech: string[]
  achievements: string[]
  projects?: {
    name: string
    description: string
    techStack: string[]
    problem: string
    solution: string
    impact: string
    githubUrl?: string
    liveUrl?: string
  }[]
  logoUrl?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  duration: string
  startYear: number
  endYear: number | 'Present'
  grade?: string
  activities: string[]
  logoUrl?: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issuerLogo?: string
  date: string
  credentialId?: string
  credentialUrl?: string
  skills: string[]
  category: 'ai_ml' | 'cloud' | 'data' | 'development' | 'other'
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  category: string
  date: string
  readTime: string
  coverImage?: string
  featured: boolean
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
  handle: string
}

export interface GitHubStats {
  username: string
  publicRepos: number
  followers: number
  following: number
  totalStars: number
  totalForks: number
  totalCommits: number
  topLanguages: { name: string; percentage: number; color: string }[]
  contributionStreak: number
  profileUrl: string
}

export interface RoleContent {
  roleId: RoleId
  hero: {
    headline: string
    subheadline: string
    description: string
    cta: string
  }
  highlightedSkills: string[]
  featuredProjectIds: string[]
  whyHireMe: {
    title: string
    points: string[]
  }
  terminalLines: string[]
}

export interface ContactForm {
  name: string
  email: string
  company?: string
  role?: string
  message: string
  budget?: string
}

export interface NavItem {
  id: string
  label: string
  href: string
  icon?: string
}

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  shortcut?: string
  action: () => void
  category: 'navigation' | 'action' | 'project' | 'social'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  typing?: boolean
}

export interface PersonalInfo {
  name: string
  firstName: string
  lastName: string
  title: string
  location: string
  email: string
  phone?: string
  bio: string
  shortBio: string
  tagline: string
  avatar: string
  resumeUrl: string
  availableForWork: boolean
  openToRoles: string[]
  languages: { language: string; level: string }[]
  hobbies: string[]
  social: SocialLink[]
}
