/**
 * Remove baked-in golden dust/glitter from couple-hero.png
 * (campaign flyer texture that reads as cluttered "bolinhas").
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcPath = path.join(root, 'public/images/hero/couple-hero.png')
const backupPath = path.join(root, 'public/images/hero/couple-hero-pre-despaggle.png')

if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(srcPath, backupPath)
}

fs.copyFileSync(backupPath, srcPath)

const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h, channels: c } = info
const src = Buffer.from(data)
const out = Buffer.from(data)

const plate = await sharp(srcPath)
  .blur(20)
  .modulate({ saturation: 0.45, brightness: 0.9 })
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
    const nx = x / w
    const ny = y / h
    const warm = r - b

    const face =
      ny > 0.16 &&
      ny < 0.58 &&
      nx > 0.12 &&
      nx < 0.72 &&
      L > 68 &&
      L < 210 &&
      Math.abs(r - g) < 42 &&
      warm < 58 &&
      g > 50 &&
      b > 35
    if (face) continue

    const shirtLogo = ny > 0.48 && ny < 0.78 && L > 90 && warm > 20
    if (shirtLogo) continue
    if ((x < 10 || y < 8) && L > 100) continue

    const pL = 0.2126 * plate[i] + 0.7152 * plate[i + 1] + 0.0722 * plate[i + 2]
    const topBand = ny < 0.16
    const upper = ny < 0.42
    const rightMist = nx > 0.55 && ny < 0.62
    const darkWarm = L < 100 && warm > 6
    const brighterThanPlate = L > pL + 3

    let blend = 0
    if (topBand) blend = L < 160 ? 0.96 : 0.55
    else if (upper && (darkWarm || brighterThanPlate) && L < 120) blend = 0.82
    else if (rightMist && L < 140 && (warm > 3 || L > 18)) blend = 0.92
    else if (L < 45 && warm > 10) blend = 0.75

    if (blend > 0) {
      out[i] = Math.round(r * (1 - blend) + plate[i] * blend)
      out[i + 1] = Math.round(g * (1 - blend) + plate[i + 1] * blend)
      out[i + 2] = Math.round(b * (1 - blend) + plate[i + 2] * blend)
      changed++
    }
  }
}

await sharp(out, { raw: { width: w, height: h, channels: c } })
  .png({ compressionLevel: 9 })
  .toFile(srcPath)

await sharp(srcPath).jpeg({ quality: 93, mozjpeg: true }).toFile(
  path.join(root, 'public/images/hero/couple-hero.jpg'),
)
await sharp(srcPath)
  .flatten({ background: '#15110d' })
  .png()
  .toFile(path.join(root, 'public/images/hero/couple-hero-source-opaque.png'))

console.log({ w, h, changed, pct: `${((changed / (w * h)) * 100).toFixed(2)}%` })
