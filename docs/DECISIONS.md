# Architecture & Design Decision Records (`docs/DECISIONS.md`)

> **Record Type:** Architectural & Design Decision Records (ADRs)
> **Status:** Accepted and Enforced across `shagoto.me`
> **Date:** October 2026

---

## ADR 001: Static Astro Engine with Zero Client UI Frameworks

### Context
`shagoto.me` is an academic, research, and software engineering publication. High performance, zero cold starts, complete offline build reproducibility, and long-term maintainability are paramount. Modern frontend frameworks (React, Vue, Svelte) introduce hydration overhead, runtime script bloat, and dependency churn.

### Decision
Use **Astro 5.x** in static output mode (`output: 'static'`). Completely exclude client-side UI frameworks and CSS utility libraries (no React, Vue, Svelte, Solid, or Tailwind CSS). Interactivity is limited to vanilla JavaScript/TypeScript embedded in Astro `<script>` tags.

### Tradeoffs & Consequences
- **Pros:** Zero JavaScript runtime for prose reading; instantaneous page loads; perfect Lighthouse performance; 100% pre-rendered static HTML/CSS.
- **Cons:** Interactive components (fuzzy search, contact modal, mobile navigation drawer) must be implemented with vanilla DOM manipulation and manual accessibility management (focus trap, ARIA attributes).

---

## ADR 002: "Quiet Precision" Design System

### Context
Previous iterations leaned towards dark mode hacker aesthetics and dense card walls with terminal-style cursors. This detracted from the seriousness of academic research and computer systems engineering.

### Decision
Adopt the **Quiet Precision** visual language:
- **Palette:** Warm archival paper (`#F8F7F3`) in light mode; deep slate (`#11191D`) in dark mode. Deep slate-teal accent (`#234F65` / `#98C9D7`).
- **Typography:** Self-hosted *EB Garamond* for intellectual reading prose, *JetBrains Mono* for code and technical metadata, and clean system sans for chrome controls.
- **Anti-Gimmick Invariant:** Ban terminal cursors, matrix rain, simulated typewriter effects, and fake terminal status banners (`cat /proc/self/status`).

### Tradeoffs & Consequences
- **Pros:** Calm, scholarly tone; high readability; timeless aesthetic that emphasizes intellectual depth.
- **Cons:** Requires rigorous restraint and deliberate whitespace hierarchy rather than relying on animations or decorative graphics.

---

## ADR 003: Curated Homepage Hierarchy vs. Complete Unfiltered Archives

### Context
Displaying all 7 projects, 2 research publications, and 3 notes on the homepage created visual clutter, equal-weight monotony, and diluted the primary identity narrative.

### Decision
Separate the homepage from the archive pages:
1. **Homepage:** A strictly curated showcase presenting:
   - Primary identity statement with a high-level current research rail (`CURRENTLY`).
   - One featured research breakthrough (*Cardiorenal Thesis Proposal* with a 3-step formal pipeline).
   - Three asymmetric engineering projects (*SerialNow.* as the primary distributed system, *CashApp* as a serverless financial governor, and *911 OpenGL* as a graphics counterpoint).
   - A typographic Active Areas of Investigation section.
   - Two curated recent essays.
2. **Archive Pages (`/projects`, `/research`, `/notes`):** Contain the complete, comprehensive inventory of all catalogued items with metadata and category filtering.

### Tradeoffs & Consequences
- **Pros:** Distinct visual hierarchy; visitors immediately grasp the author's primary technical thesis and top achievements within seconds.
- **Cons:** Secondary projects are accessed via the dedicated `/projects` archive rather than the homepage first fold.

---

## ADR 004: Native Editorial Rows over Full-Card Overlay Anchors

### Context
Card designs frequently wrap entire containers in absolute positioning links (`inset: 0`), preventing users from selecting text, breaking screen-reader link contexts, and creating awkward keyboard focus boxes.

### Decision
Refactor `ExecutionCard.astro` and archive listings into accessible **editorial rows**:
- 3-column structured layout: metadata column, content column (title, constraint/abstract, tech tags), and explicit action link column.
- The title and "Read" link are explicit interactive anchors (`<a>`). Text inside descriptions and metadata remains freely selectable.
- Hover states subtly elevate the entire row via background transition and border highlight without breaking semantic structure.

### Tradeoffs & Consequences
- **Pros:** Fully accessible; text can be selected and copied without triggering accidental navigation; clean tabular scanability on desktop and mobile.
- **Cons:** Clicking on dead whitespace outside the title or action link does not navigate, which is standard semantic web behavior.

---

## ADR 005: Strict Checkpoint Gating Protocol (70%, 80%, 90%, 100%)

### Context
Large AI-assisted codebase refactors often suffer from runaway scope, skipped testing, unverified claims, or silent breaking changes across iterations.

### Decision
Enforce a four-gate checkpoint protocol:
- **70%:** Foundation release candidate (design system, global shell, curated homepage, full archives, living documentation).
- **80%:** Long-form article reading experience (detail templates, dual-pane research viewer, diagram polish).
- **90%:** Editorial truth audit, accessibility deep dive, and metadata polish.
- **100%:** Final verification matrix, pre-flight safety audit, and durable handoff.
Each gate requires local validation, durable ledger updates (`STATE.md` and `QA_LOG.md`), and an explicit user reply of `proceed` before crossing into the next window.

### Tradeoffs & Consequences
- **Pros:** Deterministic quality control; zero regressions; complete audit trail; verifiable safety at every step.
- **Cons:** Requires deliberate stops and structured reporting.
