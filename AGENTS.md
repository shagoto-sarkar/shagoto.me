# AI Agent Routing Guide & System Prompt (`AGENTS.md`)

> **Instructions for AI Coding Assistants:**
> Read this guide before inspecting or modifying code. It defines exact file-routing rules, strict architectural invariants, codebase conventions, and do-not-touch zones for `shagoto.me`.

---

## 1. Context Routing Map

When assigned a task in a specific domain, read and edit **ONLY** the designated files. Do not scan unrelated directories or ingest whole folders.

| Domain / Task | Read & Modify First | Supporting Logic | Files to Ignore |
| :--- | :--- | :--- | :--- |
| **Research Publications & Theses** | [`src/content/research/*.md`](src/content/research/)<br>[`src/pages/research/[...slug].astro`](src/pages/research/[...slug].astro) | [`src/content/config.ts`](src/content/config.ts)<br>[`src/pages/research/index.astro`](src/pages/research/index.astro)<br>[`src/components/DualPaneViewer.astro`](src/components/DualPaneViewer.astro) | `src/content/notes/*`<br>`src/content/projects/*`<br>`public/fonts/*` |
| **Project Portfolios & Architecture** | [`src/content/projects/*.md`](src/content/projects/)<br>[`src/pages/projects/[...slug].astro`](src/pages/projects/[...slug].astro) | [`src/content/config.ts`](src/content/config.ts)<br>[`src/pages/projects/index.astro`](src/pages/projects/index.astro)<br>[`src/components/ArchitectureDiagram.astro`](src/components/ArchitectureDiagram.astro) | `src/content/notes/*`<br>`src/content/research/*`<br>`public/fonts/*` |
| **Technical Notes & Essays** | [`src/content/notes/*.md`](src/content/notes/)<br>[`src/pages/notes/[...slug].astro`](src/pages/notes/[...slug].astro) | [`src/content/config.ts`](src/content/config.ts)<br>[`src/pages/notes/index.astro`](src/pages/notes/index.astro)<br>[`src/components/ArchitectureDiagram.astro`](src/components/ArchitectureDiagram.astro) | `src/content/research/*`<br>`src/content/projects/*`<br>`public/fonts/*` |
| **Homepage & Editorial Layout** | [`src/pages/index.astro`](src/pages/index.astro)<br>[`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) | [`src/styles/global.css`](src/styles/global.css)<br>[`src/components/ExecutionCard.astro`](src/components/ExecutionCard.astro) | `scripts/*`<br>`src/content/*`<br>`public/fonts/*` |
| **Design System & Global Styling** | [`src/styles/global.css`](src/styles/global.css)<br>[`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) | Scoped `<style>` blocks in `src/pages/*` & `src/components/*` | `scripts/*`<br>`public/*`<br>`src/content/*` |
| **Interactive Components (Palette, Modal)**| [`src/components/CommandPalette.astro`](src/components/CommandPalette.astro)<br>[`src/components/ContactModal.astro`](src/components/ContactModal.astro) | [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro)<br>[`src/styles/global.css`](src/styles/global.css) | `src/content/*`<br>`public/fonts/*` |
| **Architecture Diagrams & SVGs** | [`src/assets/diagrams/*.svg`](src/assets/diagrams/)<br>[`scripts/generate_diagrams.js`](scripts/generate_diagrams.js) | [`src/components/ArchitectureDiagram.astro`](src/components/ArchitectureDiagram.astro)<br>[`src/pages/projects/[...slug].astro`](src/pages/projects/[...slug].astro) | `src/content/notes/*`<br>`public/fonts/*` |
| **SEO, Headers & Edge Config** | [`astro.config.mjs`](astro.config.mjs)<br>[`public/_headers`](public/_headers)<br>[`public/robots.txt`](public/robots.txt)<br>[`wrangler.jsonc`](wrangler.jsonc) | [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) | `src/content/*`<br>`src/components/*`<br>`src/assets/*` |
| **Verification Test Suite** | [`scripts/test_site.js`](scripts/test_site.js) | `package.json` | `public/fonts/*`<br>`src/assets/*` |
| **Living Documentation & ADRs** | [`docs/*.md`](docs/)<br>[`README.md`](README.md)<br>[`ARCHITECTURE.md`](ARCHITECTURE.md) | [`docs/upgrade/STATE.md`](docs/upgrade/STATE.md)<br>[`docs/upgrade/QA_LOG.md`](docs/upgrade/QA_LOG.md) | `dist/*`<br>`node_modules/*` |

---

## 2. Invariant Codebase Conventions

### 2.1 Zero Client UI Frameworks
- **No React, Vue, Svelte, Solid, or Tailwind:** All components must be authored as native Astro templates (`.astro`) with scoped `<style>` blocks or global styles in [`src/styles/global.css`](src/styles/global.css).
- **Vanilla DOM Interactivity:** Any dynamic behaviors (such as the Command Palette fuzzy search or Contact Modal clipboard copy) must be authored in lightweight vanilla TypeScript/JavaScript within `<script>` tags.

### 2.2 Refined Technical Editorialism
- **Prohibited Gimmicks:** Never introduce blinking cursors (`terminal-cursor`), matrix rain, fake terminal status lines (`cat /proc/self/status`), `// AXIOM NODE`, or simulated typewriter effects.
- **Tone & Typography:** Formal, intellectual, calm, restrained. Use *EB Garamond* for editorial reading prose and *JetBrains Mono* for code/metadata.

### 2.3 Test-Critical DOM Hooks & Exact Strings
[`scripts/test_site.js`](scripts/test_site.js) inspects the compiled `./dist` directory. Modifying or removing any of the following strings or attributes will break CI tests:
- **Homepage Titles & Headings:**
  - `Researching reliable intelligence`
  - `Daffodil International University`
  - `Active Areas of Investigation` (with `Neuro-symbolic reasoning` or `Neuro-Symbolic Reasoning`)
  - `Research & engineering` and `Formal Verification of Cardiorenal-Metabolic Guidelines`
  - `SerialNow.` and `911 OpenGL Commemorative Simulation`
  - `From the notebook`
- **DOM IDs & Classes:**
  - `#cmd-palette-backdrop`, `#contact-modal-backdrop`, `#copy-email-btn`, `#footer-contact-link`, `#mobile-nav-panel`, `#mobile-menu-btn`
  - `scholarly-viewer`, `openContactModal()`
- **Verified URLs & Contacts:**
  - `mail.google.com/mail/?view=cm` and `shagotosarkar@gmail.com`
  - `https://wa.me/8801771425996` (`wp: message`)
  - `https://www.instagram.com/shagotosarkar/` (`ig: @shagotosarkar`)
  - `https://www.facebook.com/shagoto.sarkar666` (`fb: /shagoto`)
  - `https://linkedin.com/in/shagoto-sarkar`
- **Research & Thesis Requirements:**
  - `scholarly-viewer` and `SMT-LIB2 Solver Specification` in neuro-symbolic research brief
  - `Academic Proposal Notice` and `Assistant Professor` in thesis proposal
- **SVG Diagrams & Highlights:**
  - Must be rendered inline as `<svg ... aria-label="...">`
  - OpenGL simulation credits `Mahadi` and links to `https://github.com/shagoto-sarkar/graphics_lab/tree/main/OpenGl_Project/911_v2`
  - Build-time Shiki code blocks must contain `astro-code` and `render_skyline_frame`

### 2.4 Content Collections & Zod Invariants
- **Schema Validation:** Every `.md` file in [`src/content/`](src/content/) must strictly satisfy the Zod schemas in [`src/content/config.ts`](src/content/config.ts).
- **Slug Format:** Slugs must be strict lowercase kebab-case (e.g., `cashapp-expense-governor.md`, `serialnow-queue-system.md`).
- **Diagram IDs:** If a project or research entry includes a diagram, register its mapping in `diagramMap` inside [`src/pages/projects/[...slug].astro`](src/pages/projects/[...slug].astro), [`src/pages/research/[...slug].astro`](src/pages/research/[...slug].astro), or [`src/pages/notes/[...slug].astro`](src/pages/notes/[...slug].astro).

---

## 3. Do-Not-Touch Zones

Never inspect, parse, or edit files in these paths:
- `dist/`: Static build output generated by Astro.
- `node_modules/`: Package dependencies.
- `.astro/`: Astro build cache and auto-generated TypeScript declarations.
- `.wrangler/`: Local Miniflare state and local session cache.
- `package-lock.json`: Dependency lockfile.
- `.git/`: Version control metadata.
- `scripts/mermaid.min.js`: Pre-compiled Mermaid vendor bundle.
- `public/fonts/`: 52 binary `.woff2` font files.
- `public/cv.pdf`: Binary resume PDF.

---

## 4. Pre-Commit Verification Checklist

Before completing any task or committing changes, run this exact sequence of commands in the project root:

```bash
# 1. Astro typecheck & schema diagnostics (Must pass with 0 errors)
npm run check

# 2. Complete production verification test suite (Build + Diagnostics + test_site.js)
npm test

# 3. Clean whitespace verification (Must return code 0)
git diff --check
```

---

## 5. Checkpoint Gating Protocol (Strict Stop Rules)

Development on `shagoto.me` adheres to strict human-supervised milestones:
- **70%** — Foundation release candidate (Design system, global navigation, curated homepage, full archives, living documentation).
- **80%** — Detail reading experience (Article typography, scholarly viewer, diagram responsiveness).
- **90%** — Editorial truth audit (All 12 Markdown entries individually audited, accessibility polish).
- **100%** — Verification matrix, durable state reconciliation, and final handoff.

**Agent Rule:** At each checkpoint gate, ensure all tests pass, update `docs/upgrade/STATE.md` and `docs/upgrade/QA_LOG.md`, deliver the structured report ending with `PAUSED. Reply proceed to continue.`, and **STOP**. Do NOT begin subsequent windows without an explicit user reply of `proceed`.
