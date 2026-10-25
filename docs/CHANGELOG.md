# Changelog (`docs/CHANGELOG.md`)

All notable changes to the `shagoto.me` codebase during the October 2026 upgrade are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [90% Editorial Truth Audit & Accessibility] - 2026-10-25

### Changed
- **Editorial Truth Audit Across All 12 Content Entries:**
  - `src/content/research/abductive-neuro-symbolic-engine.md`: Decoupled upstream LLM extraction uncertainty from formal Z3 SMT evaluation. Clarified SAT / UNSAT / UNKNOWN solver states, removed claims of "zero false passes", and acknowledged prompt engineering and edge extraction boundaries.
  - `src/content/research/z3-cardiorenal-thesis-proposal.md`: Added explicit undergraduate proposal notice, acknowledged supervisor attribution, and clarified that Z3 assertion sets are preliminary research abstractions rather than clinically validated rules.
  - `src/content/projects/serialnow-queue-system.md`: Clarified Phase 0 architecture and interactive prototype stage. Documented S.goto Lab research origin, planned Cloudflare D1/KV edge persistence, and preserved Model B / dual-lane queue invariants.
  - `src/content/projects/cashapp-expense-governor.md`: Clarified personal expense governor target staging. Refined dual-mode budget smoothing and removed claims of absolute human overspend guarantees.
  - `src/content/projects/go-edge-router.md`: Reframed sub-15ms edge routing as an architectural objective and local benchmark target. Clarified Workers KV eventual consistency model (~60s propagation) versus relational D1 storage.
  - `src/content/projects/log-cognitive-journal.md`: Replaced absolute claims of "mathematical impossibility of forensic recovery" with realistic threat modeling boundaries. Acknowledged client hardware keyloggers, malicious browser extensions, and OS pagefile memory dumps.
  - `src/content/projects/opengl-lower-manhattan.md`: Reframed 60 FPS / zero dropped frames as an observed local test environment benchmark target under VSync. Preserved collaborator attribution to Mahadi and verified `graphics_lab` repository path.
  - `src/content/projects/js-mini-compiler-ide.md`: Framed as an educational in-browser compiler and code editor prototype. Labeled CLI diagnostic output as an illustrative pipeline simulation.
  - `src/content/projects/java-ridesharing-gui.md`: Framed as academic coursework exploring Java Swing Event Dispatch Thread (EDT) / SwingWorker concurrency and relational SQL transactions.
  - `src/content/notes/headless-ubuntu-tailscale.md`: Framed as author's personal homelab Ubuntu 24.04 server configuration with representative systemd service status.
  - `src/content/notes/8086-microprocessor-assembly.md`: Framed as academic coursework exploration. Accurately described shift-and-add arithmetic and interrupt-driven I/O without unbenchmarked cycle claims.
  - `src/content/notes/moral-complexity-dostoevsky-arcane.md`: Audited reflective philosophical essay, character citations, and quotes for accuracy and tone.
- **Interactions & Accessibility Polish:**
  - Verified `src/components/CommandPalette.astro` keyboard traversal, search indexing, and modal escape behavior.
  - Verified `src/components/ContactModal.astro` clipboard copy feedback, live region announcements, and focus restoration.
  - Verified `src/pages/notes/index.astro` category filter buttons with `role="group"` and `aria-pressed` states.
  - Aligned social URLs in `src/layouts/BaseLayout.astro` Schema.org `Person` entity and footer link.
- **Verification & Quality Gate:**
  - 100% pass across all 17 routes and all test assertions in `scripts/test_site.js`.
  - Zero Astro typecheck or schema diagnostics errors (`npm run check`: 20 files, 0 errors, 0 warnings, 0 hints).
  - Code 0 on whitespace validation (`git diff --check`).

---

## [80% Article Reading Experience] - 2026-10-25

### Added
- **Reading-First DualPaneViewer (`src/components/DualPaneViewer.astro`):**
  - Default view is single-column reading-first methodology in natural document flow.
  - Eliminated the double scroll trap: removed fixed heights and nested vertical scrollbars (`overflow-y: auto`), allowing pages to scroll smoothly.
  - Segmented control buttons (`Methodology`, `Formal Model & Proofs`, `Side-by-Side (Compare)` on >= 1200px viewports) with `aria-pressed` states.
  - Proper `aria-hidden` attributes on hidden panels to prevent inaccessible focus sequences.
- **Contained Responsive Diagrams (`src/components/ArchitectureDiagram.astro`):**
  - Contained horizontal scroll container (`-webkit-overflow-scrolling: touch`) on narrow viewports with minimum width (`520px`) to prevent microtext squishing and page-level horizontal overflow.
- **Article Typography & Layout Polish (`src/styles/global.css`):**
  - Added heading `scroll-margin-top: calc(var(--header-height) + var(--space-6))` to clear sticky header.
  - Responsive table styling with horizontal scroll containment.
  - Clean link styling with underline offsets and hover transitions.
  - Figure captions and code block focus rings.

### Changed
- **Research Detail Templates (`src/pages/research/[...slug].astro`):**
  - Corrected SMT-LIB2 solver specifications: added `(set-option :produce-unsat-cores true)` and named assertions `(! ... :named ...)` for authentic unsat-core extraction.
  - Framed constraint models as formal research abstractions rather than clinical guarantees.
  - Refined masthead, breadcrumb links, and academic proposal notice box.
- **Project Detail Templates (`src/pages/projects/[...slug].astro`):**
  - Calibrated typography, Core Constraint & Objective card with accent border, collaborator credits, and sequential pagination.
- **Notes Detail Templates (`src/pages/notes/[...slug].astro`):**
  - Refined typography, category badge, and sequential pagination.

---

## [70% Foundation Release Candidate] - 2026-10-25

### Added
- **Quiet Precision Design System (`src/styles/global.css`, `docs/DESIGN_SYSTEM.md`):**
  - Custom property tokens for warm archival light palette (`#F8F7F3`, `#1A2126`, `#234F65`) and deep slate dark palette (`#11191D`, `#ECEFF1`, `#98C9D7`).
  - Fluid clamp typography scales for display headings, section headers, body prose, and monospace labels.
  - Consistent layout widths: `--max-content-width: 1180px`, `--max-prose-width: 720px`.
  - Accessible focus ring indicators with 2px offset.
- **Accessible Mobile Navigation Drawer (`src/layouts/BaseLayout.astro`):**
  - Slide-out mobile drawer (`#mobile-nav-panel`) with hamburger toggle (`#mobile-menu-btn`).
  - Accessible attributes (`aria-expanded`, `aria-controls`), keyboard `Escape` dismiss, outside click dismiss, and focus restoration to toggle button.
  - Minimum 44×44px touch targets across all mobile header controls.
  - Platform detection for search shortcut badge (`⌘K` on macOS/iOS, `Ctrl K` on Windows/Linux).
  - SVG 'S' monogram favicon in EB Garamond.
- **Editorial Archive Listing Rows (`src/components/ExecutionCard.astro`):**
  - Refactored card into a 3-column editorial row: metadata column, main content column, and explicit action link column.
  - Selectable text inside descriptions; removed full-card absolute positioning overlay anchor.
- **Archive Index Pages:**
  - Redesigned `/projects/index.astro`, `/research/index.astro`, and `/notes/index.astro` using clean editorial rows with dynamic item counters.
  - Added category filter buttons with `aria-pressed` states on the `/notes` archive.
- **Living Documentation Suite:**
  - `docs/DESIGN_SYSTEM.md`: Palette, typography, tokens, and components.
  - `docs/CONTENT_GUIDE.md`: Frontmatter schemas, honesty standards, diagram mapping, and verification commands.
  - `docs/DEVELOPMENT.md`: Workstation setup, workflow commands, visual QA matrix, and troubleshooting.
  - `docs/DEPLOYMENT.md`: Read-only Cloudflare Pages CI/CD overview and safety warnings.
  - `docs/DECISIONS.md`: Architectural Decision Records (ADRs 001–005).
  - `docs/upgrade/STATE.md`: Continuous resumption ledger.
  - `docs/upgrade/QA_LOG.md`: Detailed test and verification ledger.

### Changed
- **Dual Shiki Syntax Highlighting (`astro.config.mjs`, `src/styles/global.css`):**
  - Configured Astro to compile Shiki dual themes (`github-light` and `github-dark-dimmed`).
  - Added dark mode CSS variable overrides for syntax elements and code containers (`#EBEBE6` in light mode, `#18262C` in dark mode).
- **Curated Homepage Composition (`src/pages/index.astro`):**
  - Replaced repetitive card grid with asymmetric Quiet Precision layout.
  - Identity hero with high-level `CURRENTLY` research rail.
  - Selected Work section featuring the Cardiorenal formal verification proposal with 3-step pipeline.
  - Three selected asymmetric engineering projects (*SerialNow.*, *CashApp*, *911 OpenGL Simulation* with Mahadi collaborator credit).
  - Typographic Active Areas of Investigation rail.
  - Curated recent essays and closing contact invitation.
- **Contact Modal Accessibility (`src/components/ContactModal.astro`):**
  - Removed nested interactive roles (`role="button"` and `tabindex="0"` on `#email-field-box`).
  - Added live region announcement for clipboard copy confirmation and fallback prompt.
- **Verification Test Suite (`scripts/test_site.js`):**
  - Aligned homepage assertions with the Quiet Precision composition.
  - Added permanent archive integrity assertions verifying all 7 projects, 2 research publications, and 3 notes are present.

### Fixed
- Fixed TypeScript diagnostic warning for deprecated `navigator.platform` in `src/layouts/BaseLayout.astro` by switching to `navigator.userAgent`.
- Fixed trailing whitespace across Astro templates to maintain clean `git diff --check`.
