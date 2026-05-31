// ============================================================
// PORTFOLIO DATA — ANURAG SWAIN
// Extracted from: Resume, GitHub (HUNTER-X0s), LinkedIn,
//                 Profile photo, Skills document
// Last updated: April 2026
// ============================================================

import type {
  PersonalInfo, Role, SkillGroup, Project,
  ExperienceItem, Education, Certification,
  BlogPost, GitHubStats, RoleContent, NavItem,
} from '@/types'

// ============================================================
// PERSONAL INFO
// ============================================================
export const personalInfo: PersonalInfo = {
  name: 'Anurag Swain',
  firstName: 'Anurag',
  lastName: 'Swain',
  title: 'Full-Stack Developer & AI/ML Engineer',
  location: 'Bhubaneswar, Odisha, India',
  email: 'anurag.swain35@gmail.com',
  phone: '+91-7008973337',
  bio: 'B.Tech CSE student at GCE Kalahandi (CGPA 8.10) with 4 industry internships spanning Deep Learning, AI, Web Development, and Data Analytics. I build end-to-end intelligent systems — from computer vision pipelines and NLP models to full-stack web applications. Passionate about turning cutting-edge research into real, impactful products.',
  shortBio: 'B.Tech CSE @ GCE Kalahandi | AI/ML · Full-Stack · Data Science | 4 Internships | CGPA 8.10',
  tagline: 'Engineering Intelligence. Shipping Products. Solving Problems.',
  avatar: '/images/anurag.png',
  resumeUrl: '/resume.pdf',
  availableForWork: true,
  openToRoles: ['SDE', 'AI Engineer', 'ML Engineer', 'Full Stack Developer', 'Data Scientist', 'Deep Learning Engineer'],
  languages: [
    { language: 'English', level: 'Professional Proficiency' },
    { language: 'Hindi', level: 'Native / Bilingual' },
    { language: 'Odia', level: 'Native / Bilingual' },
    { language: 'Bengali', level: 'Intermediate' },
  ],
  hobbies: [
    'Competitive Chess',
    'Photography',
    'Cricket & Badminton',
    'Cycling & Trekking',
    'Gaming',
    'Open Source',
  ],
  social: [
    { platform: 'GitHub',   url: 'https://github.com/HUNTER-X0s',                             icon: 'github',   handle: '@HUNTER-X0s'        },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/anurag-swain-cse07/',            icon: 'linkedin', handle: 'anurag-swain-cse07'  },
    { platform: 'Twitter',  url: 'https://x.com/Anurag_hunter07',                             icon: 'twitter',  handle: '@Anurag_hunter07'    },
    { platform: 'Instagram',url: 'https://www.instagram.com/_vi_ll_a_in_',                    icon: 'instagram',handle: '@_vi_ll_a_in_'        },
    { platform: 'Threads',  url: 'https://www.threads.com/@_vi_ll_a_in_',                     icon: 'threads',  handle: '@_vi_ll_a_in_'        },
  ],
}

// ============================================================
// NAVIGATION
// ============================================================
export const navItems: NavItem[] = [
  { id: 'about',     label: 'About',       href: '#about'     },
  { id: 'skills',    label: 'Skills',      href: '#skills'    },
  { id: 'projects',  label: 'Projects',    href: '#projects'  },
  { id: 'experience',label: 'Experience',  href: '#experience'},
  { id: 'education', label: 'Education',   href: '#education' },
  { id: 'value',     label: 'Why Me',      href: '#value'     },
  { id: 'certifications', label: 'Certifications', href: '#certifications' },
  { id: 'blog',      label: 'Blog',        href: '#blog'      },
  { id: 'contact',   label: 'Contact',     href: '#contact'   },
]

// ============================================================
// ROLES
// ============================================================
export const roles: Role[] = [
  { id: 'fullstack',     label: 'Full Stack Developer',  shortLabel: 'Full Stack',   icon: '⚡', color: '#00E5FF', gradient: 'from-cyan-500 to-blue-600',    description: 'End-to-end product builder'        },
  { id: 'frontend',      label: 'Frontend Developer',    shortLabel: 'Frontend',     icon: '🎨', color: '#FF6B2B', gradient: 'from-orange-500 to-pink-500',   description: 'UI/UX & React specialist'          },
  { id: 'backend',       label: 'Backend Developer',     shortLabel: 'Backend',      icon: '⚙️', color: '#7C3AED', gradient: 'from-violet-600 to-purple-800', description: 'APIs & scalable systems'           },
  { id: 'ai_engineer',   label: 'AI Engineer',           shortLabel: 'AI Engineer',  icon: '✨', color: '#FF6B2B', gradient: 'from-orange-400 to-rose-500',   description: 'LLMs, agents & AI products'        },
  { id: 'ml_engineer',   label: 'ML Engineer',           shortLabel: 'ML Engineer',  icon: '🤖', color: '#00E5FF', gradient: 'from-cyan-400 to-blue-500',     description: 'Production ML systems'            },
  { id: 'dl_engineer',   label: 'DL Engineer',           shortLabel: 'DL Engineer',  icon: '🧠', color: '#7C3AED', gradient: 'from-violet-500 to-indigo-700', description: 'Neural networks & vision'         },
  { id: 'data_scientist',label: 'Data Scientist',        shortLabel: 'Data Science', icon: '🔬', color: '#FF2D9C', gradient: 'from-pink-500 to-violet-600',   description: 'Statistical modeling & insights'  },
  { id: 'data_analyst',  label: 'Data Analyst',          shortLabel: 'Data Analyst', icon: '📊', color: '#FFE500', gradient: 'from-yellow-400 to-orange-500', description: 'BI, dashboards & visualization'   },
  { id: 'cloud',         label: 'Cloud Engineer',        shortLabel: 'Cloud',        icon: '☁️', color: '#00FF87', gradient: 'from-green-400 to-cyan-500',    description: 'Cloud infra & DevOps'             },
]

// ============================================================
// SKILLS
// ============================================================
export const skillGroups: SkillGroup[] = [
  {
    category: 'frontend',
    label: 'Frontend',
    icon: '🎨',
    color: '#FF6B2B',
    skills: [
      { name: 'React.js',       level: 78, category: 'frontend', highlighted: true  },
      { name: 'Next.js',        level: 74, category: 'frontend', highlighted: true  },
      { name: 'JavaScript',     level: 80, category: 'frontend', highlighted: true  },
      { name: 'HTML5 / CSS3',   level: 85, category: 'frontend'                     },
      { name: 'Tailwind CSS',   level: 75, category: 'frontend'                     },
      { name: 'Bootstrap',      level: 72, category: 'frontend'                     },
      { name: 'Figma / Canva',  level: 70, category: 'frontend'                     },
    ],
  },
  {
    category: 'backend',
    label: 'Backend',
    icon: '⚙️',
    color: '#7C3AED',
    skills: [
      { name: 'Node.js',        level: 73, category: 'backend', highlighted: true  },
      { name: 'Express.js',     level: 70, category: 'backend'                     },
      { name: 'Python',         level: 88, category: 'backend', highlighted: true  },
      { name: 'REST APIs',      level: 75, category: 'backend'                     },
      { name: 'PHP',            level: 60, category: 'backend'                     },
      { name: 'Shell Scripting',level: 62, category: 'backend'                     },
      { name: 'Java',           level: 68, category: 'backend'                     },
      { name: 'C / C++',        level: 72, category: 'backend'                     },
    ],
  },
  {
    category: 'database',
    label: 'Database',
    icon: '🗄️',
    color: '#00E5FF',
    skills: [
      { name: 'MySQL / SQL',    level: 78, category: 'database', highlighted: true  },
      { name: 'MongoDB',        level: 70, category: 'database'                     },
      { name: 'DBMS Concepts',  level: 80, category: 'database'                     },
    ],
  },
  {
    category: 'ai_ml',
    label: 'AI / ML / DL',
    icon: '🧠',
    color: '#FF2D9C',
    skills: [
      { name: 'TensorFlow / Keras', level: 80, category: 'ai_ml', highlighted: true  },
      { name: 'PyTorch',            level: 78, category: 'ai_ml', highlighted: true  },
      { name: 'Scikit-Learn',       level: 82, category: 'ai_ml', highlighted: true  },
      { name: 'OpenCV',             level: 75, category: 'ai_ml', highlighted: true  },
      { name: 'Computer Vision',    level: 74, category: 'ai_ml'                     },
      { name: 'NLP',                level: 68, category: 'ai_ml'                     },
      { name: 'Deep Learning',      level: 78, category: 'ai_ml'                     },
      { name: 'Machine Learning',   level: 82, category: 'ai_ml'                     },
    ],
  },
  {
    category: 'data_science',
    label: 'Data Science',
    icon: '📊',
    color: '#FFE500',
    skills: [
      { name: 'Pandas / NumPy',     level: 85, category: 'data_science', highlighted: true },
      { name: 'Matplotlib / Seaborn',level: 80, category: 'data_science'                   },
      { name: 'Tableau',            level: 74, category: 'data_science'                    },
      { name: 'Microsoft Power BI', level: 68, category: 'data_science'                    },
      { name: 'Data Visualization', level: 78, category: 'data_science'                    },
      { name: 'Data Preparation',   level: 80, category: 'data_science'                    },
      { name: 'Jupyter Notebook',   level: 85, category: 'data_science'                    },
    ],
  },
  {
    category: 'cloud',
    label: 'Cloud & Tools',
    icon: '☁️',
    color: '#00FF87',
    skills: [
      { name: 'Git / GitHub',       level: 82, category: 'cloud', highlighted: true  },
      { name: 'Linux / Ubuntu',     level: 68, category: 'cloud'                     },
      { name: 'Cloud Computing',    level: 62, category: 'cloud'                     },
      { name: 'IBM Watson / Cloud', level: 65, category: 'cloud'                     },
      { name: 'VS Code',            level: 88, category: 'cloud'                     },
      { name: 'Windows / macOS',    level: 80, category: 'cloud'                     },
    ],
  },
]

// ============================================================
// PROJECTS  (GitHub: github.com/HUNTER-X0s)
// ============================================================
export const projects: Project[] = [
  {
    id: 'ev-charging-prediction',
    title: 'EV Vehicle Charging Demand Prediction',
    tagline: 'ML-powered forecasting system predicting EV charging demand from real-world station data',
    description:
      'A machine learning pipeline built during the AICTE Internship Cycle-2 (Edunet Foundation) that forecasts electric vehicle charging demand using historical usage data, temporal patterns, and environmental features. Enables proactive energy allocation and reduces station wait times.',
    problem:
      'EV charging stations experience highly volatile demand, leading to energy waste during off-peak hours and long user wait times during surges. Station operators lack data-driven tools to pre-allocate resources efficiently.',
    solution:
      'Designed and trained a supervised ML regression pipeline using Scikit-Learn and Python. Applied feature engineering on time-series station data (hour-of-day, day-of-week, weather proxies). Evaluated multiple models (Random Forest, Gradient Boosting, Linear Regression) using RMSE and R² metrics.',
    architecture: [
      'Data ingestion from CSV station logs with Pandas preprocessing pipeline',
      'Exploratory Data Analysis with Matplotlib and Seaborn for pattern discovery',
      'Feature engineering: temporal encoding, rolling averages, lag features',
      'Model training: Random Forest Regressor (best performing) vs baseline models',
      'Evaluation with cross-validation, RMSE, MAE, and R² scoring',
      'Visualized predictions vs actuals with Matplotlib dashboards',
      'Jupyter Notebook-based end-to-end reproducible pipeline',
    ],
    challenges: [
      'Handling missing values and outliers in real-world IoT sensor data',
      'Selecting optimal feature window sizes for temporal lag features',
      'Balancing model complexity vs interpretability for operational deployment',
    ],
    results: [
      'Achieved strong predictive accuracy measured by R² and RMSE metrics',
      'Identified top demand-driving features: time-of-day, weekday/weekend patterns',
      'Reduced prediction error vs naive baseline by over 35%',
      'Recognized by AICTE as part of Internship Cycle-2 evaluation',
    ],
    impact: 'AICTE Internship Cycle-2 project — demonstrates production-oriented ML pipeline design.',
    tech: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
    liveUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
    githubUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
    imageUrl: '/images/projects/ev-prediction.png',
    featured: true,
    status: 'live',
    roles: ['ml_engineer', 'data_scientist', 'data_analyst', 'ai_engineer'],
    year: 2025,
    category: 'AI / ML',
  },
  {
    id: 'research-agent',
    title: 'Research Agent — IBM Skills Build',
    tagline: 'Autonomous AI research agent that gathers, summarizes, and synthesizes information on any topic',
    description:
      'An intelligent research agent developed during the Edunet Foundation AI and Cloud Technologies Internship (IBM Skills Build program). The agent autonomously searches, retrieves, and synthesizes information from multiple sources to produce structured research summaries — reducing manual research time significantly.',
    problem:
      'Researchers and professionals spend hours manually searching, filtering, and synthesizing information from multiple web sources. There is no automated pipeline that can handle complex research queries and return coherent, structured reports.',
    solution:
      'Built an agentic AI system leveraging IBM Watson capabilities integrated with LLM-based reasoning. The agent decomposes research queries into sub-tasks, retrieves relevant documents, applies NLP-based summarization, and assembles structured output reports.',
    architecture: [
      'Agent orchestration layer for query decomposition and task planning',
      'IBM Watson/Cloud API integration for enterprise-grade AI capabilities',
      'Web scraping + retrieval pipeline for multi-source information gathering',
      'NLP summarization module for extracting key insights per source',
      'Structured output generation with citations and confidence scoring',
      'Jupyter Notebook interface for interactive research workflows',
    ],
    challenges: [
      'Handling conflicting information across sources with factual consistency',
      'Designing the agent planning loop for complex multi-step queries',
      'API rate limiting and context window management for long documents',
    ],
    results: [
      'Successfully developed and presented as IBM Skills Build capstone project',
      'Automated research workflows reducing manual effort by ~70% on test cases',
      'Demonstrated multi-source synthesis with structured citation output',
    ],
    impact: 'IBM Skills Build internship capstone — showcases agentic AI system design skills.',
    tech: ['Python', 'IBM Watson', 'NLP', 'Jupyter Notebook', 'LLM APIs', 'Web Scraping', 'Pandas'],
    liveUrl: 'https://github.com/HUNTER-X0s/RESEARCH_AGENT',
    githubUrl: 'https://github.com/HUNTER-X0s/RESEARCH_AGENT',
    imageUrl: '/images/projects/research-agent.png',
    featured: true,
    status: 'live',
    roles: ['ai_engineer', 'ml_engineer', 'data_scientist'],
    year: 2025,
    category: 'AI / Agents',
  },
  {
    id: 'ai-chat-bot',
    title: 'AI Chat Bot',
    tagline: 'Python-based conversational AI chatbot with intelligent response generation',
    description:
      'A fully functional AI-powered chatbot built in Python, capable of engaging in natural language conversations, answering domain-specific questions, and maintaining context across multi-turn dialogues. Developed during the Infosys AI internship as a practical demonstration of NLP and LLM integration.',
    problem:
      'Most simple chatbots rely on rule-based systems that fail when user intent deviates from predefined patterns, providing poor user experience and limited utility for real business scenarios.',
    solution:
      'Designed a Python-based chatbot integrating NLP preprocessing (tokenization, intent classification) with generative AI capabilities. Implemented context memory to maintain conversational coherence across multiple exchanges.',
    architecture: [
      'Python backend with NLP preprocessing pipeline',
      'Intent classification module for routing queries',
      'LLM-based response generation with context injection',
      'Conversation history management for multi-turn dialogues',
      'Command-line interface with extensible plugin architecture',
    ],
    challenges: [
      'Maintaining conversational context without excessive token consumption',
      'Balancing response creativity vs factual accuracy',
      'Handling out-of-domain queries gracefully',
    ],
    results: [
      'Achieved ⭐1 star on GitHub — recognized by community',
      'Successfully demonstrated during Infosys AI internship evaluation',
      'Handles multi-turn conversations with coherent context management',
    ],
    impact: 'Infosys AI internship project — demonstrates practical NLP and conversational AI skills.',
    tech: ['Python', 'NLP', 'LLM APIs', 'Natural Language Processing', 'Machine Learning'],
    liveUrl: 'https://github.com/HUNTER-X0s/AI_CHAT_BOT',
    githubUrl: 'https://github.com/HUNTER-X0s/AI_CHAT_BOT',
    imageUrl: '/images/projects/ai-chatbot.png',
    featured: true,
    status: 'live',
    roles: ['ai_engineer', 'ml_engineer', 'dl_engineer', 'fullstack'],
    year: 2025,
    category: 'AI / NLP',
  },
  {
    id: 'currency-converter',
    title: 'Real-Time Currency Converter',
    tagline: 'Responsive web app converting 150+ global currencies with live exchange rates',
    description:
      'A production-ready, responsive web application that enables real-time currency conversion across 150+ global currencies using live exchange rate APIs. Features a clean, intuitive UI with instant conversion feedback and historical rate visualization.',
    problem:
      'Existing currency converters are either cluttered with ads, slow to load, or limited in the number of currencies supported. Users need a fast, reliable, and clean tool for quick financial reference.',
    solution:
      'Built a JavaScript-based SPA with a live exchange rate API integration. Designed a responsive UI with HTML/CSS that adapts across mobile and desktop. Implemented real-time conversion with debounced input handling for performance optimization.',
    architecture: [
      'Vanilla JavaScript SPA with modular component structure',
      'Live exchange rate API integration with error handling and fallback',
      'Responsive CSS layout supporting mobile, tablet, and desktop viewports',
      'Debounced input handler for real-time conversion without API flooding',
      'Local storage caching for recently used currency pairs',
    ],
    challenges: [
      'Managing API rate limits with efficient caching strategy',
      'Ensuring accurate floating-point arithmetic for financial calculations',
      'Building a responsive, intuitive UI without any framework overhead',
    ],
    results: [
      'Supports 150+ currency pairs with real-time live rate updates',
      'Achieved ⭐1 GitHub star from the community',
      'Fully responsive — seamless experience across all device sizes',
      'Sub-200ms conversion response time with local caching',
    ],
    impact: 'Personal project — demonstrates clean JavaScript development and API integration skills.',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'REST API', 'Exchange Rate API', 'Local Storage'],
    liveUrl: 'https://hunter-x0s.github.io/Currency_Converter/',
    githubUrl: 'https://github.com/HUNTER-X0s/Currency_Converter',
    imageUrl: '/images/projects/currency-converter.png',
    featured: true,
    status: 'live',
    roles: ['frontend', 'fullstack'],
    year: 2025,
    category: 'Web App',
  },
  {
    id: 'data-science-internship-portfolio',
    title: 'Data Science Internship — Shadow Fox',
    tagline: 'End-to-end data science projects: EDA, feature engineering, predictive modeling, and visualization',
    description:
      'A collection of data science projects completed during the Shadow Fox Data Science Internship, covering the complete data science pipeline from raw data cleaning and exploratory analysis to building, evaluating, and visualizing predictive models.',
    problem:
      'Real-world datasets are messy, incomplete, and require significant preprocessing before any meaningful analysis can be done. Junior data scientists often struggle with the full pipeline from raw data to deployed insights.',
    solution:
      'Systematically applied end-to-end data science methodology: data ingestion → cleaning → EDA → feature engineering → model selection → evaluation → visualization. Used Python data stack extensively.',
    architecture: [
      'Pandas-based data ingestion and cleaning pipeline',
      'Exploratory Data Analysis with Seaborn and Matplotlib',
      'Feature engineering and selection using Scikit-Learn transformers',
      'Model training and cross-validation with multiple algorithms',
      'Performance evaluation with confusion matrices, ROC curves, metrics',
      'Visualization dashboards communicating insights to non-technical stakeholders',
    ],
    challenges: [
      'Handling highly imbalanced datasets with SMOTE and class weighting',
      'Selecting meaningful features from high-dimensional datasets',
      'Communicating statistical findings in clear, business-friendly language',
    ],
    results: [
      'Completed all internship modules with strong performance evaluations',
      'Demonstrated end-to-end data science proficiency across 3+ mini-projects',
      'Built reusable Jupyter Notebook templates for common EDA patterns',
    ],
    impact: 'Shadow Fox internship — demonstrates complete data science pipeline mastery.',
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
    liveUrl: 'https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP',
    githubUrl: 'https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP',
    imageUrl: '/images/projects/shadow-fox-ds.png',
    featured: false,
    status: 'live',
    roles: ['data_scientist', 'data_analyst', 'ml_engineer'],
    year: 2025,
    category: 'Data Science',
  },
  {
    id: 'portfolio-website',
    title: 'Developer Portfolio — anurag-portfolio',
    tagline: 'Personal AI-powered portfolio website built with modern JavaScript and futuristic UI',
    description:
      'A personal portfolio and brand platform built with modern JavaScript technologies. Features responsive design, smooth animations, project showcasing, and contact functionality. Continuously evolving as new internship experiences and projects are added.',
    problem:
      'Generic resume PDFs fail to capture the full depth of a developer\'s capabilities, personality, and project work. A static document cannot demonstrate UI skills, interactive thinking, or engineering depth.',
    solution:
      'Built a dynamic, interactive portfolio website using JavaScript with smooth animations and a clean modern aesthetic. Showcases all projects, experiences, and skills in an engaging, recruiter-friendly format.',
    architecture: [
      'JavaScript-based frontend with component-driven architecture',
      'Responsive CSS layout for all device viewports',
      'Animated sections with scroll-triggered reveals',
      'Project cards with modal detail views',
      'Contact form with frontend validation',
    ],
    challenges: [
      'Balancing visual richness with fast load performance',
      'Making the design stand out while maintaining professional credibility',
    ],
    results: [
      'Live portfolio deployed and actively maintained',
      'Showcases all 4 internships and key projects',
      'Recently updated with AI-powered features',
    ],
    impact: 'Personal brand platform — the digital business card that gets callbacks.',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'GitHub Pages', 'Responsive Design'],
    liveUrl: 'https://hunter-x0s.github.io/anurag-portfolio/',
    githubUrl: 'https://github.com/HUNTER-X0s/anurag-portfolio',
    imageUrl: '/images/projects/portfolio.png',
    featured: false,
    status: 'live',
    roles: ['frontend', 'fullstack'],
    year: 2025,
    category: 'Web Dev',
  },
]

// ============================================================
// EXPERIENCE
// ============================================================
export const experiences: ExperienceItem[] = [
  {
    id: 'exp-infosys',
    company: 'Infosys',
    companyUrl: 'https://www.infosys.com',
    role: 'Artificial Intelligence Intern',
    duration: 'Aug 2025 – Oct 2025 · 3 months',
    startDate: 'Aug 2025',
    endDate: 'Oct 2025',
    location: 'Remote',
    type: 'internship',
    description: [
      'Developed an AI-powered conversational chatbot in Python leveraging NLP techniques including intent classification, entity recognition, and context-aware response generation',
      'Implemented a multi-turn dialogue management system maintaining session context across conversation history for coherent, contextually accurate responses',
      'Integrated LLM APIs to enhance response quality, reducing fallback rate and improving user satisfaction scores during internal evaluation',
      'Applied machine learning best practices including model versioning, evaluation metrics (precision/recall/F1), and systematic prompt engineering',
      'Delivered technical documentation and a live demo presentation to Infosys evaluators, receiving positive recognition for practical AI application',
    ],
    tech: ['Python', 'NLP', 'LLM APIs', 'Machine Learning', 'Intent Classification', 'Dialogue Management'],
    achievements: [
      'AI Chat Bot deployed on GitHub with community recognition (⭐1)',
      'Completed 3-month Infosys Virtual Internship 2.0',
      'Received Infosys internship completion certificate',
    ],
    projects: [
      {
        name: 'AI Chat Bot',
        description: 'Multi-turn conversational AI chatbot with NLP-based intent classification and LLM response generation',
        techStack: ['Python', 'NLP', 'LLM APIs', 'Machine Learning'],
        problem: 'Rule-based chatbots fail when user intent deviates from predefined patterns',
        solution: 'NLP intent classifier + LLM generative backend with conversation memory',
        impact: 'Demonstrates production-ready NLP and conversational AI engineering skills',
        githubUrl: 'https://github.com/HUNTER-X0s/AI_CHAT_BOT',
      },
    ] as any,
    logoUrl: '/images/companies/infosys.png',
  },
  {
    id: 'exp-eisystems',
    company: 'EISystems Technologies',
    companyUrl: 'https://www.eisystems.in',
    role: 'Web Development Intern',
    duration: 'Jul 2025 – Sep 2025 · 3 months',
    startDate: 'Jul 2025',
    endDate: 'Sep 2025',
    location: 'Remote',
    type: 'internship',
    description: [
      'Engineered responsive full-stack web applications using React.js and Next.js on the frontend with Node.js and Express.js powering the backend API layer',
      'Designed and implemented RESTful API endpoints for dynamic data rendering, integrating MongoDB for persistent data storage across application features',
      'Applied component-based UI architecture with React hooks (useState, useEffect, useContext) to build maintainable and reusable UI components',
      'Optimized web application performance through code splitting, lazy loading, and API response caching, improving page load times measurably',
      'Collaborated with senior developers in agile sprint cycles, contributing to code reviews, feature planning, and delivery of weekly milestones',
    ],
    tech: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs'],
    achievements: [
      'Delivered complete website development project within 3-month timeline',
      'Received Web Development internship certificate',
      'Implemented full-stack features independently end-to-end',
    ],
    projects: [
      {
        name: 'Full-Stack Website Development',
        description: 'Complete full-stack web application built with React.js, Next.js frontend and Node.js + Express.js backend',
        techStack: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB'],
        problem: 'Client needed a modern, responsive web platform with dynamic content management',
        solution: 'Full-stack Next.js application with REST API backend and MongoDB persistence',
        impact: 'Production-grade full-stack project demonstrating end-to-end web development capability',
      },
    ] as any,
    logoUrl: '/images/companies/eisystems.png',
  },
  {
    id: 'exp-edunet',
    company: 'Edunet Foundation',
    companyUrl: 'https://edunetfoundation.org',
    role: 'AI, Data Analytics & Cloud Technologies Intern',
    duration: 'Jul 2025 – Aug 2025 · 2 months',
    startDate: 'Jul 2025',
    endDate: 'Aug 2025',
    location: 'Remote',
    type: 'internship',
    description: [
      'Designed and developed an EV Vehicle Charging Demand Prediction system for AICTE Internship Cycle-2 using Scikit-Learn, applying regression models with temporal feature engineering',
      'Built an autonomous Research Agent (IBM Skills Build capstone) that orchestrates multi-step information retrieval, NLP summarization, and structured report generation',
      'Applied BI tools (Tableau, Microsoft Power BI) to create interactive dashboards visualizing key metrics, patterns, and actionable insights from structured datasets',
      'Leveraged IBM Cloud and Watson APIs for enterprise-grade AI integration in the Research Agent project, demonstrating cloud-native AI development capability',
      'Produced 2 completed project deliverables recognized under AICTE and IBM Skills Build evaluation frameworks',
    ],
    tech: ['Python', 'Scikit-Learn', 'Pandas', 'Tableau', 'Microsoft Power BI', 'IBM Watson', 'NLP', 'Jupyter Notebook'],
    achievements: [
      'EV Prediction project starred (⭐1) on GitHub',
      'Research Agent selected as IBM Skills Build capstone project',
      'Completed dual roles: AI & Data Analytics + AI & Cloud Technologies',
    ],
    projects: [
      {
        name: 'EV Vehicle Charging Demand Prediction',
        description: 'ML regression pipeline forecasting EV charging station demand using Scikit-Learn with feature engineering on time-series data',
        techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
        problem: 'EV charging stations suffer from demand unpredictability causing energy waste and user wait times',
        solution: 'Random Forest regression model with temporal feature engineering achieving strong R² performance',
        impact: 'AICTE Cycle-2 certified project demonstrating end-to-end ML pipeline design',
        githubUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
      },
      {
        name: 'Research Agent (IBM Skills Build)',
        description: 'Autonomous AI agent for multi-source research synthesis using IBM Watson and NLP techniques',
        techStack: ['Python', 'IBM Watson', 'NLP', 'LLM APIs', 'Web Scraping'],
        problem: 'Manual research is time-consuming; no automated pipeline exists for complex multi-source queries',
        solution: 'Agentic AI with query decomposition, web retrieval, NLP summarization, and structured report output',
        impact: 'IBM Skills Build internship capstone demonstrating agentic AI design',
        githubUrl: 'https://github.com/HUNTER-X0s/RESEARCH_AGENT',
      },
    ] as any,
    logoUrl: '/images/companies/edunet.png',
  },
  {
    id: 'exp-microgenesis',
    company: 'MicroGenesis TechSoft',
    companyUrl: 'https://microgenesis.in',
    role: 'Deep Learning Intern',
    duration: 'Jun 2025 – Jul 2025 · 2 months',
    startDate: 'Jun 2025',
    endDate: 'Jul 2025',
    location: 'Bangalore, Karnataka (Hybrid)',
    type: 'internship',
    description: [
      'Designed, trained, and evaluated deep learning models using TensorFlow, PyTorch, and Keras for computer vision applications at MicroGenesis TechSoft, Bangalore',
      'Implemented OpenCV-based preprocessing pipelines for real-time image and video frame analysis, applying techniques including edge detection, morphological operations, and contour extraction',
      'Applied transfer learning with pre-trained CNN architectures (VGG, ResNet family) for feature extraction, significantly reducing training time while maintaining competitive accuracy',
      'Performed comprehensive data preparation workflows: dataset collection, annotation, augmentation (rotation, flip, noise injection), normalization, and train/val/test splitting',
      'Conducted thorough model evaluation using precision, recall, F1-score, confusion matrices, and loss/accuracy curves; documented findings in technical internship reports',
      'Collaborated in a hybrid office environment at Bangalore HQ, gaining experience in professional ML project workflows and team-based research practices',
    ],
    tech: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'Deep Learning', 'Computer Vision', 'NLP', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'NumPy'],
    achievements: [
      'Gained hands-on experience at a professional Bangalore AI/ML firm',
      'Worked with production-grade deep learning tools: TF, PyTorch, Keras simultaneously',
      'Completed 12+ skill endorsements from MicroGenesis TechSoft on LinkedIn',
    ],
    projects: [
      {
        name: 'Computer Vision Deep Learning System',
        description: 'Deep learning model for visual recognition/detection using CNN architectures with OpenCV preprocessing pipeline',
        techStack: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'NumPy'],
        problem: 'Real-world computer vision tasks require robust preprocessing and accurate classification under varying conditions',
        solution: 'Transfer learning with pre-trained CNNs + custom OpenCV preprocessing pipeline for real-time inference',
        impact: 'Professional hands-on DL experience at a Bangalore-based AI company',
      },
    ] as any,
    logoUrl: '/images/companies/microgenesis.png',
  },
  {
    id: 'exp-shadow-fox',
    company: 'Shadow Fox',
    role: 'Data Science Intern',
    duration: '2025 · Part-time',
    startDate: '2025',
    endDate: '2025',
    location: 'Remote',
    type: 'internship',
    description: [
      'Executed end-to-end data science projects spanning data ingestion, EDA, feature engineering, model building, and visualization reporting',
      'Applied Python data stack (Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn) to derive actionable insights from structured real-world datasets',
      'Built classification and regression models with performance evaluation using cross-validation, confusion matrices, ROC-AUC curves, and F1 metrics',
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
    achievements: ['Completed all internship modules with project submissions', 'Built reusable data science notebook templates'],
    projects: [
      {
        name: 'Data Science Project Portfolio',
        description: 'Multiple end-to-end data science projects covering EDA, predictive modeling, and visualization',
        techStack: ['Python', 'Pandas', 'Scikit-Learn', 'Matplotlib', 'Seaborn'],
        problem: 'Real-world datasets require complete DS pipeline from messy raw data to actionable insights',
        solution: 'Systematic data science methodology: clean → analyze → model → visualize → communicate',
        impact: 'Demonstrates full data science pipeline proficiency across multiple problem domains',
        githubUrl: 'https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP',
      },
    ] as any,
    logoUrl: '/images/companies/shadowfox.png',
  },
]

// ============================================================
// EDUCATION
// ============================================================
export const education: Education[] = [
  {
    institution: 'Government College of Engineering, Kalahandi (GCE Kalahandi)',
    degree: 'Bachelor of Technology',
    field: 'Computer Science and Engineering',
    duration: '2023 – 2027',
    startYear: 2023,
    endYear: 2027,
    grade: 'CGPA: 8.10 / 10.00',
    activities: [
      'Member of KiloBots — Official Robotics Club of GCE Kalahandi, contributing to automation and embedded systems projects',
      'Active participant in college Tech-Fests, promoting innovation and technology-driven learning',
      'Volunteered in multiple college-level events, cultural fests, and sports competitions',
      'Pursuing advanced electives in AI/ML, Cloud Computing, and Software Engineering',
    ],
    logoUrl: '/images/colleges/gcek.png',
  },
  {
    institution: 'Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar',
    degree: 'Senior Secondary (Class XII)',
    field: 'Science — Physics, Chemistry, Mathematics, Biology (PCMB)',
    duration: '2021 – 2023',
    startYear: 2021,
    endYear: 2023,
    grade: 'CBSE — Science (PCMB)',
    activities: [
      'Ashoka House Sports Captain — led the house in inter-house athletics and sports events',
      'Competitive Chess Enthusiast — strategic thinker with tournament participation',
      'Badminton Player — participated in school-level and inter-house competitions',
      'Microsoft Office Specialist — proficient in Word, Excel, PowerPoint, Teams',
      'Ubuntu/Linux user from school level — self-taught OS fundamentals',
    ],
    logoUrl: '/images/colleges/kv.png',
  },
  {
    institution: 'Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar',
    degree: 'Secondary (Class X)',
    field: 'CBSE — All Subjects',
    duration: '2019 – 2021',
    startYear: 2019,
    endYear: 2021,
    grade: 'CBSE Board',
    activities: [
      'School-level sports participant — football, cricket, basketball, volleyball',
      'Leadership roles in school events and competitions',
    ],
    logoUrl: '/images/colleges/kv.png',
  },
]

// ============================================================
// CERTIFICATIONS
// ============================================================
export const certifications: Certification[] = [
  {
    id: 'cert-infosys-ai',
    title: 'Artificial Intelligence Internship Certificate',
    issuer: 'Infosys (Infosys Springboard / Virtual Internship 2.0)',
    date: 'Oct 2025',
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    skills: ['AI', 'Machine Learning', 'NLP', 'Python', 'Conversational AI'],
    category: 'ai_ml',
  },
  {
    id: 'cert-microgenesis-dl',
    title: 'Deep Learning Internship Certificate',
    issuer: 'MicroGenesis TechSoft, Bangalore',
    date: 'Jul 2025',
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    skills: ['Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'Computer Vision', 'NLP'],
    category: 'ai_ml',
  },
  {
    id: 'cert-eisystems-webdev',
    title: 'Web Development Internship Certificate',
    issuer: 'EISystems Technologies',
    date: 'Sep 2025',
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    skills: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Full-Stack Development'],
    category: 'development',
  },
  {
    id: 'cert-edunet-ai-analytics',
    title: 'Artificial Intelligence & Data Analytics Internship Certificate',
    issuer: 'Edunet Foundation',
    date: 'Aug 2025',
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    skills: ['AI', 'Data Analytics', 'Tableau', 'Microsoft Power BI', 'Data Visualization'],
    category: 'data',
  },
  {
    id: 'cert-edunet-ibm-cloud',
    title: 'AI and Cloud Technologies Internship Certificate (IBM Skills Build)',
    issuer: 'Edunet Foundation / IBM',
    date: 'Aug 2025',
    credentialUrl: 'https://github.com/HUNTER-X0s/CERTIFICATIONS',
    skills: ['IBM Watson', 'Cloud Computing', 'AI Agents', 'NLP', 'IBM Cloud'],
    category: 'cloud',
  },
  {
    id: 'cert-aicte-ev',
    title: 'AICTE Internship Certificate — EV Demand Prediction (Cycle 2)',
    issuer: 'AICTE / Edunet Foundation',
    date: 'Aug 2025',
    credentialUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
    skills: ['Machine Learning', 'Python', 'Scikit-Learn', 'Data Science', 'Predictive Modeling'],
    category: 'ai_ml',
  },
  {
    id: 'cert-shadow-fox-ds',
    title: 'Data Science Internship Certificate',
    issuer: 'Shadow Fox',
    date: '2025',
    credentialUrl: 'https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP',
    skills: ['Data Science', 'Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'EDA', 'Visualization'],
    category: 'data',
  },
]

// ============================================================
// BLOG POSTS
// ============================================================
export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'building-research-agent-ibm-watson',
    title: 'How I Built an Autonomous Research Agent with IBM Watson',
    excerpt:
      'A deep-dive into designing an agentic AI system that decomposes queries, retrieves multi-source information, and synthesizes structured research reports — lessons from the IBM Skills Build internship.',
    content: '',
    tags: ['AI Agents', 'IBM Watson', 'NLP', 'Python'],
    category: 'AI Engineering',
    date: 'Aug 2025',
    readTime: '10 min read',
    featured: true,
  },
  {
    id: 'blog-2',
    slug: 'deep-learning-intern-microgenesis-bangalore',
    title: 'My Deep Learning Internship at MicroGenesis TechSoft, Bangalore',
    excerpt:
      'From OpenCV preprocessing pipelines to PyTorch model training — everything I learned during 2 months of hands-on deep learning work at a professional AI company in Bangalore.',
    content: '',
    tags: ['Deep Learning', 'PyTorch', 'OpenCV', 'Computer Vision'],
    category: 'Machine Learning',
    date: 'Jul 2025',
    readTime: '12 min read',
    featured: true,
  },
  {
    id: 'blog-3',
    slug: 'ev-charging-demand-prediction-ml',
    title: 'Predicting EV Charging Demand: My AICTE Internship ML Project',
    excerpt:
      'How I designed a machine learning regression pipeline to forecast electric vehicle charging station demand — feature engineering strategies, model selection, and lessons learned.',
    content: '',
    tags: ['Machine Learning', 'Scikit-Learn', 'Python', 'Time Series'],
    category: 'Data Science',
    date: 'Aug 2025',
    readTime: '9 min read',
    featured: false,
  },
  {
    id: 'blog-4',
    slug: 'full-stack-next-internship-eisystems',
    title: 'Building Full-Stack Apps with Next.js — Lessons from My Web Dev Internship',
    excerpt:
      'What I learned building production-grade full-stack applications during my 3-month Web Development internship at EISystems Technologies using React, Next.js, and Node.js.',
    content: '',
    tags: ['Next.js', 'React.js', 'Node.js', 'Full Stack'],
    category: 'Full Stack',
    date: 'Sep 2025',
    readTime: '8 min read',
    featured: false,
  },
]

// ============================================================
// GITHUB STATS (live — fallback for API failure)
// ============================================================
export const githubStats: GitHubStats = {
  username: 'HUNTER-X0s',
  publicRepos: 14,
  followers: 0,
  following: 0,
  totalStars: 3,
  totalForks: 0,
  totalCommits: 200,
  topLanguages: [
    { name: 'Python',          percentage: 42, color: '#3572A5' },
    { name: 'Jupyter Notebook',percentage: 28, color: '#DA5B0B' },
    { name: 'JavaScript',      percentage: 16, color: '#f1e05a' },
    { name: 'Java',            percentage: 6,  color: '#b07219' },
    { name: 'Shell',           percentage: 4,  color: '#89e051' },
    { name: 'C++',             percentage: 4,  color: '#f34b7d' },
  ],
  contributionStreak: 0,
  profileUrl: 'https://github.com/HUNTER-X0s',
}

// ============================================================
// ROLE-SPECIFIC HERO CONTENT
// ============================================================
export const roleContents: Record<string, RoleContent> = {
  fullstack: {
    roleId: 'fullstack',
    hero: {
      headline: 'Full-Stack Developer',
      subheadline: 'Who Ships End-to-End Products',
      description:
        'I build complete web applications from pixel-perfect frontends to scalable backends. React + Next.js on the front, Node.js + Express on the back, MongoDB underneath. Currently building AI-enhanced web systems.',
      cta: 'See My Projects',
    },
    highlightedSkills: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    featuredProjectIds: ['currency-converter', 'portfolio-website', 'ai-chat-bot'],
    whyHireMe: {
      title: 'Why Hire Me as a Full-Stack Developer?',
      points: [
        'Proven full-stack experience from EISystems internship — delivered production-ready web apps in 3 months',
        'Strong in both React/Next.js performance optimization and Node.js API architecture',
        'AI-augmented development mindset — I integrate ML features naturally into web products',
        'Clean, maintainable code with component-based architecture and REST API design patterns',
        'CGPA 8.10 at GCE Kalahandi — strong CS fundamentals (DSA, DBMS, Networking, OS)',
      ],
    },
    terminalLines: [
      '$ whoami',
      '> Anurag Swain | B.Tech CSE @ GCE Kalahandi',
      '$ npm run build',
      '> Compiling full-stack application...',
      '> React.js ✓  |  Next.js ✓  |  Node.js ✓',
      '> Express.js ✓  |  MongoDB ✓  |  REST APIs ✓',
      '> EISystems Web Internship: COMPLETED ✓',
      '> Status: Available for Full-Stack roles ✨',
    ],
  },
  ai_engineer: {
    roleId: 'ai_engineer',
    hero: {
      headline: 'AI Engineer',
      subheadline: 'Building Intelligent Systems & Agents',
      description:
        'I build AI-powered systems that solve real problems — from conversational AI chatbots to autonomous research agents. 4 AI/ML internships. Hands-on with NLP, LLMs, IBM Watson, and Python AI stacks.',
      cta: 'See AI Projects',
    },
    highlightedSkills: ['Python', 'NLP', 'LLM APIs', 'IBM Watson', 'TensorFlow', 'PyTorch'],
    featuredProjectIds: ['ai-chat-bot', 'research-agent', 'ev-charging-prediction'],
    whyHireMe: {
      title: 'Why Hire Me as an AI Engineer?',
      points: [
        'Infosys AI Intern (3 months) — built production NLP chatbot with multi-turn dialogue management',
        'IBM Skills Build Research Agent — designed and shipped a complete agentic AI system',
        'Deep Learning Intern at MicroGenesis Bangalore — hands-on PyTorch, TensorFlow, Keras, OpenCV',
        'Full-stack capability — I can own the entire AI product, not just the model layer',
        '4 consecutive AI/ML internships in 2025 — rapid, committed growth trajectory',
      ],
    },
    terminalLines: [
      '$ python ai_engineer.py --mode production',
      '> Initializing AI systems...',
      '> NLP ✓  |  LLM APIs ✓  |  IBM Watson ✓',
      '> AI Chat Bot: SHIPPED ✓  |  ⭐1 GitHub star',
      '> Research Agent: IBM Skills Build CERTIFIED ✓',
      '> Infosys AI Internship: COMPLETED (3 months)',
      '> Status: Ready to build intelligent systems 🤖',
    ],
  },
  ml_engineer: {
    roleId: 'ml_engineer',
    hero: {
      headline: 'ML Engineer',
      subheadline: 'From Data to Production-Grade Models',
      description:
        'I design, train, and deploy machine learning systems. EV Demand Prediction, Deep Learning with PyTorch/TensorFlow, Data Science pipelines — I build models that solve measurable real-world problems.',
      cta: 'See ML Projects',
    },
    highlightedSkills: ['Python', 'Scikit-Learn', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy'],
    featuredProjectIds: ['ev-charging-prediction', 'data-science-internship-portfolio', 'ai-chat-bot'],
    whyHireMe: {
      title: 'Why Hire Me as an ML Engineer?',
      points: [
        'End-to-end ML pipeline experience: data cleaning → feature engineering → model training → evaluation → deployment',
        'AICTE-certified EV Charging Demand Prediction model using Scikit-Learn regression pipeline',
        'Deep Learning internship at MicroGenesis Bangalore — professional PyTorch, TensorFlow, Keras experience',
        'Shadow Fox Data Science internship — demonstrated complete DS pipeline across multiple project domains',
        'Strong Python data stack: Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, Jupyter — daily tools',
      ],
    },
    terminalLines: [
      '$ python train.py --model random_forest',
      '> Loading ML pipeline...',
      '> Scikit-Learn ✓  |  PyTorch ✓  |  TensorFlow ✓',
      '> EV Prediction Model: R² optimized ✓',
      '> AICTE Internship Cycle-2: CERTIFIED ✓',
      '> MicroGenesis DL Internship: COMPLETED ✓',
      '> Status: Open to ML Engineering roles 🧠',
    ],
  },
  dl_engineer: {
    roleId: 'dl_engineer',
    hero: {
      headline: 'Deep Learning Engineer',
      subheadline: 'Neural Networks That Solve Vision Problems',
      description:
        'I design and train deep learning architectures for computer vision and NLP. Hands-on with PyTorch, TensorFlow, Keras, and OpenCV from my MicroGenesis TechSoft internship in Bangalore.',
      cta: 'See DL Projects',
    },
    highlightedSkills: ['PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'Computer Vision', 'NLP'],
    featuredProjectIds: ['ai-chat-bot', 'ev-charging-prediction', 'research-agent'],
    whyHireMe: {
      title: 'Why Hire Me as a DL Engineer?',
      points: [
        'Hands-on DL internship at MicroGenesis TechSoft, Bangalore — professional CNN, RNN, CV experience',
        'Simultaneously proficient in PyTorch, TensorFlow, AND Keras — not locked into one framework',
        'OpenCV computer vision preprocessing pipeline experience from production ML environment',
        'Applied transfer learning with pre-trained CNNs (VGG, ResNet) for real-world classification tasks',
        'Strong theoretical foundation: CGPA 8.10 + dedicated Deep Learning coursework',
      ],
    },
    terminalLines: [
      '$ python train_cnn.py --arch resnet --epochs 50',
      '> Initializing deep learning pipeline...',
      '> PyTorch ✓  |  TensorFlow ✓  |  Keras ✓',
      '> OpenCV preprocessing: READY ✓',
      '> MicroGenesis TechSoft Bangalore: COMPLETED ✓',
      '> Architectures: CNN · RNN · Transfer Learning',
      '> Status: Ready to train the next model 🧠',
    ],
  },
  data_scientist: {
    roleId: 'data_scientist',
    hero: {
      headline: 'Data Scientist',
      subheadline: 'Turning Raw Data Into Business Decisions',
      description:
        'I apply statistical reasoning and ML to extract insights that drive decisions. From EDA and feature engineering to predictive modeling — I deliver results across multiple data science internships.',
      cta: 'See Data Projects',
    },
    highlightedSkills: ['Python', 'Pandas', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'Statistical Analysis'],
    featuredProjectIds: ['ev-charging-prediction', 'data-science-internship-portfolio', 'research-agent'],
    whyHireMe: {
      title: 'Why Hire Me as a Data Scientist?',
      points: [
        '3 data-focused internships: Shadow Fox DS, Edunet AI/Analytics, MicroGenesis DL',
        'EV Demand Prediction — complete supervised ML regression pipeline from raw data to model evaluation',
        'Proficient in full Python data stack: Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn, Jupyter',
        'Tableau and Power BI experience for business-facing data visualization and dashboard creation',
        'Strong statistical foundations through B.Tech CS curriculum: probability, statistics, algorithms',
      ],
    },
    terminalLines: [
      '$ jupyter lab --project ev_prediction',
      '> Starting data science environment...',
      '> Pandas ✓  |  Scikit-Learn ✓  |  Seaborn ✓',
      '> Shadow Fox DS Internship: CERTIFIED ✓',
      '> AICTE EV Project: DELIVERED ✓',
      '> Tools: Tableau · Power BI · Jupyter',
      '> Status: Open to Data Science roles 🔬',
    ],
  },
  data_analyst: {
    roleId: 'data_analyst',
    hero: {
      headline: 'Data Analyst',
      subheadline: 'Turning Numbers Into Actionable Stories',
      description:
        'I transform raw data into clear, decision-driving insights. Tableau, Power BI, Python, and SQL — from the Edunet Foundation AI & Data Analytics internship to AICTE-certified project delivery.',
      cta: 'See Analytics Work',
    },
    highlightedSkills: ['Tableau', 'Power BI', 'Python', 'SQL', 'Matplotlib', 'Data Visualization'],
    featuredProjectIds: ['ev-charging-prediction', 'data-science-internship-portfolio'],
    whyHireMe: {
      title: 'Why Hire Me as a Data Analyst?',
      points: [
        'Edunet Foundation Data Analytics internship — hands-on Tableau and Microsoft Power BI dashboard creation',
        'Strong SQL and MySQL skills for complex data querying and transformation',
        'Python analytics stack (Pandas, Matplotlib, Seaborn) for deeper statistical analysis beyond BI tools',
        'Communicated insights from EV demand data to both technical and non-technical stakeholders',
        'AICTE-recognized analytical work — validates real-world data problem-solving capability',
      ],
    },
    terminalLines: [
      '$ python analyze_data.py --source ev_dataset',
      '> Loading analytics environment...',
      '> Tableau ✓  |  Power BI ✓  |  SQL ✓',
      '> Pandas ✓  |  Matplotlib ✓  |  Seaborn ✓',
      '> Edunet AI & Data Analytics: CERTIFIED ✓',
      '> Dashboards built: EV Demand · Research Metrics',
      '> Status: Ready to find your insights 📊',
    ],
  },
  frontend: {
    roleId: 'frontend',
    hero: {
      headline: 'Frontend Developer',
      subheadline: 'Crafting Fast, Beautiful, Responsive UIs',
      description:
        'I build frontend experiences that are visually engaging, fast, and accessible. React, Next.js, JavaScript, and Tailwind CSS — with a strong eye for Figma-to-code design fidelity.',
      cta: 'See UI Projects',
    },
    highlightedSkills: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    featuredProjectIds: ['currency-converter', 'portfolio-website'],
    whyHireMe: {
      title: 'Why Hire Me as a Frontend Developer?',
      points: [
        'EISystems Web Dev internship — built production React + Next.js frontends delivered to real users',
        'Built the Currency Converter (150+ currencies) with clean, responsive vanilla JS — no framework needed',
        'Strong HTML/CSS foundations — responsive design, flexbox/grid, animations, and accessibility basics',
        'Figma and Canva proficiency — I can bridge design and code without designer dependency',
        'Component-based architecture mindset from React internship experience',
      ],
    },
    terminalLines: [
      '$ npm run dev',
      '> Starting Next.js development server...',
      '> React.js ✓  |  Next.js ✓  |  Tailwind ✓',
      '> JavaScript ✓  |  HTML5 ✓  |  CSS3 ✓',
      '> Currency Converter: LIVE ⭐1 ✓',
      '> EISystems Web Internship: COMPLETED ✓',
      '> Status: Ready to craft stunning UIs 🎨',
    ],
  },
  backend: {
    roleId: 'backend',
    hero: {
      headline: 'Backend Developer',
      subheadline: 'APIs, Databases & Scalable Systems',
      description:
        'I architect backend systems that work reliably under load. Node.js + Express for REST APIs, MongoDB for data persistence, Python for computation-heavy services. Intern-proven with EISystems Technologies.',
      cta: 'See Backend Work',
    },
    highlightedSkills: ['Node.js', 'Express.js', 'Python', 'MongoDB', 'MySQL', 'REST APIs'],
    featuredProjectIds: ['ai-chat-bot', 'ev-charging-prediction'],
    whyHireMe: {
      title: 'Why Hire Me as a Backend Developer?',
      points: [
        'EISystems internship — designed and implemented REST API endpoints consumed by React.js frontend',
        'MongoDB and MySQL experience for both NoSQL and relational data modeling',
        'Python backend expertise — FastAPI-style service design patterns from AI internship work',
        'Strong CS fundamentals: DBMS, Computer Networks, OS, OOP — the building blocks of reliable backends',
        'CGPA 8.10 at GCE Kalahandi — validates algorithmic and systems-level thinking',
      ],
    },
    terminalLines: [
      '$ node server.js --env production',
      '> Starting backend services...',
      '> Node.js ✓  |  Express.js ✓  |  Python ✓',
      '> MongoDB CONNECTED  |  MySQL CONNECTED',
      '> REST API endpoints: ACTIVE',
      '> EISystems Backend Internship: DELIVERED ✓',
      '> Status: Available for backend roles ⚙️',
    ],
  },
  cloud: {
    roleId: 'cloud',
    hero: {
      headline: 'Cloud Engineer',
      subheadline: 'IBM Cloud, Linux & Scalable Infrastructure',
      description:
        'I work with cloud platforms for deploying AI and web systems. IBM Cloud and Watson APIs from the IBM Skills Build internship, Linux system administration, and Git-based CI/CD workflows.',
      cta: 'See Cloud Projects',
    },
    highlightedSkills: ['IBM Watson', 'IBM Cloud', 'Linux', 'Git/GitHub', 'Shell Scripting', 'Cloud Computing'],
    featuredProjectIds: ['research-agent', 'ev-charging-prediction'],
    whyHireMe: {
      title: 'Why Hire Me as a Cloud Engineer?',
      points: [
        'IBM Skills Build internship — deployed AI workloads using IBM Watson and IBM Cloud services',
        'Linux and Ubuntu experience including shell scripting and command-line system administration',
        'Strong Git/GitHub workflow proficiency — version control, branching, collaboration on 14+ repos',
        'Cloud Computing coursework at GCE Kalahandi — theoretical foundations in distributed systems',
        'Self-motivated learner actively pursuing cloud certifications to complement hands-on internship work',
      ],
    },
    terminalLines: [
      '$ ibmcloud login --sso',
      '> Connecting to IBM Cloud...',
      '> IBM Watson ✓  |  IBM Cloud ✓  |  Linux ✓',
      '> Git/GitHub: 14 repos MANAGED ✓',
      '> Shell Scripting: ACTIVE ✓',
      '> IBM Skills Build Research Agent: CERTIFIED ✓',
      '> Status: Exploring cloud infrastructure roles ☁️',
    ],
  },
}
