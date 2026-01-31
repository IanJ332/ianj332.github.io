# Design Direction: Refined Technical Editorial

## 1. Design Direction Summary
*   **Aesthetic Name:** Refined Technical Editorial
*   **DFII Score:** 13/15
    *   *Aesthetic Impact (4)*: Distinctive typography and layout.
    *   *Context Fit (5)*: perfect for a senior-level engineer/researcher.
    *   *Feasibility (5)*: achievable with Tailwind + React.
    *   *Performance (4)*: Static generation, efficient CSS.
    *   *Consistency Risk (-1)*: requires discipline in spacing/type scales.
*   **Key Inspiration:** Digital magazines (Kinfolk, Offscreen), Stripe Engineering Blog, Vercel design system (minimalism + subtle noise).
*   **Concept:** "The Portfolio as a Journal." Instead of a resume, it's a curated exhibition of technical thought.

## 2. Design System Snapshot
### Typography
*   **Display / Headers:** `Outfit` (Sans-serif, geometric but human).
    *   Rationale: Modern, readable, distinct from the overused Inter/Roboto.
*   **Body / Content:** `Space Grotesk` (for technical headers/callouts) + `DM Sans` (for long text).
    *   *Update*: Actually, let's keep it simple. `Outfit` for Headlines, `DM Sans` for body.
    *   Weights: Bold (700) for visual anchors, Regular (400) for text.

### Color & Theme
*   **Mode:** Dark Mode Native (Editorial Dark).
*   **Palette:**
    *   **Background:** `Solid Gunmetal` (#0f172a - Slate 900) -> Custom darker: `#0a0a0a`.
    *   **Surface:** `Glass Charcoal` (#171717 with backdrop blur).
    *   **Accent:** `Electric Indigo` (#6366f1) or subtly gradient text.
    *   **Text:** `Off-White` (#ededed) for primary, `Grey-400` (#9ca3af) for secondary.
    *   **Texture:** Subtle noise overlay to prevent "flatness".

### Layout & Composition
*   **Grid:** 6-column grid on desktop, breaking it for "Featured" sections.
*   **Spacing:** Loose. 120px+ vertical rhythm between major sections.
*   **Motion:**
    *   Elements fade in and slide up (20px) on scroll.
    *   Links have a proprietary hover effect (e.g., underline expands from center).

### Differentiation Anchor
> **"The Insight Lens"**
> If screenshotted, the site is recognizable by its **typographic hierarchy** (oversized section headers acting as structural dividers) and **glass-morphism cards** that feel physically layered.

## 3. Implementation Plan
1.  **Setup**: Vite + React + TailwindCSS.
2.  **Migration**: Extract data from `portfolio.js` into structured JSON/data files.
3.  **Components**:
    *   `Hero`: Minimalist, focusing on the "Who I am" statement.
    *   `SectionHeader`: Oversized, sticky headers?
    *   `ProjectCard`: Layout that emphasizes the "Problem" and "Solution" (Technical breakdown).
    *   `TechStack`: Visual ticker or clean grid, avoiding the "skill bar" cliché.
4.  **Refinement**: Accessibility checks, SEO tags.
