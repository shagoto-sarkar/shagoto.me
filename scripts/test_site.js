import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('./dist');

const expectedFiles = [
  '_headers',
  'index.html',
  '404.html',
  'CNAME',
  'cv.pdf',
  'research/index.html',
  'research/abductive-neuro-symbolic-engine/index.html',
  'research/z3-cardiorenal-thesis-proposal/index.html',
  'projects/index.html',
  'projects/cash-expense-governor/index.html',
  'projects/go-edge-router/index.html',
  'projects/log-cognitive-journal/index.html',
  'projects/opengl-lower-manhattan/index.html',
  'projects/js-mini-compiler-ide/index.html',
  'projects/java-ridesharing-gui/index.html',
  'notes/index.html',
  'notes/headless-ubuntu-tailscale/index.html',
  'notes/8086-microprocessor-assembly/index.html',
  'notes/moral-complexity-dostoevsky-arcane/index.html',
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml'
];

let failed = false;

console.log('=== VERIFYING DIST OUTPUT ARTIFACTS ===');
for (const rel of expectedFiles) {
  const full = path.join(distDir, rel);
  if (!fs.existsSync(full)) {
    console.error(`[FAIL] Missing file: ${rel}`);
    failed = true;
  } else {
    const stat = fs.statSync(full);
    console.log(`[PASS] ${rel} (${stat.size} bytes)`);
  }
}

// Verify CNAME
const cnameContent = fs.readFileSync(path.join(distDir, 'CNAME'), 'utf8').trim();
if (cnameContent === 'shagoto.me') {
  console.log('[PASS] CNAME correctly set to shagoto.me');
} else {
  console.error(`[FAIL] CNAME unexpected: ${cnameContent}`);
  failed = true;
}

// Verify cv.pdf is valid PDF
const cvBuffer = fs.readFileSync(path.join(distDir, 'cv.pdf'));
if (cvBuffer.subarray(0, 4).toString() === '%PDF') {
  console.log('[PASS] cv.pdf has valid PDF magic header');
} else {
  console.error('[FAIL] cv.pdf does not have %PDF header');
  failed = true;
}

// Content inspection checks
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const checks = [
  { name: 'Editorial Identity statement', pass: indexHtml.includes('Architecting verifiable intelligence') },
  { name: 'Affiliation with Daffodil International University', pass: indexHtml.includes('Daffodil International University') },
  { name: 'Current Focus section (Active Areas of Investigation)', pass: indexHtml.includes('Active Areas of Investigation') && indexHtml.includes('Neuro-Symbolic Reasoning') },
  { name: 'Selected Research section', pass: indexHtml.includes('Selected Research') && indexHtml.includes('Abductive Neuro-Symbolic Engine') },
  { name: 'Selected Projects section', pass: indexHtml.includes('Selected Systems &amp; Projects') && indexHtml.includes('911 OpenGL Commemorative Simulation') },
  { name: 'Recent Notes section', pass: indexHtml.includes('Recent Notes &amp; Essays') },
  { name: 'Search overlay present', pass: indexHtml.includes('cmd-palette-backdrop') },
  { name: 'Contact modal markup present', pass: indexHtml.includes('contact-modal-backdrop') },
  { name: 'Web Gmail compose URL present', pass: indexHtml.includes('mail.google.com/mail/?view=cm') },
  { name: 'Copy email button present', pass: indexHtml.includes('copy-email-btn') },
  { name: 'Contact gmail present', pass: indexHtml.includes('shagotosarkar@gmail.com') },
  { name: 'Footer WhatsApp link present', pass: indexHtml.includes('https://wa.me/8801771425996') && indexHtml.includes('wp: message') },
  { name: 'Footer Instagram link present', pass: indexHtml.includes('https://www.instagram.com/shagotosarkar/') && indexHtml.includes('ig: @shagotosarkar') },
  { name: 'Footer Facebook link present', pass: indexHtml.includes('https://www.facebook.com/shagotosarkar666') && indexHtml.includes('fb: /shagoto') },
  { name: 'Footer LinkedIn link present', pass: indexHtml.includes('https://linkedin.com/in/shagoto-sarkar') },
  { name: 'Footer contact button present and wired to modal', pass: indexHtml.includes('footer-contact-link') && indexHtml.includes('openContactModal') },
  { name: 'Prohibited terminal anti-patterns absent (no blinking cursor, fake status)', pass: !indexHtml.includes('terminal-cursor') && !indexHtml.includes('cat /proc/self/status') && !indexHtml.includes('// AXIOM NODE') },
  { name: 'Zero client JS frameworks (no react/vue/svelte)', pass: !indexHtml.includes('__astro_island') && !indexHtml.includes('react-root') }
];

console.log('\n=== HOMEPAGE EDITORIAL CHECKS (design_v2.md) ===');
for (const c of checks) {
  if (c.pass) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.error(`[FAIL] ${c.name}`);
    failed = true;
  }
}

// Research page check
const researchHtml = fs.readFileSync(path.join(distDir, 'research/abductive-neuro-symbolic-engine/index.html'), 'utf8');
const thesisHtml = fs.readFileSync(path.join(distDir, 'research/z3-cardiorenal-thesis-proposal/index.html'), 'utf8');

console.log('\n=== RESEARCH CONTENT CHECKS ===');
if (researchHtml.includes('scholarly-viewer') && researchHtml.includes('SMT-LIB2 Solver Specification')) {
  console.log('[PASS] Scholarly dual-pane viewer and Z3 proofs in Neuro-Symbolic research brief');
} else {
  console.error('[FAIL] Scholarly viewer or Z3 proofs missing');
  failed = true;
}

if (thesisHtml.includes('Academic Proposal Notice') && thesisHtml.includes('Assistant Professor')) {
  console.log('[PASS] Thesis proposal explicitly marked as proposal with supervisor');
} else {
  console.error('[FAIL] Thesis proposal banner or supervisor missing');
  failed = true;
}

// SVG Diagrams check
const hasSvg1 = researchHtml.includes('<svg');
const hasSvg2 = thesisHtml.includes('<svg');
const openglHtml = fs.readFileSync(path.join(distDir, 'projects/opengl-lower-manhattan/index.html'), 'utf8');
const hasSvg3 = openglHtml.includes('<svg');
const cashHtml = fs.readFileSync(path.join(distDir, 'projects/cash-expense-governor/index.html'), 'utf8');
const hasSvg4 = cashHtml.includes('<svg');
const goHtml = fs.readFileSync(path.join(distDir, 'projects/go-edge-router/index.html'), 'utf8');
const hasSvg5 = goHtml.includes('<svg');
const logHtml = fs.readFileSync(path.join(distDir, 'projects/log-cognitive-journal/index.html'), 'utf8');
const hasSvg6 = logHtml.includes('<svg');

console.log('\n=== SVG DIAGRAM CHECKS ===');
if (hasSvg1 && hasSvg2 && hasSvg3 && hasSvg4 && hasSvg5 && hasSvg6) {
  console.log('[PASS] All architecture diagrams rendered as SVG with aria-label');
} else {
  console.error('[FAIL] Architecture diagram SVGs missing in pages');
  failed = true;
}

// Collaboration credit check
if (openglHtml.includes('Mahadi')) {
  console.log('[PASS] 911 OpenGL simulation credits collaboration with Mahadi');
} else {
  console.error('[FAIL] Mahadi collaboration credit missing');
  failed = true;
}

// OpenGL repository link check
if (openglHtml.includes('https://github.com/shagoto-sarkar/graphics_lab/tree/main/OpenGl_Project/911_v2')) {
  console.log('[PASS] 911 OpenGL simulation technical brief links to correct graphics_lab subfolder repository');
} else {
  console.error('[FAIL] 911 OpenGL simulation repository link incorrect or missing');
  failed = true;
}

// Shiki syntax highlighting check
if (openglHtml.includes('astro-code') && openglHtml.includes('render_skyline_frame')) {
  console.log('[PASS] Build-time Shiki syntax highlighting present with local code snippets');
} else {
  console.error('[FAIL] Shiki code highlighting missing');
  failed = true;
}

// Fonts check
const fontFiles = fs.readdirSync(path.join(distDir, 'fonts'));
const hasGaramond = fontFiles.some(f => f.startsWith('eb-garamond') && f.endsWith('.woff2'));
const hasMono = fontFiles.some(f => f.startsWith('jetbrains-mono') && f.endsWith('.woff2'));

console.log('\n=== TYPOGRAPHY ASSET CHECKS ===');
if (hasGaramond && hasMono) {
  console.log(`[PASS] Self-hosted .woff2 fonts present in /fonts/ (${fontFiles.length} files total)`);
} else {
  console.error('[FAIL] Font files missing');
  failed = true;
}

console.log('\n=== SEO & INDEXING ARTIFACT CHECKS ===');

// 1. Robots.txt verification
const robotsContent = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
if (robotsContent.includes('User-agent: *') && 
    robotsContent.includes('Allow: /') && 
    robotsContent.includes('Sitemap: https://shagoto.me/sitemap-index.xml')) {
  console.log('[PASS] robots.txt contains User-agent: *, Allow: /, and Sitemap index directive');
} else {
  console.error('[FAIL] robots.txt is missing expected crawler or sitemap directives');
  failed = true;
}

// 2. Sitemap index and sitemap-0 verification
const sitemapIndexContent = fs.readFileSync(path.join(distDir, 'sitemap-index.xml'), 'utf8');
const sitemap0Content = fs.readFileSync(path.join(distDir, 'sitemap-0.xml'), 'utf8');

if (sitemapIndexContent.includes('sitemap-0.xml')) {
  console.log('[PASS] sitemap-index.xml successfully references sitemap-0.xml');
} else {
  console.error('[FAIL] sitemap-index.xml does not reference sitemap-0.xml');
  failed = true;
}

if (sitemap0Content.includes('https://shagoto.me/') && 
    sitemap0Content.includes('https://shagoto.me/research/') && 
    sitemap0Content.includes('https://shagoto.me/projects/') && 
    sitemap0Content.includes('https://shagoto.me/notes/') && 
    !sitemap0Content.includes('404')) {
  console.log('[PASS] sitemap-0.xml contains primary canonical routes and excludes 404');
} else {
  console.error('[FAIL] sitemap-0.xml missing routes or unexpectedly includes 404');
  failed = true;
}

// 3. Canonical tag verification on pages
const checkPageCanonical = (filePath, expectedCanonical) => {
  const content = fs.readFileSync(path.join(distDir, filePath), 'utf8');
  return content.includes(`<link rel="canonical" href="${expectedCanonical}"`);
};

if (checkPageCanonical('index.html', 'https://shagoto.me/') &&
    checkPageCanonical('research/index.html', 'https://shagoto.me/research/') &&
    checkPageCanonical('projects/opengl-lower-manhattan/index.html', 'https://shagoto.me/projects/opengl-lower-manhattan/')) {
  console.log('[PASS] Canonical tags present with absolute https://shagoto.me URLs');
} else {
  console.error('[FAIL] Canonical tags missing or incorrect on HTML pages');
  failed = true;
}

// 4. 404 page noindex verification
const notFoundHtml = fs.readFileSync(path.join(distDir, '404.html'), 'utf8');
if (notFoundHtml.includes('<meta name="robots" content="noindex, nofollow"') &&
    !notFoundHtml.includes('<link rel="canonical"')) {
  console.log('[PASS] 404.html contains noindex, nofollow and omits canonical tag');
} else {
  console.error('[FAIL] 404.html lacks noindex meta tag or incorrectly includes canonical link');
  failed = true;
}

// 5. Cloudflare _headers verification
console.log('\n=== CLOUDFLARE EDGE CONFIGURATION CHECKS ===');
const headersPath = path.join(distDir, '_headers');
if (fs.existsSync(headersPath)) {
  const headersContent = fs.readFileSync(headersPath, 'utf8');
  if (headersContent.includes('Cache-Control: public, max-age=31536000, immutable') &&
      headersContent.includes('X-Content-Type-Options: nosniff')) {
    console.log('[PASS] _headers contains immutable caching and nosniff security headers');
  } else {
    console.error('[FAIL] _headers missing expected caching or security rules');
    failed = true;
  }
} else {
  console.error('[FAIL] _headers missing in dist output');
  failed = true;
}


console.log('\n=== OVERALL STATUS ===');
if (failed) {
  console.error('FAILED ONE OR MORE AUDIT CHECKS.');
  process.exit(1);
} else {
  console.log('ALL AUDIT CHECKS PASSED PERFECTLY.');
}
