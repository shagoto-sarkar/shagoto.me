// Read-only deployment safeguards. Never print credentials or raw API responses.
import { appendFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const project = 'shagoto-me';
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const sha = process.env.GITHUB_SHA;
const mode = process.argv[2];

async function api(path) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/${project}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(30_000),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(`Cloudflare API request failed (HTTP ${response.status}). Check the account ID and token's Cloudflare Pages Edit access to this account.`);
  }
  return data.result;
}

async function preflight() {
  const config = await api('');
  if (config.name !== project || config.production_branch !== 'main') {
    throw new Error('Expected existing Pages project shagoto-me with production branch main. Review its settings before deploying.');
  }
  if (config.subdomain !== 'shagoto-me.pages.dev' || !config.domains?.includes('shagoto.me')) {
    throw new Error('This is not the existing production project: expected shagoto-me.pages.dev and custom domain shagoto.me. Check the account ID; do not deploy to a similarly named project.');
  }
  if (config.source) {
    const source = config.source.config;
    if (!source || source.production_deployments_enabled !== false || source.preview_deployment_setting !== 'none') {
      throw new Error('Native Pages Git builds may be enabled. Disable automatic production and preview builds for shagoto-me before using Actions; preserve the project and custom domains.');
    }
  }
  console.log('Cloudflare project, credentials, production branch, and single deployment path verified.');
}

async function smoke(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000), cache: 'no-store' });
  if (!response.ok || !(await response.text()).includes('Architecting verifiable intelligence')) {
    throw new Error(`Homepage smoke check failed for ${url}`);
  }
  if (response.headers.get('x-content-type-options') !== 'nosniff') {
    throw new Error(`Expected nosniff security header missing at ${url}`);
  }
}

async function verify() {
  if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('GITHUB_SHA must identify the deployed commit.');
  let deployment;
  for (let attempt = 0; attempt < 12; attempt++) {
    const deployments = await api('/deployments?env=production&per_page=25');
    deployment = deployments.find(item => item.deployment_trigger?.metadata?.commit_hash === sha && item.latest_stage?.status === 'success');
    if (deployment) break;
    await delay(5_000);
  }
  if (!deployment) throw new Error('No successful production deployment found for this commit.');
  const url = new URL(deployment.url);
  if (url.protocol !== 'https:' || !url.hostname.endsWith(`.${project}.pages.dev`)) {
    throw new Error('Unexpected Cloudflare deployment URL.');
  }
  let lastError;
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      await smoke(url.href);
      await smoke('https://shagoto-me.pages.dev/');
      await smoke('https://shagoto.me/');
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      await delay(5_000);
    }
  }
  if (lastError) throw lastError;
  console.log('Production commit, deployment URL, Pages origin, custom domain, and security header verified.');
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `Deployed commit \`${sha}\` to [Cloudflare Pages](${url.href}). Production homepage and security header checks passed at https://shagoto.me/.\n`);
  }
}

try {
  if (!token) throw new Error('Missing GitHub Actions secret CLOUDFLARE_API_TOKEN.');
  if (!/^[a-f0-9]{32}$/.test(account ?? '')) throw new Error('Set CLOUDFLARE_ACCOUNT_ID as an Actions variable (or existing secret) to the verified project account ID.');
  if (mode === 'preflight') await preflight();
  else if (mode === 'verify') await verify();
  else throw new Error('Usage: node scripts/cloudflare_ci.mjs preflight|verify');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
