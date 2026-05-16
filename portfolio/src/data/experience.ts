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
    overview: 'Built a production NLP chatbot with multi-turn dialogue at one of India\'s largest IT companies.',
    responsibilities: [
      'Designed and developed a Python-based conversational AI chatbot leveraging NLP techniques (tokenization, intent classification, named entity recognition) for natural language understanding',
      'Implemented a multi-turn dialogue management system with session-state memory, enabling contextually coherent conversations across multiple exchanges',
      'Integrated LLM APIs for generative response production, applying systematic prompt engineering strategies to improve response accuracy and relevance',
      'Conducted model evaluation using precision, recall, and F1-score metrics; iterated on classification thresholds to minimize false-positive intent assignments',
      'Delivered a live technical demonstration and written documentation to Infosys evaluators, receiving positive assessment on practical AI application design',
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
    overview: 'Shipped end-to-end full-stack web applications with React, Next.js, Node.js, and MongoDB.',
    responsibilities: [
      'Engineered responsive, high-performance frontend UIs using React.js with hooks (useState, useEffect, useContext) and Next.js for server-side rendering and routing',
      'Designed and implemented RESTful API endpoints with Node.js + Express.js backend, integrating MongoDB for persistent data storage with optimized schema design',
      'Applied component-based architecture principles to build a reusable, maintainable UI component library, reducing feature delivery time across sprints',
      'Implemented performance optimization strategies including code splitting, dynamic imports, lazy loading, and API response caching to improve Core Web Vitals scores',
      'Collaborated in agile sprint cycles: participated in sprint planning, daily standups, code reviews, and weekly milestone delivery',
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
    overview: 'Built AICTE-certified EV Prediction ML system and IBM Skills Build Research Agent in a dual-role AI internship.',
    responsibilities: [
      'Designed and trained an EV Charging Demand Prediction ML pipeline (AICTE Internship Cycle-2) using Scikit-Learn regression models with comprehensive temporal feature engineering',
      'Built an IBM Skills Build capstone Research Agent — an autonomous AI system that orchestrates web retrieval, NLP summarization, and structured report generation',
      'Leveraged IBM Watson and IBM Cloud APIs for enterprise-grade AI integration in the Research Agent project, demonstrating cloud-native AI development',
      'Created interactive Tableau and Power BI dashboards visualizing key patterns and actionable insights from analytical datasets for business stakeholder consumption',
      'Applied exploratory data analysis techniques to identify demand-driving temporal patterns in EV station usage data',
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
    overview: 'Professional DL engineering at a Bangalore AI firm — CNN training with PyTorch, TensorFlow, Keras + OpenCV computer vision pipelines.',
    responsibilities: [
      'Designed, trained, and evaluated deep learning computer vision models using all three major DL frameworks simultaneously: PyTorch, TensorFlow, and Keras',
      'Implemented OpenCV-based image preprocessing pipelines for real-time frame analysis, including edge detection (Canny, Sobel), morphological operations, contour extraction, and histogram equalization',
      'Applied transfer learning methodology with pre-trained CNN architectures (VGG16, ResNet50) for feature extraction and domain adaptation — reducing training compute requirements significantly',
      'Performed comprehensive data pipeline design: dataset collection, manual annotation, augmentation (rotation, flipping, noise injection, color jitter, cutout), normalization, and stratified train/val/test splitting',
      'Conducted rigorous model evaluation with precision, recall, F1-score, confusion matrices, ROC-AUC curves, and epoch-wise loss/accuracy learning curves — documented in technical reports',
      'Collaborated in hybrid office environment at Bangalore HQ, gaining professional ML project workflow experience and team-based research practices',
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

  // ══════════════════════════════════════════════════════════
  // 5. SHADOW FOX — DATA SCIENCE INTERN (2025)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-shadowfox-ds-2025',
    company: 'Shadow Fox',
    companyFullName: 'Shadow Fox',
    companyUrl: null,
    role: 'Data Science Intern',
    roleType: 'internship',
    startDate: '2025',
    endDate: '2025',
    duration: '~2 months',
    location: 'Remote',
    locationType: 'remote',
    companyLogo: '/images/logos/shadowfox.png',
    companyColor: '#7C3AED',
    overview: 'End-to-end data science pipeline execution across multiple domain datasets — from raw EDA to predictive model delivery.',
    responsibilities: [
      'Executed complete data science workflows across multiple domain datasets: ingestion → cleaning → EDA → feature engineering → model training → evaluation → visualization',
      'Applied classification and regression modeling with Scikit-Learn, implementing cross-validation, hyperparameter tuning, and performance evaluation (ROC-AUC, confusion matrix, R²)',
      'Handled imbalanced datasets using SMOTE and class-weighting strategies to improve minority class prediction performance',
      'Built reproducible Jupyter Notebook pipelines with clear markdown documentation — reusable templates for common EDA patterns',
      'Produced business-friendly visualization reports communicating statistical findings to non-technical audiences',
    ],
    techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
    achievements: [
      'Completed all Shadow Fox internship modules with deliverable submissions',
      'Built reusable Jupyter Notebook EDA templates for future data projects',
      'Handled imbalanced dataset challenges using SMOTE',
      'Received Shadow Fox Data Science internship certificate',
    ],
    projects: [
      {
        id: 'proj-shadowfox-ds-portfolio',
        name: 'Data Science Project Portfolio',
        tagline: 'Multiple end-to-end ML projects covering EDA, feature engineering, classification, and regression across real-world datasets',
        description:
          'A structured collection of data science projects developed during the Shadow Fox internship, covering the complete data science pipeline from raw data ingestion and exploratory analysis through feature engineering, model building, evaluation, and visualization reporting. Multiple domain datasets were analyzed and modeled.',
        problem:
          'Real-world datasets are messy and heterogeneous — missing values, outliers, skewed distributions, imbalanced classes, and poorly structured features make direct modeling ineffective. A systematic pipeline is needed to transform raw data into reliable ML inputs.',
        solution:
          'Applied systematic data science methodology: (1) Data profiling and cleaning with Pandas; (2) EDA with Seaborn/Matplotlib to identify patterns and anomalies; (3) Feature engineering and selection; (4) Model training with cross-validation; (5) Evaluation with multiple metrics; (6) Business-friendly visualization reporting.',
        architecture: [
          'Data ingestion: Pandas read_csv with dtype specification and initial profiling',
          'Cleaning: missing value imputation, outlier detection (IQR, Z-score), type correction',
          'EDA: distribution plots, correlation heatmaps, pairplots, temporal trends',
          'Feature engineering: encoding (label/one-hot), scaling, polynomial features',
          'Imbalance handling: SMOTE oversampling, class weighting',
          'Modeling: Logistic Regression, Random Forest, Gradient Boosting with GridSearchCV',
          'Evaluation: confusion matrix, ROC-AUC, classification report, learning curves',
        ],
        techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
        impact: 'Demonstrates complete data science pipeline proficiency across multiple problem domains — from messy raw data to evaluated predictive models and clear business communication.',
        results: [
          'End-to-end DS pipeline executed across 3+ domain datasets',
          'Built reusable EDA Jupyter Notebook templates',
          'Shadow Fox Data Science internship certificate received',
        ],
        githubUrl: 'https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP',
        liveUrl: null,
        status: 'live',
      },
    ],
    certificationId: 'cert-shadowfox-ds-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-cse07/',
    order: 5,
  },
]
