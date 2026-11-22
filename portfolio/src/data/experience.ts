// ============================================================
// ENHANCED EXPERIENCE DATA — ANURAG SWAIN
// Verified from LinkedIn Profile & Certificates
// LinkedIn: https://www.linkedin.com/in/anurag-swain-dev/
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
  // 1. NATIONAL INFORMATICS CENTRE (NIC), GOVT OF INDIA (Jun–Aug 2026)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-nic-govt-2026',
    company: 'National Informatics Centre',
    companyFullName: 'National Informatics Centre, Govt of India',
    companyUrl: 'https://www.nic.in',
    role: 'Intern',
    roleType: 'internship',
    startDate: 'Jun 2026',
    endDate: 'Aug 2026',
    duration: '3 months',
    location: '7RHP+47P, Sachivalaya Marg, OSHB Ln, Opposite to, Bhouma Nagar, Bhubaneswar, Odisha 751001',
    locationType: 'onsite',
    companyLogo: '/images/logos/nic.png',
    companyColor: '#006699',
    overview: 'Developed a government-grade AI-powered Liquor Production Forecasting Platform for the National Informatics Centre (NIC), enabling data-driven monthly bottling quota planning for the Odisha State Excise Department.',
    responsibilities: [
      'Designed and implemented a full-stack decision-support system that leverages machine learning to forecast production demand across multiple supply channels and spirit categories, replacing traditional manual planning with predictive analytics',
      'Engineered and evaluated high-precision gradient boosting models using CatBoost, XGBoost, and LightGBM on historical excise and distillery bottling datasets to determine monthly quota allocations',
      'Architected high-throughput, asynchronous RESTful APIs using FastAPI and SQLite, reverse-proxied and secured behind production Nginx web servers',
      'Developed responsive, interactive real-time visual analytics dashboards using React Vite, Lucide React, and Recharts, providing senior excise officers with dynamic trend lines and quota distribution metrics',
      'Integrated Three.js interactive 3D visualizations for spatial distillery and supply-chain mapping across Odisha bottling units',
      'Worked on-site at Sachivalaya Marg, Bhubaneswar alongside government informatics officers, adhering to rigorous government-grade security, data isolation, and deployment protocols'
    ],
    techStack: [
      'Nginx', 'Recharts', 'SQLite', 'Three.js', 'FastAPI', 'React Vite',
      'Lucide React', 'CatBoost', 'XGBoost', 'LightGBM', 'Python', 'TypeScript'
    ],
    achievements: [
      'Delivered government-grade decision-support system for Odisha State Excise Department monthly bottling quota planning',
      'Replaced traditional manual spreadsheet quota planning with predictive gradient boosting analytics (CatBoost, XGBoost, LightGBM)',
      'Built high-performance 3D spatial visualization and analytics dashboards with Three.js, Recharts, and React Vite',
      'Awarded official National Informatics Centre (Govt of India) Internship Certificate'
    ],
    projects: [
      {
        id: 'proj-nic-forecasting-platform',
        name: 'AI-Powered Liquor Production Forecasting Platform',
        tagline: 'Government-grade decision-support platform with CatBoost/XGBoost/LightGBM forecasting & Three.js/Recharts dashboards for Odisha State Excise',
        description:
          'Developed a production forecasting and quota planning platform for the National Informatics Centre (NIC) and Odisha State Excise Department. The platform ingests historical production, supply channel, and category-level demand data, computes predictive bottling quotas using ensemble gradient boosting (CatBoost, XGBoost, LightGBM), and serves interactive visualizations via React Vite, Three.js, and Recharts backed by a robust FastAPI and Nginx architecture.',
        problem:
          'The Odisha State Excise Department previously relied on manual estimations and fragmented historical spreadsheets to determine monthly distillery bottling quotas, leading to channel imbalances, stockouts, and inefficient resource allocation across state spirit categories.',
        solution:
          'Engineered a modern end-to-end full-stack predictive system: FastAPI backend with SQLite and Nginx running trained CatBoost, XGBoost, and LightGBM models, coupled with a high-performance React Vite frontend utilizing Recharts and Three.js for interactive analytics, quota simulation, and state-wide supply-chain transparency.',
        architecture: [
          'Data Pipeline: Historical excise and distillery log processing, anomaly cleaning, and feature engineering',
          'ML Model Engine: Multi-model ensemble comparing CatBoost, XGBoost, and LightGBM with automated hyperparameter tuning',
          'FastAPI Service: Asynchronous REST endpoints serving quota predictions, scenario simulations, and metrics',
          'React Vite Dashboard: Dynamic interactive UI with Recharts for trends, Lucide React icons, and Three.js 3D facility visualization',
          'Infrastructure: High-performance Nginx reverse proxy with SSL termination and cached response layers'
        ],
        techStack: [
          'Nginx', 'Recharts', 'SQLite', 'Three.js', 'FastAPI', 'React Vite',
          'Lucide React', 'CatBoost', 'XGBoost', 'LightGBM'
        ],
        impact: 'Government-grade platform enabling data-driven monthly quota planning for the Odisha State Excise Department, replacing legacy manual spreadsheets with automated, verified predictive analytics.',
        results: [
          'Automated monthly bottling quota planning across multiple spirit categories and supply channels',
          'Ensemble gradient boosting delivered superior forecasting accuracy over traditional moving averages',
          'Official Internship Certificate awarded by National Informatics Centre (Govt of India)'
        ],
        githubUrl: null,
        liveUrl: null,
        status: 'completed'
      }
    ],
    certificationId: 'cert-nic-gov-2026',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-dev/',
    order: 1
  },

  // ══════════════════════════════════════════════════════════
  // 2. INFOSYS — ARTIFICIAL INTELLIGENCE INTERN (Aug–Oct 2025)
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
    overview: 'Developed an AI-powered heart disease prediction system utilizing machine learning (Random Forest, SVM, Neural Networks) and automated OCR medical data extraction within a full-stack clinical decision support web application.',
    responsibilities: [
      'Developed an AI-powered heart disease prediction system using machine learning (Random Forest, SVM, Neural Networks) with comprehensive data preprocessing, feature engineering, and model evaluation',
      'Integrated Optical Character Recognition (OCR) for automated medical data extraction from diagnostic lab reports, streamlining health metrics ingestion into predictive pipelines',
      'Built a full stack web application featuring secure authentication, REST APIs, and real-time risk prediction dashboards for clinical risk factor assessment',
      'Conducted extensive model evaluation using precision, recall, and F1-score metrics; iteratively tuned classification thresholds to optimize diagnostic sensitivity',
      'Authored comprehensive technical documentation and delivered live technical demonstrations to Infosys senior evaluators, securing a top-tier internship evaluation'
    ],
    techStack: [
      'HuggingFace', 'LangChain', 'Open API', 'Python', 'Machine Learning',
      'Random Forest', 'SVM', 'Neural Networks', 'OCR', 'REST APIs', 'FastAPI', 'Scikit-Learn'
    ],
    achievements: [
      'Developed complete ML + OCR Heart Disease Prediction full-stack web application',
      'Integrated OCR extraction pipeline eliminating manual biometric input errors by ~85%',
      'Completed Infosys Virtual Internship 2.0 with official completion certificate'
    ],
    projects: [
      {
        id: 'proj-infosys-heart-disease',
        name: 'AI-Powered Heart Disease Prediction System & Medical OCR',
        tagline: 'Clinical risk prediction web platform combining Random Forest, SVM & Neural Networks with automated OCR medical document extraction',
        description:
          'An AI-powered clinical decision support system developed during the Infosys internship. The platform extracts patient health indicators directly from medical test reports via OCR, processes clinical features, and runs them through an ensemble of Random Forest, Support Vector Machines, and Neural Networks to output real-time cardiovascular risk assessments.',
        problem:
          'Manual entry of complex biometric data from paper/scanned lab reports is error-prone and time-consuming, delaying critical risk identification for cardiovascular patients.',
        solution:
          'Engineered an end-to-end clinical workflow: OCR extracts key metrics (cholesterol, blood pressure, ECG indicators) directly from report scans; machine learning models (Random Forest, SVM, Neural Networks) predict risk probability with high sensitivity and specificity; served via an authenticated web application with REST APIs.',
        architecture: [
          'Medical Document Ingestion: Image/PDF upload with OCR preprocessing and biometric field extraction',
          'Feature Engineering: Normalization, missing value imputation, and clinical risk factor encoding',
          'Model Ensemble: Benchmarking Random Forest, SVM, and Neural Networks with cross-validation',
          'API & Security: Secure authenticated REST endpoints for patient record management and inference',
          'UI & Visualization: Interactive risk score breakdown, risk factors radar, and diagnostic summary'
        ],
        techStack: ['Python', 'HuggingFace', 'LangChain', 'Open API', 'Machine Learning', 'Random Forest', 'SVM', 'Neural Networks', 'OCR', 'REST APIs'],
        impact: 'Demonstrated complete AI clinical application combining computer vision OCR extraction with multi-model predictive ML inference in a production-ready web architecture.',
        results: [
          'High diagnostic precision and recall across standardized cardiovascular test cohorts',
          'Automated OCR extraction reduced manual patient data input latency by ~85%',
          'Completed as core Infosys internship deliverable with positive evaluation'
        ],
        githubUrl: null,
        liveUrl: null,
        status: 'completed'
      }
    ],
    certificationId: 'cert-infosys-ai-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-dev/',
    order: 2
  },

  // ══════════════════════════════════════════════════════════
  // 3. EISYSTEMS TECHNOLOGIES — WEB DEV INTERN (Jul–Sep 2025)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-eisystems-webdev-2025',
    company: 'EISystems Technologies',
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
    overview: 'Engineered a scalable full-stack e-commerce platform using MERN architecture with TypeScript, Tailwind CSS, and Bootstrap, boosting API response times by ~30% through optimized queries and caching.',
    responsibilities: [
      'Engineered a scalable full-stack e-commerce platform using the MERN architecture, delivering core functionalities including secure authentication, product lifecycle management, cart operations, and order processing',
      'Enhanced system performance through optimized API design and database query tuning, achieving ~30% faster response times while supporting concurrent user interactions with a responsive, user-centric interface',
      'Implemented clean, modular, and accessible user interfaces utilizing React.js, Next.js, TypeScript, Tailwind CSS, and Bootstrap (Framework), providing seamless cross-device adaptability',
      'Constructed, verified, and documented comprehensive RESTful API endpoints utilizing Postman API, automating regression tests for authentication tokens and data schemas',
      'Developed Node.js and Express.js backend services connected to MongoDB, implementing indexing strategies, aggregation pipelines, and JWT session security',
      'Collaborated in agile sprint cycles, delivering weekly milestones independently end-to-end within the 3-month timeline'
    ],
    techStack: [
      'Bootstrap (Framework)', 'TypeScript', 'Postman API', 'Node.js',
      'Express.js', 'Next.js', 'React.js', 'Tailwind CSS', 'MongoDB', 'JavaScript'
    ],
    achievements: [
      'Engineered scalable full-stack e-commerce platform with MERN architecture',
      'Achieved ~30% faster API response times through database query indexing and optimized routes',
      'Documented and automated complete RESTful API test suites with Postman API',
      'Received official Web Development internship certificate from EISystems Technologies'
    ],
    projects: [
      {
        id: 'proj-eisystems-ecommerce',
        name: 'Scalable Full-Stack MERN E-Commerce Platform',
        tagline: 'High-performance e-commerce platform built with MERN, TypeScript, Tailwind CSS & Postman API (~30% faster response times)',
        description:
          'A scalable, production-grade e-commerce application engineered using MERN architecture with TypeScript, Next.js, and Tailwind CSS. Features full product catalog management, role-based user authentication, shopping cart state persistence, checkout order processing, and tuned MongoDB aggregations achieving ~30% lower endpoint latency.',
        problem:
          'Traditional e-commerce platforms suffer from slow query latency during concurrent traffic spikes, unoptimized asset delivery, and cumbersome checkout workflows.',
        solution:
          'Architected an end-to-end MERN solution with TypeScript type safety, Redis-ready caching layers, indexed MongoDB collections, and optimized Express middleware tested via Postman API, paired with a responsive Next.js frontend styled with Tailwind CSS and Bootstrap.',
        architecture: [
          'Frontend: Next.js with React.js, TypeScript, Tailwind CSS, and Bootstrap for accessible, mobile-first UI',
          'State Management: React Context and local caching for real-time cart and order workflows',
          'Backend API: Express.js and Node.js REST API with comprehensive Postman test collections',
          'Database: MongoDB document schema with compound indexing for lightning-fast catalog search',
          'Security: JWT authentication, bcrypt password hashing, and input sanitization middleware'
        ],
        techStack: [
          'Bootstrap (Framework)', 'TypeScript', 'Postman API', 'Node.js',
          'Express.js', 'Next.js', 'React.js', 'Tailwind CSS', 'MongoDB'
        ],
        impact: '~30% faster response times achieved through query indexing and clean API design; delivered full product lifecycle, cart, and order pipeline within 3-month engagement.',
        results: [
          '~30% faster API response times vs initial unindexed baseline',
          'Full e-commerce lifecycle (Auth, Catalog, Cart, Orders) delivered on schedule',
          'Received official EISystems Technologies Web Development internship certificate'
        ],
        githubUrl: null,
        liveUrl: null,
        status: 'completed'
      }
    ],
    certificationId: 'cert-eisystems-webdev-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-dev/',
    order: 3
  },

  // ══════════════════════════════════════════════════════════
  // 4. EDUNET FOUNDATION — AI, CLOUD & DATA ANALYTICS (Jul–Aug 2025)
  // ══════════════════════════════════════════════════════════
  {
    id: 'exp-edunet-ai-cloud-2025',
    company: 'Edunet Foundation',
    companyFullName: 'Edunet Foundation (EY & IBM SkillsBuild Partner)',
    companyUrl: 'https://edunetfoundation.org',
    role: 'Artificial Intelligence & Data Analytics · AI & Cloud Technologies Intern',
    roleType: 'internship',
    startDate: 'Jul 2025',
    endDate: 'Aug 2025',
    duration: '2 months',
    location: 'Remote',
    locationType: 'remote',
    companyLogo: '/images/logos/edunet.png',
    companyColor: '#F39C12',
    overview: 'Executed high-impact dual internships: built an AICTE-certified EV Charging Demand Forecasting solution with Tableau & Power BI, and engineered cloud-native AI systems with AWS (EC2, S3), Docker, and IBM Watson.',
    responsibilities: [
      'Built a predictive analytics solution for EV charging demand forecasting, leveraging data preprocessing, feature engineering, and machine learning techniques to identify usage patterns and optimize resource planning',
      'Delivered actionable insights through exploratory data analysis and model evaluation to support efficient charging infrastructure decisions, visualizing patterns in Tableau and Microsoft Power BI dashboards',
      'Architected and deployed cloud-native AI services utilizing Amazon Web Services (AWS) infrastructure, including Amazon EC2 computing instances and Amazon S3 scalable storage buckets',
      'Containerized applications and agentic microservices using Docker for consistent multi-environment deployment and automated cloud testing',
      'Developed an autonomous IBM SkillsBuild capstone Research Agent utilizing IBM Watson APIs, multi-document NLP synthesis, and automated citation assembly',
      'Awarded dual internship credentials across Artificial Intelligence & Data Analytics and AI & Cloud Technologies'
    ],
    techStack: [
      'Tableau', 'Microsoft Power BI', 'Amazon Web Services (AWS)', 'Amazon EC2',
      'Amazon S3', 'Docker', 'Python', 'Scikit-Learn', 'IBM Watson', 'Pandas', 'NumPy'
    ],
    achievements: [
      'EV Prediction GitHub repository received ⭐1 star from the developer community',
      'Research Agent selected as top-tier IBM SkillsBuild internship capstone',
      'Created executive dashboards in Tableau & Microsoft Power BI delivering actionable demand analytics',
      'Completed dual roles simultaneously: AI & Data Analytics + AI & Cloud Technologies with 2 separate certificates'
    ],
    projects: [
      {
        id: 'proj-edunet-ev-prediction',
        name: 'EV Vehicle Charging Demand Prediction',
        tagline: 'AICTE Cycle-2 certified ML pipeline forecasting EV station demand with Random Forest & Tableau/Power BI dashboards',
        description:
          'An end-to-end machine learning and data analytics solution built for AICTE Internship Cycle-2. Forecasts electric vehicle charging station demand using historical usage data enriched with temporal features, accompanied by interactive Tableau and Microsoft Power BI dashboards for grid load management.',
        problem:
          'EV charging stations experience unpredictable demand peaks and valleys — energy over-allocation wastes resources during low-demand periods, while under-allocation causes user wait times during surges. Operators lack data-driven demand forecasting tools.',
        solution:
          'Built a Scikit-Learn regression pipeline with extensive temporal feature engineering (hour-of-day encoding, day-of-week encoding, rolling average windows, lag features). Compared Random Forest, Gradient Boosting, and Linear Regression. Random Forest gave best generalization. Created visual analytics in Tableau and Power BI.',
        architecture: [
          'Data ingestion: CSV station logs loaded with Pandas, null handling, type casting',
          'EDA & Visual Analytics: Tableau and Microsoft Power BI interactive dashboards',
          'Feature engineering: temporal encoding, rolling averages, lag features, cyclical encoding',
          'Model comparison: Random Forest, Gradient Boosting, Linear Regression',
          'Evaluation: 5-fold CV, RMSE, MAE, R², residual analysis',
          'Visualization: predicted vs actual plots, feature importance charts'
        ],
        techStack: ['Python', 'Scikit-Learn', 'Tableau', 'Microsoft Power BI', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
        impact: 'AICTE Internship Cycle-2 certified; GitHub ⭐1 star; baseline error reduction via temporal feature engineering; demonstrates production-oriented ML pipeline design for real-world energy domain.',
        results: [
          'Random Forest achieved strongest R² vs baseline and simpler models',
          'Identified hour-of-day and weekday/weekend as top demand drivers',
          'AICTE government certification received (Aug 2025)',
          'GitHub ⭐1 star from developer community'
        ],
        githubUrl: 'https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION',
        liveUrl: null,
        status: 'live'
      },
      {
        id: 'proj-edunet-research-agent',
        name: 'Research Agent (AWS Cloud & IBM SkillsBuild Capstone)',
        tagline: 'Autonomous AI agent for multi-source research synthesis deployed with AWS EC2/S3, Docker & IBM Watson',
        description:
          'An agentic AI system built as the IBM SkillsBuild & Cloud Technologies internship capstone project. The agent takes a research query, decomposes it into sub-tasks, autonomously retrieves information from multiple web sources, applies NLP-based summarization per source, cross-references findings, and assembles a structured research report with citations — packaged in Docker and deployed on AWS EC2 with Amazon S3 storage.',
        problem:
          'Complex research queries require manually searching, reading, filtering, and synthesizing information across dozens of web sources — a process taking hours and prone to selection bias and missed insights.',
        solution:
          'Designed an agent orchestration layer that decomposes queries into retrieval sub-tasks. Integrated IBM Watson and AWS Cloud services (EC2, S3) with Docker containerization. Web scraping + NLP summarization pipeline processes each source into a structured, cited report.',
        architecture: [
          'Query decomposer: breaks complex queries into atomic retrieval sub-tasks',
          'Web retriever: scrapes target URLs, handles pagination and content extraction',
          'NLP summarizer: extracts key sentences and insights per source document',
          'IBM Watson integration: enhanced NLP capabilities via Watson APIs',
          'Cloud Infra: Containerized with Docker and deployed on Amazon EC2 with Amazon S3 data persistence',
          'Report assembler: structures findings into sections with citations and confidence scores'
        ],
        techStack: ['Python', 'Amazon Web Services (AWS)', 'Amazon EC2', 'Amazon S3', 'Docker', 'IBM Watson', 'NLP', 'Pandas'],
        impact: 'IBM SkillsBuild capstone project recognized in internship evaluation; demonstrates advanced agentic AI system design and cloud deployment with Docker on AWS.',
        results: [
          'Automates research workflows reducing manual effort by ~70% on test queries',
          'Containerized microservice deployed on AWS EC2 with S3 integration',
          'IBM SkillsBuild internship capstone recognition received'
        ],
        githubUrl: 'https://github.com/HUNTER-X0s/RESEARCH_AGENT',
        liveUrl: null,
        status: 'live'
      }
    ],
    certificationId: 'cert-edunet-ai-analytics-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-dev/',
    order: 4
  },

  // ══════════════════════════════════════════════════════════
  // 5. MICROGENESIS TECHSOFT — DEEP LEARNING INTERN (Jun–Jul 2025)
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
    location: "5th Floor, Tower 'C', Golden Enclave, Old Airport Road, Bangalore – 560017, KA, INDIA",
    locationType: 'hybrid',
    companyLogo: '/images/logos/microgenesis.png',
    companyColor: '#00BFA5',
    overview: 'Engineered a deep learning-based road lane detection system for autonomous driving scenarios using computer vision, OpenCV, PyTorch, TensorFlow, and Keras at MicroGenesis TechSoft Bangalore.',
    responsibilities: [
      'Engineered a deep learning-based road lane detection system for autonomous driving scenarios, leveraging computer vision techniques to achieve robust lane identification across diverse environmental conditions',
      'Designed and optimized model pipelines for real-time inference, improving detection accuracy and system reliability',
      'Developed highly optimized OpenCV-based image preprocessing pipelines for real-time video frame analysis, incorporating edge detection (Canny, Sobel), morphological operations, contour extraction, and adaptive perspective transforms',
      'Trained and evaluated deep neural networks across PyTorch, TensorFlow, and Keras frameworks, utilizing transfer learning (VGG16, ResNet50) to optimize training compute efficiency',
      'Architected end-to-end data preparation pipelines: raw driving dataset curation, semantic lane annotation, geometric data augmentation, and stratified train/val/test splits',
      'Generated comprehensive data visualization and metric evaluations with Matplotlib and Seaborn, and earned 12+ verified LinkedIn skill endorsements from MicroGenesis TechSoft professionals'
    ],
    techStack: [
      'OpenCV', 'Deep Learning', 'Computer Vision', 'PyTorch', 'TensorFlow', 'Keras',
      'Scikit-Learn', 'Machine Learning', 'Data Visualization', 'Data Preparation',
      'Natural Language Processing (NLP)', 'Artificial Intelligence (AI)', 'Seaborn', 'Matplotlib'
    ],
    achievements: [
      'Engineered autonomous driving road lane detection pipeline with real-time OpenCV inference',
      'Rare multi-framework deep learning mastery: proficient across PyTorch, TensorFlow, and Keras simultaneously',
      'Received 12+ verified technical skill endorsements on LinkedIn directly from MicroGenesis TechSoft professionals',
      'Awarded official MicroGenesis TechSoft Deep Learning internship certificate'
    ],
    projects: [
      {
        id: 'proj-microgenesis-lane-detection',
        name: 'Autonomous Driving Road Lane Detection System',
        tagline: 'Deep learning & computer vision pipeline for real-time autonomous vehicle lane identification with OpenCV, PyTorch & TensorFlow',
        description:
          'A deep learning computer vision system engineered for autonomous driving scenarios at MicroGenesis TechSoft Bangalore. Combines OpenCV video frame preprocessing (perspective warping, color thresholding, sliding window polynomial fitting) with deep convolutional neural networks to reliably detect and track road lanes in real time under challenging illumination, weather, and curvature variations.',
        problem:
          'Autonomous driving requires sub-millisecond, robust lane detection that resists glare, shadows, dashed markings, and lane occlusions without failing in edge cases.',
        solution:
          'Constructed a dual-stage vision pipeline: an adaptive OpenCV preprocessing stage extracts spatial edge and color features into an inverse perspective bird-eye view; a deep neural network fine-tuned in PyTorch and TensorFlow detects polynomial lane trajectories with high temporal stability and real-time inference speed.',
        architecture: [
          'Frame Ingestion & Camera Calibration: Distortion correction and adaptive color masking (HLS/HSV)',
          'Perspective Transform: Dynamic inverse perspective mapping to bird-eye road geometry',
          'Deep Neural Network: CNN feature backbone trained with custom lane segmentation heads',
          'Curvature & Center Tracking: 2nd-degree polynomial fitting with radius calculation and vehicle offset estimation',
          'Evaluation: Metric tracking with Matplotlib & Seaborn, latency benchmarking across GPU/CPU runtimes'
        ],
        techStack: [
          'OpenCV', 'Deep Learning', 'Computer Vision', 'PyTorch', 'TensorFlow', 'Keras',
          'Scikit-Learn', 'Machine Learning', 'Data Visualization', 'Data Preparation', 'Seaborn', 'Matplotlib'
        ],
        impact: 'Engineered robust real-time lane detection for autonomous driving; demonstrated multi-framework DL mastery (PyTorch/TF/Keras) with 12+ verified LinkedIn endorsements from Bangalore AI engineers.',
        results: [
          'Real-time inference stability achieved across diverse road illumination and curvature tests',
          '12+ verified LinkedIn skill endorsements from MicroGenesis TechSoft professionals',
          'Awarded official MicroGenesis TechSoft Deep Learning internship certificate'
        ],
        githubUrl: null,
        liveUrl: null,
        status: 'completed'
      }
    ],
    certificationId: 'cert-microgenesis-dl-2025',
    linkedInUrl: 'https://www.linkedin.com/in/anurag-swain-dev/',
    order: 5
  }

]
