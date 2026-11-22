// ============================================================
// CHATBOT KNOWLEDGE BASE — RAG-Ready Chunks
// Subject: Anurag Swain Portfolio AI
// Format: Tagged text chunks optimized for vector embeddings
// Each chunk: {id, category, tags, content, priority}
// ============================================================

export const chatbotKnowledge = [
  // ──────────────────────────────────────
  // PERSONAL IDENTITY
  // ──────────────────────────────────────
  {
    id: 'personal-001',
    category: 'identity',
    tags: ['name', 'who', 'person', 'about', 'identity', 'student'],
    priority: 'high',
    content: `Anurag Swain is a 3rd-year B.Tech Computer Science Engineering student at Government College of Engineering, Kalahandi (GCE Kalahandi / GCEK), affiliated with BPUT. He was born on 16 January 2006 and is currently 19 years old. He is from Bhubaneswar, Odisha, India. His CGPA is 8.10 out of 10.00. He is expected to graduate in 2027. His GitHub username is HUNTER-X0s. His LinkedIn profile is anurag-swain-dev.`,
  },
  {
    id: 'personal-002',
    category: 'identity',
    tags: ['contact', 'email', 'phone', 'reach', 'location'],
    priority: 'high',
    content: `Anurag Swain can be contacted at anurag.swain35@gmail.com or +91-7008973337. He is located in OldTown, Bhubaneswar, Odisha, India — PIN 751002. His alternate email is anuragswain01@outlook.com. He is active on LinkedIn (anurag-swain-dev), GitHub (HUNTER-X0s), Twitter/X (@Anurag_hunter07), and Instagram (@_vi_ll_a_in_).`,
  },
  {
    id: 'personal-003',
    category: 'identity',
    tags: ['available', 'hire', 'job', 'opportunity', 'open to', 'looking for work'],
    priority: 'high',
    content: `Anurag Swain is actively available for opportunities. He is open to full-time roles, internships, and freelance projects in Software Engineering (SDE), AI Engineering, ML Engineering, Full-Stack Development, Data Science, and Deep Learning Engineering. He is a 3rd-year student (graduating 2027) currently seeking internships and part-time/remote roles. Response time within 24 hours.`,
  },
  {
    id: 'personal-004',
    category: 'identity',
    tags: ['headline', 'bio', 'summary', 'profile', 'description', 'introduction'],
    priority: 'high',
    content: `Anurag Swain's professional headline: "Full-Stack Developer | AI/ML | Data Science | Data Analytics | C • C++ • Python • Java • JavaScript | Tech Explorer & Innovation-Driven Learner." He is passionate about building scalable tech solutions at the intersection of AI, Web Development, and Data Science. He has completed 5 professional internships spanning National Informatics Centre (Govt of India), Infosys, EISystems Technologies, Edunet Foundation, and MicroGenesis TechSoft.`,
  },

  // ──────────────────────────────────────
  // EDUCATION
  // ──────────────────────────────────────
  {
    id: 'edu-001',
    category: 'education',
    tags: ['education', 'college', 'GCEK', 'GCE Kalahandi', 'BTech', 'degree', 'university', 'CGPA', 'BPUT'],
    priority: 'high',
    content: `Anurag Swain is pursuing a Bachelor of Technology - BTech in Computer Science and Engineering at Government College of Engineering, Kalahandi (GCE Kalahandi) under BPUT (2023-2027). A dedicated and self-motivated learner, passionate about building scalable tech solutions. Proficient in C, C++, Python, Java, JavaScript, SQL, and familiar with tools like VS Code, GitHub, Git, Git Bash, MongoDB, MySQL, Pandas, NumPy, Jupyter, Figma, Canva, and ChatGPT. Skilled in Data Structures & Algorithms, Web Development, Database Management, OOP, Computer Networking, Cloud Computing, and Operating Systems. Member of Kilobots - The Official Robotics Club of GCEK, actively participating in athletics and college-level sports competitions, and volunteering and participating in college Tech-fests and cultural events.`,
  },
  {
    id: 'edu-002',
    category: 'education',
    tags: ['school', 'kendriya vidyalaya', 'class 12', 'class 10', 'secondary', 'CBSE', 'PCMB'],
    priority: 'medium',
    content: `Anurag Swain completed his 12th Grade (Senior Secondary) in Science (PCMB — Physics, Chemistry, Mathematics, Biology) from Kendriya Vidyalaya under CBSE (2021-2023). He served as Ashoka House Sports Captain, and was active in competitive chess, badminton, and competitive gaming. He completed his 10th Grade (Secondary School) General Education from Kendriya Vidyalaya (KV) No. 6, Pokhariput, Bhubaneswar (2020-2021), where he was a club-level cricket player, school football player, tech enthusiast (Microsoft Office Suite, HTML5, Linux, Teams), and active event coordinator and volunteer.`,
  },

  // ──────────────────────────────────────
  // WORK EXPERIENCE
  // ──────────────────────────────────────
  {
    id: 'exp-000',
    category: 'experience',
    tags: ['NIC', 'National Informatics Centre', 'Govt of India', 'Odisha', 'excise', 'liquor forecasting', 'CatBoost', 'FastAPI', 'Three.js', 'internship'],
    priority: 'high',
    content: `Anurag Swain worked as an on-site Intern at the National Informatics Centre (NIC), Govt of India from June to August 2026 (3 months, Sachivalaya Marg, Bhubaneswar). He developed a government-grade AI-powered Liquor Production Forecasting Platform for the Odisha State Excise Department. He built a full-stack decision-support system utilizing CatBoost, XGBoost, and LightGBM to forecast production demand and determine monthly bottling quotas across multiple supply channels and spirit categories, served via FastAPI, SQLite, and Nginx with interactive Three.js 3D and Recharts analytics dashboards.`,
  },
  {
    id: 'exp-001',
    category: 'experience',
    tags: ['Infosys', 'AI intern', 'internship', 'heart disease', 'OCR', 'LangChain', 'HuggingFace', 'experience', 'work', 'job'],
    priority: 'high',
    content: `Anurag Swain completed a 3-month Artificial Intelligence Intern role at Infosys from August to October 2025 (remote). He developed an AI-powered heart disease prediction system using machine learning (Random Forest, SVM, Neural Networks) with data preprocessing, feature engineering, and model evaluation, integrated OCR for medical data extraction from diagnostic lab reports, and built a full stack web application with REST APIs and real-time risk prediction. He received the official Infosys Virtual Internship 2.0 completion certificate.`,
  },
  {
    id: 'exp-002',
    category: 'experience',
    tags: ['EISystems', 'web development', 'full stack', 'MERN', 'e-commerce', 'React', 'Next.js', 'Node.js', 'Postman API', 'internship'],
    priority: 'high',
    content: `Anurag Swain worked as a Web Development Intern at EISystems Technologies from July to September 2025 (3 months, remote). He engineered a scalable full-stack e-commerce platform using MERN architecture, delivering secure authentication, product lifecycle management, cart operations, and order processing. He optimized API design and database query tuning, achieving ~30% faster response times. Skills used include Bootstrap (Framework), TypeScript, Postman API, Node.js, Express.js, Next.js, React.js, and Tailwind CSS. He received a Web Development internship certificate.`,
  },
  {
    id: 'exp-003',
    category: 'experience',
    tags: ['Edunet', 'AICTE', 'IBM', 'data analytics', 'cloud', 'AWS', 'Docker', 'Tableau', 'Power BI', 'internship'],
    priority: 'high',
    content: `Anurag Swain completed a 2-month dual-role internship at Edunet Foundation from July to August 2025 (remote), serving as both an Artificial Intelligence & Data Analytics Intern and an AI and Cloud Technologies Intern. He built an EV charging demand forecasting solution using Scikit-Learn with Tableau and Microsoft Power BI dashboards for AICTE Cycle-2. He also built and containerized an autonomous Research Agent using Docker deployed on AWS (Amazon EC2, Amazon S3) with IBM Watson APIs.`,
  },
  {
    id: 'exp-004',
    category: 'experience',
    tags: ['MicroGenesis', 'deep learning', 'Bangalore', 'lane detection', 'autonomous driving', 'OpenCV', 'TensorFlow', 'PyTorch', 'Keras', 'internship', 'computer vision'],
    priority: 'high',
    content: `Anurag Swain worked as a Deep Learning Intern at MicroGenesis TechSoft, Bangalore from June to July 2025 (2 months, hybrid at Golden Enclave, Old Airport Road). He engineered a deep learning-based road lane detection system for autonomous driving scenarios, leveraging computer vision techniques (OpenCV) and deep neural networks across PyTorch, TensorFlow, and Keras for real-time inference. He received 12+ verified LinkedIn skill endorsements from MicroGenesis TechSoft engineers and an official internship certificate.`,
  },
  {
    id: 'exp-005',
    category: 'experience',
    tags: ['Shadow Fox', 'data science', 'internship', 'pandas', 'numpy', 'EDA'],
    priority: 'medium',
    content: `Anurag Swain completed a Data Science Internship with Shadow Fox in 2025. He executed end-to-end data science projects covering data ingestion, exploratory data analysis (EDA), feature engineering, predictive model building, and visualization reporting using Pandas, NumPy, Scikit-Learn, Matplotlib, and Seaborn. The repository is on GitHub as SHADOW-FOX_DATASCIENCE_INTERNSHIP.`,
  },
  {
    id: 'exp-006',
    category: 'experience',
    tags: ['internships', 'how many', 'total experience', 'companies'],
    priority: 'high',
    content: `Anurag Swain has completed 5 verified industry internships: (1) National Informatics Centre (NIC), Govt of India — Intern (Jun-Aug 2026, 3 months on-site at Sachivalaya Marg, Bhubaneswar); (2) Infosys — AI Intern (Aug-Oct 2025, 3 months); (3) EISystems Technologies — Web Development Intern (Jul-Sep 2025, 3 months); (4) Edunet Foundation — AI & Data Analytics + AI & Cloud Technologies Intern (Jul-Aug 2025, 2 months); (5) MicroGenesis TechSoft Bangalore — Deep Learning Intern (Jun-Jul 2025, 2 months, hybrid). Total: ~13+ months of hands-on engineering across Government and Industry.`,
  },

  // ──────────────────────────────────────
  // PROJECTS & COMPETITIONS
  // ──────────────────────────────────────
  {
    id: 'proj-ulpf-system',
    category: 'projects',
    tags: ['ULPF', 'telemetry', 'NTRO', 'cybersecurity', 'blockchain'],
    priority: 'high',
    content: `Anurag Swain engineered the Universal Log Pre-processing Framework (ULPF) addressing Problem ID 26156 for the National Technical Research Organisation (NTRO) under the Blockchain & Cybersecurity theme. ULPF is a defense-grade sovereign telemetry normalization system capable of processing 301,000+ Events Per Second (EPS) with 20 deterministic parser engines, 100% air-gapped offline support, and cryptographic chain-of-custody ledgers using Merkle tree batch verification. The project has 680/680 unit tests passing and a full production release (v1.0.0). Video demo: https://youtu.be/A_AA40wPyMQ. GitHub repo: https://github.com/HUNTER-X0s/UNIVERSAL-LOG-PREPROCESSING-FRAMEWORK.`,
  },
  {
    id: 'proj-entity-resolution-system',
    category: 'projects',
    tags: ['entity resolution', 'Polars', 'Machine Learning', 'LightGBM', 'CatBoost', 'XGBoost'],
    priority: 'high',
    content: `Anurag Swain developed Multi-Source Business Entity Resolution across heterogeneous enterprise databases. His system features a 7-channel Polars priority retrieval engine (>99.999% search space reduction, 97.4% candidate recall), a 44-feature GPU tri-model meta-ensemble (LightGBM, CatBoost, XGBoost), and Kuhn-Munkres maximum weight bipartite matching that eliminated 12,594 false-merge collisions. GitHub repo: https://github.com/HUNTER-X0s/multisource-business-entity-resolution.`,
  },
  {
    id: 'proj-001',
    category: 'projects',
    tags: ['ULPF', 'Universal Log Preprocessing Framework', 'SIEM', 'cybersecurity', 'NTRO'],
    priority: 'high',
    content: `Universal Log Pre-processing Framework (ULPF) is Anurag's flagship cybersecurity project addressing sovereign telemetry normalization (NTRO, Problem ID 26156). It normalizes raw log streams from Zeek, Syslog, firewall, cloud, and Windows into OCSF 1.1, OpenTelemetry, and ECS standards at 301,000+ EPS with Merkle tree cryptographic chain-of-custody. Built with Python, FastAPI, TypeScript, React, Docker, and Kafka. GitHub: https://github.com/HUNTER-X0s/UNIVERSAL-LOG-PREPROCESSING-FRAMEWORK. Live demo: https://youtu.be/A_AA40wPyMQ.`,
  },
  {
    id: 'proj-002',
    category: 'projects',
    tags: ['entity resolution', 'Polars', 'LightGBM', 'CatBoost', 'XGBoost', 'CUDA'],
    priority: 'high',
    content: `Multi-Source Business Entity Resolution is an enterprise-scale entity resolution project across multi-million heterogeneous databases in US, India, and France. Evaluated across 1.73M queries with 97.4% recall and >99.999% combinatorial search space reduction. Built with Python, Polars, CUDA GPU, LightGBM, CatBoost, XGBoost, and Kuhn-Munkres bipartite graph matching. GitHub: https://github.com/HUNTER-X0s/multisource-business-entity-resolution.`,
  },
  {
    id: 'proj-003',
    category: 'projects',
    tags: ['AccessGuard', 'third-party risk', 'cybersecurity', 'RBAC', 'FastAPI', 'React'],
    priority: 'high',
    content: `AccessGuard (Third-Party Access Risk Mapper for Small Organizations) is a production-grade cybersecurity intelligence platform with 203/203 security unit tests passing. Evaluates third-party vendor permissions, calculates deterministic risk scores, and visualizes organizational attack surfaces. Built with Python, FastAPI, React 18, Tailwind CSS, and Pytest. GitHub: https://github.com/HUNTER-X0s/Third-Party-Access-Risk-Mapper-for-Small-Organizations.`,
  },
  {
    id: 'proj-malicious-url',
    category: 'projects',
    tags: ['Malicious URL Detector', 'URLSentinel', 'phishing', 'threat intelligence', 'cybersecurity', 'FastAPI', 'SSRF', 'DNS'],
    priority: 'high',
    content: `Malicious URL & Phishing Threat Detector (URLSentinel) is a security-first detection and user-protection platform engineered to analyze, detect, and mitigate phishing pages, credential-harvesting destinations, typosquatted domains, and web exploits. Features layered detection combining lexical URL heuristics, DNS/TLS inspection, multi-source threat intelligence normalization, and an isolated SSRF-safe analysis boundary with transparent evidence attribution. Built with Python, FastAPI, React 18, Tailwind CSS, TypeScript, and Docker. GitHub: https://github.com/HUNTER-X0s/MALICIOUS_URL_DETECTOR.`,
  },
  {
    id: 'proj-004',
    category: 'projects',
    tags: ['Voken', 'Solana', 'voting', 'blockchain', 'Web3', 'Anchor', 'Rust'],
    priority: 'high',
    content: `VOKEN is a decentralized voting system on the Solana blockchain featuring Rust smart contracts, Anchor framework, Phantom wallet cryptographic authentication, and an integrated AI voter guide assistant (V.I.A). Sub-second and sub-cent on-chain vote settlement. GitHub: https://github.com/HUNTER-X0s/Voken-Decentralized-Voting-System.`,
  },
  {
    id: 'proj-005',
    category: 'projects',
    tags: ['drone battery', 'computer vision', 'OCR', 'IoT', 'degradation'],
    priority: 'high',
    content: `Drone Battery Charging Performance Detector is an intelligent computer vision and hardware diagnostics platform that monitors drone battery charging cycles. Automatically detects digital multimeter displays from camera feeds, calculates 1% charge intervals, and predicts battery cell degradation. Built with TypeScript, OpenCV, Python, and Next.js. GitHub: https://github.com/HUNTER-X0s/DRONE-BATTERY-CHARGING-PERFORMANCE-DETECTOR.`,
  },
  {
    id: 'proj-006',
    category: 'projects',
    tags: ['NIC', 'liquor forecasting', 'time series', 'Odisha', 'India', 'Govt of India'],
    priority: 'high',
    content: `National Liquor Trend & Production Forecasting System is an enterprise time-series forecasting and decision-support platform built for the National Informatics Centre (NIC) and Ministry of Electronics & IT, Government of India. Forecasts manufacturing volumes and district-level consumption trends. Built with TypeScript, Python, and React. GitHub: https://github.com/HUNTER-X0s/Liquor_Trend_Forecasting-INDIA.`,
  },
  {
    id: 'proj-007',
    category: 'projects',
    tags: ['EV', 'electric vehicle', 'charging', 'prediction', 'machine learning', 'AICTE'],
    priority: 'high',
    content: `EV Vehicle Charging Demand Prediction is Anurag's AICTE Internship Cycle-2 capstone project. It is a machine learning regression pipeline that forecasts EV charging station demand using historical usage data and temporal features. Built with Python, Scikit-Learn (Random Forest Regressor), Pandas, NumPy, and Streamlit. GitHub: https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION.`,
  },
  {
    id: 'proj-008',
    category: 'projects',
    tags: ['research agent', 'IBM', 'AI agent', 'autonomous', 'NLP', 'Watsonx.ai', 'Granite'],
    priority: 'high',
    content: `Autonomous Research Agent is an intelligent research agent built as the IBM SkillsBuild internship capstone project powered by IBM Watsonx.ai Studio and the Granite LLM. Decomposes complex queries, retrieves web sources, applies NLP summarization, and synthesizes structured citation-backed briefs. GitHub: https://github.com/HUNTER-X0s/RESEARCH_AGENT.`,
  },
  {
    id: 'proj-009',
    category: 'projects',
    tags: ['chatbot', 'Gemini AI', 'Google Gemini Pro', 'Streamlit', 'multilingual'],
    priority: 'medium',
    content: `GeminiAI Multilingual ChatBot is a multimodal conversational assistant built with Python, Streamlit, and Google Gemini Pro. Supports multi-turn dialogue, real-time multilingual translation, PDF/DOCX file Q&A, and audio speech synthesis. GitHub: https://github.com/HUNTER-X0s/AI_CHAT-BOT.`,
  },
  {
    id: 'proj-010',
    category: 'projects',
    tags: ['jarvis', 'voice assistant', 'Python', 'speech recognition', 'automation'],
    priority: 'medium',
    content: `Jarvis is a Python-based voice-controlled intelligent desktop agent capable of recognizing speech commands, performing web searches, managing local media playback, and executing desktop automation routines. GitHub: https://github.com/HUNTER-X0s/JARVIS.`,
  },
  {
    id: 'proj-011',
    category: 'projects',
    tags: ['MERN', 'backend', 'REST API', 'Node.js', 'Express', 'MongoDB'],
    priority: 'medium',
    content: `MERN Stack Production Backend is an enterprise RESTful API engine built with Node.js, Express, MongoDB, Mongoose, and JWT authentication. Implements clean MVC architecture, input sanitization, and structured error handling. GitHub: https://github.com/HUNTER-X0s/MERN-STACK-BACKEND.`,
  },
  {
    id: 'proj-012',
    category: 'projects',
    tags: ['AWS', 'Amazon Web Services', 'CloudFormation', 'IaC', 'cloud vault'],
    priority: 'medium',
    content: `AWS Cloud Architecture & Infrastructure Vault is a comprehensive repository of production-ready AWS cloud templates, CloudFormation Infrastructure as Code (IaC) scripts, and blueprints covering VPC networking, EC2 autoscaling, DynamoDB, S3, and CloudFront. GitHub: https://github.com/HUNTER-X0s/Amazon-Web-Services.`,
  },
  {
    id: 'proj-013',
    category: 'projects',
    tags: ['github repos', 'all projects', 'repository list', 'public repos', 'HUNTER-X0s'],
    priority: 'high',
    content: `Anurag Swain has 30 public repositories on GitHub at https://github.com/HUNTER-X0s. Key repositories include: UNIVERSAL-LOG-PREPROCESSING-FRAMEWORK (Sovereign SIEM Telemetry Pipeline for NTRO), Multisource-Business-Entity-Resolution (GPU ML Entity Matching Pipeline), MALICIOUS_URL_DETECTOR (URLSentinel Threat Intelligence Platform), Third-Party-Access-Risk-Mapper-for-Small-Organizations (AccessGuard), Voken-Decentralized-Voting-System (Solana), DRONE-BATTERY-CHARGING-PERFORMANCE-DETECTOR, Liquor_Trend_Forecasting-INDIA (NIC, Govt of India), EV-VEHICLE-CHARGING-DEMAND-PREDICTION (AICTE), RESEARCH_AGENT (IBM SkillsBuild), AI_CHAT-BOT, JARVIS, MERN-STACK-BACKEND, E-COMMERCE, Currency_Converter, Amazon-Web-Services, LINUX-SHELL-SCRIPTING, DSA-in-C, CERTIFICATIONS, and more.`,
  },

  // ──────────────────────────────────────
  // SKILLS
  // ──────────────────────────────────────
  // SKILLS & TECHNICAL EXPERTISE
  // ──────────────────────────────────────
  {
    id: 'skill-001',
    category: 'skills',
    tags: ['programming languages', 'coding languages', 'python', 'javascript', 'typescript', 'c', 'c++', 'java', 'php', 'shell scripting'],
    priority: 'high',
    content: `Anurag Swain is proficient in 8 programming languages: Python (90%), JavaScript (85%), TypeScript (82%), C++ (78%), C (76%), Java (75%), PHP (68%), and Shell Scripting (75%). He leverages Python for AI/ML/Data Science and FastAPI, JavaScript/TypeScript for modern frontend and Node.js web applications, and C++/Java for Data Structures, Algorithms, and systems design.`,
  },
  {
    id: 'skill-002',
    category: 'skills',
    tags: ['web development', 'frontend', 'backend', 'react', 'next.js', 'node.js', 'express', 'tailwind', 'shadcn', 'rest api'],
    priority: 'high',
    content: `Anurag Swain's Web Development stack encompasses: HTML5, CSS3, shadCN/Ui, Bootstrap, Tailwind CSS, React.js, Next.js, Node.js, Express.js, and REST APIs. He builds full-stack, responsive, high-performance web applications with Server-Side Rendering (SSR), App Router, dynamic routing, and modular component architecture.`,
  },
  {
    id: 'skill-003',
    category: 'skills',
    tags: ['python libraries', 'frameworks', 'numpy', 'pandas', 'scikit-learn', 'tensorflow', 'pytorch', 'fastapi', 'streamlit', 'keras', 'matplotlib'],
    priority: 'high',
    content: `Anurag Swain's Python Libraries & Frameworks include: NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow, PyTorch, Keras, FastAPI, and Streamlit. He uses this stack for scientific computing, end-to-end data manipulation, neural network training, high-speed asynchronous REST APIs, and rapid interactive AI prototypes.`,
  },
  {
    id: 'skill-004',
    category: 'skills',
    tags: ['ai', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'predictive analytics', 'feature engineering'],
    priority: 'high',
    content: `Anurag Swain's AI / Machine Learning expertise includes: Machine Learning algorithms (Random Forest, SVM, Regression, Clustering), Deep Learning (CNNs, transfer learning), Natural Language Processing (NLP), Computer Vision (OpenCV), Predictive Analytics, Model Training & Evaluation (cross-validation, ROC/AUC, RMSE, F1-score), and Feature Engineering.`,
  },
  {
    id: 'skill-005',
    category: 'skills',
    tags: ['generative ai', 'llm', 'openai', 'gemini', 'hugging face', 'ollama', 'prompt engineering'],
    priority: 'high',
    content: `Anurag Swain's Generative AI & LLMs capabilities include: Generative AI systems, Large Language Models (LLMs), OpenAI API, Gemini API, Hugging Face Transformers, Ollama for local LLM inference, Prompt Engineering, and seamless LLM Integration into enterprise production workflows.`,
  },
  {
    id: 'skill-006',
    category: 'skills',
    tags: ['rag', 'retrieval augmented generation', 'langchain', 'vector databases', 'chromadb', 'embeddings', 'semantic search', 'watsonx'],
    priority: 'high',
    content: `Anurag Swain's RAG & AI Applications expertise features: Retrieval-Augmented Generation (RAG), LangChain, Vector Databases, ChromaDB, Embeddings, Semantic Search, Document Processing, Knowledge Bases, Context Retrieval, AI Agents, Agentic AI, Multi-Agent Systems, IBM watsonx.ai, and IBM watsonx Orchestrate.`,
  },
  {
    id: 'skill-007',
    category: 'skills',
    tags: ['agentic ai', 'ai agents', 'multi-agent systems', 'tool calling', 'agent workflows', 'autonomous execution', 'react agent'],
    priority: 'high',
    content: `Anurag Swain specializes in Agentic AI: Autonomous AI Agents, Agentic AI architectures, Multi-Agent Systems, Tool Calling, Agent Workflows, Autonomous Task Execution, AI Agent Orchestration, and ReAct-based (Reasoning + Acting) Agents.`,
  },
  {
    id: 'skill-008',
    category: 'skills',
    tags: ['databases', 'mysql', 'mongodb', 'sql', 'nosql', 'database design', 'query optimization'],
    priority: 'medium',
    content: `Anurag Swain's database competencies include: MySQL, MongoDB, SQL, NoSQL document stores, Relational Database Design, Normalization, Indexing, and Query Optimization.`,
  },
  {
    id: 'skill-009',
    category: 'skills',
    tags: ['cloud', 'devops', 'aws', 'docker', 'kubernetes', 'ci/cd', 'github actions', 'nginx', 'linux', 'vercel', 'render'],
    priority: 'high',
    content: `Anurag Swain's Cloud & DevOps capabilities include: AWS (EC2, S3), Docker, Kubernetes, CI/CD pipelines, GitHub Actions automation, Nginx reverse proxy configuration, Linux server administration, Containerization, and Cloud Deployment across Vercel, Render, and Netlify.`,
  },
  {
    id: 'skill-010',
    category: 'skills',
    tags: ['networking', 'infrastructure', 'tcp/ip', 'http', 'https', 'dns', 'dhcp', 'ip addressing', 'subnetting', 'routing', 'switching', 'firewalls', 'vpn'],
    priority: 'high',
    content: `Anurag Swain's Networking & Infrastructure skills include: TCP/IP, HTTP/HTTPS protocols, DNS, DHCP, IP Addressing & CIDR Subnetting, Routing & Switching Fundamentals, Firewalls, Ports & Protocols, Load Balancing, Reverse Proxy, VPN Fundamentals, and Network Security Fundamentals.`,
  },
  {
    id: 'skill-011',
    category: 'skills',
    tags: ['cybersecurity', 'security', 'owasp', 'vulnerability assessment', 'firewalls', 'threat modeling', 'iam', 'secure coding'],
    priority: 'high',
    content: `Anurag Swain's Cybersecurity field expertise includes: Network Security Fundamentals, Firewalls & Perimeter Defense, Web Security (OWASP Top 10 vulnerabilities like SQLi, XSS, CSRF), Vulnerability Assessment, Port Scanning & Protocol Analysis, Threat Modeling & Analysis, Cryptography Fundamentals, VPN Security & Tunneling, Identity & Access Management (IAM), and Secure Coding Practices.`,
  },
  {
    id: 'skill-012',
    category: 'skills',
    tags: ['tools', 'ides', 'version control', 'analytics', 'ui/ux', 'git', 'github', 'power bi', 'tableau', 'figma', 'canva', 'vscode', 'pycharm', 'os'],
    priority: 'medium',
    content: `Anurag Swain is proficient with industry tooling: Version Control (Git, GitHub, GitHub Actions, Branching Strategies, Pull Requests); Visualization & Analytics (Power BI, Tableau, Matplotlib, Data Analysis, Dashboard Development); UI/UX (Figma, Canva, Adobe XD); Development Tools & IDEs (VS Code, IntelliJ IDEA, PyCharm, Jupyter Notebook, Eclipse, Postman); Operating Systems (Windows, Linux, macOS).`,
  },

  // ──────────────────────────────────────
  // CERTIFICATIONS
  // ──────────────────────────────────────
  {
    id: 'cert-001',
    category: 'certifications',
    tags: ['certifications', 'certificates', 'credentials', 'awards', 'achievements'],
    priority: 'medium',
    content: `Anurag Swain has earned 7 professional certifications/internship certificates in 2025: (1) Artificial Intelligence Internship Certificate — Infosys (Oct 2025); (2) Deep Learning Internship Certificate — MicroGenesis TechSoft (Jul 2025); (3) Web Development Internship Certificate — EISystems Technologies (Sep 2025); (4) AI & Data Analytics Internship Certificate — Edunet Foundation (Aug 2025); (5) AI & Cloud Technologies / IBM Skills Build Certificate — Edunet Foundation/IBM (Aug 2025); (6) AICTE Internship Cycle-2 Certificate — EV Demand Prediction (Aug 2025); (7) Data Science Internship Certificate — Shadow Fox (2025). All certificates are stored at https://github.com/HUNTER-X0s/CERTIFICATIONS.`,
  },

  // ──────────────────────────────────────
  // HOBBIES & PERSONAL
  // ──────────────────────────────────────
  {
    id: 'hobby-001',
    category: 'personal',
    tags: ['hobbies', 'interests', 'sports', 'activities', 'outside work', 'personal'],
    priority: 'low',
    content: `Outside of tech, Anurag Swain is a competitive chess enthusiast and strategic thinker. He plays cricket, football, badminton, and volleyball. He enjoys photography, cycling, trekking, swimming, and traveling. He is a gaming enthusiast (particularly online freeware and competitive gaming). He was Ashoka House Sports Captain and School Sports Captain at Kendriya Vidyalaya. He is a member of the KiloBots robotics club at GCE Kalahandi.`,
  },
  {
    id: 'lang-001',
    category: 'personal',
    tags: ['languages', 'spoken languages', 'language skills', 'multilingual'],
    priority: 'low',
    content: `Anurag Swain speaks English (Professional Proficiency), Hindi (Native/Bilingual), Odia (Native/Bilingual — his home state language), and Bengali (Intermediate). He is from Bhubaneswar, Odisha, India.`,
  },

  // ──────────────────────────────────────
  // SOCIAL & LINKS
  // ──────────────────────────────────────
  {
    id: 'social-001',
    category: 'social',
    tags: ['links', 'social media', 'profiles', 'GitHub', 'LinkedIn', 'Twitter'],
    priority: 'medium',
    content: `Anurag Swain's professional profiles: GitHub: https://github.com/HUNTER-X0s | LinkedIn: https://www.linkedin.com/in/anurag-swain-dev/ | Twitter/X: https://x.com/Anurag_hunter07 | Instagram: https://www.instagram.com/_vi_ll_a_in_ | Threads: https://www.threads.com/@_vi_ll_a_in_. His GitHub has 29 public repositories across AI/ML, Cybersecurity, Blockchain, Full-Stack MERN, Networking, Systems Programming, and Cloud.`,
  },
  {
    id: 'skills-threejs-001',
    category: 'skills',
    tags: ['threejs', '3d', 'three.js', 'react three fiber', 'r3f', 'webgl', 'web dev'],
    priority: 'high',
    content: `In Web Development, Anurag specializes in Three.js (86%) and React Three Fiber (84%) for interactive 3D WebGL experiences, including 60 FPS particle fields, custom shaders, and dynamic 3D card perspective tilt animations. His portfolio website itself is built with Next.js 14 and Three.js.`,
  },
  {
    id: 'skills-repos-001',
    category: 'skills',
    tags: ['skills', 'technologies', 'opencv', 'polars', 'neo4j', 'pyautogui', 'solana', 'repos'],
    priority: 'high',
    content: `Key skills derived from Anurag's 29 GitHub repositories: Python (92%), Polars (90%), Scikit-learn (88%), LightGBM / XGBoost / CatBoost (86%), Three.js (86%), React / Next.js (86%/84%), OpenCV (85%), Sentence-Transformers (85%), PyAutoGUI RPA (84%), Solana & Anchor Web3 (82%), Neo4j Graph Database (82%), AWS CloudFormation (82%), MySQL (86%), C/C++ (78%/80%), Java (76%), and Linux Shell Scripting (80%).`,
  },

  // ──────────────────────────────────────
  // WHY HIRE
  // ──────────────────────────────────────
  {
    id: 'hire-001',
    category: 'value_proposition',
    tags: ['why hire', 'strengths', 'value', 'best candidate', 'recommend', 'should I hire'],
    priority: 'high',
    content: `Why hire Anurag Swain: (1) Proven builder of sovereign high-throughput systems (ULPF, 301k+ EPS sovereign log normalization for NTRO Problem ID 26156); (2) Advanced ML engineering on enterprise entity resolution across 1.73M queries; (3) 29 fully documented GitHub repositories spanning AI, ML, Web3, Cybersecurity, and Full-Stack MERN; (4) 4-5 professional internships across Deep Learning, AI, Web Development, and Data Analytics at Infosys, IBM SkillsBuild, AICTE, and MicroGenesis; (5) Strong academic record (CGPA 8.10 in B.Tech CSE); (6) Immediate availability for internships, remote, or full-time roles.`,
  },
  {
    id: 'hire-002',
    category: 'value_proposition',
    tags: ['salary', 'package', 'CTC', 'compensation', 'pay', 'expectations'],
    priority: 'medium',
    content: `Compensation expectations are best discussed directly with Anurag. He is open to fair market-rate internship stipends and fresher/entry-level full-time compensation. Reach him at anurag.swain35@gmail.com or +91-7008973337 to have that conversation. He prioritizes role quality, learning opportunity, and growth potential alongside compensation.`,
  },
]

// ============================================================
// CHATBOT RESPONSE TEMPLATES
// ============================================================
export const chatbotResponses: Record<string, string> = {
  greeting: `Hi! 👋 I'm **Jarvis**, an AI assistant for **Anurag Swain**'s portfolio. Ask me about his 29 GitHub projects, his 4 industry internships, or his skills in Python, Three.js, AI/ML, and Full-Stack!`,

  notFound: `Good question! I can help with:\n\n• **Projects** — "Tell me about his ULPF cybersecurity project" or "What are his 29 GitHub repos?"\n• **Skills** — "What are his skills in web development, 3D, and AI?"\n• **Internships** — "Where has he interned?"\n• **Contact** — "How do I reach him?"\n\nWhat would you like to know?`,

  available: `**Yes, actively looking!** Anurag is open to:\n\n• SDE / Software Engineering roles\n• AI / ML Engineer positions\n• Full-Stack Developer roles\n• Data Scientist / Data Analyst positions\n• Deep Learning Engineer roles\n\nHe's a 3rd-year B.Tech student (graduating 2027) available for internships, part-time, and full-time positions. Email: **anurag.swain35@gmail.com**`,

  internships: `Anurag has completed **5 internships** across 2025:\n\n• **Infosys** — AI Intern (Aug–Oct 2025)\n• **EISystems Technologies** — Web Dev Intern (Jul–Sep 2025)\n• **Edunet Foundation** — AI & Data Analytics + IBM Cloud (Jul–Aug 2025)\n• **MicroGenesis TechSoft, Bangalore** — Deep Learning Intern (Jun–Jul 2025)\n• **Shadow Fox** — Data Science Intern (2025)\n\nAll backed by verified completion certificates!`,

  topSkills: `**Anurag's top skills across his 29 GitHub projects:**\n\n• **Python** (92%) — Primary language for AI/ML/Data Pipelines\n• **Polars & Pandas** (90%) — High-performance data processing\n• **Scikit-Learn / LightGBM / XGBoost** (88%/86%) — Production ML & Ensembles\n• **Three.js & React Three Fiber** (86%/84%) — Interactive 3D WebGL graphics\n• **React.js & Next.js** (86%/84%) — Modern full-stack frontend\n• **OpenCV & Computer Vision** (85%) — Vision processing & telemetry\n• **Neo4j & MySQL** (82%/86%) — Graph and relational databases\n• **Solana & Web3** (82%) — Decentralized contracts & Anchor\n\nCheck out the interactive Skills section for the complete breakdown!`,
}
