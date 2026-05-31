// ============================================================
// lib/voiceCommands.ts
// Intent detection + command → action mapping system
// ============================================================

export type VoiceCommandAction =
  | { type: 'navigate'; section: string }
  | { type: 'switchRole'; roleId: string }
  | { type: 'openChat' }
  | { type: 'openProject'; projectId?: string }
  | { type: 'downloadResume' }
  | { type: 'openLink'; url: string }
  | { type: 'query'; text: string }   // fallback → RAG chat
  | { type: 'stop' }
  | { type: 'help' }

export interface VoiceCommand {
  patterns: RegExp[]
  action: (match: RegExpMatchArray | null) => VoiceCommandAction
  description: string
  example: string
}

// ── Section aliases ────────────────────────────────────────────
const SECTION_MAP: Record<string, string> = {
  home: 'hero', hero: 'hero', top: 'hero',
  about: 'about', 'who are you': 'about', 'about you': 'about',
  skills: 'skills', 'tech stack': 'skills', technologies: 'skills', expertise: 'skills',
  projects: 'projects', portfolio: 'projects', work: 'projects', 'what you built': 'projects',
  experience: 'experience', internship: 'experience', 'work history': 'experience',
  education: 'education', college: 'education', university: 'education', degree: 'education',
  'why hire': 'value', hire: 'value', value: 'value', 'why you': 'value',
  certifications: 'certifications', certs: 'certifications', achievements: 'certifications', certificates: 'certifications',
  blog: 'blog', articles: 'blog', writing: 'blog', posts: 'blog',
  contact: 'contact', 'get in touch': 'contact', reach: 'contact', email: 'contact',
}

// ── Role aliases ───────────────────────────────────────────────
const ROLE_MAP: Record<string, string> = {
  'full stack': 'fullstack', fullstack: 'fullstack', full: 'fullstack',
  frontend: 'frontend', 'front end': 'frontend', ui: 'frontend',
  backend: 'backend', 'back end': 'backend', server: 'backend', api: 'backend',
  'ai engineer': 'ai_engineer', ai: 'ai_engineer', 'artificial intelligence': 'ai_engineer',
  'machine learning': 'ml_engineer', ml: 'ml_engineer', 'ml engineer': 'ml_engineer',
  'deep learning': 'dl_engineer', dl: 'dl_engineer', 'neural network': 'dl_engineer',
  'data scientist': 'data_scientist', 'data science': 'data_scientist',
  'data analyst': 'data_analyst', analyst: 'data_analyst',
  cloud: 'cloud', devops: 'cloud', infrastructure: 'cloud',
}

// ── Command definitions ────────────────────────────────────────
export const VOICE_COMMANDS: VoiceCommand[] = [
  // ── Stop / Cancel
  {
    patterns: [/^(stop|cancel|quit|silence|shut up|be quiet|pause)$/i],
    action: () => ({ type: 'stop' }),
    description: 'Stop listening or speaking',
    example: 'Stop',
  },

  // ── Help
  {
    patterns: [/^(help|what can you do|commands|how does this work|options)$/i],
    action: () => ({ type: 'help' }),
    description: 'List available voice commands',
    example: 'Help',
  },

  // ── Navigate to section
  {
    patterns: [
      /(?:go to|show|open|navigate to|take me to|scroll to)\s+(.+?)(?:\s+section)?$/i,
      /^(.+?)\s+section$/i,
    ],
    action: (match) => {
      const raw = (match?.[1] || '').toLowerCase().trim()
      const section = SECTION_MAP[raw] || Object.entries(SECTION_MAP).find(([k]) => raw.includes(k))?.[1]
      return section
        ? { type: 'navigate', section }
        : { type: 'query', text: match?.[0] || '' }
    },
    description: 'Navigate to any section',
    example: 'Go to projects',
  },

  // ── Switch role
  {
    patterns: [
      /(?:view as|switch to|show as|see as|change to|i am a?n?)\s+(.+?)(?:\s+(?:engineer|developer|scientist|analyst))?$/i,
      /(?:view|show).*(?:as|for)\s+(.+?)(?:\s+role)?$/i,
    ],
    action: (match) => {
      const raw = (match?.[1] || '').toLowerCase().trim()
      const roleId = ROLE_MAP[raw] || Object.entries(ROLE_MAP).find(([k]) => raw.includes(k))?.[1]
      return roleId
        ? { type: 'switchRole', roleId }
        : { type: 'query', text: match?.[0] || '' }
    },
    description: 'Switch portfolio role view',
    example: 'View as AI engineer',
  },

  // ── Open chat
  {
    patterns: [/^(open chat|chat|open chatbot|text mode|switch to text)$/i],
    action: () => ({ type: 'openChat' }),
    description: 'Open the text chatbot',
    example: 'Open chat',
  },

  // ── Download resume
  {
    patterns: [/(?:download|get|show|open)\s+(?:the\s+)?resume|cv$/i],
    action: () => ({ type: 'downloadResume' }),
    description: 'Download resume PDF',
    example: 'Download resume',
  },

  // ── Open GitHub
  {
    patterns: [/(?:open|go to|show)\s+(?:his\s+)?github$/i],
    action: () => ({ type: 'openLink', url: 'https://github.com/HUNTER-X0s' }),
    description: 'Open GitHub profile',
    example: 'Open GitHub',
  },

  // ── Open LinkedIn
  {
    patterns: [/(?:open|go to|show)\s+(?:his\s+)?linkedin$/i],
    action: () => ({ type: 'openLink', url: 'https://linkedin.com/in/anurag-swain-cse07' }),
    description: 'Open LinkedIn profile',
    example: 'Open LinkedIn',
  },

  // ── Project-specific
  {
    patterns: [/(?:show|open|tell me about)\s+(?:the\s+)?ev(?:\s+prediction|\s+project)?/i],
    action: () => ({ type: 'openProject', projectId: 'ev-charging-prediction' }),
    description: 'Open EV Prediction project',
    example: 'Show the EV project',
  },
  {
    patterns: [/(?:show|open|tell me about)\s+(?:the\s+)?(?:research agent|ibm project)/i],
    action: () => ({ type: 'openProject', projectId: 'research-agent' }),
    description: 'Open Research Agent project',
    example: 'Show the Research Agent',
  },
  {
    patterns: [/(?:show|open|tell me about)\s+(?:the\s+)?(?:chatbot|ai chat|chat bot)/i],
    action: () => ({ type: 'openProject', projectId: 'ai-chat-bot' }),
    description: 'Open AI Chat Bot project',
    example: 'Show the chatbot project',
  },
]

// ── Parse transcript into command ──────────────────────────────
export function parseVoiceCommand(transcript: string): VoiceCommandAction {
  const cleaned = transcript.trim().toLowerCase()

  for (const cmd of VOICE_COMMANDS) {
    for (const pattern of cmd.patterns) {
      const match = cleaned.match(pattern)
      if (match) {
        const action = cmd.action(match)
        // If action resolves to a query (fallback), continue trying
        if (action.type !== 'query') return action
      }
    }
  }

  // Fallback → send to RAG chatbot
  return { type: 'query', text: transcript }
}

// ── Section scroll utility ─────────────────────────────────────
export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Suggested voice prompts for UI ────────────────────────────
export const VOICE_SUGGESTIONS = [
  { icon: '💼', text: 'Show me his projects', category: 'navigation' },
  { icon: '🧠', text: 'What are his AI skills?', category: 'query' },
  { icon: '🤖', text: 'View as AI engineer', category: 'role' },
  { icon: '💼', text: 'Where has he interned?', category: 'query' },
  { icon: '📄', text: 'Download resume', category: 'action' },
  { icon: '🏆', text: 'Show certifications', category: 'navigation' },
  { icon: '📬', text: 'Go to contact', category: 'navigation' },
  { icon: '⭐', text: "What's his best project?", category: 'query' },
]
