# Production Deployment & Cloudflare Edge Guide (`docs/DEPLOYMENT.md`)

> **CRITICAL SAFETY DIRECTIVE:**
> This document is strictly an informational and architectural reference. The current engineering assignment **DOES NOT AUTHORIZE** running deployment commands, executing `git push`, triggering CI/CD pipelines, or altering Cloudflare credentials. All tasks are restricted to local verification.

---

## 1. Hosting Architecture & Topology

The production instance of `shagoto.me` is hosted on **Cloudflare Pages** and served globally via Anycast Edge CDN:

- **Apex Domain:** `https://shagoto.me` (Custom domain with Cloudflare SSL)
- **Subdomain:** `https://www.shagoto.me` (Redirected to apex)
- **Direct Edge Origin:** `https://shagoto-me.pages.dev`
- **Cloudflare Pages Project Name:** `shagoto-me`
- **Compilation Engine:** Static Astro 5.x (`output: 'static'`)

---

## 2. CI/CD Pipeline Workflow

Continuous deployment is defined in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

### Workflow Triggers
1. **Pull Requests (to `main`):**
   - Executes validation only: `npm ci`, `npm run check`, and `npm test`.
   - Never exposes Cloudflare credentials or attempts edge upload.
2. **Push to `main` (Automatic Production Deploy):**
   - Runs full verification suite (`npm test`).
   - If tests pass, invokes Wrangler to deploy the pre-built `dist/` directory directly to Cloudflare Pages.
3. **Manual Dispatch (`workflow_dispatch`):**
   - Allows explicit on-demand deployment from GitHub Actions UI when targeting `main`.

---

## 3. Required Environment Variables & Secrets

Deployment requires two repository configuration items in GitHub Actions:

| Identifier | Type | Required Permissions & Scope |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Secret | Cloudflare API Token with permissions: **Account → Cloudflare Pages → Edit**. Scoped exclusively to the account owning `shagoto-me`. |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | The 32-character hexadecimal Account ID that owns the production `shagoto-me` Pages project. |

> **Security Note:** Never commit API tokens, OAuth keys, or raw Account IDs into tracked Git files.

---

## 4. Edge Headers & Caching Strategy (`public/_headers`)

Cloudflare Pages applies caching and HTTP security headers defined in [`public/_headers`](../public/_headers):

1. **Immutable Asset Caching (1 Year):**
   - `/_astro/*` and `/fonts/*` are served with `Cache-Control: public, max-age=31536000, immutable`.
   - Astro fingerprints compiled CSS and JS chunks, guaranteeing safe long-term caching without stale cache issues.
2. **Security Headers (Global):**
   - `X-Content-Type-Options: nosniff` (Prevents MIME sniffing)
   - `X-Frame-Options: DENY` (Mitigates clickjacking attacks)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: interest-cohort=()` (Disables FLoC tracking)

---

## 5. Post-Deployment Verification & Edge Health Checks

When authorized in a separate operations window, production verification follows this protocol:

1. **HTTP Status & Identity Check:**
   ```bash
   curl -sI https://shagoto.me | grep -E "HTTP/|x-content-type-options"
   curl -sI https://shagoto-me.pages.dev | grep -E "HTTP/|x-content-type-options"
   ```
2. **DNS & SSL Resolution:**
   - Verify HTTPS certificate is active and issued by Google Trust Services / Cloudflare Managed CA.
3. **Sitemap and Robots Verification:**
   - Verify `https://shagoto.me/robots.txt` points to `https://shagoto.me/sitemap-index.xml`.
   - Verify `https://shagoto.me/sitemap-0.xml` loads correctly and lists all 17 public routes.

---

## 6. Known Account Discrepancies & Guardrails

- **Account Ambiguity Warning:** Previous setup inspections revealed multiple Cloudflare project namespaces (e.g., `shagoto-me` vs. `shagoto-me-86o`). Ensure the production repository only ever interacts with the verified production project `shagoto-me`.
- **No Automatic Rollback:** Cloudflare Pages retains deployment history in its dashboard. If a regression escapes CI, rollback must be initiated manually from the Cloudflare Pages deployment history interface by reverting to the previous green deployment.
