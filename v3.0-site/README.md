# v3.0 3D Portfolio Rebuild & Asset Guide

This directory (`v3.0-site`) contains the complete static 3D portfolio environment scraped from `https://intro3d.com/u/erdrec10w6`, optimized for offline and local development on the `v3.0-rebuild` Git branch.

---

## 🛠️ Environment & Prerequisites

- **Branch**: `v3.0-rebuild`
- **Python**: Python 3.x (with `.venv` virtual environment support)
- **Node.js**: Node 18+ / npm

---

## 📁 Directory & Asset Breakdown

```
v3.0-site/
├── index.html                           # Main entry HTML with local relative path rewrites
├── favicon.ico / icon.png / apple-icon.png
├── _next/                               # Next.js Static Chunks & Stylesheets
│   └── static/
│       ├── css/2bf357f024ec6f2f.css     # Main Tailwind / Global CSS Bundle
│       └── chunks/                      # All JS chunks (Initial + 14 Dynamic Imports)
│           ├── app/u/%5Bslug%5D/        # Next.js dynamic page chunk (%5Bslug%5D)
│           ├── app/u/[slug]/            # Alias route directory for unquoted requests
│           ├── dda6fbea.e5ae5452deb88313.js
│           ├── 15a40f47.2f7614c01c092dbe.js
│           └── ... (14 dynamic lazy-loaded JS chunks total)
├── _external/                           # Downloaded External 3D Models & Images
│   └── assets.intro3d.com/
│       ├── models/                      # cb3b5629-...glb (10.4 MB 3D Model file)
│       ├── stickers/                    # WebP stickers (programmer, bunny, coffee, lightning, bubble)
│       └── thumbs/                      # Thumbnail images
└── hdri/
    └── potsdamer_platz_1k.hdr           # Three.js 3D Environment Lighting Map (1.5 MB)
```

---

## 🚀 How to Run Locally

From the root of the project directory:

```bash
# Option 1: NPM command
npm run dev:v3

# Option 2: Shell script directly
bash start-v3.sh

# Option 3: Specify a custom port (e.g. 8080)
bash start-v3.sh 8080
```

Then visit **`http://localhost:3000`** in your browser.

---

## ⚙️ Project Tools & Scripts

- `start-v3.sh`: Primary shell launcher for local dev preview.
- `scripts/serve_v3.py`: Custom Python HTTP server handling URL decoding (`%5Bslug%5D` <-> `[slug]`) to prevent 404 errors on Next.js dynamic routes.
- `scripts/fetch_v3_site.py`: Automated asset fetcher and relative path converter.
- `scripts/download_missing_chunks.py`: Utility script to download lazy-loaded Next.js JavaScript chunks.
- `scripts/audit_migration.py`: Automated comparison tool matching v2.0 portfolio data against v3.0 scraped assets.

---

## 📊 v2.0 -> v3.0 Content Audit Summary

### ✅ Currently Included in v3.0:
- Name: Ian Jiang
- Work Experiences: UIUC AI Alignment Lab, VideoTutor.ai, CollegeBot.ai, TRIPALINK, The Rabbit Haven.
- Social Links: GitHub, LinkedIn, Gmail.

### 📋 Pending Migration Items:
- Full Legal Name: `Jisheng Jiang`
- Primary Title: `Full-Stack Software Engineer`
- Education Details: UIUC (Master of CS), SJSU (B.S. CS), Honors (Dean's Scholar, Cum Laude).
- Featured Projects: Antigravity Awesome Skills, Multimodal Sentiment Analysis (Lite-MSA), BakeWise, Sign Language Recognition, Helper Bob, MAD (Majority Error Debate), Liquidity.
- Resume Google Drive Link: `https://drive.google.com/file/d/1LWvYgkYbMujArbqPk4KPg-zBK91V5-uk/view?usp=sharing`
