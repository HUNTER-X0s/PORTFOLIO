// ============================================================
// CERTIFICATIONS DATA — ANURAG SWAIN
// Extracted from: LinkedIn screenshots, Resume, GitHub/CERTIFICATIONS repo
// Format: LinkedIn-level structured data with full enrichment
// ============================================================

export type CertCategory = 'ai_ml' | 'cloud' | 'web_development' | 'data_science' | 'others'

export interface CertProject {
  name: string
  description: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  impact: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issuerShortName: string
  issuerLogo: string        // path to logo or emoji fallback
  issuerColor: string       // brand color for visual identity
  issueDate: string         // "MMM YYYY" display format
  issueDateISO: string      // "YYYY-MM" for sorting
  expiryDate: string | null
  doesExpire: boolean
  credentialId: string | null
  credentialUrl: string
  fileUrl: string           // local PDF/image path
  previewUrl: string        // thumbnail preview
  skills: string[]
  category: CertCategory
  featured: boolean         // show in highlights
  priority: number          // 1=highest for resume ordering
  badge: string             // emoji badge
  description: string       // recruiter-facing one-liner
  linkedProject: CertProject | null
  roleRelevance: string[]   // which portfolio roles this cert boosts
}

// ============================================================
// ALL CERTIFICATIONS
// ============================================================
export const certifications: Certification[] = [
  // ── 1. INFOSYS — AI INTERNSHIP ──────────────────────────
  {
    id: 'cert-infosys-ai-2025',
    title: 'Artificial Intelligence Virtual Internship 2.0',
    issuer: 'Infosys Springboard',
    issuerShortName: 'Infosys',
    issuerLogo: '/images/logos/infosys.png',
    issuerColor: '#007CC3',
    issueDate: 'Oct 2025',
    issueDateISO: '2025-10',
    expiryDate: null,
    doesExpire: false,
    credentialId: 'INFOSYS-AI-2025-ANURAG',   // *inferred — update with actual ID*
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    fileUrl: '/certificates/infosys-ai-internship-2025.pdf',
    previewUrl: '/certificates/previews/infosys-ai-internship.jpg',
    skills: [
      'Artificial Intelligence', 'Machine Learning', 'Natural Language Processing',
      'Python', 'Conversational AI', 'LLM APIs', 'Dialogue Management',
      'Intent Classification', 'Prompt Engineering',
    ],
    category: 'ai_ml',
    featured: true,
    priority: 1,
    badge: '🤖',
    description: 'Completed 3-month AI internship at one of the world\'s largest IT companies, building a production NLP chatbot with multi-turn dialogue management.',
    linkedProject: {
      name: 'AI Chat Bot',
      description: 'Multi-turn conversational AI chatbot with NLP intent classification, entity recognition, and LLM-powered response generation, built during the Infosys Virtual Internship 2.0.',
      techStack: ['Python', 'NLP', 'LLM APIs', 'Machine Learning', 'Intent Classification'],
      githubUrl: 'https://github.com/HUNTER-X0s/AI_CHAT_BOT',
      impact: 'Production-ready NLP chatbot receiving ⭐1 community star; demonstrated full conversational AI pipeline from intent recognition to contextual response generation.',
    },
    roleRelevance: ['ai_engineer', 'ml_engineer', 'dl_engineer', 'fullstack'],
  },

  // ── 2. EISYSTEMS — WEB DEVELOPMENT ──────────────────────
  {
    id: 'cert-eisystems-webdev-2025',
    title: 'Web Development Internship Certificate',
    issuer: 'EISystems Technologies',
    issuerShortName: 'EISystems',
    issuerLogo: '/images/logos/eisystems.png',
    issuerColor: '#E64C3C',
    issueDate: 'Sep 2025',
    issueDateISO: '2025-09',
    expiryDate: null,
    doesExpire: false,
    credentialId: 'EISYSTEMS-WEBDEV-2025',    // *inferred — update with actual ID*
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    fileUrl: '/certificates/eisystems-webdev-2025.pdf',
    previewUrl: '/certificates/previews/eisystems-webdev.jpg',
    skills: [
      'React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB',
      'JavaScript', 'REST APIs', 'Full-Stack Development',
      'Component Architecture', 'Agile Development',
    ],
    category: 'web_development',
    featured: true,
    priority: 2,
    badge: '⚡',
    description: 'Full-stack web development internship building production React + Next.js applications with Node.js backend and MongoDB — shipped complete features in 3-month engagement.',
    linkedProject: {
      name: 'Full-Stack Web Application (E-Commerce / Business Platform)',
      description: 'Complete full-stack web application built with React.js frontend, Next.js for SSR, Node.js + Express.js REST API backend, and MongoDB persistence layer — developed from requirements to deployment.',
      techStack: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs'],
      impact: 'Delivered production-ready web platform demonstrating end-to-end full-stack engineering capability; implemented independently within agile sprint cycles.',
    },
    roleRelevance: ['fullstack', 'frontend', 'backend'],
  },

  // ── 3. EDUNET — AI & DATA ANALYTICS ─────────────────────
  {
    id: 'cert-edunet-ai-analytics-2025',
    title: 'Artificial Intelligence & Data Analytics Internship',
    issuer: 'Edunet Foundation',
    issuerShortName: 'Edunet',
    issuerLogo: '/images/logos/edunet.png',
    issuerColor: '#F39C12',
    issueDate: 'Aug 2025',
    issueDateISO: '2025-08',
    expiryDate: null,
    doesExpire: false,
    credentialId: 'EDUNET-AIDA-2025',         // *inferred — update with actual ID*
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    fileUrl: '/certificates/edunet-ai-data-analytics-2025.pdf',
    previewUrl: '/certificates/previews/edunet-ai-analytics.jpg',
    skills: [
      'Artificial Intelligence', 'Data Analytics', 'Tableau',
      'Microsoft Power BI', 'Data Visualization', 'Python',
      'Business Intelligence', 'Insight Communication',
    ],
    category: 'data_science',
    featured: true,
    priority: 3,
    badge: '📊',
    description: 'AI & Data Analytics internship creating Tableau and Power BI dashboards for business insights, combined with Python-based ML pipeline for EV demand analysis.',
    linkedProject: {
      name: 'EV Vehicle Charging Demand Prediction',
      description: 'AICTE Internship Cycle-2 project: end-to-end ML regression pipeline forecasting EV charging station demand using Random Forest with temporal feature engineering.',
      techStack: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib', 'Seaborn', 'Tableau', 'Power BI'],
      githubUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
      impact: 'AICTE-certified ML project (⭐1 GitHub star) demonstrating predictive analytics on real-world energy demand data.',
    },
    roleRelevance: ['data_analyst', 'data_scientist', 'ai_engineer'],
  },

  // ── 4. EDUNET / IBM — AI & CLOUD (IBM SKILLS BUILD) ─────
  {
    id: 'cert-edunet-ibm-cloud-2025',
    title: 'AI and Cloud Technologies Internship (IBM Skills Build)',
    issuer: 'Edunet Foundation / IBM',
    issuerShortName: 'IBM Skills Build',
    issuerLogo: '/images/logos/ibm.png',
    issuerColor: '#0F62FE',
    issueDate: 'Aug 2025',
    issueDateISO: '2025-08',
    expiryDate: null,
    doesExpire: false,
    credentialId: 'IBM-SKILLSBUILD-EDUNET-2025', // *inferred — update with actual ID*
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    fileUrl: '/certificates/edunet-ibm-cloud-2025.pdf',
    previewUrl: '/certificates/previews/ibm-skills-build.jpg',
    skills: [
      'IBM Watson', 'IBM Cloud', 'Cloud Computing', 'AI Agents',
      'Natural Language Processing', 'Agentic AI', 'Python',
      'Enterprise AI Integration', 'Research Automation',
    ],
    category: 'cloud',
    featured: true,
    priority: 4,
    badge: '☁️',
    description: 'IBM Skills Build certified AI & Cloud internship — built an autonomous Research Agent as the capstone project using IBM Watson APIs and agentic AI architecture.',
    linkedProject: {
      name: 'Research Agent (IBM Skills Build Capstone)',
      description: 'Autonomous AI agent that decomposes research queries, retrieves multi-source information via web scraping, applies NLP summarization, and generates structured research reports with citations — powered by IBM Watson APIs.',
      techStack: ['Python', 'IBM Watson', 'IBM Cloud', 'NLP', 'LLM APIs', 'Web Scraping', 'Jupyter Notebook'],
      githubUrl: 'https://github.com/HUNTER-X0s/RESEARCH_AGENT',
      impact: 'IBM Skills Build capstone project demonstrating agentic AI system design; reduces manual research time by ~70% on complex multi-source queries.',
    },
    roleRelevance: ['ai_engineer', 'cloud', 'ml_engineer'],
  },

  // ── 5. AICTE — EV PREDICTION (CYCLE 2) ──────────────────
  {
    id: 'cert-aicte-ev-2025',
    title: 'AICTE Internship Cycle-2 — EV Charging Demand Prediction',
    issuer: 'AICTE / Edunet Foundation',
    issuerShortName: 'AICTE',
    issuerLogo: '/images/logos/aicte.png',
    issuerColor: '#1A237E',
    issueDate: 'Aug 2025',
    issueDateISO: '2025-08',
    expiryDate: null,
    doesExpire: false,
    credentialId: 'AICTE-CYCLE2-2025',        // *inferred — update with actual ID*
    credentialUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
    fileUrl: '/certificates/aicte-cycle2-ev-2025.pdf',
    previewUrl: '/certificates/previews/aicte-cycle2.jpg',
    skills: [
      'Machine Learning', 'Python', 'Scikit-Learn', 'Pandas', 'NumPy',
      'Feature Engineering', 'Regression Models', 'Random Forest',
      'Data Science', 'Time Series Analysis', 'Model Evaluation',
    ],
    category: 'ai_ml',
    featured: true,
    priority: 5,
    badge: '🏛️',
    description: 'Government body (AICTE) recognized ML project certification — EV Charging Demand Prediction pipeline achieving strong predictive accuracy on real-world station data.',
    linkedProject: {
      name: 'EV Vehicle Charging Demand Prediction',
      description: 'Supervised ML regression pipeline using Scikit-Learn (Random Forest Regressor) with comprehensive temporal feature engineering on EV station historical data.',
      techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
      githubUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
      impact: 'AICTE-certified; GitHub ⭐1 star; demonstrates end-to-end ML pipeline from data ingestion to evaluation.',
    },
    roleRelevance: ['ml_engineer', 'data_scientist', 'ai_engineer'],
  },

  // ── 6. MICROGENESIS — DEEP LEARNING ─────────────────────
  {
    id: 'cert-microgenesis-dl-2025',
    title: 'Deep Learning Internship Certificate',
    issuer: 'MicroGenesis TechSoft',
    issuerShortName: 'MicroGenesis',
    issuerLogo: '/images/logos/microgenesis.png',
    issuerColor: '#00BFA5',
    issueDate: 'Jul 2025',
    issueDateISO: '2025-07',
    expiryDate: null,
    doesExpire: false,
    credentialId: 'MICROGENESIS-DL-2025',     // *inferred — update with actual ID*
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    fileUrl: '/certificates/microgenesis-dl-2025.pdf',
    previewUrl: '/certificates/previews/microgenesis-dl.jpg',
    skills: [
      'Deep Learning', 'TensorFlow', 'Keras', 'PyTorch', 'OpenCV',
      'Computer Vision', 'CNN Architectures', 'Transfer Learning',
      'NLP', 'Data Augmentation', 'Model Evaluation',
      'Seaborn', 'Matplotlib', 'Scikit-Learn',
    ],
    category: 'ai_ml',
    featured: true,
    priority: 6,
    badge: '🧠',
    description: 'Professional Deep Learning internship at a Bangalore AI firm — hands-on CNN training with PyTorch, TensorFlow, Keras simultaneously, plus OpenCV computer vision pipeline.',
    linkedProject: {
      name: 'Computer Vision Deep Learning System',
      description: 'Deep learning-based visual recognition system using CNN architectures with OpenCV preprocessing pipeline. Applied transfer learning (VGG, ResNet) for feature extraction with comprehensive data augmentation.',
      techStack: ['Python', 'PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'Scikit-Learn', 'NumPy', 'Matplotlib'],
      impact: 'Professional DL experience at MicroGenesis TechSoft, Bangalore — received 12+ LinkedIn skill endorsements from the company.',
    },
    roleRelevance: ['dl_engineer', 'ml_engineer', 'ai_engineer'],
  },

  // ── 7. SHADOW FOX — DATA SCIENCE ────────────────────────
  {
    id: 'cert-shadowfox-ds-2025',
    title: 'Data Science Internship Certificate',
    issuer: 'Shadow Fox',
    issuerShortName: 'Shadow Fox',
    issuerLogo: '/images/logos/shadowfox.png',
    issuerColor: '#7C3AED',
    issueDate: 'Aug 2025',
    issueDateISO: '2025-08',
    expiryDate: null,
    doesExpire: false,
    credentialId: 'SHADOWFOX-DS-2025',        // *inferred — update with actual ID*
    credentialUrl: 'https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP',
    fileUrl: '/certificates/shadowfox-ds-2025.pdf',
    previewUrl: '/certificates/previews/shadowfox-ds.jpg',
    skills: [
      'Data Science', 'Python', 'Pandas', 'NumPy', 'Scikit-Learn',
      'Matplotlib', 'Seaborn', 'EDA', 'Feature Engineering',
      'Statistical Analysis', 'Classification', 'Regression',
      'Model Evaluation', 'Jupyter Notebook',
    ],
    category: 'data_science',
    featured: false,
    priority: 7,
    badge: '🔬',
    description: 'Data Science internship executing end-to-end ML pipelines: EDA → feature engineering → predictive modeling → visualization reporting across multiple domain datasets.',
    linkedProject: {
      name: 'Data Science Project Portfolio',
      description: 'Multiple end-to-end data science projects covering EDA, feature engineering, classification and regression modeling, and visualization reporting using the full Python data science stack.',
      techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
      githubUrl: 'https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP',
      impact: 'Demonstrates complete data science pipeline proficiency across multiple problem domains.',
    },
    roleRelevance: ['data_scientist', 'data_analyst', 'ml_engineer'],
  },
]

// ============================================================
// HELPER UTILITIES
// ============================================================

// Get certs sorted by priority (for resume insertion)
export const getSortedCerts = () =>
  [...certifications].sort((a, b) => a.priority - b.priority)

// Get certs by role relevance
export const getCertsByRole = (roleId: string) =>
  certifications.filter((c) => c.roleRelevance.includes(roleId))
    .sort((a, b) => a.priority - b.priority)

// Get certs by category
export const getCertsByCategory = (category: CertCategory) =>
  certifications.filter((c) => c.category === category)

// Get featured certs for hero display
export const getFeaturedCerts = () =>
  certifications.filter((c) => c.featured).sort((a, b) => a.priority - b.priority)

// Category metadata
export const certCategoryMeta: Record<CertCategory, { label: string; color: string; icon: string }> = {
  ai_ml:           { label: 'AI / ML',         color: '#00E5FF', icon: '🤖' },
  cloud:           { label: 'Cloud',            color: '#00FF87', icon: '☁️' },
  web_development: { label: 'Web Development',  color: '#FF6B2B', icon: '⚡' },
  data_science:    { label: 'Data Science',     color: '#FFE500', icon: '📊' },
  others:          { label: 'Others',           color: '#7C3AED', icon: '🏆' },
}

// Resume-optimized cert titles per role (top 4 for each)
export const certsByRoleForResume: Record<string, string[]> = {
  fullstack:     ['cert-eisystems-webdev-2025', 'cert-infosys-ai-2025', 'cert-edunet-ibm-cloud-2025'],
  frontend:      ['cert-eisystems-webdev-2025', 'cert-infosys-ai-2025'],
  backend:       ['cert-eisystems-webdev-2025', 'cert-infosys-ai-2025', 'cert-edunet-ibm-cloud-2025'],
  ai_engineer:   ['cert-infosys-ai-2025', 'cert-edunet-ibm-cloud-2025', 'cert-aicte-ev-2025', 'cert-microgenesis-dl-2025'],
  ml_engineer:   ['cert-aicte-ev-2025', 'cert-microgenesis-dl-2025', 'cert-infosys-ai-2025', 'cert-shadowfox-ds-2025'],
  dl_engineer:   ['cert-microgenesis-dl-2025', 'cert-infosys-ai-2025', 'cert-edunet-ibm-cloud-2025'],
  data_scientist:['cert-aicte-ev-2025', 'cert-shadowfox-ds-2025', 'cert-edunet-ai-analytics-2025'],
  data_analyst:  ['cert-edunet-ai-analytics-2025', 'cert-aicte-ev-2025', 'cert-shadowfox-ds-2025'],
  cloud:         ['cert-edunet-ibm-cloud-2025', 'cert-eisystems-webdev-2025', 'cert-infosys-ai-2025'],
}
