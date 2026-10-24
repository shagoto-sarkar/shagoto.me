# shagoto.me

Personal academic and systems engineering publication of Shagoto Sarkar.

- **Production URL:** [https://shagoto.me](https://shagoto.me)
- **Pages Origin:** [https://shagoto-me.pages.dev](https://shagoto-me.pages.dev)
- **Architecture Guide:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **AI Agent Routing:** [`AGENTS.md`](AGENTS.md)

---

## Tech Stack & Architecture

| Layer | Technologies | Role |
| :--- | :--- | :--- |
| **Static Generator** | Astro 5.4+ (`output: 'static'`), TypeScript (strict) | Zero client UI runtime, 100% pre-rendered HTML/CSS |
| **Design System** | Vanilla CSS (`AXIOM Design System v2`) | Refined Technical Editorialism, semantic CSS custom properties |
| **Typography** | Self-hosted *EB Garamond* & *JetBrains Mono* | 52 `.woff2` font files served locally with immutable caching |
| **Diagrams & Syntax**| Inline accessible SVGs + Build-time Shiki | Zero client runtime overhead, full screen reader support |
| **Edge Hosting** | Cloudflare Pages + Anycast CDN | Instant global distribution, automated TLS, immutable headers |
| **Content Layer** | Astro Content Collections + Zod validation | Type-safe markdown collections for research, projects & notes |

---

## Directory & Entry-Point Tree

```
shagoto.me/
├── src/
│   ├── assets/
│   │   └── diagrams/          # Architecture SVGs (Cash, Go, Log, OpenGL, etc.)
│   ├── components/
│   │   ├── CommandPalette.astro # Fuzzy search launcher (Cmd+K / Ctrl+K)
│   │   ├── ContactModal.astro # Accessible contact dialog & clipboard copy
│   │   ├── Footer.astro       # Editorial footer & verified social channels
│   │   └── Header.astro       # Top navigation, status indicator & search button
│   ├── content/               # Type-safe Astro Markdown content collections
│   │   ├── notes/             # Technical essays & systems notes
│   │   ├── projects/          # Systems engineering & open-source case studies
│   │   ├── research/          # Neuro-symbolic reasoning & formal verification papers
│   │   └── config.ts          # Zod schema definitions for all content collections
│   ├── layouts/
│   │   └── BaseLayout.astro   # Root HTML shell, SEO metadata, canonical links & fonts
│   ├── pages/
│   │   ├── notes/             # Notes index and [...slug].astro dynamic routes
│   │   ├── projects/          # Projects index and [...slug].astro dynamic routes
│   │   ├── research/          # Research index and [...slug].astro dynamic routes
│   │   ├── 404.astro          # Custom 404 error page (noindex, nofollow)
│   │   └── index.astro        # Editorial homepage
│   └── styles/
│       └── global.css         # AXIOM v2 CSS custom properties & typography tokens
├── public/                    # Static public assets (_headers, robots.txt, fonts, cv.pdf)
├── scripts/
│   └── test_site.js           # Production verification test suite (HTML & DOM audit)
├── ARCHITECTURE.md            # Deep system architecture & editorial guidelines
├── AGENTS.md                  # AI coding agent routing rules & invariants
├── astro.config.mjs           # Astro configuration with sitemap integration
├── wrangler.jsonc             # Cloudflare Pages deployment configuration
└── package.json               # Scripts & dependencies
```

---

## Operational CLI Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local Astro development server (Port 4321)
npm run dev

# 3. Run Astro schema & TypeScript diagnostics
npm run check

# 4. Full production test suite (build + check + scripts/test_site.js)
npm test

# 5. Build static production distribution (dist/)
npm run build

# 6. Preview local production build (Port 4321)
npm run preview

# 7. Deploy directly to Cloudflare Pages from terminal
npm run deploy
```

For complete technical architecture, design tokens, and editorial invariants, see [`ARCHITECTURE.md`](ARCHITECTURE.md). For AI coding guidelines and DOM hook requirements, see [`AGENTS.md`](AGENTS.md).