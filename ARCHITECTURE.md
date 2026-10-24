# System Architecture & Technical Specification (`ARCHITECTURE.md`)

> **Target:** `shagoto.me`  
> **Status:** Production Ground-Truth Specification  
> **Framework:** Astro 5.x (`output: 'static'`) + TypeScript (strict mode)  
> **Styling:** Vanilla CSS (`AXIOM Design System v2` — Refined Technical Editorialism)  
> **Deployment:** Cloudflare Pages (Serverless Edge CDN + Global Anycast Routing)  
> **Client Runtime:** Zero UI framework runtime (No React, Vue, Svelte, or Tailwind)  

---

## 1. System Topology & Infrastructure Identifiers

`shagoto.me` is the personal academic and systems engineering publication of Shagoto Sarkar. It compiles to 100% static HTML/CSS with build-time syntax highlighting and inline SVG diagrams, deployed globally across Cloudflare's serverless Anycast edge network.

```
                    ┌───────────────────────────────────────────┐
                    │  https://shagoto.me / https://www.shagoto.me
                    └─────────────────────┬─────────────────────┘
                                          │ (Cloudflare Anycast DNS / Edge SSL)
                                          ▼
                         ┌─────────────────────────────────┐
                         │ Cloudflare Pages Project        │
                         │ Name: "shagoto-me"              │
                         │ Origin: shagoto-me.pages.dev    │
                         └────────────────┬────────────────┘
                                          │
                                          ▼ (Zero Cold-Start Edge Distribution)
                         ┌─────────────────────────────────┐
                         │ dist/ (Static Compilation)      │
                         │ - Pre-rendered HTML (16 routes) │
                         │ - Self-hosted Fonts (*.woff2)   │
                         │ - SVG Architecture Diagrams     │
                         │ - public/_headers & robots.txt  │
                         └─────────────────────────────────┘
```

### Production Identifiers

| Resource | Value | Notes |
| :--- | :--- | :--- |
| **Production Domain** | `https://shagoto.me` | Custom apex domain with Google Trust Services SSL |
| **Alternate Domain** | `https://www.shagoto.me` | Canonicalized to apex domain |
| **Pages Default Host**| `https://shagoto-me.pages.dev` | Cloudflare direct worker origin |
| **Pages Project** | `shagoto-me` | Production branch: `main` |
| **Cloudflare Account**| `1e8d24858eeea95aeceb71b98246481d` | Account: `shagotosarkar@gmail.com` |
| **Framework Engine** | Astro 5.4+ | Static site generation (`output: 'static'`) |

---

## 2. Editorial Identity & Design System (AXIOM v2)

The design direction is **Refined Technical Editorialism**—presenting the publication as a serious computer science researcher and systems engineer.

### 2.1 Core Aesthetic Laws
- **Sophistication Through Restraint:** Hierarchy, generous whitespace, calibrated typography, and dense content rather than decorative graphics or animations.
- **Strict Anti-Gimmick Law:** Prohibited from using terminal clichés (blinking cursors, simulated typing, `cat /proc/self/status`, `// AXIOM NODE`, matrix effects, or ASCII art).
- **Zero Client UI Frameworks:** Zero React, Vue, Svelte, or Tailwind dependencies. All styles are defined in [`src/styles/global.css`](src/styles/global.css) and scoped `<style>` blocks.

### 2.2 Typography Tokens
All font files are self-hosted `.woff2` binaries stored in [`public/fonts/`](public/fonts/) (52 files):
- **Serif (Headings, Quotes, Body):** *EB Garamond* (`@fontsource/eb-garamond`) for academic rigor and readability.
- **Monospace (Code, Metadata, Chips):** *JetBrains Mono* (`@fontsource/jetbrains-mono`) for technical schemas, equations, and code blocks.
- **System Sans (Controls, Palette, UI):** Clean native system font stack for interactive chrome.

### 2.3 Color Palette (CSS Custom Properties)
```css
:root {
  --color-bg: #0D0F12;               /* Deep void charcoal */
  --color-surface: #14181E;          /* Card & elevated surface */
  --color-border: #1F242C;           /* Subtle structural boundary */
  --color-text-primary: #EDEDED;     /* Crisp high-contrast reading text */
  --color-text-secondary: #9BA3AF;   /* Muted metadata & secondary copy */
  --color-accent: #10B981;           /* Emerald system accent */
}
```

---

## 3. Content Architecture & Collections Schema

Content collections are strictly defined in [`src/content/config.ts`](src/content/config.ts) and validated at build time via Zod:

| Collection | Directory | Schema & Frontmatter Rules |
| :--- | :--- | :--- |
| **`research`** | [`src/content/research/`](src/content/research/) | Formal academic initiatives and SMT verification. Fields: `title`, `description`, `pubDate`, `status` (`published`/`in-progress`/`proposal`), `venue` (optional), `collaborators` (optional), `pdf` (optional), `code` (optional). |
| **`projects`** | [`src/content/projects/`](src/content/projects/) | Low-level systems, compilers, graphics pipelines, edge routers. Fields: `title`, `description`, `pubDate`, `techStack` (array), `github` (optional), `liveUrl` (optional), `diagramId` (optional). |
| **`notes`** | [`src/content/notes/`](src/content/notes/) | Technical essays, assembly notes, operational guides. Fields: `title`, `description`, `pubDate`, `tags` (array), `readTime` (string). |

---

## 4. Interactive Components & Micro-Modules

All interactions use pure, accessible vanilla TypeScript/JavaScript without external libraries:

- **Command Palette (`src/components/CommandPalette.astro`):** Global keyboard launcher (`Cmd+K` / `Ctrl+K`) with instant client-side fuzzy search across research, projects, notes, and shortcuts.
- **Contact Modal (`src/components/ContactModal.astro`):** Accessible dialog with direct web Gmail compose link, 1-click clipboard copy (`navigator.clipboard`), and verified social channels.
- **Scholarly Viewer:** Dual-pane layout on research papers displaying side-by-side paper abstracts and executable Z3 SMT-LIB2 solver specifications.
- **Architecture Diagrams:** Inline SVG diagrams rendered at build time with comprehensive `aria-label` accessibility descriptors (OpenGL simulation, Mini-Compiler, Java Ridesharing, Cash Governor, Go Edge Router, Log Cognitive Journal).

---

## 5. SEO, Edge Caching & Security Headers

### 5.1 Canonical URLs & Sitemaps
- Every page dynamically generates an absolute canonical tag: `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />`.
- `404.html` explicitly includes `<meta name="robots" content="noindex, nofollow" />` and omits the canonical link.
- Sitemaps generated via `@astrojs/sitemap`: `sitemap-index.xml` pointing to `sitemap-0.xml`.
- `public/robots.txt` specifies `User-agent: *`, `Allow: /`, and `Sitemap: https://shagoto.me/sitemap-index.xml`.

### 5.2 Edge Caching Headers (`public/_headers`)
```http
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: interest-cohort=()

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## 6. Automated Verification Test Suite (`scripts/test_site.js`)

The test suite validates build outputs before any release:
- **Build Artifacts:** Confirms presence and non-zero byte size of all HTML pages, PDF resume, CNAME, and sitemaps.
- **Editorial Compliance:** Asserts presence of required editorial strings and confirms absence of terminal gimmicks.
- **Accessibility & Assets:** Asserts SVG diagram rendering with `aria-label` and verifies 52 self-hosted font files.
- **SEO & Cloudflare Configuration:** Asserts canonical tags, `robots.txt`, and `_headers` security rules.

---

## 7. Operational Runbook & CI/CD Pipeline

Managed via GitHub Actions in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

### 7.1 Deployment Guardrails
1. **Automated CI (On every Push / PR to `main`):** Executes `npm run check` and `npm test` (`astro build && astro check && node scripts/test_site.js`). Never automatically deploys.
2. **Guarded 1-Click Production Release:** Triggered manually from the GitHub Actions tab via `workflow_dispatch`.

### 7.2 CLI Commands
```bash
# Start local Astro development server (Port 4321)
npm run dev

# Run Astro TypeScript & schema diagnostics
npm run check

# Full production verification (build + check + test_site.js)
npm test

# Production build only (dist/)
npm run build

# Direct manual terminal deploy via Wrangler
npm run deploy
```
