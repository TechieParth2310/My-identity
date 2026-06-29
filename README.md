# Parth Kothawade — Portfolio ("The Studio")

A stunning, dark-cinematic, image-first personal portfolio website built with pure vanilla technologies (no frameworks, no bundlers, no build steps). It is designed to be highly responsive, offline-resilient, and performant.

🚀 **Live Site:** [https://my-identity.vercel.app/](https://my-identity.vercel.app/) *(or your deployed Vercel URL)*

---

## 🌟 Key Features

- **Cinematic Entrance Ritual:** A full-screen immersive intro with randomly selected AI-generated backdrops, golden embers, a stylized boot meter, and an iris reveal.
- **Dynamic Device Hero:** A photorealistic "device on a desk" display showing a live, self-typing terminal feed of Parth's recent shipping updates.
- **6-Project Case Study Gallery:** A premium, framed grid that expands into detailed, interactive full-screen overlays with smooth transitions.
- **"Ask My Work" AI Assistant:** An interactive, conversational terminal powered by a Vercel serverless function (`/api/ask.js`) utilizing NVIDIA NIM models for first-person project queries.
- **High-End Micro-Interactions:**
  - WebGL GPU-accelerated golden particles using **Three.js**
  - **⌘K Command Palette** for quick site-wide navigation
  - Procedural synthesizer sound design using the **Web Audio API**
  - Magnetic custom cursor and scroll-reveal triggers
  - Real-time scroll progress indicator

---

## 🛠️ Tech Stack & Constraints

- **Core:** HTML5, CSS3, Vanilla ES6 Javascript.
- **3D Particles:** Three.js (loaded via cdnjs).
- **Sound Design:** Web Audio API (completely synthetic, no media assets to download).
- **AI Backend:** Serverless API function (`/api/ask.js`) hosting NVIDIA NIM model logic securely.
- **Resiliency & Failsafes:**
  - **Visible by default:** The website remains fully functional and readable even if JavaScript is disabled or CDN resources fail.
  - **Offline/No-API fallback:** If the backend or internet connection is missing, the AI Assistant automatically falls back to predefined offline answers.
  - **Isolation:** Premium modules are isolated within safe blocks so that errors cannot crash the core page.

---

## 📁 File Structure

```
MY Identity/
├── index.html            # Core HTML layout, sections, and script loading
├── css/
│   └── site.css          # Design system, variables, styling, and animations
├── js/
│   ├── site.js           # Core features (splash, typing feed, case studies)
│   └── next.js           # Advanced features (WebGL, AI agent, command palette, sounds)
├── api/
│   └── ask.js            # Vercel serverless function backend for AI Q&A
├── assets/               # Project screenshots & AI backdrops
├── My portrait.png       # Headshot image for About section
├── Parth-Master-Profile.md # Single source of truth profile document
├── PROJECT-REPORT.md     # In-depth technical breakdown and architecture report
├── PROJECT-SOURCE.md     # Consolidated codebase source file
└── DEPLOY.md             # Detailed deployment walkthrough
```

---

## 🚀 Getting Started

### Running Locally
Since this is a vanilla static site, you can run it instantly:
1. Double-click `index.html` to open it in your browser directly.
2. Alternatively, run a local development server in the directory:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```

### Deploying to Vercel
For the full interactive AI Assistant experience:
1. Push this repository to GitHub.
2. Link the repository to **Vercel** as a static project.
3. Configure the following environment variables in your Vercel Dashboard:
   - `NVIDIA_API_KEY`: Your NVIDIA developer key (`nvapi-...`)
   - `NVIDIA_BASE_URL`: `https://integrate.api.nvidia.com/v1`
   - `AI_MODEL_FAST`: `meta/llama-3.1-8b-instruct`
4. Redeploy the project, and the serverless backend will live-compile responses for your visitors!

---

## 👤 Author
- **Parth Kothawade** — AI Product Engineer (Pune, India)
- **Email (Work):** dev.tools@iamstillalive.com
- **Email (Personal):** parthkothawade2310@gmail.com
- **GitHub:** [@TechieParth2310](https://github.com/TechieParth2310)