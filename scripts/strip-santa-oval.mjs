/**
 * Option A: strip baked oval / stubs / flourish from santa-hero.png,
 * keep only the saint figure on transparent background (CSS draws the oval).
 * Restores from santa-hero.before-oval-fix.png when present.
 */
import sharp from 'sharp'
import fs from 'fs'

const input = 'src/assets/santa-hero.png'
const backup = 'src/assets/santa-hero.before-oval-fix.png'

if (fs.existsSync(backup)) {
  fs.copyFileSync(backup, input)
} else {
  console.error('Missing', backup)
  process.exit(1)
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info
const out = Buffer.from(data)

function idx(x, y) {
  return (y * W + x) * C
}
function get(x, y) {
  const i = idx(x, y)
  return [out[i], out[i + 1], out[i + 2], out[i + 3]]
}
function isGold(x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return false
  const [r, g, b, a] = get(x, y)
  if (a < 70) return false
  return r - b > 6 && (r + g + b) / 3 > 32
}

// Sample outer left/right stroke (skip stub rows near y=23–25)
const L = []
const R = []
for (let y = 8; y <= 48; y++) {
  if (y >= 22 && y <= 26) continue
  let lx = -1
  let rx = -1
  for (let x = 0; x < Math.floor(W * 0.55); x++) {
    if (!isGold(x, y)) continue
    let run = 1
    while (isGold(x + run, y)) run++
    if (run < 2) {
      x += run
      continue
    }
    lx = x
    break
  }
  for (let x = W - 1; x > Math.floor(W * 0.4); x--) {
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
  if (lx >= 0 && rx >= 0 && rx - lx > 40) {
    L.push({ x: lx, y })
    R.push({ x: rx, y })
  }
}

let best = { mae: 1e9, cx: 66, cy: 118, rx: 78, ry: 112 }
for (let cy = 100; cy <= 130; cy++) {
  for (let ry = 100; ry <= 125; ry++) {
    for (let cx = 58; cx <= 72; cx++) {
      for (let rx = 68; rx <= 90; rx++) {
        let err = 0
        let n = 0
        for (let i = 0; i < L.length; i++) {
          const t = (L[i].y - cy) / ry
          if (Math.abs(t) >= 0.999) {
            err += 25
            n += 2
            continue
          }
          const h = rx * Math.sqrt(1 - t * t)
          err += Math.abs(cx - h - L[i].x) + Math.abs(cx + h - R[i].x)
          n += 2
        }
        const mae = err / Math.max(1, n)
        if (mae < best.mae) best = { cx, cy, rx, ry, mae }
      }
    }
  }
}

const { cx, cy, rx, ry } = best
const rn = (x, y) => Math.hypot((x - cx) / rx, (y - cy) / ry)

// Seed from solidly-inside gold, flood to adjacent gold inside figure ellipse
const keep = new Uint8Array(W * H)
const q = []
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!isGold(x, y)) continue
    if (rn(x, y) < 0.78) {
      keep[y * W + x] = 1
      q.push(x, y)
    }
  }
}

let qi = 0
while (qi < q.length) {
  const x = q[qi++]
  const y = q[qi++]
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
      const p = ny * W + nx
      if (keep[p]) continue
      if (!isGold(nx, ny)) continue
      if (rn(nx, ny) > 0.9) continue
      keep[p] = 1
      q.push(nx, ny)
    }
  }
}

let kept = 0
let minX = W
let minY = H
let maxX = 0
let maxY = 0

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = idx(x, y)
    const r = out[i]
    const g = out[i + 1]
    const b = out[i + 2]
    const a = out[i + 3]
    const lum = (r + g + b) / 3
    const sat = Math.max(r, g, b) - Math.min(r, g, b)
    const warm = r - b

    if (!keep[y * W + x] || (lum < 42 && sat < 28 && warm < 18) || a < 8) {
      out[i] = 0
      out[i + 1] = 0
      out[i + 2] = 0
      out[i + 3] = 0
      continue
    }

    kept++
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
}

const pad = 8
const left = Math.max(0, minX - pad)
const top = Math.max(0, minY - pad)
const right = Math.min(W - 1, maxX + pad)
const bottom = Math.min(H - 1, maxY + pad)
const finalW = right - left + 1
const finalH = bottom - top + 1

const cropped = Buffer.alloc(finalW * finalH * 4)
for (let y = 0; y < finalH; y++) {
  for (let x = 0; x < finalW; x++) {
    const si = idx(left + x, top + y)
    const di = (y * finalW + x) * 4
    cropped[di] = out[si]
    cropped[di + 1] = out[si + 1]
    cropped[di + 2] = out[si + 2]
    cropped[di + 3] = out[si + 3]
  }
}

await sharp(cropped, { raw: { width: finalW, height: finalH, channels: 4 } })
  .png()
  .toFile(input)

console.log({
  ellipse: best,
  kept,
  crop: [left, top, finalW, finalH],
  out: input,
})
