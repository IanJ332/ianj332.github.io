/* Change this file to get your personal Portfolio */

// To change portfolio colors globally go to the  _globalColor.scss file

const emoji = (string) => string;

const splashScreen = {
  enabled: false,
  duration: 2000
};

// Summary And Greeting Section

const illustration = {
  animated: true // Set to false to use static SVG
};

const greeting = {
  username: "Ian Jiang",
  title: "Hi all, I'm Ian",
  subTitle: emoji(
    "I’m a Full-Stack Software Engineer with a specialization in AI model training, backend systems, and cloud-based architecture. My core proficiencies include Python, Java, JavaScript, and a variety of modern backend frameworks, allowing me to deliver high-performance, scalable solutions."
  ),
  // resumeLink: "/resume.pdf", // 只写 /resume.pdf，因为public目录默认就是根目录
  resumeLink:
    "https://drive.google.com/file/d/1LWvYgkYbMujArbqPk4KPg-zBK91V5-uk/view?usp=sharing", // Set to empty to hide the button
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/IanJ332",
  linkedin: "https://www.linkedin.com/in/jisheng-jiang/",
  gmail: "jiangjs03@gmail.com",
  // gitlab: "https://gitlab.com/saadpasta",
  // facebook: "https://www.facebook.com/saad.pasta7",
  medium: "https://medium.com/@jiangjs03",
  // stackoverflow: "https://stackoverflow.com/users/10422806/saad-pasta",
  // Instagram, Twitter and Kaggle are also supported in the links!
  // To customize icons and social links, tweak src/components/SocialMedia
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "Technical Skills",
  subTitle: "",
  introText: "I build production-grade AI and backend systems, with experience across LLM applications, retrieval pipelines, and scalable web products.",
  skills: [], // Removed verbose prose
  softwareSkills: [
    {
      category: "Backend & Platform",
      skills: ["Java", "Spring Boot", "Python", "TypeScript", "REST", "GraphQL", "Kubernetes", "AWS", "GCP"]
    },
    {
      category: "AI Systems",
      skills: ["RAG", "LLM routing", "context management", "vector search", "inference optimization", "GAN"]
    },
    {
      category: "Data & Storage",
      skills: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "ETL", "Supabase", "FAISS", "Milvus"]
    },
    {
      category: "Frontend",
      skills: ["React", "Next.js", "UI implementation", "performance tuning"]
    }
  ],
  display: true
};

// Education Section
const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "University of Illinois Urbana-Champaign",
      logo: "/assets/images/uiucLOGO.png",
      subHeader: "Master of Computer Science",
      duration: "Expected Graduation: Dec 2026",
      desc: "",
      descBullets: [
        "GPA: 3.6/4.0",
        "Member, AI Alignment Illinois"
      ]
    },
    {
      schoolName: "San José State University",
      logo: "/assets/images/sjsuLOGO.png",
      subHeader: "B.S. in Computer Science",
      duration: "August 2021 - June 2025",
      desc: "",
      descBullets: [
        "GPA: 3.7/4.0",
        "Dean's Scholar",
        "Cum Laude"
      ]
    }
  ]
};

// Work experience section

const workExperiences = {
  display: true, // Set it to true to show workExperiences Section
  experience: [
    {
      role: "Machine Learning Researcher",
      company: "UIUC AI Alignment Lab",
      companylogo: "/assets/images/uiucLOGO.png",
      date: "Expected Graduation: Dec 2026",
      desc: "",
      descBullets: [
        "Built a **Multi-Agent Debate** framework with role-specialized personas and **dynamic anchoring** to reduce consensus drift in complex reasoning tasks.",
        "Developed a critic-actor revision pipeline with **3D confidence scoring**, improving reasoning accuracy by **40%+**."
      ]
    },
    {
      role: "Co-founder · AI Model Engineer",
      company: "VideoTutor.ai",
      companylogo: "",
      date: "Nov 2024 - Oct 2025",
      desc: "",
      descBullets: [
        "Built a **LangChain** routing classifier to dispatch requests by query complexity, reducing model API costs by **30%**.",
        "Designed a **Databricks + FAISS** distillation pipeline and shared-context **RAG** flow for **30K+ users**, reducing latency and improving response consistency."
      ]
    },
    {
      role: "LLM Infrastructure Engineer",
      company: "CollegeBot.ai",
      companylogo: "/assets/images/collegebotLOGO.avif",
      date: "Jan 2024 - Oct 2024",
      desc: "",
      descBullets: [
        "Developed a **Milvus-backed stateful memory engine** for persona-specific context across long-form agent interactions.",
        "Optimized task decomposition, function calling, and orchestration flows to improve reliability on complex instructions."
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "TRIPALINK",
      companylogo: "/assets/images/Tripalink.png",
      date: "Jun 2023 - Aug 2023",
      desc: "",
      descBullets: [
        "Built **Java / Spring Boot** microservices and **GraphQL / REST APIs** on **AWS** to accelerate tenant-analysis workflows by **80%**.",
        "Improved retrieval performance with **Redis** and **PostgreSQL** indexing, reducing data-access latency by **25%**.",
        "Maintained **CI/CD** and end-to-end testing workflows with **Jenkins, Maven, and Postman**, reducing manual deployment overhead by **80%**."
      ]
    },
    {
      role: "Volunteer Software Engineer",
      company: "The Rabbit Haven",
      companylogo: "/assets/images/therabbithavenLOGO.png",
      date: "Nov 2022 - May 2023",
      desc: "",
      descBullets: [
        "Rebuilt the **React** portal and digitized adoption workflows for non-technical shelter staff, automating Python-based **ETL** synchronization into **MySQL** and saving about **35 minutes** per adoption task.",
        "Built a concurrency-safe **ETL pipeline** using pessimistic locking to maintain **ACID** transactional consistency."
      ]
    }
  ]
};

// Some big projects you have worked on

const bigProjects = {
  title: "Selected Works",
  subtitle: "SOFTWARE ENGINEERING & AI RESEARCH",
  featuredProjects: [
    {
      projectName: "Antigravity Awesome Skills",
      subtitle: "Core Contributor",
      featuredSummary: "Core contributor focused on **backend harness engineering** and **hazard-tagging** for safer skill execution.",
      descBullets: [
        "Spearheaded backend harness architecture for **AWS/GCP + NoSQL** skill modules, helping standardize cross-regional backend topologies.",
        "Leading and engineered a **Hazard-Tagging (Risk Classification)** system via rigorous skill testing, safeguarding database integrity against unverified AI-generated code executions."
      ],
      stack: ["Open Source", "Design", "Agentic Coding"],
      footerLink: [
        {
          name: "View GitHub repo",
          url: "https://github.com/sickn33/antigravity-awesome-skills"
        }
      ]
    },
    {
      projectName: "Multimodal Sentiment Analysis System",
      featuredSummary: "Real-time multimodal sentiment analysis pipeline optimized for low-latency streaming inference.",
      descBullets: [
        "Built a **VAD-gated FastAPI/WebSocket** pipeline for live multimodal inference.",
        "Applied **Int8 quantization** and **entropy-based fusion** to keep latency below **300ms**.",
        "Reached **85%** multimodal accuracy while maintaining real-time responsiveness."
      ],
      stack: ["Python", "PyTorch", "CNN", "HuBERT"],
      footerLink: [
        {
          name: "View GitHub repo",
          url: "https://github.com/IanJ332/Lite-MSA-Stream"
        }
      ]
    },
    {
      projectName: "BakeWise",
      image: "/assets/images/bake wise.png",
      featuredSummary: "Full-stack IoT tracking and fermentation assistant built with **Kotlin (MVVM)** and **FastAPI**, combining a custom scheduling system with Gemini-based analysis.",
      descBullets: [
        "Architected a full-stack IoT tracking ecosystem with **Kotlin (MVVM)** and **FastAPI** for guided fermentation workflows.",
        "Integrated a custom **backward-scheduling algorithm** and the **Gemini API** for real-time fermentation analysis.",
        "Designed a **Harness Security Architecture** to sandbox AI outputs, establishing a secure **AI development flow** and leveraging **GitHub Copilot + Jira/Linear** for rapid team state synchronization. "
      ],
      stack: ["Kotlin", "Android", "MVVM"],
      footerLink: [
        {
          name: "View GitHub repo",
          url: "https://github.com/IanJ332/BakeWise"
        }
      ]
    }
  ],
  otherProjects: [
    {
      projectName: "Sign Language Recognition",
      image: "/assets/images/how2signlogo.png",
      description: "Automated hyperparameter tuning for a MobileNetV2 + CNN-LSTM backbone via Bayesian Optimization, reaching 98.4% accuracy.",
      stack: ["Python", "TensorFlow", "Optuna"],
      footerLink: [
        {
          name: "View GitHub repo",
          url: "https://github.com/IanJ332/Sign_language_translator"
        }
      ]
    },
    {
      projectName: "Helper Bob: LLM Infrastructure",
      image: "/assets/images/helperbobLOGO.svg",
      description: "Advanced Prompt Engineering and Orchestration Layer to minimize conversational drift.",
      stack: ["LLM", "System Design"],
      footerLink: [
        {
          name: "Open HuggingFace Model",
          url: "https://huggingface.co/Ian332/Helper_Bob"
        }
      ]
    },
    {
      projectName: "MAD: Majority Error Debate",
      description: "A novel critic-actor architecture enhancing LLM accuracy against minority agent hallucination positions.",
      stack: ["LLM", "Research", "Python"],
      footerLink: [
        {
          name: "View GitHub repo",
          url: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate"
        },
        {
          name: "View Paper",
          url: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate/blob/main/CS546_GP.pdf"
        }
      ]
    },
    {
      projectName: "Liquidity: Bank Simulation",
      description: "Robust financial platform with Next.js/Supabase handling atomic transactions and real-time updates.",
      stack: ["Next.js", "Supabase", "PostgreSQL"],
      footerLink: [
        {
          name: "View GitHub repo",
          url: "https://github.com/ehcaw/Liquidity"
        }
      ]
    }
    // Note: Kimi.ai project entry removed to avoid double-counting experience
  ],
  display: true
};

// Blogs Section

const blogSection = {
  title: "Blogs",
  subtitle:
    "Sharing insights on AI, optimization, and technology trends through in-depth articles.",
  displayMediumBlogs: true, // 将其设置为布尔值 true
  blogs: [
    {
      url: "https://medium.com/@jiangjs03/the-quest-for-true-ai-reasoning-data-driven-approaches-and-extreme-hardware-optimization-1797a4b0bf47",
      title: "The Quest for True AI Reasoning: Data-Driven Approaches and Extreme Hardware Optimization",
      description:
        "Exploring the current limitations of AI reasoning, the role of data-driven methods, and how extreme hardware optimization could be the key to unlocking truly intelligent systems."
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle:
    "Discuss a project or just want to say hi? My inbox is open for all.",
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