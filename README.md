# Ian Jiang — Portfolio 3.0

![Total Stars](https://img.shields.io/endpoint?url=https://ianj332.github.io/stars.json)

A high-performance personal site built with **Vite, React 18 and TailwindCSS**,
combining the "Refined Technical Editorial" aesthetic with a real-time WebGL
avatar stage.

**Live:** [ianj332.github.io](https://ianj332.github.io) — served from the
`gh-pages` branch, built from `main`.

## 🚀 Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/ (refreshes the star count first)
npm run preview    # serve the production build locally
npm run deploy     # build + publish dist/ to the gh-pages branch
```

## ✍️ Updating Content

All copy lives in **`src/data/portfolio.js`** — no component edits are needed
for routine updates. Each section is preceded by an **entry template** comment
block documenting every field, which corner of the card it renders in, and the
formatting rules (only `**bold**` is parsed; `date` holds dates only,
`location` holds places only).

See [`TECH_NOTES.md`](./TECH_NOTES.md) for the full developer and maintenance
guide: architecture, glassmorphism invariants, avatar/shader calibration,
performance rules, and the release checklist.

## 🎨 Design System

*   **Typography:** Outfit (Display), DM Sans (Body), Space Mono (Code).
*   **Colors:** Gunmetal (`#0a0a0a`) & Charcoal (`#171717`) with Indigo accents.
*   **Aesthetic:** Editorial dark/light mode with glassmorphism and subtle noise.

## 📁 Project Structure

*   `src/data/portfolio.js` — **single source of truth** for all site content.
*   `src/App.jsx` — page shell: nav, hero, sections, footer.
*   `src/components/` — avatar canvas, tilt cards, floating badges, cursor.
*   `src/index.css` — design tokens and component classes.
*   `public/assets/` — logos, images and the 3D avatar GLB chunks.
*   `v3.0-site/` — standalone 3D reference environment (`npm run dev:v3`).
*   `scripts/` — star-count automation and migration/audit utilities.

## 🛠 Tech Stack

*   **Core:** React 18, Vite 5
*   **3D:** Three.js, React Three Fiber, Drei, Postprocessing
*   **Styling:** TailwindCSS 3.4
*   **Animation:** Framer Motion
*   **Icons:** Lucide React

## 🌿 Branches

*   `main` — current v3 source of truth; every release is built from here.
*   `gh-pages` — generated deploy output (never edit by hand).
*   `v2-backup` — preserved v2.0 portfolio, kept as a fallback.
