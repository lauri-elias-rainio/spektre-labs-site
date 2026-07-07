/**
 * THE FOUNDRY — the machine that builds the hero.
 *
 * Meta-paradigm: the loop this project ran by hand all day (tune → render →
 * measure → keep the better one) architected as an autonomous search machine.
 * Art direction is a coordinate in a parameter space; the frontier gate is
 * the fitness function; the champion is promoted only when beaten — the
 * ratchet discipline. Nothing counts but the verified delta.
 *
 * Usage:  node scripts/foundry.mjs [generations=16]
 * Needs:  next server on :3111, Brave, frontier_gate.py.
 * Output: scripts/foundry_ledger.jsonl (append-only) + champion AD printed.
 */

import { chromium } from '/Users/eliaslorenzo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, existsSync } from 'node:fs';

const GENS = Number(process.argv[2] ?? 16);
const LEDGER = 'scripts/foundry_ledger.jsonl';
const BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

/* the search space — each axis: [min, max, sigma-as-fraction-of-range] */
const SPACE = {
  camY: [5.5, 11.0, 0.18],
  camZ: [52, 84, 0.18],
  lookUp: [0.20, 0.30, 0.18],
  fogT: [0.028, 0.062, 0.2],
  beamK: [500, 1100, 0.2],
  seaAmp: [0.85, 1.35, 0.15],
  foamK: [0.7, 1.5, 0.2],
  seaBody: [0.010, 0.034, 0.25],
  sssK: [0.06, 0.20, 0.25],
  grainA: [0.02, 0.05, 0.25],
  exposure: [0.95, 1.25, 0.2],
  haloK: [0.02, 0.12, 0.25],
};

/* champion = current defaults (must mirror AD_DEFAULT in engine.ts) */
let champion = {
  ad: {
    camY: 8.0, camZ: 64.0, lookUp: 0.255, fogT: 0.040, beamK: 760.0,
    seaAmp: 1.0, foamK: 1.0, seaBody: 0.018, sssK: 0.105, grainA: 0.034,
    exposure: 1.05, haloK: 0.05,
  },
  score: 0,
};
// resume from ledger if present — the ratchet never forgets
if (existsSync(LEDGER)) {
  for (const line of readFileSync(LEDGER, 'utf8').trim().split('\n')) {
    if (!line) continue;
    const e = JSON.parse(line);
    if (e.promoted && e.score > champion.score) champion = { ad: e.ad, score: e.score };
  }
}

/* golden-ratio low-discrepancy mutation — strict math, not white noise */
const PHI = (1 + Math.sqrt(5)) / 2;
function mutate(base, gen, temp) {
  const ad = { ...base };
  const keys = Object.keys(SPACE);
  // rotate which axes move: 3 axes per candidate via golden-ratio stride
  const start = Math.floor((gen * PHI * keys.length) % keys.length);
  for (let j = 0; j < 3; j++) {
    const k = keys[(start + j * 5) % keys.length];
    const [lo, hi, sig] = SPACE[k];
    const u = ((gen * PHI + j * 0.37) % 1) * 2 - 1; // deterministic offset
    const v = base[k] + u * (hi - lo) * sig * temp;
    ad[k] = Math.round(Math.min(hi, Math.max(lo, v)) * 1000) / 1000;
  }
  return ad;
}

async function capture(ad, out) {
  const page = await freshPage();
  const url = 'http://localhost:3111/?ad=' + encodeURIComponent(JSON.stringify(ad));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(9000); // engine live + EMA convergence
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: out });
  await page.context().close();
}

function gate(png) {
  const raw = execFileSync('python3', ['scripts/frontier_gate.py', png, '--json'], { encoding: 'utf8' });
  return JSON.parse(raw);
}

const b = await chromium.launch({
  executablePath: BRAVE, headless: true,
  args: ['--enable-unsafe-webgpu', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist',
         '--disable-features=BackForwardCache'],
});
/* ISOLATION LAW: a fresh context per candidate — bfcache froze gens 3-14
   of run #2 into one cached page (identical metric vectors exposed it). */
async function freshPage() {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  return ctx.newPage();
}

// generation 0: measure the champion honestly first
await capture(champion.ad, '/tmp/foundry-champ.png');
const g0 = gate('/tmp/foundry-champ.png');
champion.score = g0.score;
console.log(`CHAMPION baseline: ${g0.score}`);
appendFileSync(LEDGER, JSON.stringify({ t: new Date().toISOString(), gen: 0, ad: champion.ad, score: g0.score, promoted: true, note: 'baseline' }) + '\n');

for (let gen = 1; gen <= GENS; gen++) {
  const temp = 1.0 - (gen / (GENS + 2)) * 0.6; // simulated annealing schedule
  const ad = mutate(champion.ad, gen, temp);
  const png = `/tmp/foundry-g${gen}.png`;
  await capture(ad, png);
  const g = gate(png);
  const beat = g.score > champion.score;
  console.log(`gen ${gen}: ${g.score}  ${beat ? '← PROMOTED' : `(champion ${champion.score})`}`);
  appendFileSync(LEDGER, JSON.stringify({ t: new Date().toISOString(), gen, ad, score: g.score, promoted: beat, metrics: g.metrics.map(m => `${m.metric}:${m.score}`) }) + '\n');
  if (beat) champion = { ad, score: g.score };
}

console.log('\n=== FOUNDRY RESULT ===');
console.log('champion score:', champion.score);
console.log('champion AD:', JSON.stringify(champion.ad));
await b.close();
