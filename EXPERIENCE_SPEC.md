# Portfolio Content & Experience Specification

This document provides standardized technical guidelines for extending and maintaining the portfolio content (`src/data/portfolio.js`).

---

## 1. Data Schema Standards

### Work Experience (`workExperiences.experience`)
```javascript
{
  role: "Title / Position",              // e.g. "Machine Learning Researcher"
  company: "Company / Lab Name",        // e.g. "UIUC AI Alignment Lab"
  companylogo: "/assets/images/logo.png",// Absolute path or "" (triggers letter badge fallback)
  location: "City, State / Remote",      // Optional: e.g. "Urbana-Champaign, IL"
  date: "Month Year - Month Year",       // e.g. "Jan 2026 - Present"
  url: "https://company.com",            // Optional: link to company
  descBullets: [
    "First achievement bullet with **bold metric highlighting**.",
    "Second achievement bullet."
  ]
}
```
*Rule for bullet points*: Highlight key performance numbers/technologies using markdown bold `**30%+**`, `**LangChain**`, `**FastAPI**`.

---

### Featured & Secondary Projects (`bigProjects`)
```javascript
// Featured Project
{
  projectName: "Project Name",
  image: "/assets/images/project.png", // Optional: triggers letter badge if empty
  subtitle: "Role / Tagline",           // e.g. "Core Contributor"
  featuredSummary: "One-sentence high-level summary with **bold highlights**.",
  descBullets: [
    "Technical architectural bullet point 1.",
    "Technical architectural bullet point 2."
  ],
  stack: ["Category", "Framework", "Tech"],
  footerLink: [
    { name: "View GitHub repo", url: "https://github.com/..." }
  ]
}

// Compact Project
{
  projectName: "Compact Tool Name",
  image: "/assets/images/logo.png",    // Optional
  description: "Concise 1-2 sentence description.",
  stack: ["Python", "TensorFlow"],
  footerLink: [
    { name: "View GitHub repo", url: "https://github.com/..." }
  ]
}
```

---

### Education (`educationInfo.schools`)
```javascript
{
  schoolName: "Institution Name",
  logo: "/assets/images/schoolLOGO.png",
  subHeader: "Degree & Major",           // e.g. "Master of Computer Science"
  duration: "August 2024 - Dec 2026",
  descBullets: [
    "GPA: X.X/4.0",
    "Honors / Activities"
  ]
}
```

---

## 2. Visual & Font Specifications

| Element | Font Family | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Section Titles / Headers** | `Outfit` | `font-display` | Major headings, roles, project titles |
| **Body / Descriptions** | `Inter` | `font-body` | Explanations, bullet text |
| **Terminal & Tech Badges** | `JetBrains Mono` | `font-mono` | Code tags, dates, ZSH terminal card |

---

## 3. Automated Fallback Rules

- **Missing Logos**: If `logo` or `image` is missing or empty `""`, components will render a modern letter badge (e.g. `[U]` for UIUC, `[V]` for VideoTutor) with styled gradient accents and crisp border.
- **GitHub Stars**: If `stars` API fails or rate-limits, the GitHub counter displays a neutral badge without breaking the card layout.
