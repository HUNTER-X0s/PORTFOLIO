// ============================================================
// ENHANCED EXPERIENCE DATA — ANURAG SWAIN
// Every internship linked to concrete projects with
// problem → solution → tech → impact structure
// ============================================================

export interface InternshipProject {
  id: string
  name: string
  tagline: string
  description: string
  problem: string
  solution: string
  architecture: string[]
  techStack: string[]
  impact: string
  results: string[]
  githubUrl: string | null
  liveUrl: string | null
  status: 'live' | 'completed' | 'archived'
}

export interface EnhancedExperience {
  id: string
  company: string
  companyFullName: string
  companyUrl: string | null
  role: string
  roleType: 'internship' | 'full-time' | 'part-time' | 'freelance'
  startDate: string
  endDate: string
  duration: string
  location: string
  locationType: 'remote' | 'hybrid' | 'onsite'
  companyLogo: string
  companyColor: string
  overview: string                // one-liner summary for timeline view
  responsibilities: string[]      // bullet points
  techStack: string[]             // all tech used
  achievements: string[]          // key wins with metrics
  projects: InternshipProject[]   // linked projects (CRITICAL)
  certificationId: string | null  // links to certifications.ts
  linkedInUrl: string | null
  order: number                   // display order (1=most recent)
}

// ============================================================
// EXPERIENCES WITH PROJECT MAPPING
// ============================================================
export const enhancedExperiences: EnhancedExperience[] = [

  // ══════════════════════════════════════════════════════════
  // 1. INFOSYS — AI INTERN (Aug–Oct 2025)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-infosys-ai-2025',
    company: 'Infosys',
    companyFullName: 'Infosys Limited',
    companyUrl: 'https://www.infosys.com',
    role: 'Artificial Intelligence Intern',
    roleType: 'internship',
    startDate: 'Aug 2025',
    endDate: 'Oct 2025',
    duration: '3 months',
    location: 'Remote',
    locationType: 'remote',
    companyLogo: '/images/logos/infosys.png',
    companyColor: '#007CC3',
    overview: 'Engineered a production-ready conversational AI chatbot with multi-turn dialogue management, intent classification, and generative LLM integration at one of India\'s largest IT services companies, demonstrating enterprise-grade NLP capabilities.',
    responsibilities: [
      'Spearheaded the design and development of a scalable Python-based conversational AI chatbot, utilizing advanced NLP techniques such as tokenization, intent classification, and named entity recognition for highly accurate natural language understanding',
      'Engineered a robust multi-turn dialogue management system featuring session-state memory and context windowing, enabling seamless, contextually coherent conversations across complex, multi-step user interactions',
      'Integrated state-of-the-art LLM APIs to power generative response production, employing rigorous prompt engineering strategies to maximize response accuracy, relevance, and safety',
      'Conducted extensive model evaluation using precision, recall, and F1-score metrics; iteratively tuned classification thresholds to drastically minimize false-positive intent assignments and improve user experience',
      'Authored comprehensive technical documentation and delivered a live technical demonstration to Infosys senior evaluators, securing a highly positive performance assessment on practical AI system architecture',
      'Optimized natural language processing pipelines to reduce response latency by 30%, ensuring real-time conversational fluency for end users'
    ],
    techStack: ['Python', 'NLP', 'LLM APIs', 'Machine Learning', 'Intent Classification', 'Entity Recognition', 'Dialogue Management', 'Prompt Engineering'],
    achievements: [
      'Published AI Chat Bot on GitHub — received ⭐1 community star',
      'Completed Infosys Virtual Internship 2.0 (3-month program)',
      'Received Infosys internship completion certificate',
      'Implemented context-aware dialogue system handling multi-turn conversations without context loss',
    ],
    projects: [
      {
        id: 'proj-infosys-chatbot',
        name: 'AI Chat Bot',
        tagline: 'Multi-turn conversational AI chatbot with NLP intent classification and LLM response generation',
        description:
          'A fully functional, Python-based AI chatbot developed during the Infosys Virtual Internship 2.0. The bot uses NLP-based intent classification to understand user queries, maintains multi-turn conversation context via a session memory module, and leverages LLM APIs to generate contextually appropriate, coherent responses.',
        problem:
          'Rule-based chatbots break down when user intent deviates from pre-scripted patterns — they fail to understand paraphrasing, context shifts, or compound queries, resulting in frustrating user experiences.',
        solution:
          'Built an NLP-first intent classification pipeline that tokenizes and classifies user input into intent categories. A session memory module tracks conversation history. LLM API generates responses conditioned on full conversation context, enabling natural, adaptive dialogue.',
        architecture: [
          'Input preprocessing: tokenization, stopword removal, text normalization',
          'Intent classifier: ML-based multi-class classification with confidence scoring',
          'Entity extractor: named entity recognition for extracting key information',
          'Session manager: in-memory conversation history with context window management',
          'LLM response generator: prompt construction from context + LLM API call',
          'Output post-processor: response validation and formatting',
        ],
        techStack: ['Python', 'NLP', 'LLM APIs', 'Machine Learning', 'Intent Classification', 'Dialogue Systems'],
        impact: 'Community-starred GitHub project (⭐1); demonstrates complete NLP pipeline from intent understanding to context-aware generation — a core AI engineering competency.',
        results: [
          'Handles multi-turn conversations with consistent contextual coherence',
          'Achieved ⭐1 GitHub star from developer community',
          'Completed as Infosys internship deliverable with positive evaluation',
        ],
        githubUrl: 'https://github.com/HUNTER-X0s/AI_CHAT_BOT',
        liveUrl: null,
        status: 'live',
      },
    ],
    certificationId: 'cert-infosys-ai-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-cse07/',
    order: 1,
  },

  // ══════════════════════════════════════════════════════════
  // 2. EISYSTEMS — WEB DEV INTERN (Jul–Sep 2025)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-eisystems-webdev-2025',
    company: 'EISystems',
    companyFullName: 'EISystems Technologies',
    companyUrl: 'https://www.eisystems.in',
    role: 'Web Development Intern',
    roleType: 'internship',
    startDate: 'Jul 2025',
    endDate: 'Sep 2025',
    duration: '3 months',
    location: 'Remote',
    locationType: 'remote',
    companyLogo: '/images/logos/eisystems.png',
    companyColor: '#E64C3C',
    overview: 'Architected and shipped end-to-end full-stack web applications from the ground up, utilizing React, Next.js, Node.js, and MongoDB to deliver high-performance, SEO-optimized business solutions.',
    responsibilities: [
      'Engineered highly responsive, performant, and accessible frontend user interfaces using React.js with advanced hooks (useState, useEffect, useContext) and Next.js for server-side rendering, significantly boosting SEO and initial load speeds',
      'Architected and implemented secure RESTful API endpoints using a Node.js and Express.js backend, seamlessly integrating MongoDB for persistent, scalable data storage with optimized, indexed schema designs',
      'Pioneered a component-based UI architecture to construct a comprehensive, reusable component library, cutting down feature delivery time by 40% across subsequent agile development sprints',
      'Deployed advanced web performance optimization strategies—including code splitting, dynamic module imports, lazy loading, and intelligent API response caching—to achieve near-perfect Core Web Vitals scores',
      'Thrived in a fast-paced agile environment: actively participated in rigorous sprint planning, daily standups, peer code reviews, and consistently met strict weekly milestone delivery targets without senior developer oversight',
      'Implemented robust state management solutions and secure JWT-based authentication flows to protect user data and ensure seamless session persistence across the application ecosystem'
    ],
    techStack: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs', 'CSS3', 'HTML5'],
    achievements: [
      'Delivered complete website development project within 3-month timeline',
      'Implemented full-stack features independently end-to-end without senior developer handholding',
      'Received official Web Development internship certificate from EISystems Technologies',
      'Improved application performance through lazy loading and caching strategies',
    ],
    projects: [
      {
        id: 'proj-eisystems-fullstack',
        name: 'Full-Stack Business Web Platform',
        tagline: 'Production-ready full-stack web application with React frontend and Node.js backend',
        description:
          'A complete full-stack web application built from requirements to deployment during the EISystems Technologies internship. Features a React.js + Next.js frontend consuming a Node.js + Express.js REST API backend, with MongoDB for data persistence. Delivered all features independently across 3-month engagement.',
        problem:
          'The client needed a modern, responsive web platform with dynamic content management, user-facing pages with server-side rendering for SEO performance, and a clean REST API backend for data operations.',
        solution:
          'Implemented a Next.js frontend with SSR for SEO-optimized pages and a separate Node.js + Express.js API layer for business logic, connected to MongoDB. Applied component-driven React architecture for maintainable, scalable UI code.',
        architecture: [
          'Next.js frontend: SSR pages + client-side React for dynamic sections',
          'Component library: reusable React components with props-driven customization',
          'Express.js API: RESTful routes with middleware for auth, validation, error handling',
          'MongoDB: document collections with indexed fields for query performance',
          'API integration: Axios-based client with error handling and loading states',
          'Performance: code splitting, lazy loading, image optimization',
        ],
        techStack: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs'],
        impact: 'Production-grade full-stack web application delivered within 3-month internship; demonstrates complete end-to-end web engineering capability without dependency on senior developers.',
        results: [
          'Complete working application delivered on schedule',
          'Full-stack implementation: frontend + API + database owned independently',
          'Received EISystems web development internship certificate',
        ],
        githubUrl: null,
        liveUrl: null,
        status: 'completed',
      },
    ],
    certificationId: 'cert-eisystems-webdev-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-cse07/',
    order: 2,
  },

  // ══════════════════════════════════════════════════════════
  // 3. EDUNET FOUNDATION — AI & CLOUD (Jul–Aug 2025)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-edunet-ai-cloud-2025',
    company: 'Edunet Foundation',
    companyFullName: 'Edunet Foundation / IBM Skills Build',
    companyUrl: 'https://edunetfoundation.org',
    role: 'AI & Data Analytics · AI & Cloud Technologies Intern',
    roleType: 'internship',
    startDate: 'Jul 2025',
    endDate: 'Aug 2025',
    duration: '2 months',
    location: 'Remote',
    locationType: 'remote',
    companyLogo: '/images/logos/edunet.png',
    companyColor: '#F39C12',
    overview: 'Executed a high-impact dual-role internship, delivering an AICTE-certified EV Charging Demand Prediction ML system and an autonomous IBM Skills Build Research Agent utilizing advanced Cloud and Watson APIs.',
    responsibilities: [
      'Architected and trained an advanced EV Charging Demand Prediction machine learning pipeline (for AICTE Internship Cycle-2) utilizing Scikit-Learn regression models, featuring comprehensive temporal and cyclical feature engineering',
      'Developed an autonomous IBM Skills Build capstone Research Agent—an intelligent AI system capable of orchestrating complex web retrieval, multi-document NLP summarization, and structured, cited report generation',
      'Successfully integrated enterprise-grade IBM Watson and IBM Cloud APIs to power the Research Agent, showcasing advanced cloud-native AI development and API orchestration capabilities',
      'Designed and deployed interactive, real-time Tableau and Power BI dashboards that transformed complex analytical datasets into actionable visual insights for non-technical business stakeholders',
      'Executed deep exploratory data analysis (EDA) techniques to uncover hidden demand-driving temporal patterns, spatial correlations, and usage anomalies in massive EV station datasets',
      'Optimized predictive model performance through rigorous cross-validation and hyperparameter tuning, achieving state-of-the-art R² scores and significantly minimizing Mean Absolute Error (MAE)'
    ],
    techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'IBM Watson', 'IBM Cloud', 'NLP', 'Tableau', 'Power BI', 'Jupyter Notebook'],
    achievements: [
      'EV Prediction GitHub repo received ⭐1 star from community',
      'Research Agent selected as IBM Skills Build internship capstone',
      'Completed dual roles simultaneously: AI & Data Analytics + AI & Cloud Technologies',
      'Received 2 separate internship certificates from Edunet Foundation',
    ],
    projects: [
      {
        id: 'proj-edunet-ev-prediction',
        name: 'EV Vehicle Charging Demand Prediction',
        tagline: 'AICTE Cycle-2 certified ML pipeline forecasting EV station demand with Random Forest regression',
        description:
          'An end-to-end machine learning pipeline built for AICTE Internship Cycle-2. Forecasts electric vehicle charging station demand using historical usage data enriched with temporal features. The Random Forest Regressor achieved the best performance across multiple candidate models, with comprehensive evaluation via cross-validation, RMSE, MAE, and R² metrics.',
        problem:
          'EV charging stations experience unpredictable demand peaks and valleys — energy over-allocation wastes resources during low-demand periods, while under-allocation causes user wait times during surges. Operators lack data-driven demand forecasting tools.',
        solution:
          'Built a Scikit-Learn regression pipeline with extensive temporal feature engineering (hour-of-day encoding, day-of-week encoding, rolling average windows, lag features). Compared Random Forest, Gradient Boosting, and Linear Regression. Random Forest gave best generalization. Applied cross-validation for robust evaluation.',
        architecture: [
          'Data ingestion: CSV station logs loaded with Pandas, null handling, type casting',
          'EDA: Matplotlib + Seaborn — demand distribution, temporal patterns, correlations',
          'Feature engineering: temporal encoding, rolling averages, lag features, cyclical encoding',
          'Model comparison: Random Forest, Gradient Boosting, Linear Regression',
          'Evaluation: 5-fold CV, RMSE, MAE, R², residual analysis',
          'Visualization: predicted vs actual plots, feature importance charts',
        ],
        techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
        impact: 'AICTE Internship Cycle-2 certified; GitHub ⭐1 star; baseline error reduction via temporal feature engineering; demonstrates production-oriented ML pipeline design for real-world energy domain.',
        results: [
          'Random Forest achieved strongest R² vs baseline and simpler models',
          'Identified hour-of-day and weekday/weekend as top demand drivers',
          'AICTE government certification received (Aug 2025)',
          'GitHub ⭐1 star from developer community',
        ],
        githubUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
        liveUrl: null,
        status: 'live',
      },
      {
        id: 'proj-edunet-research-agent',
        name: 'Research Agent (IBM Skills Build Capstone)',
        tagline: 'Autonomous AI agent for multi-source research synthesis using IBM Watson and NLP',
        description:
          'An agentic AI system built as the IBM Skills Build internship capstone project. The agent takes a research query, decomposes it into sub-tasks, autonomously retrieves information from multiple web sources, applies NLP-based summarization per source, cross-references findings, and assembles a structured research report with citations — reducing manual research time significantly.',
        problem:
          'Complex research queries require manually searching, reading, filtering, and synthesizing information across dozens of web sources — a process taking hours and prone to selection bias and missed insights.',
        solution:
          'Designed an agent orchestration layer that decomposes queries into retrieval sub-tasks. Integrated IBM Watson APIs for enterprise AI capabilities. Web scraping + NLP summarization pipeline processes each source. An assembly module synthesizes multi-source outputs into a structured, cited report.',
        architecture: [
          'Query decomposer: breaks complex queries into atomic retrieval sub-tasks',
          'Web retriever: scrapes target URLs, handles pagination and content extraction',
          'NLP summarizer: extracts key sentences and insights per source document',
          'IBM Watson integration: enhanced NLP capabilities via Watson APIs',
          'Cross-reference module: identifies consistent vs conflicting information across sources',
          'Report assembler: structures findings into sections with citations and confidence scores',
        ],
        techStack: ['Python', 'IBM Watson', 'IBM Cloud', 'NLP', 'LLM APIs', 'Web Scraping', 'Jupyter Notebook', 'Pandas'],
        impact: 'IBM Skills Build capstone project recognized in internship evaluation; demonstrates advanced agentic AI system design beyond simple model training — a highly valued capability for AI engineering roles.',
        results: [
          'Automates research workflows reducing manual effort by ~70% on test queries',
          'Multi-source synthesis with structured citation output',
          'IBM Skills Build internship capstone recognition received',
        ],
        githubUrl: 'https://github.com/HUNTER-X0s/RESEARCH_AGENT',
        liveUrl: null,
        status: 'live',
      },
    ],
    certificationId: 'cert-edunet-ai-analytics-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-cse07/',
    order: 3,
  },

  // ══════════════════════════════════════════════════════════
  // 4. MICROGENESIS — DEEP LEARNING INTERN (Jun–Jul 2025)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-microgenesis-dl-2025',
    company: 'MicroGenesis TechSoft',
    companyFullName: 'MicroGenesis TechSoft Pvt Ltd',
    companyUrl: 'https://microgenesis.in',
    role: 'Deep Learning Intern',
    roleType: 'internship',
    startDate: 'Jun 2025',
    endDate: 'Jul 2025',
    duration: '2 months',
    location: '5th Floor, Tower C, Golden Enclave, Old Airport Rd, Bangalore – 560017',
    locationType: 'hybrid',
    companyLogo: '/images/logos/microgenesis.png',
    companyColor: '#00BFA5',
    overview: 'Contributed to professional Deep Learning engineering at a leading Bangalore AI firm, developing robust Computer Vision pipelines using PyTorch, TensorFlow, Keras, and advanced OpenCV processing techniques.',
    responsibilities: [
      'Engineered, trained, and rigorously evaluated complex deep learning computer vision models, achieving proficiency across all three major DL frameworks simultaneously: PyTorch, TensorFlow, and Keras',
      'Developed highly optimized OpenCV-based image preprocessing pipelines for real-time video frame analysis, incorporating advanced edge detection (Canny, Sobel), morphological operations, contour extraction, and adaptive histogram equalization',
      'Pioneered the application of transfer learning methodologies utilizing massive pre-trained CNN architectures (VGG16, ResNet50) for targeted feature extraction and domain adaptation, slashing training compute requirements by over 60%',
      'Architected comprehensive data pipelines: from raw dataset collection and meticulous manual annotation to advanced augmentation (rotation, noise injection, color jitter, cutout) and stratified train/validation/test splitting',
      'Executed exhaustive model evaluation protocols leveraging precision, recall, F1-score matrices, ROC-AUC curves, and detailed epoch-wise learning curves, culminating in comprehensive technical research reports',
      'Thrived in a collaborative hybrid office environment at the Bangalore HQ, mastering professional ML project lifecycles, version control practices, and team-based algorithmic research methodologies'
    ],
    techStack: ['Python', 'PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'Scikit-Learn', 'Deep Learning', 'Computer Vision', 'NLP', 'NumPy', 'Matplotlib', 'Seaborn'],
    achievements: [
      'Gained professional DL experience at an established Bangalore AI/ML firm (Hybrid)',
      'Proficient in PyTorch, TensorFlow, AND Keras simultaneously — rare multi-framework competency',
      'Received 12+ LinkedIn skill endorsements directly from MicroGenesis TechSoft',
      'Applied transfer learning reducing training time by ~60% vs training from scratch',
      'Received MicroGenesis TechSoft Deep Learning internship certificate',
    ],
    projects: [
      {
        id: 'proj-microgenesis-cv-system',
        name: 'Computer Vision Deep Learning System',
        tagline: 'CNN-based visual recognition system with OpenCV preprocessing and transfer learning — MicroGenesis TechSoft, Bangalore',
        description:
          'A deep learning computer vision system developed at MicroGenesis TechSoft using CNN architectures for visual recognition tasks. The project covered the complete DL pipeline: data collection and annotation, OpenCV preprocessing, model design with transfer learning (VGG/ResNet), training with augmentation, and comprehensive evaluation. Built across PyTorch, TensorFlow, and Keras frameworks.',
        problem:
          'Real-world computer vision tasks require robust preprocessing pipelines to handle image variability (lighting, scale, rotation, noise), accurate classification under distribution shift, and efficient training without prohibitive compute requirements.',
        solution:
          'Implemented OpenCV preprocessing pipeline handling all common image transformations. Applied transfer learning with pre-trained CNN feature extractors (VGG16, ResNet50) fine-tuned on the target domain — dramatically reducing data and compute requirements. Used comprehensive augmentation to improve generalization.',
        architecture: [
          'Data pipeline: OpenCV-based preprocessing (resize, normalize, augment) → PyTorch DataLoader',
          'Model design: VGG16/ResNet50 feature extractor → custom classification head',
          'Transfer learning: freeze backbone → train head → gradual unfreezing for fine-tuning',
          'Loss & optimizer: CrossEntropyLoss + Adam with learning rate scheduling',
          'Evaluation: confusion matrix, precision/recall/F1, ROC-AUC, epoch curves',
          'Parallel implementation in TensorFlow/Keras for framework comparison',
        ],
        techStack: ['Python', 'PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-Learn'],
        impact: 'Professional deep learning experience at MicroGenesis TechSoft Bangalore; 12+ LinkedIn skill endorsements from company; demonstrates multi-framework DL competency highly valued by AI employers.',
        results: [
          'Transfer learning reduced training time by ~60% vs from-scratch baseline',
          'Comprehensive evaluation pipeline across all standard DL metrics',
          '12+ LinkedIn endorsements from MicroGenesis TechSoft professionals',
          'Completed hybrid internship at professional Bangalore AI firm',
        ],
        githubUrl: null,
        liveUrl: null,
        status: 'completed',
      },
    ],
    certificationId: 'cert-microgenesis-dl-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-cse07/',
    order: 4,
  },


]
