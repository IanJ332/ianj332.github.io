/* ==========================================
   v3.0 Portfolio Data Standards & Mock Injector
   Phase 4: Migration Preparation & Data Schema
   ========================================== */

(function () {
  'use strict';

  console.log('📦 Loading v3.0 Mock Portfolio Data & Typography Standards...');

  window.V3_PORTFOLIO_DATA = {
    engineer: {
      fullName: "Jisheng (Ian) Jiang",
      primaryTitle: "Full-Stack & ML Engineer",
      location: "Santa Clara, CA & UIUC",
      education: "Master of Computer Science @ UIUC | B.S. CS @ SJSU (Cum Laude)",
      resumeUrl: "https://drive.google.com/file/d/1LWvYgkYbMujArbqPk4KPg-zBK91V5-uk/view?usp=sharing"
    },
    experiences: [
      {
        id: "exp-1",
        role: "Research Assistant",
        company: "UIUC AI Alignment Lab",
        period: "Jan 2026 - Present",
        highlights: [
          "Engineered Multi-Agent Debate framework with role-specialized personas to resolve correlated reasoning failures in complex tasks.",
          "Developed critic-actor revision pipeline with 3D confidence scoring (logic, confidence, question alignment), improving accuracy by 40%+."
        ],
        tags: ["LLM Alignment", "Multi-Agent Systems", "Python", "PyTorch"]
      },
      {
        id: "exp-2",
        role: "Co-Founder & AI Model Engineer",
        company: "VideoTutor.ai",
        period: "Nov 2024 - Oct 2025",
        highlights: [
          "Deployed LangChain routing classifier dispatching queries by complexity, cutting API costs by 30%.",
          "Designed Databricks + FAISS distillation pipeline and shared-context RAG flow serving 30K+ users."
        ],
        tags: ["LangChain", "RAG", "FAISS", "Databricks"]
      },
      {
        id: "exp-3",
        role: "LLM Infrastructure Engineer",
        company: "CollegeBot.ai (Sponsored by Kimi.ai)",
        period: "Jan 2024 - Oct 2024",
        highlights: [
          "Developed Milvus stateful memory engine for persona context across long-form interactions.",
          "Optimized task decomposition and function calling orchestration flows for maximum instruction reliability."
        ],
        tags: ["Milvus", "Vector DB", "LLM Infra", "Python"]
      },
      {
        id: "exp-4",
        role: "Software Engineer Intern",
        company: "TRIPALINK",
        period: "Jun 2023 - Aug 2023",
        highlights: [
          "Architected Java / Spring Boot microservices & GraphQL APIs on AWS EKS, accelerating workflows by 80%.",
          "Optimized Redis caching & PostgreSQL indexing, lowering data-access latency by 25%."
        ],
        tags: ["Java", "Spring Boot", "GraphQL", "AWS EKS", "Redis"]
      }
    ],
    techStack: {
      "Backend & AI Infra": ["Python", "Java", "Spring Boot", "PyTorch", "LangChain", "GraphQL", "REST"],
      "Data & Storage": ["PostgreSQL", "MySQL", "Redis", "Milvus", "FAISS", "Databricks", "ETL"],
      "Cloud & DevOps": ["AWS EKS", "Docker", "Kubernetes", "CI/CD", "Jenkins", "GCP"]
    }
  };

  // Typography & UI Style Standards Helper
  window.V3_TYPOGRAPHY_SPECS = {
    h1: "font-family: 'Space Grotesk', sans-serif; font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;",
    subtitle: "font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 500; color: #9ca3af; margin-top: 0.25rem;",
    bullet: "font-family: 'Inter', sans-serif; font-size: 0.95rem; line-height: 1.6; color: #e5e7eb;",
    techBadge: "display: inline-block; padding: 4px 10px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 6px; font-size: 12px; font-weight: 600; color: #a5b4fc; margin-right: 6px; margin-bottom: 6px;"
  };

})();
