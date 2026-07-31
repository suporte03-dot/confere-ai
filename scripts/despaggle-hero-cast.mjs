/**
 * Aggressively remove baked-in gold glitter / edge frame from couple-hero,
 * then brighten for editorial cast panel.
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcPath = path.join(root, 'public/images/hero/couple-hero.png')
const outPng = srcPath
const outJpg = path.join(root, 'public/images/hero/couple-hero.jpg')
const debugDir = path.join(root, 'tmp-hero-debug')

const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
})
const W = info.width
const H = info.height
const C = info.channels
const src = Buffer.from(data)
const out = Buffer.from(data)

const lumAt = (buf, i) => 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]

function neighborhoodMean(buf, x, y, r, skipHot = true) {
  let sr = 0
  let sg = 0
  let sb = 0
  let n = 0
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx === 0 && dy === 0) continue
      const xx = x + dx
      const yy = y + dy
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue
      const j = (yy * W + xx) * C
      const r0 = buf[j]
      const g0 = buf[j + 1]
      const b0 = buf[j + 2]
      const v = 0.2126 * r0 + 0.7152 * g0 + 0.0722 * b0
      const warm = r0 - b0
      if (skipHot && warm > 16 && v > 38) continue
      sr += r0
      sg += g0
      sb += b0
      n++
    }
  }
  if (!n) return [14, 11, 8]
  return [Math.round(sr / n), Math.round(sg / n), Math.round(sb / n)]
}

let killed = 0

// Pass A: left/top gold frame line — paint solid dark
for (let y = 0; y < H; y++) {
  for (let x = 0; x < Math.min(16, W); x++) {
    const i = (y * W + x) * C
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = lumAt(src, i)
    if ((r - b > 12 && v > 28) || (x < 5 && v > 40)) {
      const [fr, fg, fb] = neighborhoodMean(src, Math.min(x + 18, W - 1), y, 2, false)
      out[i] = fr
      out[i + 1] = fg
      out[i + 2] = fb
      killed++
    }
  }
}
for (let y = 0; y < Math.min(14, H); y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C
    const r = src[i]
    const b = src[i + 2]
    const v = lumAt(src, i)
    if (r - b > 12 && v > 30) {
      const [fr, fg, fb] = neighborhoodMean(src, x, Math.min(y + 16, H - 1), 2, false)
      out[i] = fr
      out[i + 1] = fg
      out[i + 2] = fb
      killed++
    }
  }
}

// Pass B: kill warm bright outliers (bolinhas) — low threshold, multi-radius
for (let pass = 0; pass < 3; pass++) {
  const read = pass === 0 ? src : out
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = (y * W + x) * C
      if (out[i + 3] < 12) continue
      const r = read[i]
      const g = read[i + 1]
      const b = read[i + 2]
      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const warm = r - b
      const nx = x / W
      const ny = y / H

      // warm speckles / glitter
      const warmish = warm >= 10 && r >= 32 && r >= g - 8
      if (!warmish && !(v > 55 && warm > 6)) continue

      const [nr, ng, nb] = neighborhoodMean(read, x, y, pass === 0 ? 2 : 3, true)
      const nv = 0.2126 * nr + 0.7152 * ng + 0.0722 * nb
      const delta = v - nv

      // denser kill on bg fields (right side / top) where flyer dust lives
      const bgField = nx > 0.52 || ny < 0.18 || nx < 0.06 || (nx > 0.7 && ny < 0.7)
      const thresh = bgField ? 6 : 10

      if (delta >= thresh || (warm >= 22 && v > nv + 4 && v < 200)) {
        out[i] = nr
        out[i + 1] = ng
        out[i + 2] = nb
        killed++
      }
    }
  }
}

// Pass C: soft despeckle residual grain on dark regions (median-ish 3x3)
const mid = Buffer.from(out)
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const i = (y * W + x) * C
    const v = lumAt(mid, i)
    if (v > 85 || mid[i + 3] < 20) continue
    const rs = []
    const gs = []
    const bs = []
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const j = ((y + dy) * W + (x + dx)) * C
        rs.push(mid[j])
        gs.push(mid[j + 1])
        bs.push(mid[j + 2])
      }
    }
    rs.sort((a, b) => a - b)
    gs.sort((a, b) => a - b)
    bs.sort((a, b) => a - b)
    const mr = rs[4]
    const mg = gs[4]
    const mb = bs[4]
    // only pull toward median when current pixel is a hot speck
    if (mid[i] - mr > 8 || lumAt(mid, i) - (0.2126 * mr + 0.7152 * mg + 0.0722 * mb) > 8) {
      out[i] = Math.round(mid[i] * 0.25 + mr * 0.75)
      out[i + 1] = Math.round(mid[i + 1] * 0.25 + mg * 0.75)
      out[i + 2] = Math.round(mid[i + 2] * 0.25 + mb * 0.75)
      killed++
    }
  }
}

// Pass D: brighten midtones hard (faces were ~mean 15)
for (let i = 0; i < out.length; i += C) {
  if (out[i + 3] < 8) continue
  let r = out[i] / 255
  let g = out[i + 1] / 255
  let b = out[i + 2] / 255
  // strong gamma lift + gain
  r = Math.pow(r, 0.72) * 1.32
  g = Math.pow(g, 0.72) * 1.3
  b = Math.pow(b, 0.72) * 1.26
  let R = Math.min(255, Math.round(r * 255))
  let G = Math.min(255, Math.round(g * 255))
  let B = Math.min(255, Math.round(b * 255))
  const v = 0.2126 * R + 0.7152 * G + 0.0722 * B
  if (v > 20 && v < 200) {
    const t = 1 - Math.abs(v - 105) / 110
    const add = Math.round(18 * Math.max(0, t))
    R = Math.min(255, R + add + 3)
    G = Math.min(255, G + add + 1)
    B = Math.min(255, B + Math.round(add * 0.65))
  }
  out[i] = R
  out[i + 1] = G
  out[i + 2] = B
}

fs.mkdirSync(debugDir, { recursive: true })
const cleaned = await sharp(out, { raw: { width: W, height: H, channels: C } })
  .modulate({ brightness: 1.06, saturation: 1.02 })
  .linear(1.04, -2)
  .png({ compressionLevel: 8 })
  .toBuffer()

await fs.promises.writeFile(outPng, cleaned)
await sharp(cleaned).jpeg({ quality: 94, mozjpeg: true }).toFile(outJpg)

await sharp(cleaned)
  .extract({ left: 0, top: 0, width: Math.min(480, W), height: Math.min(200, H) })
  .png()
  .toFile(path.join(debugDir, 'despaggle-top.png'))
await sharp(cleaned)
  .extract({
    left: Math.round(W * 0.2),
    top: Math.round(H * 0.1),
    width: Math.min(520, W - Math.round(W * 0.2)),
    height: Math.min(420, H - Math.round(H * 0.1)),
  })
  .png()
  .toFile(path.join(debugDir, 'despaggle-faces.png'))
await sharp(cleaned).png().toFile(path.join(debugDir, 'despaggle-full.png'))

const { data: cd, info: ci } = await sharp(cleaned).raw().ensureAlpha().toBuffer({
  resolveWithObject: true,
})
let sum = 0
let n = 0
let gold = 0
for (let y = Math.round(H * 0.15); y < Math.round(H * 0.55); y++) {
  for (let x = Math.round(W * 0.15); x < Math.round(W * 0.7); x++) {
    const i = (y * W + x) * ci.channels
    sum += 0.2126 * cd[i] + 0.7152 * cd[i + 1] + 0.0722 * cd[i + 2]
    n++
    if (cd[i] - cd[i + 2] >= 18 && cd[i] >= 48) gold++
  }
}
console.log({ killed, faceMean: (sum / n).toFixed(1), goldInFaces: gold })
