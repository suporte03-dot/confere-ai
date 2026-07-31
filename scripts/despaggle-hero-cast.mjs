/**
 * Remove baked-in gold glitter ("bolinhas") + left/top frame junk from couple-hero,
 * then lift midtones for a cleaner editorial cast panel.
 *
 * Source of bolinhas: inauguration flyer processing (scripts/clean-inauguration-hero.mjs
 * previously injected hash-based spark noise into the dark canvas). Also present in
 * the flyer artwork itself. Not CSS particles.
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const backupPath = path.join(root, 'public/images/hero/couple-hero-pre-despaggle.png')
const outPng = path.join(root, 'public/images/hero/couple-hero.png')
const outJpg = path.join(root, 'public/images/hero/couple-hero.jpg')

const srcPath = fs.existsSync(backupPath) ? backupPath : outPng
if (!fs.existsSync(backupPath) && fs.existsSync(outPng)) {
  fs.copyFileSync(outPng, backupPath)
}

const { data: src, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
})
const w = info.width
const h = info.height
const c = info.channels
const out = Buffer.from(src)
const median = await sharp(srcPath).median(11).ensureAlpha().raw().toBuffer()
const soft = await sharp(srcPath)
  .blur(4)
  .modulate({ saturation: 0.65, brightness: 0.95 })
  .ensureAlpha()
  .raw()
  .toBuffer()

let changed = 0
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * c
    if (src[i + 3] < 12) continue
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const warm = r - b
    const nx = x / w
    const ny = y / h

    let s = 0
    let n = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue
        const xx = x + dx
        const yy = y + dy
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
        const j = (yy * w + xx) * c
        s += 0.2126 * src[j] + 0.7152 * src[j + 1] + 0.0722 * src[j + 2]
        n++
      }
    }
    const peak = L - s / Math.max(1, n)

    const face1 = ((nx - 0.32) / 0.18) ** 2 + ((ny - 0.32) / 0.16) ** 2 < 1
    const face2 = ((nx - 0.55) / 0.16) ** 2 + ((ny - 0.3) / 0.15) ** 2 < 1
    const protect = (face1 || face2) && L > 35 && peak < 20

    const bgDust = ny < 0.25 || nx > 0.6 || nx < 0.07 || y < 14 || x < 16
    const isSpark =
      !protect &&
      ((x < 16 && warm > 6) ||
        (y < 12 && warm > 8 && L > 28) ||
        (warm > 9 && peak > 3 && L > 14 && L < 160) ||
        (bgDust && warm > 6 && L > 14 && L < 150) ||
        (warm > 14 && peak > 1.5 && L > 20 && L < 140))

    if (isSpark) {
      const fill = bgDust || L < 38 ? soft : median
      out[i] = fill[i]
      out[i + 1] = fill[i + 1]
      out[i + 2] = fill[i + 2]
      changed++
    }
  }
}

for (let y = 0; y < h; y++) {
  const si = (y * w + 24) * c
  for (let x = 0; x < 16; x++) {
    const i = (y * w + x) * c
    out[i] = out[si]
    out[i + 1] = out[si + 1]
    out[i + 2] = out[si + 2]
  }
}
for (let x = 0; x < w; x++) {
  const si = (20 * w + x) * c
  for (let y = 0; y < 12; y++) {
    const i = (y * w + x) * c
    out[i] = out[si]
    out[i + 1] = out[si + 1]
    out[i + 2] = out[si + 2]
  }
}

for (let i = 0; i < out.length; i += c) {
  const r = out[i]
  const g = out[i + 1]
  const b = out[i + 2]
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b
  if (L < 5) continue
  const t = Math.max(0, Math.min(1, (L - 5) / 95))
  const gain = 1 + 0.75 * t
  const gamma = 1 - 0.2 * t
  const f = (v) => Math.min(255, Math.round(Math.pow(v / 255, gamma) * 255 * gain))
  out[i] = f(r)
  out[i + 1] = f(g)
  out[i + 2] = f(b)
}

const buf = await sharp(out, { raw: { width: w, height: h, channels: c } })
  .modulate({ brightness: 1.24, saturation: 1.02 })
  .linear(1.07, -5)
  .png({ compressionLevel: 8 })
  .toBuffer()

await fs.promises.writeFile(outPng, buf)
await sharp(buf).jpeg({ quality: 94, mozjpeg: true }).toFile(outJpg)
console.log({ changed, outPng, outJpg })
