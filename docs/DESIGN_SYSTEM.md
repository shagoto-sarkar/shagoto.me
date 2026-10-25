# Design System Specification — “Quiet Precision” (`docs/DESIGN_SYSTEM.md`)

> **Role:** Canonical reference for visual styling, tokens, typography, and responsive editorial layout in `shagoto.me`.
> **Source of Truth:** [`src/styles/global.css`](../src/styles/global.css)

---

## 1. Aesthetic Rationale & Tone

The design direction for `shagoto.me` is **Quiet Precision**: a contemporary research publication meets an exceptionally crafted software engineer's portfolio.

### The Five Principles
1. **Editorial:** Typeset like a respected intellectual journal—warm paper background, high-contrast ink, disciplined serif headings, clear reading line-lengths.
2. **Precise:** Clear mathematical alignments, hairline separators, 1px rules, no loose or floaty layouts.
3. **Warm:** Soft off-white paper (`#F8F7F3`) in light mode; deep slate-ink (`#11191D`) in dark mode. Never stark, glaring white or pure pitch black.
4. **Distinguished:** Subtle interactive deep ink-blue accent (`#234F65` light, `#98C9D7` dark), avoiding saturated product-marketing teals or generic blues.
5. **Understated:** Personality arises from typography, negative space, and authentic technical artifacts—never animated theatrics, blinking cursors, or faux-terminal gimmicks.

---

## 2. Semantic Color Tokens

All colors are exposed as CSS custom properties on `:root` and overridden in `@media (prefers-color-scheme: dark)`:

| Semantic Token | Light Mode Value | Dark Mode Value | Purpose & Placement |
| :--- | :--- | :--- | :--- |
| `--color-bg-base` | `#F8F7F3` | `#11191D` | Main page paper surface |
| `--color-bg-surface` | `#FFFFFF` | `#19242A` | Elevated cards, dialogs, modals |
| `--color-bg-subtle` | `#F0F1ED` | `#223038` | Soft hover states, chips, secondary surfaces |
| `--color-text-primary` | `#17242C` | `#F0F1EC` | Primary ink for headings and reading copy |
| `--color-text-secondary`| `#4B555C` | `#B5C0C4` | Supporting descriptions, secondary metadata |
| `--color-text-muted` | `#67737A` | `#A6B5BC` | Timestamps, kickers (WCAG AA compliant) |
| `--color-border` | `#DDE1DE` | `#334249` | Main structural boundaries & hairline rules |
| `--color-border-subtle` | `#E8EAE6` | `#29373D` | Soft dividers between rows |
| `--color-accent` | `#234F65` | `#98C9D7` | Links, focus rings, interactive ink-blue |
| `--color-accent-subtle` | `#E8F0F3` | `#203640` | Subtle active/selected indicator backgrounds |
| `--color-code-bg` | `#F0F2F1` | `#18262C` | Code block surfaces (matches dual Shiki) |

### Contrast & Accessibility (WCAG 2.2 AA)
- Primary text on base: 13.5:1 (Light), 14.8:1 (Dark) — exceeds AAA.
- Secondary text on base: 7.2:1 (Light), 8.3:1 (Dark) — exceeds AA.
- Interactive accent: 8.5:1 (Light), 7.8:1 (Dark) — exceeds AA.

---

## 3. Typography System

The website relies strictly on three disciplined font families:
- **Display & Editorial Prose:** *EB Garamond* (`400`, `400i`, `600`, `700`, `700i`).
- **User Interface & Descriptions:** System Sans (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Code & Technical Metadata:** *JetBrains Mono* (`400`, `500`, `700`).

### Responsive Typographic Scale

| Hierarchy | Desktop Size | Mobile Size | Line Height | Family |
| :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `clamp(3.6rem, 5.6vw, 5.2rem)` | `clamp(2.7rem, 8vw, 3.7rem)` | 1.05–1.10 | *EB Garamond* |
| **Archive H1** | `3.3rem`–`3.8rem` | `2.6rem`–`3.0rem` | 1.08–1.14 | *EB Garamond* |
| **Article H1** | `clamp(2.7rem, 4.1vw, 3.75rem)` | `2.25rem`–`2.7rem` | 1.10–1.15 | *EB Garamond* |
| **Section H2** | `2.1rem`–`2.55rem` | `1.8rem`–`2.15rem` | 1.18–1.22 | *EB Garamond* |
| **Featured Title** | `2.0rem`–`2.55rem` | `1.7rem`–`2.05rem` | 1.20–1.25 | *EB Garamond* |
| **Row / Card Title** | `1.55rem`–`1.85rem` | `1.4rem`–`1.65rem` | 1.25 | *EB Garamond* |
| **Article Prose** | `1.20rem`–`1.28rem` | `1.125rem`–`1.20rem`| 1.70–1.80 | *EB Garamond* |
| **UI Body Copy** | `1.00rem`–`1.06rem` | `1.0rem` | 1.60 | System Sans |
| **Metadata / Eyebrow**| `0.73rem`–`0.80rem` | `0.72rem`–`0.78rem` | 1.40 | *JetBrains Mono* |
| **Code Blocks** | `0.81rem`–`0.90rem` | `0.78rem`–`0.84rem` | 1.65 | *JetBrains Mono* |

---

## 4. Layout, Spacing & Container

- **Maximum Content Width:** `1160px`, centered.
- **Side Gutters:**
  - Desktop: `clamp(24px, 4vw, 56px)`
  - Tablet/Mobile: `20px`
  - Compact (<=360px): `16px`
- **Prose Reading Measure:** `min(100%, 70ch)` (approximately 720px max).
- **Major Section Gap:** `clamp(48px, 6vw, 88px)`.
- **Divider Treatment:** 1px hairline rules using `var(--color-border)` between sections.

---

## 5. Interaction & Motion Invariants

- **Standard Transitions:** `120ms`–`180ms` `ease-out` on color, background, and border.
- **No 3D Tilt, Parallax or Scale Animations:** Respects dignity and focus.
- **Focus Rings:** Strong, high-contrast `2px solid var(--color-accent)` with `3px` offset via `:focus-visible`.
- **Motion Reduction:** Full support for `prefers-reduced-motion: reduce` (instantly resets transition durations).
