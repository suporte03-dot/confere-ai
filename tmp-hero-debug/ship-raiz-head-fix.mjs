import sharp from 'sharp'
import fs from 'fs'

/**
 * Prefer the widest warm campaign crop so object-fit:cover
 * crops less aggressively on a landscape panel.
 * hist-2938c75 = 615x492 warm color, same couple framing.
 */
const candidates = [
  'tmp-hero-debug/hist-2938c75.png',
  'tmp-hero-debug/raiz-hero-lefttrim.png',
  'src/assets/raiz-hero.before-torso-framing.png',
  'src/assets/raiz-hero.before-head-fix.png',
]

async function sim(srcPath, outPath, panelW, panelH, ox, oy) {
  const meta = await sharp(srcPath).metadata()
  const iw = meta.width
  const ih = meta.height
  const sc = Math.max(panelW / iw, panelH / ih)
  const L = (ox / 100) * (panelW - iw * sc)
  const T = (oy / 100) * (panelH - ih * sc)
  const el = Math.round(Math.min(Math.max(0, -L / sc), Math.max(0, iw - panelW / sc)))
  const et = Math.round(Math.min(Math.max(0, -T / sc), Math.max(0, ih - panelH / sc)))
  const ew = Math.round(Math.min(panelW / sc, iw - el))
  const eh = Math.round(Math.min(panelH / sc, ih - et))
  console.log(
    outPath,
    meta.width + 'x' + meta.height,
    'visY',
    et + '-' + (et + eh),
    '/',
    ih,
    'sc',
    sc.toFixed(2),
  )
  await sharp(srcPath)
    .extract({ left: el, top: et, width: ew, height: eh })
    .resize(panelW, panelH)
    .png()
    .toFile(outPath)
}

// Pick widest existing warm source
let best = null
let bestW = 0
for (const c of candidates) {
  if (!fs.existsSync(c)) continue
  const m = await sharp(c).metadata()
  console.log('candidate', c, m.width + 'x' + m.height)
  if (m.width > bestW) {
    bestW = m.width
    best = c
  }
}

console.log('using', best)

// Backup current if needed
if (!fs.existsSync('src/assets/raiz-hero.before-head-fix.png')) {
  fs.copyFileSync('src/assets/raiz-hero.png', 'src/assets/raiz-hero.before-head-fix.png')
}

// Ship clean wide asset (no fake sky letterbox)
fs.copyFileSync(best, 'src/assets/raiz-hero.png')
const out = await sharp('src/assets/raiz-hero.png').metadata()
console.log('shipped', out.width + 'x' + out.height)

const src = 'src/assets/raiz-hero.png'
for (const [h, oy] of [
  [640, 18],
  [640, 22],
  [640, 26],
  [640, 30],
  [660, 24],
  [680, 22],
  [600, 20],
]) {
  await sim(src, `tmp-hero-debug/pick-h${h}-oy${oy}.png`, 790, h, 46, oy)
}
await sim(src, 'tmp-hero-debug/pick-mob-oy28.png', 390, 420, 48, 28)
await sim(src, 'tmp-hero-debug/pick-mob-oy32.png', 390, 440, 48, 32)

// Also compare before-torso at same positions
await sim(
  'src/assets/raiz-hero.before-torso-framing.png',
  'tmp-hero-debug/pick-torso-h640-oy22.png',
  790,
  640,
  46,
  22,
)
await sim(
  'tmp-hero-debug/raiz-hero-lefttrim.png',
  'tmp-hero-debug/pick-left-h640-oy22.png',
  790,
  640,
  46,
  22,
)
