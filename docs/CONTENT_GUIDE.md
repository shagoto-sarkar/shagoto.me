# Content Authoring & Integrity Guide (`docs/CONTENT_GUIDE.md`)

> **Audience:** Content authors, maintainers, and AI coding agents updating research, projects, or notes on `shagoto.me`.
> **Standard:** Truthful technical editorialism. Every claim must distinguish demonstrated performance from design targets, prototypes from production, and research proposals from completed findings.

---

## 1. Core Principles of Technical Editorialism

1. **Honesty Over Promotional Claims:**
   - Clearly delineate between what has been built, tested, and benchmarked vs. what is a conceptual architecture or proposal.
   - Never present an automated formal verification model (such as SMT-LIB2 / Z3 constraints) as "clinical medical certification" or "guaranteed patient safety."
   - Never present student prototypes or hobby systems as scaled "enterprise production infrastructure."

2. **Preserve Collaborator Credit:**
   - Retain all co-author, supervisor, and collaborator credits.
   - Example: The 911 OpenGL simulation credits **Mahadi** as co-collaborator; academic proposals must credit supervisors (e.g., **Md. Sabab Zulfiker**, Assistant Professor, DIU).

3. **Strict Validation & No Broken Slugs:**
   - All content files must pass Astro's Zod schema validation during `npm run check`.
   - Slugs must remain strict lowercase kebab-case (e.g., `serialnow-queue-system.md`). Existing slugs must never be renamed or deleted without creating redirects.

---

## 2. Content Collections & Frontmatter Specifications

The site uses three primary collections defined in [`src/content/config.ts`](../src/content/config.ts):

### 2.1 Research Collection (`src/content/research/*.md`)

Used for formal papers, thesis proposals, and algorithmic research briefs.

```yaml
---
title: "Formal Verification of Multi-Guideline Medical Prescriptions via Satisfiability Modulo Theories"
abstract: "A symbolic constraint modeling framework encoding KDIGO and ADA clinical guidelines into first-order SMT-LIB2 predicates, executed via Z3 to detect counter-indicated multi-morbidity drug regimes."
date: 2026-03-15
status: "proposal"              # Allowed: "proposal" | "ongoing" | "completed" | "published"
isProposal: true                # Renders academic proposal notice banner
supervisor: "Md. Sabab Zulfiker, Assistant Professor" # Required if isProposal: true
tags:
  - "Formal Verification"
  - "Satisfiability Modulo Theories"
  - "Z3"
  - "Clinical Decision Support"
proofAvailable: true            # Enables scholarly viewer / solver split
githubUrl: "https://github.com/shagoto-sarkar/cardiorenal-smt-verifier"
---
```

**Required Field Invariants:**
- `status`: One of `'proposal'`, `'ongoing'`, `'completed'`, `'published'`.
- `isProposal`: When `true`, the detail template renders an explicit banner clarifying that this is an academic research proposal undergoing peer review or departmental defense.
- `proofAvailable`: Set to `true` only when executable formal proofs, SMT-LIB2 specifications, or verification scripts exist and are embedded.

---

### 2.2 Projects Collection (`src/content/projects/*.md`)

Used for software engineering systems, architectural case studies, and tools.

```yaml
---
title: "SerialNow: Distributed Token & Queue Orchestrator"
constraint: "High-throughput ticket dispatch with sub-10ms Redis state transitions and real-time WebSocket client sync."
techStack:
  - "Go"
  - "Redis"
  - "WebSockets"
  - "Docker"
date: 2025-11-20
collaborators:                  # Optional array of strings
  - "Shagoto Sarkar"
demoVideoAvailable: false       # Boolean flag
repoUrl: "https://github.com/shagoto-sarkar/serialnow"
---
```

**Required Field Invariants:**
- `constraint`: A concise, one-sentence statement of the core technical difficulty or engineering boundary (e.g., latency, memory footprint, concurrency, reliability).
- `techStack`: Array of concrete technologies used (e.g., Go, C++, OpenGL, SQLite, Hono). Avoid buzzwords; list actual components.
- Case Study Structure: Detail pages should follow an engineering post-mortem structure:
  1. *The Core Constraint / System Problem*
  2. *Architectural Strategy & Data Flow*
  3. *Demonstrated Reality vs. Future Roadmap* (Explicitly label features that are implemented vs. planned).

---

### 2.3 Notes Collection (`src/content/notes/*.md`)

Used for field essays, systems investigations, and technical reflections.

```yaml
---
title: "Zero-Trust Infrastructure on Headless Linux via Tailscale Mesh"
date: 2025-08-12
category: "infrastructure"      # Allowed: "infrastructure" | "academia" | "philosophy"
tags:
  - "Tailscale"
  - "WireGuard"
  - "Linux"
  - "DevOps"
---
```

**Required Field Invariants:**
- `category`: Must be one of `'infrastructure'`, `'academia'`, or `'philosophy'`.
- Excerpts/Summaries: Note articles are presented on the homepage and `/notes` archive with clean summaries derived from frontmatter or the opening paragraph. Keep opening prose informative.

---

## 3. Architecture Diagrams & SVG Embedding

Every technical project or research brief should include an architectural diagram illustrating data flow or component relationships:

1. **Storage Location:** Save vector SVGs in `src/assets/diagrams/<slug>-architecture.svg`.
2. **Registration:** Register the slug-to-diagram mapping in the respective dynamic route:
   - Projects: `src/pages/projects/[...slug].astro` -> `diagramMap`
   - Research: `src/pages/research/[...slug].astro` -> `diagramMap`
   - Notes: `src/pages/notes/[...slug].astro` -> `diagramMap`
3. **Accessibility:**
   - All diagrams must be wrapped in `ArchitectureDiagram.astro`.
   - SVGs must provide descriptive `aria-label` attributes and `<title>` tags so assistive technologies can describe the flow.
   - SVGs must be styled for both light and dark themes using `currentColor` or CSS custom properties.

---

## 4. Code Blocks & Mathematical Typography

1. **Syntax Highlighting:**
   - Code blocks are highlighted at build time via Astro Shiki using dual themes: `github-light` and `github-dark-dimmed`.
   - Specify the exact language identifier (e.g., `go`, `cpp`, `typescript`, `z3`, `bash`, `json`).
   - Do not write simulated terminal scripts or ASCII progress bars.

2. **Mathematical Notation:**
   - Use clean Unicode symbols or LaTeX-style notation formatted in monospace or semantic HTML (`<math>` / `<code>`).

---

## 5. Verification Checklist for Content Authors

Before submitting or committing new content:

```bash
# 1. Validate Zod schemas and TypeScript types
npm run check

# 2. Verify static route generation and test assertions
npm test

# 3. Check for trailing whitespace
git diff --check
```
