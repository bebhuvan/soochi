import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const serifFontBase64 = fs.readFileSync(
  'node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2'
).toString('base64')

const serifItalicBase64 = fs.readFileSync(
  'node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2'
).toString('base64')

const sansFontBase64 = fs.readFileSync(
  'node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2'
).toString('base64')

const KINDS = [
  { key: 'organisation', name: 'Organisations', color: '#407ac4', note: 'Bodies doing public-interest civic work, research, advocacy, and service delivery.' },
  { key: 'dataset', name: 'Data Sources', color: '#dc744e', note: 'Open statistical services, public data portals, and downloadable datasets.' },
  { key: 'directory', name: 'Directories', color: '#49aa80', note: 'Curated specialized guides pointing deeper into specific civic domains.' },
  { key: 'tool', name: 'Tools & Software', color: '#e2a649', note: 'Open source tools and civic software you can run without commercial lock-in.' },
  { key: 'publication', name: 'Publications', color: '#dc85a4', note: 'Independent research, investigative journalism, and evidence-based reports.' },
  { key: 'dashboard', name: 'Dashboards', color: '#2e7f2a', note: 'Live indicators, monitors, and public tracking dashboards.' },
  { key: 'archive', name: 'Archives', color: '#4a4296', note: 'Preserved public records and digital repositories saved from link rot.' },
  { key: 'community', name: 'Communities', color: '#d35b56', note: 'Practitioner groups, civic meetups, and open forums you can actively join.' },
]

// Count entries per kind
const entriesDir = './src/content/entries'
const counts = {}
for (const k of KINDS) counts[k.key] = 0

if (fs.existsSync(entriesDir)) {
  for (const file of fs.readdirSync(entriesDir)) {
    if (!file.endsWith('.md')) continue
    const txt = fs.readFileSync(path.join(entriesDir, file), 'utf-8')
    const m = txt.match(/^kind:\s*['"]?([a-z-]+)/m)
    if (m && counts[m[1]] !== undefined) counts[m[1]]++
  }
}

const tmpHtmlPath = '/tmp/soochi-kind-og.html'

for (const k of KINDS) {
  const count = counts[k.key] || 0
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 200 900;
  src: url('data:font/woff2;base64,${serifFontBase64}') format('woff2');
}
@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 200 900;
  src: url('data:font/woff2;base64,${serifItalicBase64}') format('woff2');
}
@font-face {
  font-family: 'Public Sans';
  font-style: normal;
  font-weight: 100 900;
  src: url('data:font/woff2;base64,${sansFontBase64}') format('woff2');
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  width: 1200px;
  height: 630px;
  overflow: hidden;
  background-color: #faf9f6;
  font-family: 'Public Sans', system-ui, sans-serif;
  color: #12131a;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 68px 88px 60px;
}

/* Architectural Grid Background */
.grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.035) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: -1px -1px;
}

/* Organic Ambient Radiance tuned to this kind's OKLab hue */
.ambient-glow {
  position: absolute;
  top: -100px;
  right: -60px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at 60% 40%, ${k.color}22 0%, ${k.color}11 40%, transparent 75%);
  filter: blur(50px);
  pointer-events: none;
}

.ambient-glow-bottom {
  position: absolute;
  bottom: -140px;
  left: 180px;
  width: 500px;
  height: 440px;
  background: radial-gradient(circle, ${k.color}14 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}

/* Glassmorphic Corner Rule Accents */
.corner-cross {
  position: absolute;
  font-family: monospace;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.22);
  line-height: 1;
}
.cross-tl { top: 38px; left: 42px; }
.cross-tr { top: 38px; right: 42px; }
.cross-bl { bottom: 38px; left: 42px; }
.cross-br { bottom: 38px; right: 42px; }

/* Header */
.header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wordmark-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mark-svg {
  width: 28px;
  height: 28px;
}

.mark-title {
  font-family: 'Public Sans', sans-serif;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #12131a;
}

.kicker-divider {
  width: 1px;
  height: 18px;
  background: rgba(0, 0, 0, 0.16);
  margin-inline: 4px;
}

.kicker-subtitle {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #686976;
}

.kind-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 650;
  color: #1c1d24;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.kind-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${k.color};
}

/* Main Content */
.hero {
  position: relative;
  z-index: 2;
  max-width: 1040px;
}

.eyebrow {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${k.color};
  margin-bottom: 14px;
}

.headline {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 70px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.028em;
  color: #111218;
}

.note {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 26px;
  line-height: 1.45;
  color: #484a56;
  margin-top: 20px;
  max-width: 860px;
}

/* Footer */
.footer {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.strip {
  display: flex;
  gap: 6px;
  height: 6px;
  width: 100%;
}

.strip-seg {
  flex: 1;
  height: 100%;
  border-radius: 3px;
  opacity: 0.4;
}

.strip-seg.active {
  opacity: 1;
  height: 8px;
  margin-top: -1px;
}

.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #686976;
  font-weight: 550;
}

.meta-tally {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #12131a;
}
</style>
</head>
<body>
<div class="grid-bg"></div>
<div class="ambient-glow"></div>
<div class="ambient-glow-bottom"></div>

<div class="corner-cross cross-tl">+</div>
<div class="corner-cross cross-tr">+</div>
<div class="corner-cross cross-bl">+</div>
<div class="corner-cross cross-br">+</div>

<header class="header">
  <div class="wordmark-wrap">
    <svg class="mark-svg" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="7" width="24" height="4" rx="2" fill="#1c5cab" />
      <rect x="1" y="14" width="16" height="4" rx="2" fill="#1c5cab" />
      <rect x="1" y="21" width="9" height="4" rx="2" fill="#1c5cab" />
    </svg>
    <span class="mark-title">Soochi</span>
    <span class="kicker-divider"></span>
    <span class="kicker-subtitle">Public-Interest Index</span>
  </div>

  <div class="kind-badge">
    <span class="kind-dot"></span>
    <span>soochi.fyi/kinds/${k.key}</span>
  </div>
</header>

<main class="hero">
  <p class="eyebrow">Directory Category</p>
  <h1 class="headline">${k.name}</h1>
  <p class="note">${k.note}</p>
</main>

<footer class="footer">
  <div class="strip">
    <div class="strip-seg ${k.key === 'organisation' ? 'active' : ''}" style="background: #407ac4;"></div>
    <div class="strip-seg ${k.key === 'dataset' ? 'active' : ''}" style="background: #dc744e;"></div>
    <div class="strip-seg ${k.key === 'directory' ? 'active' : ''}" style="background: #49aa80;"></div>
    <div class="strip-seg ${k.key === 'tool' ? 'active' : ''}" style="background: #e2a649;"></div>
    <div class="strip-seg ${k.key === 'publication' ? 'active' : ''}" style="background: #dc85a4;"></div>
    <div class="strip-seg ${k.key === 'dashboard' ? 'active' : ''}" style="background: #2e7f2a;"></div>
    <div class="strip-seg ${k.key === 'archive' ? 'active' : ''}" style="background: #4a4296;"></div>
    <div class="strip-seg ${k.key === 'community' ? 'active' : ''}" style="background: #d35b56;"></div>
  </div>

  <div class="legend-row">
    <span>Free, open, public-interest directory under CC BY 4.0</span>
    <span class="meta-tally">${count} verified ${k.name.toLowerCase()} listed</span>
  </div>
</footer>
</body>
</html>`

  fs.writeFileSync(tmpHtmlPath, html)
  const outPath = `public/og/kind-${k.key}.png`
  console.log(`Rendering OG image for ${k.name} -> ${outPath}`)
  execSync(
    `google-chrome --headless=new --disable-gpu --window-size=1200,630 --screenshot="${outPath}" "file://${tmpHtmlPath}"`
  )
}

console.log('All 8 kind OG images successfully created in public/og/')
