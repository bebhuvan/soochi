import fs from 'node:fs'
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

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

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
  padding: 72px 88px 64px;
}

/* Subtle Architectural Grid Background */
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

/* Organic Ambient Radiance / Modern Digital Art Glow */
.ambient-glow {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 640px;
  height: 640px;
  background: radial-gradient(circle at 60% 40%, rgba(220, 116, 78, 0.09) 0%, rgba(73, 170, 128, 0.07) 35%, rgba(64, 122, 196, 0.04) 60%, transparent 75%);
  filter: blur(50px);
  pointer-events: none;
}

.ambient-glow-bottom {
  position: absolute;
  bottom: -160px;
  left: 200px;
  width: 520px;
  height: 480px;
  background: radial-gradient(circle, rgba(74, 66, 150, 0.05) 0%, rgba(226, 166, 73, 0.04) 45%, transparent 70%);
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

.domain-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: #2b2c36;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.domain-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #dc744e;
}

/* Main Headline Section */
.hero {
  position: relative;
  z-index: 2;
  margin-top: 6px;
  max-width: 1040px;
}

.headline {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 68px;
  font-weight: 560;
  line-height: 1.14;
  letter-spacing: -0.028em;
  color: #111218;
  text-wrap: balance;
}

.headline em {
  font-style: italic;
  font-weight: 480;
  color: #2e303d;
}

/* Bottom Strip & Metadata */
.footer {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* The 8-color composition strip */
.strip {
  display: flex;
  gap: 8px;
  height: 6px;
  width: 100%;
}

.strip-seg {
  flex: 1;
  height: 100%;
  border-radius: 3px;
}

.seg-org { background: #407ac4; }
.seg-data { background: #dc744e; }
.seg-dir { background: #49aa80; }
.seg-tool { background: #e2a649; }
.seg-pub { background: #dc85a4; }
.seg-dash { background: #2e7f2a; }
.seg-arch { background: #4a4296; }
.seg-comm { background: #d35b56; }

/* Micro-legend chips */
.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  color: #555765;
}

.kinds-list {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
}

.kind-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.kind-dot {
  width: 6.5px;
  height: 6.5px;
  border-radius: 50%;
  display: inline-block;
}

.tally {
  font-weight: 600;
  color: #1c1d24;
  letter-spacing: 0.02em;
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
    <svg class="mark-svg" viewBox="0 0 32 32" fill="none">
      <rect x="1" y="6" width="25" height="4.5" rx="2.25" fill="#12131a" />
      <rect x="1" y="14" width="17" height="4.5" rx="2.25" fill="#12131a" />
      <rect x="1" y="22" width="10" height="4.5" rx="2.25" fill="#12131a" />
    </svg>
    <span class="mark-title">Soochi</span>
    <div class="kicker-divider"></div>
    <span class="kicker-subtitle">The Civic Index</span>
  </div>
  <div class="domain-badge">
    <span class="domain-dot"></span>
    <span>soochi.fyi</span>
  </div>
</header>

<main class="hero">
  <h1 class="headline">
    The data, tools, organisations and research behind <em>public-interest work.</em>
  </h1>
</main>

<footer class="footer">
  <div class="strip">
    <div class="strip-seg seg-org"></div>
    <div class="strip-seg seg-data"></div>
    <div class="strip-seg seg-dir"></div>
    <div class="strip-seg seg-tool"></div>
    <div class="strip-seg seg-pub"></div>
    <div class="strip-seg seg-dash"></div>
    <div class="strip-seg seg-arch"></div>
    <div class="strip-seg seg-comm"></div>
  </div>

  <div class="legend-row">
    <div class="kinds-list">
      <span class="kind-item"><span class="kind-dot" style="background: #407ac4;"></span>Organisations</span>
      <span class="kind-item"><span class="kind-dot" style="background: #dc744e;"></span>Data sources</span>
      <span class="kind-item"><span class="kind-dot" style="background: #49aa80;"></span>Directories</span>
      <span class="kind-item"><span class="kind-dot" style="background: #e2a649;"></span>Tools</span>
      <span class="kind-item"><span class="kind-dot" style="background: #dc85a4;"></span>Publications</span>
      <span class="kind-item"><span class="kind-dot" style="background: #2e7f2a;"></span>Dashboards</span>
      <span class="kind-item"><span class="kind-dot" style="background: #4a4296;"></span>Archives</span>
      <span class="kind-item"><span class="kind-dot" style="background: #d35b56;"></span>Communities</span>
    </div>
    <div class="tally">
      480+ entries across 8 kinds
    </div>
  </div>
</footer>
</body>
</html>`

const htmlPath = '/home/bhuvanesh.r/.gemini/antigravity-cli/brain/23704abd-6543-4187-b06a-030e7ad53425/scratch/og-template.html'
fs.writeFileSync(htmlPath, html)

const outPath = 'public/og.png'
console.log('Rendering OG image via Google Chrome...')
execSync(
  `google-chrome --headless=new --disable-gpu --window-size=1200,630 --screenshot="${outPath}" "file://${htmlPath}"`
)
console.log('OG image successfully generated at', outPath)
