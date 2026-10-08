# Rishabh Jain — Senior Frontend Engineer Portfolio

[![Live Site](https://img.shields.io/badge/Live_Portfolio-rishabh2324.github.io-c8ff4d?style=for-the-badge&logoColor=black)](https://rishabh2324.github.io/)
[![Built with Astro](https://img.shields.io/badge/Astro-7-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Deployment](https://img.shields.io/badge/Deployed_on-GitHub_Pages-22272e?style=for-the-badge&logo=github&logoColor=white)](https://rishabh2324.github.io/)

A cinematic, motion-driven portfolio: a live WebGL orb that morphs as you scroll, GSAP scroll choreography, and a working **config-driven UI engine** that compiles a JSON schema into a reactive form right on the page.

🌐 **Live URL**: [https://rishabh2324.github.io/](https://rishabh2324.github.io/)

---

## ⚡ Highlights

- 🌌 **WebGL orb:** a noise-displaced, iridescent shader orb (Three.js) that reacts to the cursor and scroll velocity, and travels, scales and recolours between sections (`src/scripts/webgl`).
- 🧩 **Live config engine:** scroll to watch the schema type itself out while each field materialises. Then switch schemas or edit the JSON directly, with validation, conditional branching (`visibleWhen`) and computed outputs (`src/scripts/form-engine.ts`).
- 🎬 **Scroll storytelling:** a preloader intro, split-text reveals, a pinned horizontal projects reel, a timeline that draws itself as you scroll, and velocity-reactive marquees.
- 🖱️ **Micro-interactions:** a custom cursor with contextual labels, magnetic buttons, 3D card tilt, a hover-follow project preview and curtain page transitions.
- ♿ **Graceful by default:** honours `prefers-reduced-motion`, falls back to CSS when WebGL is unavailable, keeps content visible without JS, and supports keyboard navigation.

---

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build/) (static output)
- **Motion:** [GSAP](https://gsap.com/) (ScrollTrigger, SplitText) + [Lenis](https://lenis.darkroom.engineering/) smooth scroll
- **3D:** [Three.js](https://threejs.org/) with custom GLSL shaders, lazy-loaded behind the preloader
- **Styling:** Vanilla CSS with custom-property tokens (`src/styles/global.css`)
- **Typography:** Space Grotesk, Instrument Serif and JetBrains Mono
- **Deployment:** GitHub Pages via GitHub Actions

Content (experience, projects, skills, demo schemas) lives in `src/data/portfolioData.ts`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- npm or yarn

### Installation & Development
```bash
# 1. Clone repository
git clone https://github.com/Rishabh2324/Rishabh2324.github.io.git
cd Rishabh2324.github.io

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

### Production Build & Preview
```bash
# Build static site to ./dist/
npm run build

# Preview build locally
npm run preview
```

---

## 👤 Author

**Rishabh Jain**  
- **Role:** Senior Frontend Engineer (WDE-2)  
- **Portfolio:** [https://rishabh2324.github.io/](https://rishabh2324.github.io/)  
- **LinkedIn:** [https://www.linkedin.com/in/rishabhjain2324](https://www.linkedin.com/in/rishabhjain2324)  
- **Email:** [rishabh2401jain@gmail.com](mailto:rishabh2401jain@gmail.com)  
