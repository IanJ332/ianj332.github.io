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
  title: "Technical Expertise",
  subTitle: "FULL-STACK | DATA | AI | SYSTEMS",
  skills: [
    emoji("⚡ Full-Stack & Backend Engineering: Building scalable and high-performance systems with Java (Spring Boot), Python, and TypeScript. Experienced in architecting robust RESTful APIs and developing sleek, responsive front-ends using Next.js, React.js, and Tailwind CSS."),
    emoji("⚡ Data Architecture & Cloud: Designing resilient data infrastructures with a mastery of Postgres (Supabase), MySQL, and NoSQL (MongoDB). Proficient in deploying full-stack and AI solutions via AWS and managing continuous integration through Git."),
    emoji("⚡ AI/ML & LLM Orchestration: Specialized in fine-tuning Large Language Models and building LLM Infrastructure. Proven track record in NLP (Multi-Agent Debate), Computer Vision (Sign Language Recognition), and real-time Sentiment Analysis."),
    emoji("⚡ Mobile & System Design: Architecting native mobile experiences with Kotlin (MVVM) and optimizing system-level performance with C/C++. Focused on bridging complex algorithms with user-centric interface design."),
    emoji("⚡ Open Source & Community: Core contributor to 'antigravity-awesome-skills', an high-impact repository with over 5.4K stars, specializing in AI-agentic coding patterns and advanced frontend design.")
  ],
  softwareSkills: [
    {
      category: "Languages",
      skills: ["Java", "Python", "TypeScript", "JavaScript", "SQL", "C++", "C"]
    },
    {
      category: "Web Frameworks",
      skills: ["Next.js", "React", "Spring Boot", "Node.js", "NestJS", "Express"]
    },
    {
      category: "Tools & Databases",
      skills: ["PostgreSQL (Supabase)", "MySQL", "MongoDB", "Redis", "AWS", "Git", "Docker"]
    },
    {
      category: "AI/ML Frameworks",
      skills: ["PyTorch", "TensorFlow", "Keras", "HuggingFace", "ONNX"]
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
      duration: "Expected Graduation: December 2026",
      desc: "", // 由于现在还没上学，desc留空，将来可以补充
      descBullets: [
        "Relevant Coursework:",
        "Advanced Topics in Natural Language Processing",
        "Applied in Machine Learning",
        "User Interface Design"
      ]
    },
    {
      schoolName: "San José State University",
      logo: "/assets/images/sjsuLOGO.png",
      subHeader: "Bachelor of Science in Computer Science",
      duration: "August 2021 - June 2025",
      desc: "", // 暂时不需要描述，保留
      descBullets: [
        "Honors:",
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
      role: "Co-founder & AI Model Engineer",
      company: "CollegeBot.AI",
      companylogo: "/assets/images/collegebotLOGO.avif",
      url: "https://collegebot.ai/",
      date: "Nov 2024 – Present",
      desc: "Co-founded and scaled an AI-driven educational platform to over 10,000 students, streamlining access to complex university resources.",
      descBullets: [
        "Developed and executed the model's training strategy using PyTorch, TensorFlow, and CUDA, focusing on Natural Language Understanding (NLU) to accurately interpret university policies and academic programs.",
        "Launched Collegebot.ai, attracting a rapidly growing user base of over 10,000 students within the first eight months."
      ]
    },
    {
      role: "Software Engineer (Intern)",
      company: "TRIPALINK",
      companylogo: "/assets/images/Tripalink.png",
      date: "June 2023 – Aug 2023",
      desc: "Engineered backend APIs for an AI-driven rental recommendation engine and led the successful deployment of the management system software.",
      descBullets: [
        "Designed and implemented new APIs using Java, Python, and GraphQL to process apartment rental applications, while utilizing React.js, SpringBoot, and Maven for system-wide rollouts.",
        "Improved system observability and reliability by implementing comprehensive logging and monitoring solutions."
      ]
    },
    {
      role: "Software Engineer",
      company: "The Rabbit Haven",
      companylogo: "/assets/images/therabbithavenLOGO.png",
      date: "Nov 2022 – May 2025",
      desc: "Led a critical digital transformation for a non-profit organization, optimizing adoption processes and staff workflows.",
      descBullets: [
        "Enhanced operational resilience by digitizing adoption forms and automating information synchronization, maintaining service levels despite external resource constraints.",
        "Collaborated directly with shelter staff to streamline online adoption forms, which involved managing form data submission and improving data collection efficiency."
      ]
    }
  ]
};

// Some big projects you have worked on

const bigProjects = {
  title: "Featured Work",
  subtitle: "SOFTWARE ENGINEERING & AI RESEARCH",
  projects: [
    {
      projectName: "Liquidity: Full-Stack Bank Simulation",
      projectDesc: "A robust financial platform built with Next.js and Supabase (PostgreSQL), featuring atomic transaction handling and real-time balance updates.",
      stack: ["Next.js", "Supabase", "PostgreSQL"],
      letterLogo: ["Liquidity"],
      footerLink: [
        {
          name: "Website/Repo",
          url: "https://github.com/ehcaw/Liquidity"
        }
      ]
    },
    {
      image: "/assets/images/bake wise.png",
      projectName: "BakeWise: Guided Sourdough Assistant",
      projectDesc: "An Android application (Kotlin, MVVM) that utilizes a proprietary backward scheduling algorithm to translate complex fermentation biology into actionable user guidance.",
      stack: ["Kotlin", "Android", "MVVM"],
      objFit: "object-contain",
      footerLink: [
        {
          name: "Repo",
          url: "https://github.com/IanJ332/BakeWise"
        }
      ]
    },
    {
      projectName: "MAD",
      projectDesc: "A research project exploring a novel critic-actor architecture to address the 'majority error problem' in LLM reasoning, enhancing system accuracy by defending minority agent positions.",
      stack: ["LLM", "Research", "Python"],
      letterLogo: ["Multi", "Agent", "Debate"],
      footerLink: [
        {
          name: "Repo",
          url: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate"
        },
        {
          name: "Paper",
          url: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate/blob/main/CS546_GP.pdf"
        }
      ]
    },
    {
      projectName: "Lite-MSA: Real-Time Multimodal Sentiment Analysis",
      projectDesc: "A low-latency (ms) edge system integrating 1D-CNN with quantized HuBERT/DistilRoberta for high-accuracy sentiment detection across heterogeneous datasets.",
      stack: ["Python", "PyTorch", "CNN", "HuBERT"],
      letterLogo: ["Multilingual", "Speaker", "Attributed"],
      footerLink: [
        {
          name: "Repo",
          url: "https://github.com/IanJ332/Lite-MSA-Stream"
        }
      ]
    },
    {
      image: "/assets/images/how2signlogo.png",
      projectName: "Sign Language Recognition (BO + CNN + LSTM)",
      projectDesc: "A full-stack deep learning pipeline using a MobileNetV2 backbone and Bayesian Optimization (Optuna) to boost recognition performance by 25%.",
      stack: ["Python", "TensorFlow", "Optuna"],
      objFit: "object-contain",
      footerLink: [
        {
          name: "Repo",
          url: "https://github.com/IanJ332/Sign_language_translator"
        }
      ]
    },
    {
      image: "/assets/images/helperbobLOGO.svg",
      projectName: "Helper Bob: LLM Infrastructure & Orchestration",
      projectDesc: "A specialized project focused on an advanced Prompt Engineering and Orchestration Layer designed to minimize conversational drift and maximize user-perceived coherence.",
      stack: ["LLM", "Orchestration", "System Design"],
      objFit: "object-contain",
      footerLink: [
        {
          name: "Link",
          url: "https://huggingface.co/Ian332/Helper_Bob"
        }
      ]
    },
    {
      image: "/assets/images/kimi-color.png",
      projectName: "Kimi.ai: LLM Infrastructure Engineer",
      projectDesc: "Developed a sophisticated Context Management System to capture and persist user persona memory and dialogue history for seamless conversational flows.",
      stack: ["LLM Infrastructure", "Context Mgmt", "Production"],
      objFit: "object-contain",
      footerLink: [
        {
          name: "Website",
          url: "https://www.kimi.com/en"
        }
      ]
    },
    {
      projectName: "Antigravity",
      projectDesc: "A high-impact open-source repository gathering advanced agentic coding skills. Successfully reached 5.4K+ Stars on GitHub as a key contributor.",
      stack: ["Open Source", "Design", "Agentic Coding"],
      letterLogo: ["Antigravity", "Awesome", "Skills"],
      githubRepo: "sickn33/antigravity-awesome-skills",
      footerLink: [
        {
          name: "Repo",
          url: "https://github.com/sickn33/antigravity-awesome-skills"
        }
      ]
    }
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