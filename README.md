# shagoto.me

Personal academic and systems engineering publication of Shagoto Sarkar.

- **Production URL:** [https://shagoto.me](https://shagoto.me)
- **Pages Origin:** [https://shagoto-me.pages.dev](https://shagoto-me.pages.dev)
- **Architecture Guide:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **AI Agent Routing Guide:** [`AGENTS.md`](AGENTS.md)

---

## Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Static Generator** | Astro 5.4+ (`output: 'static'`) | Zero-JS client runtime, 100% pre-rendered static HTML |
| **Type Safety** | TypeScript (strict) + Zod | Schema validation for markdown collections & build diagnostics |
| **Design System** | Vanilla CSS (`AXIOM v2`) | Refined Technical Editorialism, semantic custom properties |
| **Typography** | Self-hosted *EB Garamond* & *JetBrains Mono* | 52 local `.woff2` files served with immutable cache headers |
| **Diagrams & Syntax** | Inline SVGs + Build-time Shiki | Zero client runtime overhead, accessible `aria-label` tags |
| **Hosting & Edge** | Cloudflare Pages + Anycast CDN | Global edge distribution, automated SSL, custom headers |

---

## Directory & Entry-Point Tree

```
shagoto.me/
├── src/
│   ├── assets/
│   │   └── diagrams/              # Architecture SVGs (CashApp, Go, Log, SerialNow, etc.)
│   ├── components/
│   │   ├── ArchitectureDiagram.astro # Responsive SVG diagram container with aria descriptors
│   │   ├── CommandPalette.astro   # Accessible fuzzy search modal (Cmd+K / Ctrl+K)
│   │   ├── ContactModal.astro     # Contact dialog, 1-click clipboard copy & socials
│   │   ├── DualPaneViewer.astro   # Scholarly viewer: abstract + Z3 SMT solver spec
│   │   └── ExecutionCard.astro    # Editorial listing card for research, projects & notes
│   ├── content/                   # Zod-validated Markdown collections
│   │   ├── notes/                 # Field essays & systems notes (3 entries)
│   │   ├── projects/              # Systems engineering case studies (7 entries)
│   │   ├── research/              # Formal verification & neuro-symbolic papers (2 entries)
│   │   └── config.ts              # Zod schema definitions for all content collections
│   ├── layouts/
│   │   └── BaseLayout.astro       # Root HTML shell, nav header, footer, SEO & JSON-LD
│   ├── pages/
│   │   ├── 404.astro              # Custom 404 page (noindex, nofollow)
│   │   ├── index.astro            # Editorial homepage & active investigation areas
│   │   ├── notes/                 # Notes archive index & dynamic [...slug].astro
│   │   ├── projects/              # Projects archive index & dynamic [...slug].astro
│   │   └── research/              # Research archive index & dynamic [...slug].astro
│   └── styles/
│       └── global.css             # AXIOM v2 CSS custom properties, resets & font definitions
├── public/
│   ├── fonts/                     # 52 self-hosted .woff2 font binaries
│   ├── _headers                   # Cloudflare security headers & 1-year immutable caching
│   ├── CNAME                      # Custom apex domain pointer (shagoto.me)
│   ├── cv.pdf                     # Curriculum Vitae binary document
│   └── robots.txt                 # Crawler rules & sitemap index reference
├── scripts/
│   ├── generate_diagrams.js       # Mermaid to SVG generator script
│   ├── mermaid.min.js             # Pre-compiled Mermaid vendor runtime for build script
│   └── test_site.js               # CI production verification audit test suite
├── .github/workflows/deploy.yml   # GitHub Actions CI & manual production deploy workflow
├── ARCHITECTURE.md                # Technical specification & system architecture
├── AGENTS.md                      # AI coding agent routing map & codebase invariants
├── astro.config.mjs               # Astro site config & sitemap integration
├── package.json                   # Scripts, dependencies & project metadata
└── wrangler.jsonc                 # Cloudflare Pages deployment configuration
```

---

## Data Flow & Core Abstractions

1. **Content Definition & Validation:** Markdown files in `src/content/{research,projects,notes}` define frontmatter strictly typed by Zod schemas in `src/content/config.ts`.
2. **Static Route Generation:** Dynamic pages (`src/pages/*/[...slug].astro`) execute `getStaticPaths()` using `getCollection()`, injecting content and resolving architecture SVGs from `src/assets/diagrams/`.
3. **Syntax Highlighting & Formatting:** Shiki highlights code blocks during static generation with `github-dark-dimmed` theme; date formatting is localized via `Intl.DateTimeFormat`.
4. **Layout & Editorial Shell:** `src/layouts/BaseLayout.astro` wraps all pages, injecting self-hosted font faces, canonical URL tags, Schema.org `Person` JSON-LD, global navigation, and the footer.
5. **Client-Side Interactivity (Zero Frameworks):** Micro-interactions in `CommandPalette.astro` (fuzzy search filtering, keyboard shortcuts) and `ContactModal.astro` (clipboard copy, backdrop dismiss) operate with vanilla DOM event listeners.
6. **Edge CDN Delivery:** The compiled `dist/` directory deploys to Cloudflare Pages, applying caching rules from `public/_headers` (1-year immutable for `/_astro/*` and `/fonts/*`).

---

## Operational CLI Commands

```bash
# 1. Install project dependencies
npm install

# 2. Start local Astro dev server (http://localhost:4321)
npm run dev

# 3. Type-check & content schema diagnostics
npm run check

# 4. Production verification suite (Build + Diagnostics + test_site.js)
npm test

# 5. Compile static production build (outputs to dist/)
npm run build

# 6. Preview compiled production build locally
npm run preview

# 7. Manual deploy to Cloudflare Pages via Wrangler
npm run deploy
```

For complete technical specifications, see [`ARCHITECTURE.md`](ARCHITECTURE.md). For AI coding rules, see [`AGENTS.md`](AGENTS.md).