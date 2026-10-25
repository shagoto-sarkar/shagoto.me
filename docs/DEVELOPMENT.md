# Local Development & Engineering Guide (`docs/DEVELOPMENT.md`)

> **Target:** Local workstation development, verification, and code quality workflows for `shagoto.me`.
> **Safety Guardrail:** All local work must execute completely offline or against local preview servers. Never trigger production Cloudflare deployment or modify remote credentials during local development.

---

## 1. Prerequisites & Environment Setup

- **Node.js:** v20.x or higher LTS (validated on v20.18+)
- **npm:** v10.x or higher
- **Git:** Standard git client
- **Operating System:** Linux / macOS / WSL2 on Windows

### Initial Repository Setup

```bash
# Clone the repository
git clone https://github.com/shagoto-sarkar/shagoto.me.git
cd shagoto.me

# Install exact locked dependencies
npm ci
```

---

## 2. Development Workflow Commands

| Command | Action | Output / Target |
| :--- | :--- | :--- |
| `npm run dev` | Starts local Astro development server | `http://localhost:4321` (HMR enabled) |
| `npm run check` | Runs Astro TypeScript & Zod schema diagnostics | Validates `.astro`, `.ts`, and `src/content/**/*.md` |
| `npm run build` | Compiles production static assets | Generates pre-rendered HTML/CSS into `dist/` |
| `npm run preview` | Starts local HTTP preview of compiled `dist/` | `http://localhost:4321` (Static production fidelity) |
| `npm test` | Complete CI test suite (Build + Diagnostics + `test_site.js`) | Validates all 17 routes, assets, headers & DOM invariants |

---

## 3. Pre-Commit Quality Gate Sequence

Before committing any branch or opening a pull request, run this exact sequence:

```bash
# 1. Typecheck and content collection diagnostics (Must pass with 0 errors/warnings)
npm run check

# 2. Complete production verification test suite (Build + test_site.js)
npm test

# 3. Trailing whitespace audit (Must exit with code 0)
git diff --check
```

---

## 4. Visual QA & Responsive Viewport Matrix

All UI components and pages must be validated against the following viewport matrix in both Light and Dark themes:

| Viewport | Device Class | Primary Checks |
| :--- | :--- | :--- |
| **320px** | Narrow Mobile (e.g., iPhone SE) | No horizontal scrolling (`document.scrollingElement.scrollWidth <= clientWidth`); readable typography. |
| **390px** | Standard Mobile (e.g., iPhone 14/15) | Touch targets ≥44×44px; mobile drawer navigation opens/closes cleanly; metadata stacks vertically. |
| **768px** | Tablet Portrait (e.g., iPad Mini) | Clean grid transitions; header navigation legible without clipping. |
| **1440px** | Desktop Widescreen | Max content width constrained to 1180px; prose measure constrained to 720px; asymmetric alignments balanced. |

### Theme & Mode Invariants

1. **Light Theme (`prefers-color-scheme: light`):**
   - Base background: `#F8F7F3` (warm archival cream).
   - Primary ink: `#1A2126` (deep charcoal).
   - Syntax code background: `#EBEBE6`.
2. **Dark Theme (`prefers-color-scheme: dark`):**
   - Base background: `#11191D` (deep slate).
   - Primary ink: `#ECEFF1` (soft silver).
   - Syntax code background: `#18262C`.
3. **Reduced Motion (`prefers-reduced-motion: reduce`):**
   - Transitions disabled (`transition-duration: 0.01ms !important`).
4. **Keyboard & Focus Navigation:**
   - All interactive elements must show a distinct 2px focus ring (`outline: 2px solid var(--color-accent); outline-offset: 2px`).
   - Modals and drawers must trap focus or cleanly restore focus to trigger buttons upon dismissal via `Escape`.

---

## 5. Modifying Styles & Components

1. **Tokens Over Ad-Hoc Values:**
   - Always reference design tokens in [`src/styles/global.css`](../src/styles/global.css) (e.g., `var(--color-accent)`, `var(--space-6)`, `var(--font-serif)`).
   - Never write inline hardcoded colors or ad-hoc margins.
2. **Zero Client UI Frameworks:**
   - Do not install Tailwind, React, Vue, or Svelte.
   - Author native `.astro` components with scoped `<style>` blocks.
3. **Vanilla DOM Interactivity:**
   - Author client scripts in plain TypeScript/JavaScript inside `<script>` tags.
   - Always clean up event listeners when appropriate.

---

## 6. Troubleshooting Common Issues

### Issue: `npm run check` reports TypeScript error on `navigator.userAgent` or `platform`
- **Solution:** `navigator.platform` is deprecated in modern TypeScript definitions. Use `navigator.userAgent` with regex pattern testing for OS detection (e.g., `/Mac|iPhone|iPad/i.test(navigator.userAgent)`).

### Issue: `git diff --check` fails with "trailing whitespace"
- **Solution:** Run `sed -i 's/[ \t]*$//' <file>` to automatically strip trailing whitespace from edited lines.

### Issue: Port 4321 is already in use
- **Solution:** Check running background tasks using `lsof -i :4321` or `npx astro preview --port 4322`. Cleanly terminate orphaned node processes before launching new test runs.
