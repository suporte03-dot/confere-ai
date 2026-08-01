/**
 * Fix santa-hero.png medallion:
 * - erase baked horizontal stubs (top-left "detalhezinho" + right tail)
 * - complete broken top of the double oval stroke
 *
 * Restores from santa-hero.before-oval-fix.png when present.
 */
import sharp from 'sharp'
import fs from 'fs'

const input = 'src/assets/santa-hero.png'
const backup = 'src/assets/santa-hero.before-oval-fix.png'
if (fs.existsSync(backup)) fs.copyFileSync(backup, input)
else if (!fs.existsSync(input + '.bak')) fs.copyFileSync(input, backup)

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info
const out = Buffer.from(data)

function get(x, y) {
  const i = (y * W + x) * C
  return [out[i], out[i + 1], out[i + 2], out[i + 3]]
}
function set(x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= W || y >= H) return
  const i = (y * W + x) * C
  out[i] = r
  out[i + 1] = g
  out[i + 2] = b
  out[i + 3] = a
}
function isGold(x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return false
  const [r, g, b, a] = get(x, y)
  if (a < 90) return false
  return r - b > 8 && (r + g + b) / 3 > 40
}

const L = []
const R = []
for (let y = 8; y <= 45; y++) {
  if (y >= 22 && y <= 26) continue
  let lx = -1
  let rx = -1
  for (let x = 0; x < 100; x++) {
    if (!isGold(x, y)) continue
    let run = 1
    while (isGold(x + run, y)) run++
    if (run < 2) {
      x += run
      continue
    }
    if (y >= 20 && y <= 28 && x <= 4 && run <= 14) {
      let gap = 0
      while (!isGold(x + run + gap, y) && gap < 20) gap++
      if (gap >= 4) {
        x += run + gap - 1
        continue
      }
    }
    lx = x
    break
  }
  for (let x = 140; x >= 50; x--) {
    if (!isGold(x, y)) continue
    let run = 1
    while (isGold(x - run, y)) run++
    if (run < 2) {
      x -= run
      continue
    }
    rx = x
    break
  }
  if (lx >= 0 && rx >= 0) {
    L.push({ x: lx, y })
    R.push({ x: rx, y })
  }
}

let best = { mae: 1e9 }
for (let cy = 95; cy <= 130; cy++) {
  for (let ry = 90; ry <= 125; ry++) {
    for (let cx = 58; cx <= 72; cx++) {
      for (let rx = 70; rx <= 88; rx++) {
        let err = 0
        let n = 0
        for (let i = 0; i < L.length; i++) {
          const t = (L[i].y - cy) / ry
          if (Math.abs(t) >= 0.999) {
            err += 20
            n += 2
            continue
          }
          const h = rx * Math.sqrt(1 - t * t)
          err += Math.abs(cx - h - L[i].x) + Math.abs(cx + h - R[i].x)
          n += 2
        }
        const mae = err / n
        if (mae < best.mae) best = { cx, cy, rx, ry, mae }
      }
    }
  }
}

let best2 = best
for (let cy = best.cy - 1.5; cy <= best.cy + 1.5; cy += 0.25) {
  for (let ry = best.ry - 2; ry <= best.ry + 2; ry += 0.25) {
    for (let cx = best.cx - 1.5; cx <= best.cx + 1.5; cx += 0.25) {
      for (let rx = best.rx - 2; rx <= best.rx + 2; rx += 0.25) {
        let err = 0
        let n = 0
        for (let i = 0; i < L.length; i++) {
          const t = (L[i].y - cy) / ry
          if (Math.abs(t) >= 0.999) {
            err += 20
            n += 2
            continue
          }
          const h = rx * Math.sqrt(1 - t * t)
          err += Math.abs(cx - h - L[i].x) + Math.abs(cx + h - R[i].x)
          n += 2
        }
        const mae = err / n
        if (mae < best2.mae) best2 = { cx, cy, rx, ry, mae }
      }
    }
  }
}

const { cx, cy, rx, ry } = best2
const inset = 4.5
const irx = rx - inset
const iry = ry - inset

// Prefer brighter gold from existing upper stroke
let sr = 0
let sg = 0
let sb = 0
let sn = 0
for (const p of L.slice(0, 25)) {
  for (let dx = 0; dx < 3; dx++) {
    const [r, g, b, a] = get(p.x + dx, p.y)
    if (a > 140 && (r + g + b) / 3 > 55) {
      sr += r
      sg += g
      sb += b
      sn++
    }
  }
}
const GR = Math.round(sr / Math.max(1, sn))
const GG = Math.round(sg / Math.max(1, sn))
const GB = Math.round(sb / Math.max(1, sn))

function clear(x, y) {
  if (get(x, y)[3] > 0) set(x, y, 0, 0, 0, 0)
}
function rn(x, y, rxi = rx, ryi = ry) {
  return Math.hypot((x - cx) / rxi, (y - cy) / ryi)
}

for (let y = 0; y <= 50; y++) {
  for (let x = 0; x < W; x++) {
    if (!isGold(x, y)) continue
    if (rn(x, y) > 1.05) clear(x, y)
  }
}
for (let y = 20; y <= 28; y++) {
  for (let x = 0; x <= 22; x++) {
    if (rn(x, y) > 1.01) clear(x, y)
  }
}
for (let y = 21; y <= 27; y++) {
  for (let x = 115; x < W; x++) {
    if (rn(x, y) > 1.01) clear(x, y)
  }
}

function stamp(x, y, half = 1.15) {
  const xi = Math.round(x)
  const yi = Math.round(y)
  for (let oy = -2; oy <= 2; oy++) {
    for (let ox = -2; ox <= 2; ox++) {
      const d = Math.hypot(ox, oy)
      if (d > half + 0.7) continue
      const fall = d <= half ? 1 : Math.max(0, 1 - (d - half) / 0.7)
      const a = Math.round(255 * fall)
      const px = xi + ox
      const py = yi + oy
      if (px < 0 || py < 0 || px >= W || py >= H) continue
      if (a > get(px, py)[3]) set(px, py, GR, GG, GB, a)
    }
  }
}

// Complete top wedge for outer + inner oval (force-draw; glow fools coverage checks)
for (let deg = -135; deg <= -45; deg += 0.1) {
  const t = (deg * Math.PI) / 180
  stamp(cx + rx * Math.cos(t), cy + ry * Math.sin(t), 1.25)
  stamp(cx + irx * Math.cos(t), cy + iry * Math.sin(t), 1.15)
}

for (let y = 20; y <= 28; y++) {
  for (let x = 0; x <= 20; x++) {
    if (rn(x, y) > 1.02) clear(x, y)
  }
  for (let x = 118; x < W; x++) {
    if (rn(x, y) > 1.02) clear(x, y)
  }
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(input)

console.log({
  ellipse: { ...best2, top: cy - ry },
  inset,
  gold: [GR, GG, GB],
  out: input,
})
