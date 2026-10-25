# shagoto.me

Personal academic and systems engineering publication of Shagoto Sarkar.

- **Production URL:** [https://shagoto.me](https://shagoto.me)
- **Pages Origin:** [https://shagoto-me.pages.dev](https://shagoto-me.pages.dev)
- **Architecture Guide:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **AI Agent Routing Guide:** [`AGENTS.md`](AGENTS.md)
- **Documentation Suite:**
  - [Design System (`docs/DESIGN_SYSTEM.md`)](docs/DESIGN_SYSTEM.md)
  - [Content Authoring Guide (`docs/CONTENT_GUIDE.md`)](docs/CONTENT_GUIDE.md)
  - [Local Development Guide (`docs/DEVELOPMENT.md`)](docs/DEVELOPMENT.md)
  - [Deployment & Edge Guide (`docs/DEPLOYMENT.md`)](docs/DEPLOYMENT.md)
  - [Architecture Decision Records (`docs/DECISIONS.md`)](docs/DECISIONS.md)
  - [Changelog (`docs/CHANGELOG.md`)](docs/CHANGELOG.md)
  - [Upgrade Recovery State (`docs/upgrade/STATE.md`)](docs/upgrade/STATE.md)
  - [QA & Verification Log (`docs/upgrade/QA_LOG.md`)](docs/upgrade/QA_LOG.md)

---

## Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Static Generator** | Astro 5.4+ (`output: 'static'`) | Zero-JS client runtime, 100% pre-rendered static HTML |
| **Type Safety** | TypeScript (strict) + Zod | Schema validation for markdown collections & build diagnostics |
| **Design System** | Vanilla CSS (`Quiet Precision`) | Warm archival / deep slate editorialism, semantic custom properties |
| **Typography** | Self-hosted *EB Garamond* & *JetBrains Mono* | 52 local `.woff2` files served with immutable cache headers |
| **Diagrams & Syntax** | Inline SVGs + Build-time Shiki | Dual themes (`github-light` / `github-dark-dimmed`), accessible `aria-label` tags |
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
│   │   └── ExecutionCard.astro    # Accessible editorial row for research, projects & notes
│   ├── content/                   # Zod-validated Markdown collections
│   │   ├── notes/                 # Field essays & systems notes (3 entries)
│   │   ├── projects/              # Systems engineering case studies (7 entries)
│   │   ├── research/              # Formal verification & neuro-symbolic papers (2 entries)
│   │   └── config.ts              # Zod schema definitions for all content collections
│   ├── layouts/
│   │   └── BaseLayout.astro       # Root HTML shell, nav header, mobile drawer, footer, SEO & JSON-LD
│   ├── pages/
│   │   ├── 404.astro              # Custom 404 page (noindex, nofollow)
│   │   ├── index.astro            # Curated Quiet Precision homepage & active investigation areas
│   │   ├── notes/                 # Notes archive index & dynamic [...slug].astro
│   │   ├── projects/              # Projects archive index & dynamic [...slug].astro
│   │   └── research/              # Research archive index & dynamic [...slug].astro
│   └── styles/
│       └── global.css             # Quiet Precision CSS custom properties, resets & font definitions
├── docs/                          # Canonical project documentation suite
│   ├── DESIGN_SYSTEM.md           # Tokens, typography scale, responsive breakpoints & components
│   ├── CONTENT_GUIDE.md           # Frontmatter schemas, honesty standards & verification steps
│   ├── DEVELOPMENT.md             # Workstation prerequisites, CLI commands & visual QA matrix
│   ├── DEPLOYMENT.md              # Cloudflare Pages CI/CD overview & safety guardrails
│   ├── DECISIONS.md               # Architectural Decision Records (ADRs 001–005)
│   ├── CHANGELOG.md               # Chronological factual changes
│   └── upgrade/                   # Durable resumption ledger (STATE.md & QA_LOG.md)
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
3. **Syntax Highlighting & Formatting:** Shiki highlights code blocks during static generation with dual themes (`github-light` / `github-dark-dimmed`); date formatting is localized via `Intl.DateTimeFormat`.
4. **Layout & Editorial Shell:** `src/layouts/BaseLayout.astro` wraps all pages, injecting self-hosted font faces, canonical URL tags, Schema.org `Person` JSON-LD, responsive header navigation with mobile drawer, and the footer.
5. **Client-Side Interactivity (Zero Frameworks):** Micro-interactions in `CommandPalette.astro` (fuzzy search filtering, keyboard shortcuts), `ContactModal.astro` (clipboard copy, backdrop dismiss), and `BaseLayout.astro` (mobile drawer toggle) operate with vanilla DOM event listeners.
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
```

> **SAFETY NOTICE:** Manual terminal deployment (`npm run deploy`) or triggering production CI/CD builds is strictly prohibited during feature development without explicit client authorization.

For complete technical specifications, see [`ARCHITECTURE.md`](ARCHITECTURE.md). For AI coding rules, see [`AGENTS.md`](AGENTS.md).
## Production CI/CD

`.github/workflows/deploy.yml` is the single intended deployment pipeline. It
preserves the existing Cloudflare Pages project and its custom domains. GitHub
Actions with Wrangler fits this repository because it gates deployment on Astro
diagnostics and the existing production assertion suite, then deploys that exact
build. Do not enable a second Cloudflare Git build pipeline.

Pull requests targeting `main` run `npm ci`, `npm run check`, and `npm test`
(build, diagnostics, and site assertions). There is no separate lint tool in this
project; Astro diagnostics provide the existing static checks. Successful pushes
to `main` deploy automatically; manual dispatch deploys only when `main` is
selected. PR jobs have no Cloudflare credentials. Actions are pinned to commit
SHAs, checkout does not persist credentials, jobs have timeouts, and the GitHub
token has only `contents: read`. The deployment job installs Wrangler from the
existing lockfile rather than downloading an unpinned CLI. Production jobs are
serialized and an active deployment is never cancelled by a newer push.

Required repository Actions configuration:

| Name | Kind | Value |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Secret | CI token with **Account → Cloudflare Pages → Edit**, scoped only to the account owning the production project |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | Verified account ID owning `shagoto-me.pages.dev` and `shagoto.me` |

An existing `CLOUDFLARE_ACCOUNT_ID` secret remains supported; the variable takes
precedence. There is no fallback account ID. Never replace an existing secret
without explicit approval, commit tokens, or use a local Wrangler OAuth token as
a CI credential. Pages token permissions cover the selected account; they are
not restricted to one Pages project. No DNS or zone write permission is needed.
See [Cloudflare's CI upload guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

Before deployment, CI verifies the existing project identity and Git integration.
For a Direct Upload project, it retains the current setup. For a Git-connected
project linked to this exact repository, it disables automatic production and
preview Git builds through a narrowly scoped API patch, then reads the settings
back to verify them. This preserves the repository connection, domains, and DNS.
It rejects unexpected source repositories and similarly named projects in other
accounts. The standalone `preflight` command remains read-only; `configure`
reconciles the native Git build settings. See [Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/).

After deployment, `scripts/cloudflare_ci.mjs verify` checks the Cloudflare API
for a successful production deployment matching the workflow commit. It retries
HTTP checks against that deployment's URL, the Pages origin, and `shagoto.me`,
requiring the expected homepage identity and `X-Content-Type-Options: nosniff`.
Failures remain visible in Actions; no automatic rollback or DNS change occurs.
The workflow summary links the verified deployment. A manual rerun rebuilds the
selected main commit, so check that it is still the intended production revision.

### Setup inspection, 2026-10-25

The inspected Actions run passed verification and failed because its
`CLOUDFLARE_API_TOKEN` was empty. Both existing production URLs returned HTTP 200
and the expected homepage content. The available local Cloudflare OAuth login
could not access the workflow's previously hardcoded account. Its similarly
named Pages project uses `shagoto-me-86o.pages.dev` and has no production custom
domain listed; do not deploy this repository there. Confirm the production
owner's account before configuring the variable. Native Git settings for the
production account still require authenticated inspection.

The GitHub connector supports inspecting runs but cannot configure Actions
secrets. If using GitHub CLI, authenticate with an account authorized to manage
this repository's Actions secrets. List existing secret and variable names before
adding any missing entries. Enter a new Cloudflare token through GitHub's secret
form or the CLI's hidden stdin prompt, never in chat or a command argument.
