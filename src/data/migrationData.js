/**
 * This file serves as the main content bridge for your personal website.
 * Simply replace the values in this object with your own data to migrate your content.
 * 
 * Each section corresponds to a high-level layout block on the website.
 */

export const migrationData = {
    // --- NAVIGATION / CATALOG SECTION ---
    navbar: {
        logo: {
            initial: "I",
            name: "Ian Jiang"
        },
        links: [
            { name: 'About', href: '#about' },
            { name: 'Expertise', href: '#expertise' },
            { name: 'Work', href: '#work' },
            { name: 'Projects', href: '#projects' },
            { name: 'Academic', href: '#education' },
            { name: 'Writing', href: '#writing' },
            { name: 'Contact', href: '#contact' }
        ]
    },

    // --- PERSONAL INFO SECTION ---
    hero: {
        username: "Ian Jiang",
        title: {
            main: "Designing",
            accent: "Intelligence_"
        },
        subTitle: "I build high-precision software systems and AI infrastructure. Currently architecting distributed reasoning engines and optimizing large language models.",
        image: "/assets/images/Sailor.jpg",
        resumeLink: "https://drive.google.com/file/d/1LWvYgkYbMujArbqPk4KPg-zBK91V5-uk/view?usp=sharing",
        socialLinks: {
            github: "https://github.com/IanJ332",
            linkedin: "https://www.linkedin.com/in/jisheng-jiang/",
            gmail: "jiangjs03@gmail.com"
        }
    },

    // --- TRAJECTORY / EXPERIENCE SECTION ---
    experience: {
        title: "Trajectory",
        jobs: [
            {
                role: "Co-founder & AI Model Engineer",
                company: "CollegeBot.AI",
                url: "https://collegebot.ai/",
                date: "Nov 2024 – Present",
                desc: "Co-founded and scaled an AI-driven educational platform to over 10,000 students.",
                bullets: [
                    "Developed and executed the model's training strategy focusing on Natural Language Understanding (NLU).",
                    "Launched Collegebot.ai, attracting a rapidly growing user base."
                ]
            },
            // Add more jobs here...
        ]
    },

    // --- PROJECTS / CREATIONS SECTION ---
    projects: {
        title: "Featured Work",
        subtitle: "SOFTWARE ENGINEERING & AI RESEARCH",
        gallery: [
            {
                title: "Liquidity: Full-Stack Bank Simulation",
                description: "A robust financial platform built with Next.js and Supabase (PostgreSQL), featuring atomic transaction handling and real-time balance updates.",
                stack: ["Next.js", "Supabase", "PostgreSQL"],
                github: "https://github.com/ehcaw/Liquidity",
                link: "https://github.com/ehcaw/Liquidity",
                glowColor: "rgba(59, 130, 246, 0.5)",
                image: null,
                letterLogo: ["Liquidity"]
            },
            {
                title: "BakeWise: Guided Sourdough Assistant",
                description: "An Android application (Kotlin, MVVM) utilizing a proprietary backward scheduling algorithm to translate complex fermentation biology.",
                stack: ["Kotlin", "Android", "MVVM"],
                github: "https://github.com/IanJ332/BakeWise",
                link: "https://github.com/IanJ332/BakeWise",
                glowColor: "rgba(251, 146, 60, 0.5)",
                image: "/assets/images/bake wise.png",
                objFit: "object-contain"
            },
            {
                title: "MAD: Multi-Agent Debate",
                description: "Research project exploring a novel critic-actor architecture to address the 'majority error problem' in LLM reasoning.",
                stack: ["LLM", "Research", "Python"],
                github: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate",
                link: "https://github.com/nilgeoutim/CS546_MajorityErrorDebate/blob/main/CS546_GP.pdf",
                glowColor: "rgba(245, 158, 11, 0.5)",
                image: null,
                letterLogo: ["Multi", "Agent", "Debate"]
            },
            {
                title: "Lite-MSA: Real-Time Sentiment",
                description: "A low-latency (ms) edge system integrating 1D-CNN with quantized HuBERT for high-accuracy sentiment detection.",
                stack: ["Python", "PyTorch", "CNN"],
                github: "https://github.com/IanJ332/Lite-MSA-Stream",
                link: "https://github.com/IanJ332/Lite-MSA-Stream",
                glowColor: "rgba(16, 185, 129, 0.5)",
                image: null,
                letterLogo: ["Multilingual", "Speaker", "Attributed"]
            },
            {
                title: "Sign Language Recognition",
                description: "A full-stack deep learning pipeline using a MobileNetV2 backbone and Bayesian Optimization (Optuna).",
                stack: ["Python", "TensorFlow", "Optuna"],
                github: "https://github.com/IanJ332/Sign_language_translator",
                link: "https://github.com/IanJ332/Sign_language_translator",
                glowColor: "rgba(139, 92, 246, 0.5)",
                image: "/assets/images/how2signlogo.png",
                objFit: "object-contain"
            },
            {
                title: "Helper Bob: LLM Orchestration",
                description: "Advanced Prompt Engineering and Orchestration Layer designed to minimize conversational drift.",
                stack: ["LLM", "System Design"],
                github: null,
                link: "https://huggingface.co/Ian332/Helper_Bob",
                glowColor: "rgba(245, 158, 11, 0.5)",
                image: "/assets/images/helperbobLOGO.svg",
                objFit: "object-contain"
            },
            {
                title: "Kimi.ai: Infrastructure Engineer",
                description: "Developed a sophisticated Context Management System to capture and persist user persona memory and dialogue history.",
                stack: ["LLM Infrastructure"],
                github: null,
                link: "https://www.kimi.com/en",
                glowColor: "rgba(99, 102, 241, 0.5)",
                image: "/assets/images/kimi-color.png",
                objFit: "object-contain"
            },
            {
                title: "Antigravity: Agentic Skills",
                description: "A high-impact open-source repository gathering advanced agentic coding skills.",
                stack: ["Open Source", "Agentic Coding"],
                github: "sickn33/antigravity-awesome-skills",
                link: "https://github.com/sickn33/antigravity-awesome-skills",
                glowColor: "rgba(79, 70, 229, 0.5)",
                image: null,
                letterLogo: ["Antigravity", "Awesome", "Skills"]
            }
        ]
    },

    // --- SKILLS / EXPERTISE SECTION ---
    expertise: {
        title: "Technical Expertise",
        categories: [
            {
                name: "Full-Stack & Backend",
                description: "Building scalable and high-performance systems with Java, Python, and TypeScript."
            },
            // Add more categories here...
        ],
        techTree: [
            { category: "Languages", skills: ["Java", "Python", "TypeScript", "SQL"] },
            { category: "Web Frameworks", skills: ["React", "Spring Boot", "Next.js"] },
            { category: "Tools & Databases", skills: ["AWS", "Docker", "Git"] }
        ]
    },

    // --- EDUCATION / ACADEMIC SECTION ---
    education: {
        title: "Academic",
        schools: [
            {
                name: "University of Illinois Urbana-Champaign",
                degree: "Master of Computer Science",
                period: "2026",
                logo: "/assets/images/uiucLOGO.png",
                bullets: ["Advanced NLP", "Applied ML"]
            }
        ]
    },

    // --- WRITING / BLOGS SECTION ---
    writing: {
        title: "Reflections",
        blogs: [
            {
                title: "The Quest for True AI Reasoning",
                url: "https://medium.com/...",
                date: "2025",
                summary: "Exploring the limitations of AI reasoning..."
            }
        ]
    },

    // --- CONTACT / FOOTER SECTION ---
    contact: {
        title: "Let's Connect",
        email: "jiangjs03@gmail.com",
        tagline: "Crafted with Reason",
        socials: [
            { name: "Github", url: "https://github.com/IanJ332" },
            { name: "Linkedin", url: "https://www.linkedin.com/in/jisheng-jiang/" }
        ]
    }
};
