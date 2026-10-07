// Snapshots the fully-rendered React app into index.html's #root, so crawlers and
// tools that don't execute JavaScript still see real content (title, text, links).
// The shipped bundle still boots normally on top of it for real visitors — React's
// createRoot() replaces this static markup with the live app on mount, same as today.
//
// This is a CommonJS (.cjs) file on purpose: the project's package.json has
// "type": "module", and this script needs `require('playwright')`.
//
// Playwright is NOT a project dependency (kept out on purpose, so it never slows
// down `npm install` on Vercel's build). Run this manually, via a Node that has
// Playwright available (e.g. Claude Code's playwright skill), whenever page content
// changes meaningfully:
//   1. npm run build
//   2. npm run preview -- --port 4173   (in another terminal)
//   3. node scripts/prerender.cjs
//   4. npm run build   (picks up the updated index.html)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PREVIEW_URL = process.env.PRERENDER_URL || 'http://127.0.0.1:4173';
const indexPath = process.env.PRERENDER_INDEX_PATH || path.resolve(__dirname, '../index.html');

(async () => {
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {});
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const rootHtml = await page.locator('#root').evaluate((root) => {
    const snapshot = root.cloneNode(true);
    snapshot.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
    snapshot.querySelectorAll('.plate-on, .cutting, .hero-offscreen').forEach((element) => element.classList.remove('plate-on', 'cutting', 'hero-offscreen'));
    return snapshot.innerHTML;
  });
  await browser.close();

  const source = fs.readFileSync(indexPath, 'utf8');

  // Anchored on two fixed, unique markers (not a regex over the div's own content,
  // which is unsafe here since the rendered markup is full of nested </div> tags).
  const ROOT_OPEN = '<div id="root">';
  const SCRIPT_MARKER = '<script type="module" src="/src/main.jsx">';
  const rootStart = source.indexOf(ROOT_OPEN);
  const scriptStart = source.indexOf(SCRIPT_MARKER);
  if (rootStart === -1 || scriptStart === -1 || scriptStart < rootStart) {
    throw new Error('Prerender: could not locate the #root div and main.jsx script tag in index.html');
  }

  const updated = `${source.slice(0, rootStart)}${ROOT_OPEN}${rootHtml}</div>\n    ${source.slice(scriptStart)}`;
  fs.writeFileSync(indexPath, updated);
  // Keep the structured data allowed by the deployed Content Security Policy.
  const jsonLd = updated.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const configPath = path.join(path.dirname(indexPath), 'vercel.json');
  if (jsonLd && fs.existsSync(configPath)) {
    const hash = crypto.createHash('sha256').update(jsonLd[1]).digest('base64');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    for (const rule of config.headers ?? []) {
      for (const header of rule.headers ?? []) {
        if (header.key.toLowerCase() === 'content-security-policy') {
          header.value = header.value.replace(/script-src [^;]+/, `script-src 'self' 'sha256-${hash}'`);
        }
      }
    }
    fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  }
  console.log(`Prerendered ${rootHtml.length} chars of markup into index.html`);
})();
