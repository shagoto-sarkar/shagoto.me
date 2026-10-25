# System Architecture & Technical Specification (`ARCHITECTURE.md`)

> **Target:** `shagoto.me`  
> **Status:** Production Ground-Truth Specification  
> **Framework:** Astro 5.x (`output: 'static'`) + TypeScript (strict mode)  
> **Styling:** Vanilla CSS (`AXIOM Design System v2` — Refined Technical Editorialism)  
> **Deployment:** Cloudflare Pages (Serverless Edge CDN + Global Anycast Routing)  
> **Client Runtime:** Zero UI framework runtime (No React, Vue, Svelte, or Tailwind)  

---

## 1. System Topology & Infrastructure Identifiers

`shagoto.me` compiles to 100% static HTML/CSS with build-time syntax highlighting and inline accessible SVG diagrams, distributed globally across Cloudflare's serverless Anycast edge network.

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
                         │ - Pre-rendered HTML (17 routes) │
                         │ - Self-hosted Fonts (*.woff2)   │
                         │ - Inline SVG Diagrams           │
                         │ - public/_headers & robots.txt  │
                         └─────────────────────────────────┘
```

### Production Identifiers

| Resource | Value | Notes |
| :--- | :--- | :--- |
| **Production Domain** | `https://shagoto.me` | Custom apex domain with automated Cloudflare/Google Trust Services SSL |
| **Alternate Domain** | `https://www.shagoto.me` | Canonicalized to apex domain |
| **Pages Default Host**| `https://shagoto-me.pages.dev` | Cloudflare direct worker origin |
| **Pages Project** | `shagoto-me` | Production branch: `main` |
| **Cloudflare Account**| `1e8d24858eeea95aeceb71b98246481d` | Account: `shagotosarkar@gmail.com` |
| **Framework Engine** | Astro 5.4+ | Static site generation (`output: 'static'`, `format: 'directory'`) |

---

## 2. Editorial Identity & Design System (AXIOM v2)

The design direction is **Refined Technical Editorialism**—presenting the publication as a computer science researcher and systems engineer.

### 2.1 Aesthetic Principles
- **Sophistication Through Restraint:** Hierarchy, generous whitespace, calibrated typography, and high-density content.
- **Strict Anti-Gimmick Law:** Never use terminal clichés (blinking cursors, simulated typing, `cat /proc/self/status`, `// AXIOM NODE`, matrix rain, or ASCII decorations).
- **Zero Client UI Frameworks:** Zero React, Vue, Svelte, or Tailwind dependencies. All styles are defined in [`src/styles/global.css`](src/styles/global.css) and scoped `<style>` blocks.

### 2.2 Typography Tokens
All font files are self-hosted `.woff2` binaries stored in [`public/fonts/`](public/fonts/) (52 files):
- **Editorial Serif (Headings, Quotes, Reading Prose):** *EB Garamond* (`@fontsource/eb-garamond`, weights 400, 400i, 600, 700, 700i).
- **Monospace (Code, Schemas, Metadata, Chips):** *JetBrains Mono* (`@fontsource/jetbrains-mono`, weights 400, 500, 700).
- **System Sans (Chrome Controls, Palette, Modal):** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

### 2.3 Color System (`src/styles/global.css`)

```css
/* Default: Warm Off-White Editorial */
:root {
  --color-bg-base: #FAFAF8;          /* Warm archival paper */
  --color-bg-surface: #FFFFFF;       /* Card & elevated element background */
  --color-bg-subtle: #F2F2EE;        /* Secondary background & chip fill */
  --color-text-primary: #121212;     /* High-contrast ink */
  --color-text-secondary: #555555;   /* Secondary prose & metadata */
  --color-text-muted: #767676;       /* Subdued timestamps & labels */
  --color-border: #E5E5E0;           /* Structural hairline boundary */
  --color-border-subtle: #EBEBE6;    /* Subtle division border */
  --color-accent: #1D4ED8;           /* Deep cobalt accent */
  --color-accent-subtle: #EFF6FF;    /* Tinted accent surface */

  /* Spacing Scale */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Layout Boundaries */
  --max-content-width: 1180px;
  --max-prose-width: 720px;
  --radius-subtle: 3px;
  --motion-duration: 150ms;
}

/* Editorial Dark Theme */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-base: #141415;
    --color-bg-surface: #1B1B1D;
    --color-bg-subtle: #222225;
    --color-text-primary: #ECECEC;
    --color-text-secondary: #A0A0A5;
    --color-text-muted: #7A7A80;
    --color-border: #2A2A2E;
    --color-border-subtle: #242428;
    --color-accent: #60A5FA;
    --color-accent-subtle: #1E293B;
  }
}
```

---

## 3. Content Architecture & Collections Schema

Content collections are strictly validated at build time via Zod in [`src/content/config.ts`](src/content/config.ts):

| Collection | Path | Exact Zod Schema Fields |
| :--- | :--- | :--- |
| **`research`** | [`src/content/research/*.md`](src/content/research/) | `title` (string)<br>`abstract` (string)<br>`date` (Date)<br>`status` (`'proposal'` \| `'ongoing'` \| `'completed'` \| `'published'`)<br>`isProposal` (boolean, default: `false`)<br>`supervisor` (optional string)<br>`tags` (string[])<br>`proofAvailable` (boolean, default: `false`)<br>`githubUrl` (optional URL string) |
| **`projects`** | [`src/content/projects/*.md`](src/content/projects/) | `title` (string)<br>`constraint` (string)<br>`techStack` (string[])<br>`date` (Date)<br>`collaborators` (optional string[])<br>`demoVideoAvailable` (boolean, default: `false`)<br>`repoUrl` (optional URL string) |
| **`notes`** | [`src/content/notes/*.md`](src/content/notes/) | `title` (string)<br>`date` (Date)<br>`category` (`'infrastructure'` \| `'academia'` \| `'philosophy'`)<br>`tags` (string[]) |

---

## 4. Components & Micro-Modules

All components are written in native Astro templates (`.astro`) with zero client framework dependencies:

- **`BaseLayout.astro` (`src/layouts/BaseLayout.astro`):** Root HTML shell. Injects self-hosted `@font-face` declarations, canonical tags, Schema.org `Person` JSON-LD metadata, top navigation header (with search trigger), and footer (with social links and contact modal trigger).
- **`CommandPalette.astro` (`src/components/CommandPalette.astro`):** Global search dialog (`Cmd+K` / `Ctrl+K`). Features instant client-side fuzzy searching across indexed research, projects, notes, and quick navigation actions with keyboard selection (`ArrowUp`, `ArrowDown`, `Enter`).
- **`ContactModal.astro` (`src/components/ContactModal.astro`):** Accessible contact dialog triggered by header/footer actions. Includes 1-click email copy (`navigator.clipboard`) with visual feedback, web Gmail direct compose link, and verified external profiles.
- **`DualPaneViewer.astro` (`src/components/DualPaneViewer.astro`):** Scholarly dual-pane viewer for research briefs displaying side-by-side paper abstracts and executable Z3 SMT-LIB2 solver specifications.
- **`ArchitectureDiagram.astro` (`src/components/ArchitectureDiagram.astro`):** Accessible SVG container embedding build-time architecture SVGs with responsive aspect ratio and full screen-reader `aria-label` descriptors.
- **`ExecutionCard.astro` (`src/components/ExecutionCard.astro`):** High-density editorial card component used across the homepage and archive listing indexes.

---

## 5. SVG Architecture Diagram Subsystem

System architecture diagrams are pre-rendered into clean, accessible SVG vectors stored in [`src/assets/diagrams/`](src/assets/diagrams/) and inlined at build time:

| Diagram File | Associated Route / Content | Core Subject |
| :--- | :--- | :--- |
| `neuro-symbolic-pipeline.svg` | `/research/abductive-neuro-symbolic-engine` | LLM narrative extraction to Z3 SMT solver SAT/UNSAT pipeline |
| `cardiorenal-thesis-architecture.svg`| `/research/z3-cardiorenal-thesis-proposal` | KDIGO/ADA/ACC guideline formalization & multi-morbidity checking |
| `opengl-simulation-architecture.svg` | `/projects/opengl-lower-manhattan` | C++/GLFW scene graph, VBO, GLSL shaders to 60fps framebuffer |
| `js-compiler-architecture.svg` | `/projects/js-mini-compiler-ide` | Lexer token stream, recursive descent AST, interpreter sandbox |
| `java-ridesharing-architecture.svg` | `/projects/java-ridesharing-gui` | Java Swing EDT decoupled from SwingWorker threads and JDBC SQL |
| `cashapp-expense-governor.svg` | `/projects/cashapp-expense-governor` | Cloudflare Workers, Hono, D1 multi-tenant envelope budgeting |
| `go-edge-router.svg` | `/projects/go-edge-router` | Go radix-tree reverse proxy with token-bucket rate limiting |
| `log-cognitive-journal.svg` | `/projects/log-cognitive-journal` | Local-first SQLite, vector embeddings, and zero-telemetry sync |
| `serialnow-architecture.svg` | `/projects/serialnow-queue-system` | Multi-tenant token dispatch, Redis state machine & WebSocket alerts |
| `headless-ubuntu-architecture.svg` | `/notes/headless-ubuntu-tailscale` | WireGuard Tailscale mesh into headless server systemd & Docker |

Diagram mapping is dynamically resolved in `src/pages/projects/[...slug].astro`, `src/pages/research/[...slug].astro`, and `src/pages/notes/[...slug].astro`.

---

## 6. SEO, Edge Caching & Security Headers

### 6.1 Canonical URLs & Sitemaps
- Every page dynamically generates an absolute canonical tag: `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />`.
- `404.html` explicitly includes `<meta name="robots" content="noindex, nofollow" />` and omits the canonical link.
- Sitemaps generated via `@astrojs/sitemap`: `sitemap-index.xml` pointing to `sitemap-0.xml` (excluding `/404`).
- `public/robots.txt` specifies `User-agent: *`, `Allow: /`, and `Sitemap: https://shagoto.me/sitemap-index.xml`.

### 6.2 Edge Caching & Security Headers (`public/_headers`)
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

## 7. Automated Verification Test Suite (`scripts/test_site.js`)

The test suite validates build outputs before any release:
- **Build Artifacts:** Confirms presence and non-zero byte size of all 17 HTML pages, PDF resume, CNAME, and sitemaps.
- **Editorial Compliance:** Asserts presence of required editorial strings and confirms absence of terminal gimmicks.
- **Accessibility & Assets:** Asserts SVG diagram rendering with `aria-label` and verifies 52 self-hosted font files.
- **SEO & Cloudflare Configuration:** Asserts canonical tags, `robots.txt`, and `_headers` security rules.

---

## 8. Operational Runbook & CI/CD Pipeline

Managed via GitHub Actions in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

### 8.1 Deployment Guardrails
1. **Automated Verification & Release (Push to `main`):** Executes `npm test` (`astro build && astro check && node scripts/test_site.js`) before deploying static artifacts to Cloudflare Pages.
2. **Manual Production Release:** Can also be triggered directly from the GitHub Actions tab via `workflow_dispatch`.

### 8.2 CLI Commands
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
