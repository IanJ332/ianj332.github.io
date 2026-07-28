/* Change this file to get your personal Portfolio */

const emoji = (string) => string;

const splashScreen = {
  enabled: false,
  duration: 2000
};

// Summary And Greeting Section
const illustration = {
  animated: true
};

const greeting = {
  username: "Ian Jiang",
  fullLegalName: "Jisheng Jiang",
  title: "Full-Stack Software Engineer & ML Researcher",
  subTitle: emoji(
    "I’m a Full-Stack Software Engineer specializing in AI agent infrastructure, LLM retrieval pipelines, and high-concurrency cloud architecture. With deep expertise across Python, Java, TypeScript, and modern AI frameworks, I build scalable systems with rigorous safety guardrails."
  ),
  resumeLink: "https://drive.google.com/file/d/1LWvYgkYbMujArbqPk4KPg-zBK91V5-uk/view?usp=sharing",
  displayGreeting: true
};

// Social Media Links
const socialMediaLinks = {
  github: "https://github.com/IanJ332",
  linkedin: "https://www.linkedin.com/in/jisheng-jiang/",
  gmail: "jiangjs03@gmail.com",
  medium: "https://medium.com/@jiangjs03",
  agenticSkillsRepo: "https://github.com/sickn33/agentic-awesome-skills",
  display: true
};

// Enhanced Tech Stack & Skill Vault
const skillsSection = {
  title: "Technical Expertise & Skill Vault",
  subTitle: "ENGINEERING PROFICIENCY & ARCHITECTURAL STACK",
  introText: "Production-grade experience across AI Infrastructure, Scalable Microservices, Cloud Orchestration, and Modern High-Performance Web Applications.",
  softwareSkills: [
    {
      category: "AI Systems & Infrastructure",
      description: "Agent Orchestration, Retrieval Pipelines & Inference Optimization",
      skills: [
        { name: "Agentic AI & Guardrails", level: "Expert" },
        { name: "LLM Routing & Context Management", level: "Advanced" },
        { name: "RAG & Vector Search (Milvus, FAISS)", level: "Advanced" },
        { name: "Multi-Agent Debate & 3D Scoring", level: "Research" },
        { name: "FastAPI / WebSocket Streaming", level: "Expert" },
        { name: "PyTorch & Int8 Quantization", level: "Advanced" }
      ]
    },
    {
      category: "Backend & Cloud Architecture",
      description: "Distributed Systems, Microservices & Containerization",
      skills: [
        { name: "Java & Spring Boot", level: "Expert" },
        { name: "Python (AsyncIO / Databricks)", level: "Expert" },
        { name: "TypeScript & Node.js", level: "Advanced" },
        { name: "GraphQL & RESTful APIs", level: "Expert" },
        { name: "AWS EKS (Kubernetes) & GCP", level: "Advanced" },
        { name: "CI/CD (Jenkins, Docker)", level: "Advanced" }
      ]
    },
    {
      category: "Data Engineering & Storage",
      description: "Relational, NoSQL Databases & High-Concurrency Caching",
      skills: [
        { name: "PostgreSQL & MySQL", level: "Expert" },
        { name: "Redis Caching & Latency Optimization", level: "Advanced" },
        { name: "Supabase & Realtime DB", level: "Advanced" },
        { name: "ETL Pipelines & Data Sync", level: "Advanced" },
        { name: "Pessimistic Locking & ACID Correctness", level: "Expert" }
      ]
    },
    {
      category: "Frontend & Interactive 3D",
      description: "Modern Responsive Web Applications & WebGL Integration",
      skills: [
        { name: "React 18 & Next.js", level: "Expert" },
        { name: "Three.js / WebGL / R3F", level: "Advanced" },
        { name: "TailwindCSS & Glassmorphic UI", level: "Expert" },
        { name: "Framer Motion & Micro-animations", level: "Advanced" },
        { name: "Vite & Modern Build Tooling", level: "Expert" }
      ]
    }
  ],
  display: true
};

// Education Section
const educationInfo = {
  display: true,
  schools: [
    {
      schoolName: "University of Illinois Urbana-Champaign",
      logo: "/assets/images/uiucLOGO.png",
      subHeader: "Master of Computer Science (MCS)",
      duration: "Expected Graduation: Dec 2026",
      location: "Urbana-Champaign, IL",
      descBullets: [
        "GPA: 3.6 / 4.0",
        "Member, AI Alignment Illinois & UIUC AI Alignment Lab",
        "Focus on Multi-Agent Debate, Reasoning Reliability & AI Guardrails"
      ]
    },
    {
      schoolName: "San José State University",
      logo: "/assets/images/sjsuLOGO.png",
      subHeader: "B.S. in Computer Science",
      duration: "August 2021 - June 2025",
      location: "San Jose, CA",
      descBullets: [
        "GPA: 3.7 / 4.0",
        "Dean's Scholar & Cum Laude Honors",
        "Specialization in Software Engineering & Machine Learning Systems"
      ]
    }
  ]
};

// Work Experience Section
const workExperiences = {
  display: true,
  experience: [
    {
      role: "Agentic AI Infrastructure Engineer",
      company: "Agentic Awesome Skills",
      companylogo: "/assets/images/me.png",
      location: "Open Source / Core Contributor",
      date: "Core Contributor · 2025 - Present",
      url: "https://github.com/sickn33/agentic-awesome-skills",
      descBullets: [
        "Spearheaded backend harness architecture for **AWS/GCP + NoSQL** skill modules, standardizing cross-regional backend topologies for autonomous agent execution.",
        "Engineered a **Hazard-Tagging (Risk Classification)** risk isolation system via automated skill testing, safeguarding database integrity against unverified AI code executions."
      ]
    },
    {
      role: "Machine Learning Researcher",
      company: "UIUC AI Alignment Lab",
      companylogo: "/assets/images/uiucLOGO.png",
      location: "Urbana-Champaign, IL",
      date: "Member since Jan 2026",
      url: "https://illinois.edu",
      descBullets: [
        "Led and engineered a **Multi-Agent Debate** framework with role-specialized personas and **dynamic anchoring** to resolve correlated reasoning failures and consensus drift in complex reasoning tasks.",
        "Developed a critic-actor revision pipeline with **3D confidence scoring** (Logic, Confidence, and Reasoning-Question Alignment scores), boosting LLM reasoning accuracy by **40%+**."
      ]
    },
    {
      role: "Co-founder · AI Model Engineer",
      company: "VideoTutor.ai",
      companylogo: "/assets/images/me.png",
      location: "San Jose, CA",
      date: "Nov 2024 - Oct 2025",
      descBullets: [
        "Deployed a **LangChain** routing classifier to dispatch requests by query complexity, reducing model API expenditure by **30%**.",
        "Designed a **Databricks + FAISS** distillation pipeline and shared-context **RAG** flow for **30K+ users**, dynamically mitigating retrieval bias and drastically reducing latency."
      ]
    },
    {
      role: "LLM Infrastructure Engineer",
      company: "CollegeBot.ai",
      companylogo: "/assets/images/collegebotLOGO.avif",
      location: "Sponsored by Kimi.ai",
      date: "Jan 2024 - Oct 2024",
      descBullets: [
        "Developed a **Milvus-backed stateful memory engine** for persona-specific context across long-form agent interactions, eliminating semantic drift.",
        "Optimized task decomposition, function calling, and multi-step orchestration flows to guarantee reliable agent execution."
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "TRIPALINK",
      companylogo: "/assets/images/Tripalink.png",
      location: "Los Angeles, CA",
      date: "Jun 2023 - Aug 2023",
      descBullets: [
        "Architected **Java / Spring Boot** microservices and **GraphQL / REST APIs** on **AWS EKS (Kubernetes)**, accelerating tenant-analysis workflows by **80%**.",
        "Optimized query performance with **Redis** and **PostgreSQL** indexing, reducing data-access latency by **25%**.",
        "Maintained **CI/CD** pipelines with **Jenkins, Maven, and Postman**, cutting manual deployment overhead by **80%**."
      ]
    },
    {
      role: "Volunteer Software Engineer",
      company: "The Rabbit Haven",
      companylogo: "/assets/images/therabbithavenLOGO.png",
      location: "San Jose, CA",
      date: "Nov 2022 - May 2023",
      descBullets: [
        "Rebuilt the **React** shelter portal and digitized adoption workflows, automating Python **ETL** synchronization into **MySQL** and saving ~**35 minutes** per task.",
        "Implemented Pessimistic Locking to guarantee transactional **ACID** correctness under concurrent shelter traffic."
      ]
    }
  ]
};

// Featured Projects & Research Showcase
const bigProjects = {
  title: "Selected Works & Agentic Projects",
  subtitle: "SOFTWARE ENGINEERING & AI RESEARCH",
  featuredProjects: [
    {
      projectName: "Agentic Awesome Skills",
      image: "/assets/images/me.png",
      subtitle: "Core Contributor · Open Source",
      featuredSummary: "A production-grade **Agentic Skill Harness** and risk-governance standard powering autonomous coding agents.",
      descBullets: [
        "Architected standardized skill interfaces for **AWS, GCP, and NoSQL** agent execution environments.",
        "Engineered an automated **Hazard-Tagging (Risk Classification)** system to prevent unverified code mutations."
      ],
      stack: ["Agentic AI", "Open Source", "Security Harness", "TypeScript"],
      footerLink: [
        {
          name: "View GitHub Repo (44.0k+ ⭐)",
          url: "https://github.com/sickn33/agentic-awesome-skills"
        }
      ]
    },
    {
      projectName: "Helper Bob: LLM Infrastructure",
      image: "/assets/images/helperbobLOGO.svg",
      subtitle: "LLM Orchestration & Prompt Layer",
      featuredSummary: "Advanced **Prompt Engineering and Orchestration Layer** designed to eliminate conversational semantic drift in complex multi-step reasoning.",
      descBullets: [
        "Published customized LLM inference model weights on HuggingFace Hub.",
        "Implemented dynamic context compression and multi-step function calling guardrails."
      ],
      stack: ["LLM Infrastructure", "HuggingFace", "Python", "Prompt Engineering"],
      footerLink: [
        {
          name: "Open HuggingFace Model",
          url: "https://huggingface.co/Ian332/Helper_Bob"
        }
      ]
    },
    {
      projectName: "Multimodal Sentiment Analysis System (Lite-MSA)",
      image: "/assets/images/me.png",
      subtitle: "Real-time Multimodal AI Pipeline",
      featuredSummary: "Real-time multimodal sentiment analysis pipeline optimized for **low-latency streaming inference**.",
      descBullets: [
        "Built a **VAD-gated FastAPI/WebSocket** pipeline for live audio-visual streaming inference.",
        "Applied **Int8 quantization** and entropy-based fusion to maintain sub-**300ms** latency at **85%** multimodal accuracy."
      ],
      stack: ["Python", "PyTorch", "FastAPI", "WebSocket", "HuBERT"],
      footerLink: [
        {
          name: "View GitHub Repo",
          url: "https://github.com/IanJ332/Lite-MSA-Stream"
        }
      ]
    },
    {
      projectName: "BakeWise: AI Fermentation Assistant",
      image: "/assets/images/bake wise.png",
      subtitle: "IoT & Gemini AI Ecosystem",
      featuredSummary: "A **True AI Fermentation Assistant** built with **Kotlin (MVVM)** and **FastAPI**, pairing real-time IoT tracking with Gemini-based reasoning.",
      descBullets: [
        "Architected an IoT tracking app with **Kotlin (MVVM)** and **FastAPI** for guided fermentation workflows.",
        "Integrated a custom **backward-scheduling algorithm** and Gemini API for real-time sourdough analysis."
      ],
      stack: ["Kotlin", "Android MVVM", "FastAPI", "Gemini API"],
      footerLink: [
        {
          name: "View GitHub Repo",
          url: "https://github.com/IanJ332/BakeWise"
        }
      ]
    }
  ],
  otherProjects: [
    {
      projectName: "Sign Language Recognition",
      image: "/assets/images/how2signlogo.png",
      description: "Automated hyperparameter tuning for a MobileNetV2 + CNN-LSTM backbone via Bayesian Optimization, achieving 98.4% accuracy.",
      stack: ["Python", "TensorFlow", "Optuna", "CNN-LSTM"],
      footerLink: [
        {
          name: "View GitHub Repo",
          url: "https://github.com/IanJ332/Sign_language_translator"
        }
      ]
    },
    {
      projectName: "MAD: Majority Error Debate",
      image: "/assets/images/uiucLOGO.png",
      description: "A novel critic-actor multi-agent architecture countering majority agent hallucination positions in complex reasoning benchmarks.",
      stack: ["LLM Research", "Multi-Agent Debate", "Python"],
      footerLink: [
        {
          name: "View GitHub Repo",
          url: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate"
        },
        {
          name: "Read Paper PDF",
          url: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate/blob/main/CS546_GP.pdf"
        }
      ]
    },
    {
      projectName: "Liquidity: Financial Bank Platform",
      image: "/assets/images/me.png",
      description: "High-concurrency financial platform built with Next.js & Supabase, guaranteeing atomic ACID transactions and live updates.",
      stack: ["Next.js", "Supabase", "PostgreSQL", "Realtime"],
      footerLink: [
        {
          name: "View GitHub Repo",
          url: "https://github.com/ehcaw/Liquidity"
        }
      ]
    }
  ],
  display: true
};

// Blogs Section
const blogSection = {
  title: "Blogs & Technical Writing",
  subtitle: "In-depth research on AI reasoning, hardware optimization, and model architectures.",
  displayMediumBlogs: true,
  blogs: [
    {
      url: "https://medium.com/@jiangjs03/the-quest-for-true-ai-reasoning-data-driven-approaches-and-extreme-hardware-optimization-1797a4b0bf47",
      title: "The Quest for True AI Reasoning: Data-Driven Approaches and Extreme Hardware Optimization",
      description:
        "Exploring current LLM reasoning limitations, the role of data-driven multi-agent protocols, and how hardware optimization unlocks next-generation AI reasoning capabilities."
    }
  ],
  display: true
};

const contactInfo = {
  title: emoji("Get in Touch ☎️"),
  subtitle: "Open for machine learning engineering, backend systems, and research opportunities.",
  email_address: "jiangjs03@gmail.com"
};

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  workExperiences,
  bigProjects,
  blogSection,
  contactInfo
};