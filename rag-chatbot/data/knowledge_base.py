"""
knowledge_base.py
Complete structured knowledge base for Anurag Swain's portfolio RAG system.
Every fact is grounded in actual resume / LinkedIn / GitHub data.
"""

KNOWLEDGE_CHUNKS = [

    # ══════════════════════════════════════════════════════════
    # IDENTITY & CONTACT
    # ══════════════════════════════════════════════════════════
    {
        "id": "identity-001",
        "category": "identity",
        "topic": "personal_info",
        "content": """
Anurag Swain is a 3rd-year B.Tech Computer Science and Engineering student at Government College of Engineering, Kalahandi (GCE Kalahandi), affiliated with BPUT, Odisha, India. 
He was born on 16 January 2006. His current CGPA is 8.10 out of 10.00. He is expected to graduate in 2027.
He is located in OldTown, Bhubaneswar, Odisha, India — PIN 751002.
His primary email is anurag.swain35@gmail.com. His alternate email is anuragswain01@outlook.com.
His phone number is +91-7008973337.
His GitHub username is HUNTER-X0s with profile at https://github.com/HUNTER-X0s.
His LinkedIn profile URL is https://www.linkedin.com/in/anurag-swain-cse07/.
His Twitter/X handle is @Anurag_hunter07 at https://x.com/Anurag_hunter07.
His Instagram handle is @_vi_ll_a_in_ at https://www.instagram.com/_vi_ll_a_in_.
""",
        "keywords": ["name", "contact", "location", "email", "phone", "github", "linkedin", "who is", "about"],
    },

    {
        "id": "identity-002",
        "category": "identity",
        "topic": "professional_headline",
        "content": """
Anurag Swain's professional headline is: "Full-Stack Developer | AI/ML | Data Science | Data Analytics | C • C++ • Python • Java • JavaScript | Tech Explorer & Innovation-Driven Learner | Passionate about Solving Real-World Problems with Tech."
He is a motivated, detail-oriented developer actively exploring AI, web development, and data science.
He describes himself as a critical thinker and problem solver with active involvement in both technical and non-technical activities.
He is passionate about building scalable tech solutions and constantly upskilling through hands-on coding, online platforms, and project-based learning.
He is a member of KiloBots — the official Robotics Club of GCE Kalahandi — contributing to automation and embedded systems projects.
He is currently open to: SDE roles, AI Engineer positions, ML Engineer roles, Full-Stack Developer positions, Data Scientist roles, and Deep Learning Engineer positions.
""",
        "keywords": ["headline", "summary", "introduction", "open to", "looking for", "available", "seeking"],
    },

    # ══════════════════════════════════════════════════════════
    # INTERNSHIP 1: INFOSYS
    # ══════════════════════════════════════════════════════════
    {
        "id": "experience-infosys-001",
        "category": "experience",
        "topic": "infosys_internship",
        "content": """
Anurag Swain worked as an Artificial Intelligence Intern at Infosys (Infosys Springboard — Virtual Internship 2.0) from August 2025 to October 2025, a duration of 3 months. This was a remote internship.
He received an Infosys internship completion certificate.
Key responsibilities:
- Developed a Python-based conversational AI chatbot using NLP techniques including tokenization, intent classification, and named entity recognition for natural language understanding
- Implemented a multi-turn dialogue management system with session-state memory enabling contextually coherent conversations across multiple exchanges
- Integrated Large Language Model (LLM) APIs for generative response production and applied systematic prompt engineering strategies to improve response accuracy
- Conducted model evaluation using precision, recall, and F1-score metrics; iterated on classification thresholds to minimize false-positive intent assignments
- Delivered a live technical demonstration and written documentation to Infosys evaluators
Key achievements:
- Published AI Chat Bot on GitHub which received 1 community star (⭐1)
- Successfully completed the Infosys Virtual Internship 2.0 program
- Implemented context-aware dialogue system handling multi-turn conversations without context loss
""",
        "keywords": ["infosys", "AI intern", "NLP", "chatbot", "dialogue", "LLM", "internship 2025"],
    },

    {
        "id": "experience-infosys-project",
        "category": "project",
        "topic": "ai_chat_bot",
        "content": """
Project: AI Chat Bot — built during Infosys AI Internship (Aug–Oct 2025)
GitHub URL: https://github.com/HUNTER-X0s/AI_CHAT_BOT
Community Stars: 1 (⭐1)
Language: Python

Description: A fully functional Python-based conversational AI chatbot featuring multi-turn dialogue management, NLP-based intent classification, entity recognition, and LLM API integration for natural language response generation.

Problem it solves: Rule-based chatbots break down when user intent deviates from pre-scripted patterns. They fail to understand paraphrasing, context shifts, or compound queries, resulting in frustrating user experiences.

Solution: NLP-first intent classification pipeline that tokenizes and classifies user input into intent categories. A session memory module tracks conversation history. LLM API generates responses conditioned on full conversation context.

Architecture:
1. Input preprocessing: tokenization, stopword removal, text normalization
2. Intent classifier: ML-based multi-class classification with confidence scoring  
3. Entity extractor: named entity recognition for key information extraction
4. Session manager: in-memory conversation history with context window management
5. LLM response generator: prompt construction from context + LLM API call
6. Output post-processor: response validation and formatting

Tech Stack: Python, NLP, LLM APIs, Machine Learning, Intent Classification, Dialogue Management

Impact: Community-starred project demonstrating complete NLP pipeline from intent understanding to context-aware generation.
""",
        "keywords": ["AI chat bot", "chatbot project", "NLP project", "Infosys project", "dialogue system"],
    },

    # ══════════════════════════════════════════════════════════
    # INTERNSHIP 2: EISYSTEMS
    # ══════════════════════════════════════════════════════════
    {
        "id": "experience-eisystems-001",
        "category": "experience",
        "topic": "eisystems_internship",
        "content": """
Anurag Swain worked as a Web Development Intern at EISystems Technologies from July 2025 to September 2025, a duration of 3 months. This was a remote internship.
He received a Web Development internship certificate.
Key responsibilities:
- Engineered responsive full-stack web applications using React.js and Next.js frontend with Node.js + Express.js backend
- Designed and implemented RESTful API endpoints with MongoDB integration
- Applied component-based React architecture using hooks (useState, useEffect, useContext) for maintainable UI code
- Implemented performance optimization: code splitting, lazy loading, API response caching
- Collaborated in agile sprint cycles: planning, standups, code reviews, milestone delivery
Key achievements:
- Delivered complete website development project within 3-month timeline
- Implemented full-stack features independently from requirements to deployment
- Received official Web Development internship certificate
Skills used: React.js, Next.js, Node.js, Express.js, MongoDB, JavaScript, REST APIs, HTML5, CSS3
""",
        "keywords": ["EISystems", "web development intern", "React", "Next.js", "Node.js", "full stack", "internship"],
    },

    {
        "id": "experience-eisystems-project",
        "category": "project",
        "topic": "eisystems_web_platform",
        "content": """
Project: Full-Stack Business Web Platform — built during EISystems Technologies Web Dev Internship (Jul–Sep 2025)
Status: Completed (client project, not open source)

Description: A complete full-stack web application built from requirements to deployment during the EISystems Technologies internship. Features React.js + Next.js frontend with Node.js + Express.js REST API backend and MongoDB persistence.

Problem: Client needed a modern, responsive web platform with dynamic content management, SSR for SEO, and a clean REST API backend.

Solution: Next.js frontend with SSR + Express.js API layer for business logic connected to MongoDB.

Architecture:
1. Next.js frontend: SSR pages + client-side React for dynamic sections
2. Component library: reusable React components with hooks
3. Express.js API: RESTful routes with middleware for validation and error handling
4. MongoDB: document collections with indexed fields
5. Performance: code splitting, lazy loading, image optimization

Tech Stack: React.js, Next.js, Node.js, Express.js, MongoDB, JavaScript, REST APIs
Impact: Production-grade full-stack application delivered within 3-month internship timeline.
""",
        "keywords": ["EISystems project", "web platform", "full stack project", "React project", "Next.js project"],
    },

    # ══════════════════════════════════════════════════════════
    # INTERNSHIP 3: EDUNET / IBM
    # ══════════════════════════════════════════════════════════
    {
        "id": "experience-edunet-001",
        "category": "experience",
        "topic": "edunet_internship",
        "content": """
Anurag Swain completed a dual-role internship at Edunet Foundation from July 2025 to August 2025, a duration of 2 months. This was a remote internship.
Role 1: Artificial Intelligence and Data Analytics Intern (Jul–Aug 2025)
Role 2: AI and Cloud Technologies Intern / IBM Skills Build (Jul–Aug 2025)

Key responsibilities:
- Built EV Vehicle Charging Demand Prediction system for AICTE Internship Cycle-2 using Scikit-Learn
- Developed IBM Skills Build capstone Research Agent — autonomous AI system for multi-source research
- Applied IBM Watson and IBM Cloud APIs for enterprise AI integration
- Created Tableau and Microsoft Power BI dashboards for business intelligence visualization
- Applied EDA techniques to identify demand patterns in EV station usage data

Key achievements:
- EV Prediction GitHub repository received 1 community star (⭐1)
- Research Agent selected as IBM Skills Build internship capstone project
- Completed dual roles simultaneously receiving 2 separate internship certificates
- AICTE Internship Cycle-2 certification received

Skills used: Python, Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, IBM Watson, IBM Cloud, Tableau, Power BI, Jupyter Notebook
""",
        "keywords": ["Edunet", "IBM", "AICTE", "data analytics intern", "AI cloud intern", "internship"],
    },

    {
        "id": "experience-edunet-project-ev",
        "category": "project",
        "topic": "ev_charging_prediction",
        "content": """
Project: EV Vehicle Charging Demand Prediction
GitHub URL: https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION
Community Stars: 1 (⭐1)
Language: Jupyter Notebook (Python)
Certification: AICTE Internship Cycle-2

Description: An end-to-end machine learning pipeline that forecasts electric vehicle charging station demand using historical usage data enriched with temporal features. Built during Edunet Foundation internship for AICTE Cycle-2.

Problem: EV charging stations experience unpredictable demand peaks — energy over-allocation wastes resources during low demand, while under-allocation causes user wait times during surges.

Solution: Scikit-Learn regression pipeline with temporal feature engineering. Compared Random Forest (best), Gradient Boosting, and Linear Regression. Applied cross-validation for robust evaluation.

Architecture:
1. Data ingestion: CSV station logs with Pandas, null handling, type casting
2. EDA: Matplotlib + Seaborn — temporal patterns, correlations, demand distributions
3. Feature engineering: temporal encoding, rolling averages, lag features, cyclical encoding
4. Model training: Random Forest vs Gradient Boosting vs Linear Regression
5. Evaluation: 5-fold CV, RMSE, MAE, R², residual analysis
6. Visualization: predicted vs actual plots, feature importance charts

Tech Stack: Python, Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook
Impact: AICTE-certified; GitHub ⭐1 star; identified hour-of-day and weekday/weekend as top demand drivers.
""",
        "keywords": ["EV prediction", "electric vehicle", "charging demand", "AICTE project", "Scikit-Learn project", "machine learning project"],
    },

    {
        "id": "experience-edunet-project-research-agent",
        "category": "project",
        "topic": "research_agent",
        "content": """
Project: Research Agent (IBM Skills Build Capstone)
GitHub URL: https://github.com/HUNTER-X0s/RESEARCH_AGENT
Language: Jupyter Notebook (Python)
Recognition: IBM Skills Build Internship Capstone

Description: An autonomous AI agent that decomposes research queries, retrieves information from multiple web sources, applies NLP-based summarization, and assembles structured research reports with citations.

Problem: Complex research queries require manually searching, reading, filtering, and synthesizing information across dozens of web sources — taking hours and prone to selection bias.

Solution: Agent orchestration layer decomposes queries into sub-tasks. IBM Watson APIs provide enterprise AI. Web scraping + NLP summarization pipeline processes each source. Assembly module synthesizes into structured cited reports.

Architecture:
1. Query decomposer: breaks queries into atomic retrieval sub-tasks
2. Web retriever: scrapes target URLs, handles pagination
3. NLP summarizer: extracts key sentences and insights per source
4. IBM Watson integration: enhanced NLP via Watson APIs
5. Cross-reference module: identifies consistent vs conflicting information
6. Report assembler: structures findings with citations and confidence scores

Tech Stack: Python, IBM Watson, IBM Cloud, NLP, LLM APIs, Web Scraping, Jupyter Notebook
Impact: IBM Skills Build capstone recognition; reduces manual research time by ~70%; demonstrates agentic AI design.
""",
        "keywords": ["research agent", "IBM Watson project", "autonomous agent", "NLP project", "IBM Skills Build capstone"],
    },

    # ══════════════════════════════════════════════════════════
    # INTERNSHIP 4: MICROGENESIS
    # ══════════════════════════════════════════════════════════
    {
        "id": "experience-microgenesis-001",
        "category": "experience",
        "topic": "microgenesis_internship",
        "content": """
Anurag Swain worked as a Deep Learning Intern at MicroGenesis TechSoft from June 2025 to July 2025, a duration of 2 months. This was a HYBRID internship at 5th Floor, Tower C, Golden Enclave, Old Airport Road, Bangalore – 560017.
This was an IN-PERSON professional internship at a Bangalore AI/ML firm.

Key responsibilities:
- Designed, trained, and evaluated deep learning computer vision models using TensorFlow, PyTorch, AND Keras simultaneously
- Implemented OpenCV-based preprocessing pipelines: edge detection, morphological operations, contour extraction, histogram equalization
- Applied transfer learning with pre-trained CNN architectures (VGG16, ResNet50) reducing training compute by ~60%
- Performed data augmentation: rotation, flipping, noise injection, color jitter, cutout
- Conducted model evaluation with precision, recall, F1, confusion matrices, ROC-AUC curves, epoch-wise loss/accuracy learning curves
- Worked in professional hybrid office environment in Bangalore

Key achievements:
- Professional DL experience at an established Bangalore AI/ML company
- Proficient in PyTorch, TensorFlow, AND Keras simultaneously — rare multi-framework competency
- Received 12+ LinkedIn skill endorsements from MicroGenesis TechSoft
- Transfer learning reduced training time by approximately 60%
- Received MicroGenesis TechSoft Deep Learning internship certificate

Skills used: Python, PyTorch, TensorFlow, Keras, OpenCV, Computer Vision, Deep Learning, NLP, Scikit-Learn, NumPy, Matplotlib, Seaborn
""",
        "keywords": ["MicroGenesis", "deep learning intern", "Bangalore internship", "PyTorch", "TensorFlow", "OpenCV", "computer vision", "CNN"],
    },



    # ══════════════════════════════════════════════════════════
    # PERSONAL PROJECTS
    # ══════════════════════════════════════════════════════════
    {
        "id": "project-currency-converter",
        "category": "project",
        "topic": "currency_converter",
        "content": """
Project: Real-Time Currency Converter
GitHub URL: https://github.com/HUNTER-X0s/Currency_Converter
Live URL: https://hunter-x0s.github.io/Currency_Converter/
Community Stars: 1 (⭐1)
Language: JavaScript

Description: A responsive web application converting between 150+ global currencies using live exchange rates from an external API.

Features: Real-time conversion, debounced inputs for performance, local storage caching for recently used pairs, responsive design for all device sizes.

Problem: Existing currency converters are cluttered, slow, or limited in currency support.

Solution: Vanilla JavaScript SPA with live exchange rate API integration, debounced input handling, and local storage caching.

Tech Stack: JavaScript, HTML5, CSS3, Exchange Rate API, Local Storage
Impact: Supports 150+ currencies; GitHub ⭐1 star; sub-200ms conversion with local caching.
""",
        "keywords": ["currency converter", "JavaScript project", "web app", "live project", "real-time"],
    },

    {
        "id": "project-portfolio-website",
        "category": "project",
        "topic": "portfolio_website",
        "content": """
Project: Developer Portfolio (anurag-portfolio)
GitHub URL: https://github.com/HUNTER-X0s/anurag-portfolio
Live URL: https://hunter-x0s.github.io/anurag-portfolio/
Language: JavaScript (recently updated)

Description: Personal portfolio website showcasing Anurag's projects, experience, and skills. Recently updated with AI-powered features. The primary digital presence for professional opportunities.

Tech Stack: JavaScript, HTML5, CSS3, GitHub Pages
Status: Live and actively maintained.
""",
        "keywords": ["portfolio website", "personal site", "anurag portfolio"],
    },

    # ══════════════════════════════════════════════════════════
    # SKILLS
    # ══════════════════════════════════════════════════════════
    {
        "id": "skills-programming",
        "category": "skills",
        "topic": "programming_languages",
        "content": """
Anurag Swain's programming language skills:
- Python: 88% proficiency — primary language for AI/ML/Data Science; used in all 4 AI/ML internships
- JavaScript: 80% proficiency — web development, frontend, ES6+ features
- C and C++: 72% proficiency — algorithmic programming, OOP, competitive programming
- Java: 68% proficiency — core Java, OOP, academic projects; GitHub repo: JAVA_PROGRAMMING
- PHP: 60% proficiency — web backend; GitHub repo: PHP_PROGRAMMING
- Shell Scripting: 62% proficiency — Linux scripting; GitHub repo: LINUX-SHELL-SCRIPTING
- SQL: 78% proficiency — database queries, MySQL; GitHub repo: SQL_mysql
""",
        "keywords": ["programming languages", "coding skills", "Python skill", "JavaScript skill", "what languages", "can he code"],
    },

    {
        "id": "skills-web-development",
        "category": "skills",
        "topic": "web_development_skills",
        "content": """
Anurag Swain's web development skills:
Frontend:
- React.js: 78% — component architecture, hooks, context API; used at EISystems Technologies
- Next.js: 74% — SSR, file-based routing, API routes; used at EISystems Technologies
- HTML5/CSS3: 85% — semantic HTML, flexbox, grid, animations, responsive design
- Tailwind CSS: 75% — utility-first styling
- Bootstrap: 72% — responsive grid and components
- JavaScript: 80% — ES6+, async/await, DOM manipulation, fetch API

Backend:
- Node.js: 73% — server-side JS, async programming; used at EISystems
- Express.js: 70% — REST API design, middleware, routing; used at EISystems
- PHP: 60% — web backend scripting

UI/UX Design:
- Figma: 70% — wireframing, prototyping, design systems
- Canva: 70% — graphic design, presentations
""",
        "keywords": ["web development skills", "React skills", "frontend skills", "backend skills", "Node.js skills"],
    },

    {
        "id": "skills-ai-ml-dl",
        "category": "skills",
        "topic": "ai_ml_dl_skills",
        "content": """
Anurag Swain's AI/ML/Deep Learning skills:

Machine Learning:
- Scikit-Learn: 82% — regression, classification, clustering, model evaluation, pipelines; used in EV Prediction project
- Machine Learning overall: 82% — supervised/unsupervised learning, feature engineering, cross-validation
- Pandas/NumPy: 85% — data manipulation, numerical computing; used in all data science work

Deep Learning:
- TensorFlow/Keras: 80% — neural network design, training, evaluation; used at MicroGenesis Bangalore
- PyTorch: 78% — tensor operations, autograd, custom models; used at MicroGenesis Bangalore
- Deep Learning overall: 78% — CNNs, RNNs, transfer learning, data augmentation

Computer Vision:
- OpenCV: 75% — image preprocessing, edge detection, contour extraction; used at MicroGenesis
- Computer Vision: 74% — object detection, image classification

NLP:
- NLP: 68% — tokenization, intent classification, entity recognition, summarization; used at Infosys

Other AI tools:
- IBM Watson: 65% — Watson APIs for NLP and cloud AI; used in Research Agent project
- LLM APIs: 68% — OpenAI/LLM integration; used in Infosys chatbot
""",
        "keywords": ["AI skills", "ML skills", "machine learning", "deep learning", "NLP skills", "PyTorch", "TensorFlow", "OpenCV", "computer vision"],
    },

    {
        "id": "skills-data-science",
        "category": "skills",
        "topic": "data_science_skills",
        "content": """
Anurag Swain's Data Science skills:
- Pandas: 85% — data manipulation, cleaning, merging, groupby operations
- NumPy: 85% — numerical computing, array operations
- Matplotlib: 80% — data visualization, plots, charts, figures
- Seaborn: 80% — statistical visualization, heatmaps, distribution plots
- Jupyter Notebook: 85% — interactive development, reproducible analysis
- Data Visualization: 78% — communicating insights through charts and dashboards
- Tableau: 74% — business intelligence dashboards; used at Edunet Foundation
- Microsoft Power BI: 68% — BI reporting and visualization; used at Edunet Foundation
- Feature Engineering: 80% — temporal encoding, lag features, polynomial features, scaling
- Statistical Analysis: 75% — hypothesis testing, correlation, distribution analysis
""",
        "keywords": ["data science skills", "Pandas skill", "data visualization", "Tableau", "Power BI", "Jupyter", "statistics"],
    },

    {
        "id": "skills-database-cloud",
        "category": "skills",
        "topic": "database_cloud_tools",
        "content": """
Anurag Swain's database and tools skills:

Databases:
- MySQL/SQL: 78% — relational database queries, joins, indexing; GitHub repo: SQL_mysql
- MongoDB: 70% — NoSQL document store, CRUD operations; used at EISystems Technologies
- DBMS Concepts: 80% — normalization, transactions, indexing, query optimization (coursework)

Cloud & DevOps:
- Git/GitHub: 82% — version control, branching, pull requests; manages 14 public repos
- IBM Watson/Cloud: 65% — enterprise AI APIs; used in Research Agent
- Linux/Ubuntu: 68% — command line, file system, package management; GitHub: LINUX-SHELL-SCRIPTING
- Cloud Computing: 62% — theoretical foundations in distributed systems (B.Tech coursework)
- VS Code: 88% — primary IDE

Operating Systems:
- Windows: 80%
- Linux/Ubuntu: 68% — used since school
- macOS: basic familiarity
""",
        "keywords": ["database skills", "MongoDB skill", "MySQL skill", "Git skills", "GitHub", "cloud skills", "Linux"],
    },

    {
        "id": "skills-cs-fundamentals",
        "category": "skills",
        "topic": "computer_science_fundamentals",
        "content": """
Anurag Swain's Computer Science fundamentals (B.Tech CSE curriculum with CGPA 8.10):
- Data Structures and Algorithms (DSA): strong — competitive programming background
- Object-Oriented Programming (OOP): strong — applied in Python, Java, C++
- Database Management System (DBMS): strong — normalization, transactions, SQL
- Computer Networks (CN): good — TCP/IP, OSI model, protocols
- Operating Systems (OS): good — process management, memory, file systems
- Cloud Computing (CC): familiar — distributed systems, service models
- Deep Learning (DL): advanced — from MicroGenesis internship
- Software Engineering (SE): good — SDLC, agile, requirements analysis
- Artificial Intelligence (AI): advanced — from 4 AI/ML internships
- Machine Learning (ML): advanced — from internships and projects
""",
        "keywords": ["CS fundamentals", "DSA", "algorithms", "data structures", "OOP", "networking", "operating systems", "CGPA"],
    },

    # ══════════════════════════════════════════════════════════
    # EDUCATION
    # ══════════════════════════════════════════════════════════
    {
        "id": "education-gcek",
        "category": "education",
        "topic": "btech_degree",
        "content": """
Anurag Swain is pursuing a Bachelor of Technology (B.Tech) in Computer Science and Engineering at Government College of Engineering, Kalahandi (GCE Kalahandi), Odisha, affiliated with Biju Patnaik University of Technology (BPUT).
Duration: 2023 to 2027 (currently 3rd year).
CGPA: 8.10 out of 10.00 (strong academic performance).
Club: Member of KiloBots — the official Robotics Club of GCE Kalahandi — contributing to team-based automation and embedded systems projects.
Activities: Active participant in Tech-Fests promoting innovation; volunteered in college-level functions and cultural events; participated in athletics and sports competitions.
Key courses: AI/ML, Deep Learning, Cloud Computing, Software Engineering, Data Structures & Algorithms, OOP, DBMS, Computer Networks, Operating Systems.
""",
        "keywords": ["education", "college", "GCE Kalahandi", "GCEK", "B.Tech", "CGPA", "degree", "BPUT"],
    },

    {
        "id": "education-kv",
        "category": "education",
        "topic": "school_education",
        "content": """
Anurag Swain completed his Class XII (Senior Secondary) in Science with PCMB (Physics, Chemistry, Mathematics, Biology) from Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar under CBSE board in 2023.
He completed his Class X (Secondary) from the same school in 2021.
School activities: Ashoka House Sports Captain — led the house in inter-house athletics and sports events with team management skills. Competitive chess enthusiast with tournament participation. Badminton player in school-level and inter-house competitions. Active in online competitive gaming. Proficient in Microsoft Office since school.
He began using Linux/Ubuntu from school level (self-taught).
""",
        "keywords": ["school", "Kendriya Vidyalaya", "class 12", "class 10", "CBSE", "PCMB", "secondary"],
    },

    # ══════════════════════════════════════════════════════════
    # CERTIFICATIONS
    # ══════════════════════════════════════════════════════════
    {
        "id": "certifications-all",
        "category": "certifications",
        "topic": "all_certifications",
        "content": """
Anurag Swain has earned 6 professional internship and project certifications in 2025:

1. Artificial Intelligence Virtual Internship 2.0 Certificate
   Issued by: Infosys (Infosys Springboard)
   Date: October 2025
   Skills: AI, Machine Learning, NLP, Python, Conversational AI, LLM APIs

2. Web Development Internship Certificate
   Issued by: EISystems Technologies
   Date: September 2025
   Skills: React.js, Next.js, Node.js, Express.js, MongoDB, Full-Stack Development

3. Artificial Intelligence & Data Analytics Internship Certificate
   Issued by: Edunet Foundation
   Date: August 2025
   Skills: AI, Data Analytics, Tableau, Microsoft Power BI, Data Visualization

4. AI and Cloud Technologies Internship Certificate (IBM Skills Build)
   Issued by: Edunet Foundation / IBM
   Date: August 2025
   Skills: IBM Watson, IBM Cloud, Cloud Computing, AI Agents, NLP

5. AICTE Internship Cycle-2 Certificate — EV Charging Demand Prediction
   Issued by: AICTE / Edunet Foundation
   Date: August 2025
   Skills: Machine Learning, Python, Scikit-Learn, Predictive Modeling

6. Deep Learning Internship Certificate
   Issued by: MicroGenesis TechSoft, Bangalore
   Date: July 2025
   Skills: Deep Learning, TensorFlow, PyTorch, Keras, OpenCV, Computer Vision

All certificates are stored at: https://github.com/HUNTER-X0s/CERTIFICATIONS
""",
        "keywords": ["certifications", "certificates", "credentials", "Infosys cert", "IBM cert", "AICTE cert", "MicroGenesis cert"],
    },

    # ══════════════════════════════════════════════════════════
    # GITHUB STATS
    # ══════════════════════════════════════════════════════════
    {
        "id": "github-stats",
        "category": "github",
        "topic": "github_repositories",
        "content": """
Anurag Swain's GitHub profile: https://github.com/HUNTER-X0s
GitHub username: HUNTER-X0s
GitHub bio: "HUNTER-X0s · DATA SCIENCE ENTHUSIAST · DEVELOPER"
Total public repositories: 14
Total stars received: 3 (across repositories)

Key repositories:
1. EV-VEHICLE-CHARGING-DEMAND-PREDICTION — Jupyter Notebook — ⭐1 — AICTE Internship Cycle-2
2. AI_CHAT_BOT — Python — ⭐1 — Infosys AI Internship project
3. Currency_Converter — JavaScript — ⭐1 — Real-time currency web app
4. RESEARCH_AGENT — Jupyter Notebook — IBM Skills Build Capstone
5. anurag-portfolio — JavaScript — Personal portfolio website
7. CERTIFICATIONS — Repository storing all internship certificates
8. SQL_mysql — SQL learning and projects
9. JAVA_PROGRAMMING — Java code and projects
10. LINUX-SHELL-SCRIPTING — Shell scripting on Linux
11. C_plus_PROGRAMMING — C++ projects and exercises
12. PHP_PROGRAMMING — PHP web development
13. PYTHON_PROGRAMMING — Python learning and projects
14. HUNTER-X0s — Profile README

Top languages by usage: Python (42%), Jupyter Notebook (28%), JavaScript (16%), Java (6%), Shell (4%), C++ (4%)
""",
        "keywords": ["GitHub", "repositories", "repos", "stars", "open source", "code", "HUNTER-X0s"],
    },

    # ══════════════════════════════════════════════════════════
    # HOBBIES & PERSONAL
    # ══════════════════════════════════════════════════════════
    {
        "id": "personal-hobbies",
        "category": "personal",
        "topic": "hobbies_interests",
        "content": """
Anurag Swain's hobbies and interests outside of tech:
- Competitive Chess: strategic thinker with tournament participation; chess captain at school
- Photography: hobby photographer
- Sports: Cricket, Football, Badminton, Volleyball — played at school and college level
- Cycling and Trekking: outdoor adventure activities
- Swimming: recreational
- Traveling: enjoys exploring new places
- Gaming: online freeware and competitive gaming with strategic gameplay focus
- Open Source: active contributor to 14 public GitHub repositories
Languages spoken: English (Professional), Hindi (Native/Bilingual), Odia (Native/Bilingual — home state), Bengali (Intermediate)
""",
        "keywords": ["hobbies", "interests", "chess", "sports", "photography", "personal", "languages"],
    },

    # ══════════════════════════════════════════════════════════
    # ROLE FIT ANALYSIS
    # ══════════════════════════════════════════════════════════
    {
        "id": "role-fit-analysis",
        "category": "value_proposition",
        "topic": "best_role_fit",
        "content": """
Best role fits for Anurag Swain based on his actual experience and skills:

STRONGEST FIT: AI/ML Engineer
- 4 consecutive AI/ML internships in 2025: Infosys (AI), Edunet/IBM (AI+Cloud), MicroGenesis (Deep Learning), Shadow Fox (Data Science)
- Hands-on with PyTorch, TensorFlow, Keras, Scikit-Learn, OpenCV, NLP, LLM APIs
- Shipped 2 starred ML projects: EV Prediction (⭐1), AI Chat Bot (⭐1)
- IBM Skills Build capstone recognition for Research Agent agentic AI system

STRONG FIT: Full-Stack Developer
- 3-month EISystems Technologies web development internship
- Built production React.js + Next.js + Node.js + Express.js + MongoDB application
- Currency Converter live project demonstrating independent frontend capability
- GitHub active with 14 repos and multiple web projects

STRONG FIT: Data Scientist
- Shadow Fox Data Science internship + Edunet AI & Data Analytics internship
- AICTE-certified EV Demand Prediction ML pipeline
- Strong Python data stack: Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn
- Tableau and Power BI experience for business-facing visualization

GOOD FIT: Deep Learning Engineer
- Professional DL experience at MicroGenesis TechSoft, Bangalore (hybrid, in-person)
- Multi-framework expertise: PyTorch + TensorFlow + Keras simultaneously (rare)
- OpenCV computer vision pipeline experience
- Received 12+ LinkedIn endorsements from MicroGenesis TechSoft professionals

WHY HIRE ANURAG:
1. 4 professional internships in 2025 — exceptional volume for a 3rd-year student
2. CGPA 8.10 — strong academic foundation validates learning ability
3. GitHub projects with community recognition (3 starred repos)
4. Adaptable across AI/ML, full-stack, and data science domains
5. Fast learner — completed IBM Skills Build, AICTE-certified ML, and 4+ tech stacks in one year
6. Available for immediate internships and entry-level roles
""",
        "keywords": ["best role", "role fit", "why hire", "strengths", "suitability", "recommendation", "best for", "suited for"],
    },

    {
        "id": "availability-contact",
        "category": "identity",
        "topic": "availability_hiring",
        "content": """
Anurag Swain is ACTIVELY AVAILABLE for opportunities as of 2025-2026.
He is open to:
- Software Development Engineer (SDE) roles
- AI Engineer positions
- ML / Machine Learning Engineer roles
- Full-Stack Developer positions
- Data Scientist roles
- Deep Learning Engineer positions
- Frontend / Backend Developer roles
- Data Analyst positions

He is a 3rd-year B.Tech student expected to graduate in 2027. He is seeking internships, part-time remote roles, and full-time fresher positions.
Preferred: Remote or hybrid positions. Open to relocation for the right opportunity.
Contact: Email anurag.swain35@gmail.com or call +91-7008973337.
Expected response time: within 24 hours.
""",
        "keywords": ["available", "hiring", "open to work", "contact", "opportunity", "join", "availability"],
    },
]
