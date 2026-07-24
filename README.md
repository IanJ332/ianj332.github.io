# Ian Jiang - Portfolio 2.0
![Total Stars](https://img.shields.io/endpoint?url=https://ianj332.github.io/stars.json)

A refined, high-performance portfolio built with **Vite, React, and TailwindCSS**.
Designed with the "Refined Technical Editorial" aesthetic.

## 🌟 v3.0 3D Rebuild Branch (`v3.0-rebuild`)

The `v3.0-rebuild` branch contains the isolated 3D personal website environment:
- **Local Dev Server**: `npm run dev:v3` or `bash start-v3.sh`
- **3D Assets & Site Folder**: [`v3.0-site/`](./v3.0-site/) (Contains HTML, CSS, JS, 10.4MB 3D Model `.glb`, stickers, HDRI maps)
- **Documentation**: See [`v3.0-site/README.md`](./v3.0-site/README.md) for complete asset details and migration audit.

## 🚀 Getting Started (v2.0)

Since Node.js was not detected in the environment, the project files have been generated but dependencies are not installed.

### ⚡ Quick Start (Virtual Environment)
The project is set up with a self-contained **Python virtual environment** that includes Node.js.

1.  **Activte the environment**:
    ```powershell
    .\venv\Scripts\activate
    ```
2.  **Run the development server**:
    ```powershell
    npm run dev
    ```

*(Dependencies are already installed in the virtual environment)*
Open [http://localhost:5173](http://localhost:5173) to view it.

## 🎨 Design System

*   **Typography:** Outfit (Display), DM Sans (Body), Space Mono (Code).
*   **Colors:** Gunmetal (`#0a0a0a`) & Charcoal (`#171717`) with Indigo accents.
*   **Aesthetic:** Editorial Dark Mode with Glassmorphism and subtle noise textures.

## 📁 Project Structure

*   `src/data/portfolio.js`: **CMS-like Data Source**. Edit this file to update your content.
*   `src/App.jsx`: Main single-page application structure.
*   `src/index.css`: Global styles and Tailwind configuration.
*   `legacy_backup/`: Contains your previous project files.

## 🛠 Tech Stack

*   **Core:** React 18, Vite
*   **Styling:** TailwindCSS 3.4
*   **Animation:** Framer Motion
*   **Icons:** Lucide React
