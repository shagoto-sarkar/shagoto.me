# shagoto.me

Personal academic & systems engineering publication of Shagoto Sarkar.

## Architecture

- **Core Framework:** [Astro 5](https://astro.build/) (`output: 'static'`)
- **Language:** TypeScript (Strict mode)
- **Styling:** Vanilla CSS (`AXIOM Design System v2`), zero client-side UI frameworks
- **Diagrams & Highlighting:** Build-time Shiki syntax highlighting & SVG architecture diagrams
- **Deployment & Edge Platform:** Cloudflare Pages / Static Edge (`wrangler.jsonc`, `public/_headers`)

## Local Development

Ensure Node.js 22 is installed.

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run diagnostics and type checking
npm run check

# Execute production build and verification test suite
npm test
```

## Cloudflare Pages Deployment Configuration

When deploying through the Cloudflare Dashboard or Git integration, configure:

- **Framework preset:** None (or Astro)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js version:** `22` (automatically detected via `.node-version`)

Alternatively, deploy directly via Wrangler CLI:

```bash
npx wrangler pages deploy dist
```