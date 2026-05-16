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
    content: `Anurag Swain is a 3rd-year B.Tech Computer Science Engineering student at Government College of Engineering, Kalahandi (GCE Kalahandi / GCEK), affiliated with BPUT. He was born on 16 January 2006 and is currently 19 years old. He is from Bhubaneswar, Odisha, India. His CGPA is 8.10 out of 10.00. He is expected to graduate in 2027. His GitHub username is HUNTER-X0s. His LinkedIn profile is anurag-swain-cse07.`,
  },
  {
    id: 'personal-002',
    category: 'identity',
    tags: ['contact', 'email', 'phone', 'reach', 'location'],
    priority: 'high',
    content: `Anurag Swain can be contacted at anurag.swain35@gmail.com or +91-7008973337. He is located in OldTown, Bhubaneswar, Odisha, India — PIN 751002. His alternate email is anuragswain01@outlook.com. He is active on LinkedIn (anurag-swain-cse07), GitHub (HUNTER-X0s), Twitter/X (@Anurag_hunter07), and Instagram (@_vi_ll_a_in_).`,
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
    content: `Anurag Swain's professional headline: "Full-Stack Developer | AI/ML | Data Science | Data Analytics | C • C++ • Python • Java • JavaScript | Tech Explorer & Innovation-Driven Learner." He is passionate about building scalable tech solutions at the intersection of AI, Web Development, and Data Science. He has completed 4 professional internships in 2025 across Deep Learning, AI, Web Development, and Data Analytics.`,
  },

  // ──────────────────────────────────────
  // EDUCATION
  // ──────────────────────────────────────
  {
    id: 'edu-001',
    category: 'education',
    tags: ['education', 'college', 'GCEK', 'GCE Kalahandi', 'BTech', 'degree', 'university', 'CGPA'],
    priority: 'high',
    content: `Anurag Swain is pursuing a Bachelor of Technology (B.Tech) in Computer Science and Engineering at Government College of Engineering, Kalahandi (GCE Kalahandi), Odisha, affiliated with BPUT. Duration: 2023-2027. CGPA: 8.10 out of 10.00. He is a member of KiloBots — the official robotics club of GCE Kalahandi — contributing to automation and embedded systems projects. He actively participates in Tech-Fests and college sports competitions.`,
  },
  {
    id: 'edu-002',
    category: 'education',
    tags: ['school', 'kendriya vidyalaya', 'class 12', 'class 10', 'secondary', 'CBSE', 'PCMB'],
    priority: 'medium',
    content: `Anurag Swain completed his Class XII (Senior Secondary) in Science (PCMB — Physics, Chemistry, Mathematics, Biology) from Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar in 2023. He completed Class X from the same institution. He was Ashoka House Sports Captain at school, participated in competitive chess, badminton, and multiple sports at school and inter-house level. He has been using Linux/Ubuntu since school level.`,
  },

  // ──────────────────────────────────────
  // WORK EXPERIENCE
  // ──────────────────────────────────────
  {
    id: 'exp-001',
    category: 'experience',
    tags: ['Infosys', 'AI intern', 'internship', 'experience', 'work', 'job'],
    priority: 'high',
    content: `Anurag Swain completed a 3-month Artificial Intelligence Intern role at Infosys from August to October 2025 (remote). He developed an AI-powered conversational chatbot in Python using NLP techniques including intent classification, entity recognition, and context-aware multi-turn dialogue management. He integrated LLM APIs for enhanced response quality. The resulting AI Chat Bot project is published on GitHub (HUNTER-X0s/AI_CHAT_BOT) and received a community star. He received the Infosys Virtual Internship 2.0 completion certificate.`,
  },
  {
    id: 'exp-002',
    category: 'experience',
    tags: ['EISystems', 'web development', 'full stack', 'React', 'Next.js', 'Node.js', 'internship'],
    priority: 'high',
    content: `Anurag Swain worked as a Web Development Intern at EISystems Technologies from July to September 2025 (3 months, remote). He built full-stack web applications using React.js and Next.js for the frontend and Node.js with Express.js for the backend, with MongoDB for data storage. He designed RESTful APIs, applied React hooks for component-driven UI architecture, optimized performance through code splitting and lazy loading, and participated in agile sprints. He received a Web Development internship certificate.`,
  },
  {
    id: 'exp-003',
    category: 'experience',
    tags: ['Edunet', 'AICTE', 'IBM', 'data analytics', 'cloud', 'AI', 'Tableau', 'Power BI', 'internship'],
    priority: 'high',
    content: `Anurag Swain completed a 2-month dual-role internship at Edunet Foundation from July to August 2025 (remote). He served as both an Artificial Intelligence & Data Analytics Intern and an AI and Cloud Technologies Intern. He built the EV Vehicle Charging Demand Prediction system for AICTE Internship Cycle-2, and developed the Research Agent as an IBM Skills Build capstone project. He used Tableau and Microsoft Power BI for data visualization and IBM Watson/Cloud APIs for enterprise AI integration.`,
  },
  {
    id: 'exp-004',
    category: 'experience',
    tags: ['MicroGenesis', 'deep learning', 'Bangalore', 'TensorFlow', 'PyTorch', 'OpenCV', 'internship', 'computer vision'],
    priority: 'high',
    content: `Anurag Swain worked as a Deep Learning Intern at MicroGenesis TechSoft, Bangalore from June to July 2025 (2 months, hybrid). This was an in-person internship at 5th Floor, Tower C, Golden Enclave, Old Airport Road, Bangalore 560017. He designed, trained, and evaluated deep learning models using TensorFlow, PyTorch, and Keras for computer vision applications. He implemented OpenCV preprocessing pipelines, applied transfer learning with CNN architectures (VGG, ResNet), conducted data augmentation, and performed model evaluation. He received 12+ LinkedIn skill endorsements from MicroGenesis TechSoft.`,
  },
  {
    id: 'exp-005',
    category: 'experience',
    tags: ['Shadow Fox', 'data science', 'internship', 'pandas', 'numpy', 'EDA'],
    priority: 'medium',
    content: `Anurag Swain completed a Data Science Internship with Shadow Fox in 2025. He executed end-to-end data science projects covering data ingestion, exploratory data analysis (EDA), feature engineering, predictive model building, and visualization reporting. He applied the Python data stack (Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn) and built reusable Jupyter Notebook templates. The internship work is published on GitHub as SHADOW-FOX_DATASCIENCE_INTERNSHIP.`,
  },
  {
    id: 'exp-006',
    category: 'experience',
    tags: ['internships', 'how many', 'total experience', 'companies'],
    priority: 'high',
    content: `Anurag Swain has completed 5 professional internships as of 2025: (1) Infosys — AI Intern (Aug-Oct 2025, 3 months); (2) EISystems Technologies — Web Development Intern (Jul-Sep 2025, 3 months); (3) Edunet Foundation — AI & Data Analytics + AI & Cloud Technologies Intern (Jul-Aug 2025, 2 months); (4) MicroGenesis TechSoft Bangalore — Deep Learning Intern (Jun-Jul 2025, 2 months, hybrid); (5) Shadow Fox — Data Science Intern (2025). Total: approximately 12 months of hands-on industry experience.`,
  },

  // ──────────────────────────────────────
  // PROJECTS
  // ──────────────────────────────────────
  {
    id: 'proj-001',
    category: 'projects',
    tags: ['EV', 'electric vehicle', 'charging', 'prediction', 'machine learning', 'AICTE', 'project'],
    priority: 'high',
    content: `EV Vehicle Charging Demand Prediction is Anurag's AICTE Internship Cycle-2 project built during the Edunet Foundation internship. It is a machine learning regression pipeline that forecasts EV charging station demand using historical usage data and temporal features. Built with Python, Scikit-Learn (Random Forest Regressor), Pandas, NumPy, Matplotlib, and Seaborn. The project is published on GitHub at https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION and has received 1 GitHub star.`,
  },
  {
    id: 'proj-002',
    category: 'projects',
    tags: ['research agent', 'IBM', 'AI agent', 'autonomous', 'NLP', 'Watson', 'project'],
    priority: 'high',
    content: `Research Agent is an autonomous AI agent built as the IBM Skills Build internship capstone project during Anurag's Edunet Foundation internship. It orchestrates multi-step information retrieval, NLP-based summarization, and structured research report generation from multiple sources. Built with Python, IBM Watson APIs, NLP techniques, and Jupyter Notebook. Published on GitHub at https://github.com/HUNTER-X0s/RESEARCH_AGENT.`,
  },
  {
    id: 'proj-003',
    category: 'projects',
    tags: ['chatbot', 'AI chat', 'NLP', 'conversational AI', 'Python', 'Infosys', 'project'],
    priority: 'high',
    content: `AI Chat Bot is Anurag's Python-based conversational AI chatbot built during the Infosys AI internship. It features multi-turn dialogue management, NLP-based intent classification, entity recognition, and LLM API integration for natural language response generation. Published on GitHub at https://github.com/HUNTER-X0s/AI_CHAT_BOT and has received 1 community GitHub star.`,
  },
  {
    id: 'proj-004',
    category: 'projects',
    tags: ['currency converter', 'JavaScript', 'web app', 'real-time', 'exchange rate', 'project'],
    priority: 'medium',
    content: `Currency Converter is a responsive JavaScript web application that converts between 150+ global currencies using live exchange rates. Built with vanilla JavaScript, HTML5, and CSS3 featuring real-time conversion, debounced inputs, and local storage caching. Deployed at https://hunter-x0s.github.io/Currency_Converter/. Published on GitHub at https://github.com/HUNTER-X0s/Currency_Converter with 1 GitHub star.`,
  },
  {
    id: 'proj-005',
    category: 'projects',
    tags: ['portfolio', 'website', 'personal site', 'anurag portfolio', 'project'],
    priority: 'medium',
    content: `anurag-portfolio is Anurag's personal portfolio website built with JavaScript. It showcases his projects, experience, and skills. Recently updated with new AI-powered features. Published on GitHub at https://github.com/HUNTER-X0s/anurag-portfolio and deployed at https://hunter-x0s.github.io/anurag-portfolio/.`,
  },
  {
    id: 'proj-006',
    category: 'projects',
    tags: ['shadow fox', 'data science', 'jupyter', 'EDA', 'project'],
    priority: 'medium',
    content: `SHADOW-FOX_DATASCIENCE_INTERNSHIP is a collection of data science projects from Anurag's Shadow Fox internship. Built with Jupyter Notebook, Python, Pandas, NumPy, Scikit-Learn, Matplotlib, and Seaborn. Covers end-to-end data science pipeline from EDA to predictive modeling. Published at https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP.`,
  },
  {
    id: 'proj-007',
    category: 'projects',
    tags: ['github repos', 'all projects', 'repository list', 'public repos'],
    priority: 'medium',
    content: `Anurag Swain has 14 public GitHub repositories at https://github.com/HUNTER-X0s. Key repos include: EV-VEHICLE-CHARGING-DEMAND-PREDICTION (⭐1, Jupyter Notebook, AICTE), AI_CHAT_BOT (⭐1, Python, Infosys), Currency_Converter (⭐1, JavaScript), RESEARCH_AGENT (Jupyter, IBM), SHADOW-FOX_DATASCIENCE_INTERNSHIP (Jupyter), anurag-portfolio (JavaScript), CERTIFICATIONS, PYTHON_PROGRAMMING, JAVA_PROGRAMMING, SQL_mysql, C_plus_PROGRAMMING, PHP_PROGRAMMING, LINUX-SHELL-SCRIPTING, HUNTER-X0s.`,
  },

  // ──────────────────────────────────────
  // SKILLS
  // ──────────────────────────────────────
  {
    id: 'skill-001',
    category: 'skills',
    tags: ['programming languages', 'coding languages', 'what languages', 'language skills'],
    priority: 'high',
    content: `Anurag Swain is proficient in the following programming languages: Python (strongest, 88%), JavaScript (80%), C and C++ (72%), Java (68%), PHP (60%), and Shell Scripting (62%). He regularly uses Python for AI/ML/Data Science work, JavaScript for web development, and Java/C++ for DSA and academic work.`,
  },
  {
    id: 'skill-002',
    category: 'skills',
    tags: ['web development skills', 'frontend', 'React', 'Next.js', 'HTML', 'CSS'],
    priority: 'high',
    content: `Anurag Swain's web development skills include: React.js (78%), Next.js (74%), JavaScript (80%), HTML5/CSS3 (85%), Tailwind CSS (75%), Bootstrap (72%), Figma/Canva for UI design (70%). He used React.js and Next.js professionally during his 3-month EISystems Technologies web internship.`,
  },
  {
    id: 'skill-003',
    category: 'skills',
    tags: ['AI skills', 'ML skills', 'deep learning', 'TensorFlow', 'PyTorch', 'machine learning'],
    priority: 'high',
    content: `Anurag Swain's AI/ML/DL skills include: Scikit-Learn (82%), Machine Learning (82%), TensorFlow/Keras (80%), Deep Learning (78%), PyTorch (78%), OpenCV (75%), Computer Vision (74%), NLP (68%). He gained these skills through 4 internships: MicroGenesis TechSoft (DL), Infosys (AI), Edunet (AI/Analytics), and Shadow Fox (Data Science).`,
  },
  {
    id: 'skill-004',
    category: 'skills',
    tags: ['data science skills', 'pandas', 'numpy', 'matplotlib', 'tableau', 'power BI'],
    priority: 'high',
    content: `Anurag Swain's data science skills include: Python (88%), Pandas/NumPy (85%), Jupyter Notebook (85%), Matplotlib/Seaborn (80%), Data Preparation (80%), Data Visualization (78%), Tableau (74%), and Microsoft Power BI (68%). He used Tableau and Power BI at Edunet Foundation and the full Python stack across multiple internships.`,
  },
  {
    id: 'skill-005',
    category: 'skills',
    tags: ['database', 'SQL', 'MySQL', 'MongoDB', 'database skills'],
    priority: 'medium',
    content: `Anurag Swain's database skills include: MySQL/SQL (78%), DBMS Concepts (80%), and MongoDB (70%). He used MongoDB during his EISystems web development internship and MySQL for academic projects and personal GitHub repositories.`,
  },
  {
    id: 'skill-006',
    category: 'skills',
    tags: ['tools', 'git', 'github', 'linux', 'cloud', 'IBM', 'tools and technologies'],
    priority: 'medium',
    content: `Anurag Swain's tools and cloud skills include: Git/GitHub (82%), VS Code (88%), IBM Watson/Cloud (65%), Linux/Ubuntu (68%), Cloud Computing (62%), Shell Scripting (62%), Windows/macOS (80%). He manages 14 public GitHub repositories and has IBM Skills Build cloud experience.`,
  },
  {
    id: 'skill-007',
    category: 'skills',
    tags: ['computer science fundamentals', 'DSA', 'OOP', 'OS', 'networking', 'algorithms'],
    priority: 'medium',
    content: `Anurag Swain has strong computer science fundamentals including: Data Structures and Algorithms (DSA), Object-Oriented Programming (OOP), Database Management System (DBMS), Computer Networks (CN), Operating Systems (OS), Cloud Computing (CC), Deep Learning (DL), Software Engineering (SE), and Artificial Intelligence/Machine Learning (AI/ML). These are part of his B.Tech CSE curriculum with CGPA 8.10.`,
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
    content: `Anurag Swain's professional profiles: GitHub: https://github.com/HUNTER-X0s | LinkedIn: https://www.linkedin.com/in/anurag-swain-cse07/ | Twitter/X: https://x.com/Anurag_hunter07 | Instagram: https://www.instagram.com/_vi_ll_a_in_ | Threads: https://www.threads.com/@_vi_ll_a_in_. His GitHub has 14 public repos with 3 total stars. Most active in Python, Jupyter Notebook, and JavaScript.`,
  },

  // ──────────────────────────────────────
  // WHY HIRE
  // ──────────────────────────────────────
  {
    id: 'hire-001',
    category: 'value_proposition',
    tags: ['why hire', 'strengths', 'value', 'best candidate', 'recommend', 'should I hire'],
    priority: 'high',
    content: `Why hire Anurag Swain: (1) 4-5 professional internships in 2025 across the full AI/ML/Data/Web stack — rare breadth for a 3rd-year student; (2) CGPA 8.10 — strong academic foundation in CS fundamentals; (3) Shipped real GitHub projects with community recognition (3 starred repos); (4) Adaptable: proven in Deep Learning (MicroGenesis, Bangalore), AI engineering (Infosys), Full-Stack Web (EISystems), Data Analytics (Edunet), Data Science (Shadow Fox); (5) Fast learner — completed IBM Skills Build, AICTE-certified ML project, and 4 different technology stacks in a single year; (6) Available for immediate internships and roles.`,
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
  greeting: `Hi! 👋 I'm an AI assistant for **Anurag Swain**'s portfolio. Ask me about his skills, internships, projects, or whether he's available for your role!`,

  notFound: `Good question! I can help with:\n\n• **Skills** — "What are his top skills?"\n• **Projects** — "Tell me about the EV project"\n• **Internships** — "Where has he interned?"\n• **Availability** — "Is he open to jobs?"\n• **Contact** — "How do I reach him?"\n\nWhat would you like to know?`,

  available: `**Yes, actively looking!** Anurag is open to:\n\n• SDE / Software Engineering roles\n• AI / ML Engineer positions\n• Full-Stack Developer roles\n• Data Scientist / Data Analyst positions\n• Deep Learning Engineer roles\n\nHe's a 3rd-year B.Tech student (graduating 2027) available for internships, part-time, and full-time positions. Email: **anurag.swain35@gmail.com**`,

  internships: `Anurag has completed **5 internships** in 2025:\n\n• **Infosys** — AI Intern (Aug–Oct 2025)\n• **EISystems Technologies** — Web Dev Intern (Jul–Sep 2025)\n• **Edunet Foundation** — AI & Data Analytics + IBM Cloud (Jul–Aug 2025)\n• **MicroGenesis TechSoft, Bangalore** — Deep Learning Intern (Jun–Jul 2025)\n• **Shadow Fox** — Data Science Intern (2025)\n\nAll with completion certificates!`,

  topSkills: `**Anurag's top skills:**\n\n• **Python** (88%) — AI/ML/DS primary language\n• **Scikit-Learn + ML** (82%) — Supervised learning, regression, classification\n• **React.js / Next.js** (78%/74%) — Full-stack web development\n• **TensorFlow / PyTorch** (80%/78%) — Deep learning\n• **Pandas / NumPy** (85%) — Data manipulation\n• **OpenCV** (75%) — Computer vision\n\nFull profile at the Skills section!`,
}
