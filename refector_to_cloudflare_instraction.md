# AGENT EXECUTION SPECIFICATION: `shagoto.me` Refactor & Cloudflare Serverless Migration

**Target Environment:** Antigravity IDE  
**Model Profile:** Gemini Flash 3.8 (Strict, Deterministic Execution Mode)  
**Project:** `shagoto.me` (Personal Academic & Systems Engineering Publication of Shagoto Sarkar)  
**Core Stack:** Astro 5.x (`output: 'static'`), TypeScript (Strict), Vanilla CSS (`AXIOM Design System v2`), Build-time Shiki & SVG Diagrams.

---

## 0. CRITICAL INVARIANTS (READ FIRST — DO NOT VIOLATE)

Before reading or modifying any file, you must lock these invariants into memory. Violating any of these rules will cause the automated test suite (`scripts/test_site.js`) to fail:

1. **Zero Client UI Frameworks:** Do NOT install or use React, Vue, Svelte, Solid, or Tailwind CSS. All styling must remain in vanilla CSS (`src/styles/global.css` and scoped `<style>` blocks).
2. **Design System Compliance (`design_v2.md`):** Maintain *Refined Technical Editorialism*. Never introduce terminal gimmicks (`terminal-cursor`, `cat /proc/self/status`, `// AXIOM NODE`, blinking cursors, or matrix effects).
3. **Preserve Test-Critical DOM Hooks & Strings:** `scripts/test_site.js` inspects the compiled HTML in `./dist`. You MUST preserve these exact IDs, classes, functions, and text markers:
   - Homepage phrases: `Architecting verifiable intelligence`, `Daffodil International University`, `Active Areas of Investigation`, `Neuro-Symbolic Reasoning`, `Selected Research`, `Abductive Neuro-Symbolic Engine`, `Selected Systems & Projects`, `911 OpenGL Commemorative Simulation`, `Recent Notes & Essays`.
   - Component hooks: `cmd-palette-backdrop`, `contact-modal-backdrop`, `copy-email-btn`, `footer-contact-link`, `openContactModal`, `scholarly-viewer`, `SMT-LIB2 Solver Specification`.
   - Contact & Social URLs: `mail.google.com/mail/?view=cm`, `shagotosarkar@gmail.com`, `https://wa.me/8801771425996` (`wp: message`), `https://www.instagram.com/shagotosarkar/` (`ig: @shagotosarkar`), `https://www.facebook.com/shagotosarkar666` (`fb: /shagoto`), `https://linkedin.com/in/shagoto-sarkar`.
4. **Do Not Scan Heavy Directories:** Ignore `node_modules/`, `.git/`, `.astro/`, `dist/`, and `scripts/mermaid.min.js` to preserve context limits.
5. **Sequential Execution:** Execute Phases 1 through 4 in exact order. Run verification checks after each phase before proceeding to the next.

---

## PHASE 1: Necessary Project Edits & Metadata Upgrades

###Objective
Audit and upgrade the site's global metadata, SEO remediation items (`updates/seo_updates_plan.md`), font loading performance, and repository cleanliness.

### Step 1.1: Audit & Upgrade `src/layouts/BaseLayout.astro`
Open `src/layouts/BaseLayout.astro` and ensure the `<head>` implements the following cleanly without duplicating tags:
1. **Canonical URL:** Ensure `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />` is present and resolves to `https://shagoto.me/...`.
2. **Font Preloading (Core Web Vitals / LCP Optimization):** Add `<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" ... />` for the primary above-the-fold weights used in `src/styles/global.css`:
   - `/fonts/eb-garamond-latin-400-normal.woff2`
   - `/fonts/eb-garamond-latin-600-normal.woff2`
   - `/fonts/jetbrains-mono-latin-400-normal.woff2`
3. **OpenGraph & Academic Metadata:** Ensure dynamic `title` and `description` props populate:
   - `<meta property="og:title" content={...} />`
   - `<meta property="og:description" content={...} />`
   - `<meta property="og:url" content={new URL(Astro.url.pathname, Astro.site)} />`
   - `<meta property="og:type" content="website" />`
   - `<meta name="twitter:card" content="summary" />`
4. **JSON-LD Structured Data (`Person` / Researcher Schema):** Inject a clean build-time `<script type="application/ld+json">` block in `BaseLayout.astro` defining Shagoto Sarkar (`https://shagoto.me`), affiliation (`Daffodil International University`), `sameAs` links (GitHub, LinkedIn), and `knowsAbout` (`Neuro-Symbolic AI`, `Formal Verification`, `Z3 SMT Solver`, `Systems Engineering`, `C++`, `OpenGL`).

### Step 1.2: Verify `public/robots.txt` & Static Public Assets
1. Open `public/robots.txt` and ensure it contains clean plain text (no Markdown brackets) pointing to the sitemap:
   ```text
   User-agent: *
   Allow: /

   Sitemap: [https://shagoto.me/sitemap-index.xml](https://shagoto.me/sitemap-index.xml)
   ```
2. Verify `public/cv.pdf` and `public/CNAME` exist and remain untouched.

---

## PHASE 2: Code, Logic & Component Refinements

### Objective
Improve client-side JavaScript robustness, keyboard accessibility, DOM event lifecycle management, and TypeScript strictness across components and pages.

### Step 2.1: Refactor `src/components/CommandPalette.astro`
Inspect `src/components/CommandPalette.astro` and improve its internal `<script>` and markup while keeping `cmd-palette-backdrop` intact:
1. **Input Guarding:** Ensure pressing `/` only opens the Command Palette when the active element (`document.activeElement`) is NOT an `<input>`, `<textarea>`, `<select>`, or `[contenteditable="true"]`. Also support `Ctrl+K` / `Meta+K` as a secondary shortcut.
2. **Keyboard Navigation:** Ensure `ArrowDown` and `ArrowUp` cycle cleanly through visible filtered search results (wrapping around at the top and bottom), visually highlighting the active item (`aria-selected="true"`), and pressing `Enter` navigates directly to the selected item's `href`.
3. **Focus & Scroll Lock:** When opened, lock background scrolling (`document.body.style.overflow = 'hidden'`), focus the search input immediately, and restore focus to the previously active element when closed via `Escape` or backdrop click.
4. **XSS-Safe Filtering:** Ensure search result rendering or filtering manipulates DOM nodes safely (`textContent` or toggling visibility on pre-rendered list items) rather than injecting unsanitized `innerHTML`.

### Step 2.2: Refactor `src/components/ContactModal.astro`
Inspect `src/components/ContactModal.astro` and refine its logic while preserving `contact-modal-backdrop`, `copy-email-btn`, `openContactModal`, `mail.google.com/mail/?view=cm`, and `shagotosarkar@gmail.com`:
1. **Clipboard Resilience:** In the `#copy-email-btn` click handler, wrap `navigator.clipboard.writeText('shagotosarkar@gmail.com')` in a `try/catch` block with a fallback (`document.execCommand('copy')` via a temporary textarea) so copying never fails on stricter browser contexts.
2. **Timer Cleanup:** Clear any existing feedback timeout (`clearTimeout`) before setting a new `"Copied"` status timer so rapid clicks do not cause flickering UI text.
3. **Accessibility:** Ensure the modal container has `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and closes cleanly on `Escape` or clicking outside the modal card on `#contact-modal-backdrop`.

### Step 2.3: Refactor `src/components/DualPaneViewer.astro`
Inspect `src/components/DualPaneViewer.astro` (preserving `scholarly-viewer` and `SMT-LIB2 Solver Specification`):
1. Ensure view-mode toggle buttons (e.g., Split View / Prose Only / Formal Proof Only on mobile or desktop) properly update `aria-pressed="true/false"`.
2. Ensure code blocks inside the SMT-LIB2 pane have clean horizontal scroll containment (`overflow-x: auto`) without breaking mobile viewport width.

### Step 2.4: TypeScript & Astro Content Collection Hygiene
1. Run `npx astro check` to inspect all `.astro` and `.ts` files for implicit `any`, unused variables, or null-safety warnings.
2. In `src/pages/index.astro`, `src/pages/research/*`, `src/pages/projects/*`, and `src/pages/notes/*`, ensure collection sorting (`date.valueOf()`) is deterministic (newest first) and all dynamic route `getStaticPaths()` functions are strictly typed.

---

## PHASE 3: Optimization for Cloudflare Serverless Deployment

### Objective
Transition the project from a self-hosted Linux Docker/Nginx setup to a zero-cold-start **Cloudflare Pages / Static Edge** architecture, replicating all `nginx.conf` caching, compression, and routing behaviors natively at the Cloudflare edge.

### Step 3.1: Create `public/_headers` (Edge Caching & Security Headers)
Create `public/_headers` so Astro copies it into `dist/_headers` at build time. Configure it to replace `nginx.conf` caching rules and add production-grade security headers:

```text
# Security headers for all pages
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()

# 1-Year Immutable Cache for Astro hashed bundles
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# 1-Year Immutable Cache for self-hosted WOFF2 fonts
/fonts/*
  Cache-Control: public, max-age=31536000, immutable

# Cache for CV and Sitemap
/cv.pdf
  Cache-Control: public, max-age=86400, must-revalidate

/sitemap-index.xml
  Cache-Control: public, max-age=3600

/sitemap-0.xml
  Cache-Control: public, max-age=3600
```

### Step 3.2: Create `wrangler.jsonc` for Cloudflare Deployment
Create a clean `wrangler.jsonc` in the project root so the project can be deployed via either Cloudflare Git integration OR `npx wrangler pages deploy dist` / Cloudflare Workers Static Assets:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "shagoto-me",
  "compatibility_date": "2026-10-01",
  "pages_build_output_dir": "./dist"
}
```

### Step 3.3: Pin Node Runtime Version for Cloudflare Build Image
Create `.node-version` in the project root containing:
```text
22
```
*(This instructs Cloudflare's build pipeline to use Node.js 22, matching `@types/node: ^22.20.3` and `package-lock.json` requirements).*

### Step 3.4: Clean Up Legacy Self-Hosted Server Files
1. Remove the obsolete Linux container files from the root directory so the repository reflects a clean serverless deployment:
   - Delete `Dockerfile`
   - Delete `docker-compose.yml`
   - Delete `.dockerignore`
   - Delete `nginx.conf`
2. Update `.gitignore` to ignore `.wrangler/` and `.env*` alongside `dist/`, `.astro/`, and `node_modules/`.
3. Update `README.md` with concise documentation of the architecture, local development commands (`npm run dev`, `npm test`), and Cloudflare build configuration (`Build command: npm run build`, `Build output directory: dist`, `Node.js version: 22`).

### Step 3.5: Update `scripts/test_site.js` for Cloudflare Artifacts
Open `scripts/test_site.js` and add `_headers` to the `expectedFiles` array so that `npm test` verifies the Cloudflare edge header configuration is present in `./dist` on every build:
- Verify `dist/_headers` exists and includes `Cache-Control: public, max-age=31536000, immutable` and `X-Content-Type-Options: nosniff`.

---

## PHASE 4: Final Review & Pre-Deployment Verification Protocol

### Objective
Execute a mandatory, automated verification gate before declaring the task complete. Do NOT skip any command in this phase.

### Step 4.1: Execute the Full Build & Verification Suite
Run the following commands sequentially in the terminal:

1. **Type & Astro Diagnostics:**
   ```bash
   npm run check
   ```
   *Requirement:* Must return `0 errors`, `0 warnings`, and `0 hints`.

2. **Production Static Build & Automated Assertion Suite:**
   ```bash
   npm test
   ```
   *(This executes `astro build && astro check && node scripts/test_site.js`)*.  
   *Requirement:* Every single `[PASS]` check in `scripts/test_site.js` must succeed with exit code `0`.

### Step 4.2: Pre-Deployment Audit Checklist
Verify and confirm each item below before concluding:
- [ ] All 19 expected artifacts (original 18 + `_headers`) exist in `./dist`.
- [ ] Every HTML page in `./dist` contains a valid `<link rel="canonical" href="https://shagoto.me/...">`.
- [ ] `dist/robots.txt` contains a clean URL for `Sitemap: https://shagoto.me/sitemap-index.xml` with no Markdown syntax errors.
- [ ] Zero client-side framework islands (`__astro_island`) exist in the compiled output.
- [ ] Legacy container files (`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `.dockerignore`) are removed.
- [ ] `.node-version` and `wrangler.jsonc` are present in the root directory.

### Step 4.3: Final Output Report
Once all checks pass with `0 errors`, output a concise **Deployment Readiness Report** summarizing:
1. Files modified, created, and deleted.
2. Output of `npm test`.
3. Exact 3-step instructions for connecting the repository to the Cloudflare Dashboard (or deploying via `npx wrangler pages deploy dist`).
