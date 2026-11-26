// shots.mjs — mengambil screenshot situs ASLI yang jalan di headless
// Chromium (Playwright + browser cache mesin ini), sekaligus mencatat
// console error dan request jaringan. Bukan bagian entry (dev-only).
//   node shots.mjs
// Menulis screenshots/1-dashboard.jpg .. 4-dashboard-phone.jpg (JPEG
// kualitas 82, sisi panjang 1280 / 844).

import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 8091;
const BASE = `http://127.0.0.1:${PORT}`;

const SHOTS = [
  { file: '1-dashboard.jpg', path: '#/', width: 1280, height: 800 },
  { file: '2-kalkulator.jpg', path: '#/kalkulator', width: 1280, height: 800 },
  { file: '3-belanja.jpg', path: '#/belanja', width: 1280, height: 800 },
  { file: '4-dashboard-phone.jpg', path: '#/', width: 390, height: 844 },
];

const server = spawn('node', ['serve.ts', `--port=${PORT}`], { cwd: here, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));

mkdirSync(join(here, 'screenshots'), { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
  args: ['--no-sandbox'],
});

let totalErrors = 0;
let totalExternal = 0;
for (const shot of SHOTS) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  const errors = [];
  const external = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith(BASE)) external.push(url);
  });
  await page.goto(BASE + '/' + shot.path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(here, 'screenshots', shot.file), type: 'jpeg', quality: 82 });
  console.log(`${shot.file}: ${shot.width}x${shot.height} consoleErrors=${errors.length} externalRequests=${external.length}`);
  if (errors.length) console.log('  errors:', errors.join(' | '));
  if (external.length) console.log('  external:', external.join(' | '));
  totalErrors += errors.length;
  totalExternal += external.length;
  await page.close();
}

await browser.close();
server.kill();
console.log(`TOTAL consoleErrors=${totalErrors} externalRequests=${totalExternal}`);
process.exit(totalErrors || totalExternal ? 1 : 0);
