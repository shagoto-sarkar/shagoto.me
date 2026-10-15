# CLOUDFLARE PAGES DEPLOYMENT PLAYBOOK & CI/CD RUNBOOK
**System Target:** `https://shagoto.me` & `https://www.shagoto.me`  
**Hosting Architecture:** Cloudflare Pages (Astro 5 Static Edge + Global Anycast CDN)  
**GitHub Repository:** `https://github.com/shagoto-sarkar/shagoto.me`  
**Governing Standard:** Automated CI Verification & Guarded 1-Click Production Releases  

---

## 1. System Architecture & Topology

`shagoto.me` is the personal academic and systems engineering publication of Shagoto Sarkar, built on Astro 5 (`output: 'static'`) and deployed to Cloudflare's serverless Anycast edge network with zero client UI runtime dependencies.

```
                    ┌───────────────────────────────────────────┐
                    │  https://shagoto.me / https://www.shagoto.me
                    └─────────────────────┬─────────────────────┘
                                          │ (Cloudflare Anycast DNS / Edge SSL)
                                          ▼
                         ┌─────────────────────────────────┐
                         │ Cloudflare Pages Project        │
                         │ Name: "shagoto-me"              │
                         │ Origin: shagoto-me.pages.dev    │
                         └────────────────┬────────────────┘
                                          │
                                          ▼ (Zero Cold-Start Edge Distribution)
                         ┌─────────────────────────────────┐
                         │ dist/ (Compiled Static Output)  │
                         │ - index.html & editorial routes │
                         │ - _headers (Edge Caching/Sec)   │
                         │ - _astro/ (1-Yr Immutable)      │
                         │ - fonts/ (1-Yr Immutable WOFF2) │
                         │ - robots.txt & sitemaps         │
                         │ - CNAME & cv.pdf                │
                         └─────────────────────────────────┘
```

---

## 2. Infrastructure Identifiers & Production Bindings

| Resource | Value | Notes |
| :--- | :--- | :--- |
| **Production Apex Domain** | `https://shagoto.me` | Custom domain with Cloudflare Universal Edge SSL |
| **Production WWW Domain** | `https://www.shagoto.me` | Redirects / resolves to apex with SSL |
| **Pages Default Hostname** | `https://shagoto-me.pages.dev` | Cloudflare internal canonical origin |
| **Cloudflare Account ID** | `1e8d24858eeea95aeceb71b98246481d` | Account: `shagotosarkar@gmail.com` |
| **Pages Project Name** | `shagoto-me` | Production branch: `main` |
| **Framework Preset** | `None` / `Astro` | Static output directory: `./dist` |
| **Node.js Runtime** | `22` | Declared in `.node-version` |

---

## 3. GitHub Actions CI/CD Pipeline Specification

The workflow file is located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Strict Guardrail Philosophy
1. **Never auto-deploy on `git push`:** Pushing commits to `main` triggers automated Astro check and verification test suite execution (`npm run check && npm test`). It **never** touches production.
2. **1-Click Explicit Releases:** Deployments to production run **only** when manually approved via GitHub Actions UI (`workflow_dispatch`).
3. **Zero-Downtime Atomic Swaps:** Cloudflare Pages switches edge traffic instantly across 300+ global data centers with 0 ms cold starts.

### Required GitHub Secrets
Under `https://github.com/shagoto-sarkar/shagoto.me/settings/secrets/actions`:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `CLOUDFLARE_ACCOUNT_ID` | `1e8d24858eeea95aeceb71b98246481d` | Cloudflare Account ID |
| `CLOUDFLARE_API_TOKEN` | *(User's Cloudflare API Token)* | Must have `Workers & Pages: Edit` and `Pages: Edit` permissions |

---

## 4. Operational Runbook & Developer Commands

### 4.1 Local Development
```bash
# Start Astro local development server:
npm run dev
```
- Local URL: `http://localhost:4321`

### 4.2 Typecheck & Automated Test Suite
```bash
# Run strict TypeScript and Astro diagnostics:
npm run check

# Run production build + Astro check + full automated assertion test suite:
npm test
```

### 4.3 Direct Terminal Deployment (Authenticated Workstation)
```bash
# Build, verify, and deploy directly to Cloudflare Pages:
npm run deploy
```
*Or via Wrangler CLI explicitly:*
```bash
npx wrangler pages deploy dist --project-name=shagoto-me --branch=main
```

### 4.4 Custom Domain Mapping (Apex & WWW)

Because the `shagoto.me` DNS zone is managed in the same Cloudflare account (`1e8d24858eeea95aeceb71b98246481d`), attaching custom domains is done via the Cloudflare Dashboard with automated DNS record configuration:

1. In the **Cloudflare Dashboard**, navigate to **Compute (Workers & Pages)** > **shagoto-me** > **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `shagoto.me` and click **Continue** $\rightarrow$ **Activate domain**.
4. Click **Set up a custom domain** again, enter `www.shagoto.me`, and click **Activate domain**.
5. Cloudflare automatically handles the CNAME flattening / Anycast DNS routing and provisions Google Trust Services / Let's Encrypt Edge SSL certificates.

### 4.5 Inspecting Production Edge Traffic & Deployment History
```bash
# View list of all previous Pages deployments:
npx wrangler pages deployment list --project-name=shagoto-me

# Stream live production edge logs in real-time:
npx wrangler pages deployment tail --project-name=shagoto-me
```

---

## 5. How to Deploy Future Versions (Step-by-Step)

### Scenario A: Normal Editorial & Code Updates (Articles, Notes, Projects, UI)
1. Write and verify your changes locally:
   ```bash
   npm run dev
   ```
2. Run verification suite to guarantee 0 errors, 0 warnings, and all test assertions pass:
   ```bash
   npm test
   ```
3. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: updated research brief and notes"
   git push origin main
   ```
   *(GitHub Actions will run the verification workflow to ensure build stability without touching live site).*
4. **Trigger 1-Click Production Release:**
   - Go to: [GitHub Actions $\rightarrow$ Deploy shagoto.me](https://github.com/shagoto-sarkar/shagoto.me/actions/workflows/deploy.yml)
   - Click **Run workflow** $\rightarrow$ select branch `main` $\rightarrow$ click green **Run workflow**.
   - Your updates are propagated globally to all Cloudflare edge nodes in ~30 seconds.

---

### Scenario B: Direct Local Deployment (Emergency Hotfix or CLI)
If GitHub Actions is unavailable or you prefer deploying directly from your authenticated terminal:
```bash
# 1. Run full test suite:
npm test

# 2. Deploy dist directly to production:
npx wrangler pages deploy dist --project-name=shagoto-me --branch=main
```

---

### Scenario C: Instant Production Rollback
If a published release introduces unintended editorial or styling regressions:
1. In the **Cloudflare Dashboard**, navigate to **Workers & Pages** > **shagoto-me** > **Deployments**.
2. Locate the previous successful deployment.
3. Click the three dots icon (`...`) > **Rollback to this deployment**.
4. Cloudflare instantly rolls back edge traffic globally within seconds.

---

## 6. Troubleshooting & Common Pitfalls

| Issue | Root Cause | Resolution |
| :--- | :--- | :--- |
| **`In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN`** | Missing secret in GitHub repository settings. | Ensure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are configured in GitHub Repository Secrets. |
| **`Missing file: _headers` in `npm test`** | `public/_headers` was moved or deleted. | Ensure `public/_headers` exists so Astro copies it to `dist/_headers` during build. |
| **`Custom domain already in use`** | Apex or subdomain attached to another service (e.g. GitHub Pages). | Remove old GitHub Pages DNS records (`185.199.108.153`, etc.) in Cloudflare DNS and ensure CNAME points to `shagoto-me.pages.dev`. |
| **`Node.js version mismatch in Cloudflare build`** | Cloudflare Pages default build image defaulted to Node 18 or 20. | Verify `.node-version` in the root contains `22`. |
| **`Uncommitted changes / dist out of sync`** | Attempting deployment without fresh build. | Always run `npm test` before `npx wrangler pages deploy dist`. |

---

## 7. AI Agent Directive for Future Sessions

When instructing an AI assistant to deploy or maintain this repository, provide this reference prompt:

> *"Please inspect `shagoto.me_deployment.md` for this repository's architectural topology, Cloudflare Pages configuration, and guarded deployment runbook. Follow the exact commands and GitHub Actions workflow documented there."*
