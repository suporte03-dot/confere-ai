/**
 * Extract header atmosphere from header-novo-premium.png (full UI mockup).
 * Uses a clean dark-texture strip (no baked logo/nav/icons), stretched full-size
 * for .site-chrome via --site-chrome-bg / header-atmosphere.png.
 */
import sharp from 'sharp'
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = join(root, 'src/assets/header-novo-premium.png')
const backupPath = join(root, 'src/assets/header-novo-premium.full-mockup.png')
const outPath = join(root, 'src/assets/header-atmosphere.png')

if (!existsSync(srcPath)) {
  throw new Error(`Missing source: ${srcPath}`)
}

if (!existsSync(backupPath)) {
  copyFileSync(srcPath, backupPath)
  console.log('saved full mockup backup')
}

const source = backupPath
const meta = await sharp(source).metadata()
const w = meta.width
const h = meta.height

// Clean charcoal strip between promo bar and main baked UI row.
const bandTop = 28
const bandHeight = 22
const bandLeft = 0
const bandW = w

const { data, info } = await sharp(source)
  .extract({ left: bandLeft, top: bandTop, width: bandW, height: bandHeight })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { channels: c } = info
const scrubbed = Buffer.from(data)

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function isGoldish(r, g, b, L) {
  return r > 90 && g > 65 && b < 140 && L > 40 && r >= g * 0.9
}

for (let y = 0; y < bandHeight; y++) {
  let sr = 0
  let sg = 0
  let sb = 0
  let n = 0
  for (let x = 0; x < bandW; x++) {
    const i = (y * bandW + x) * c
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const L = lum(r, g, b)
    if (L < 35 && !isGoldish(r, g, b, L)) {
      sr += r
      sg += g
      sb += b
      n++
    }
  }
  if (!n) {
    sr = 10
    sg = 9
    sb = 8
    n = 1
  }
  sr = Math.round(sr / n)
  sg = Math.round(sg / n)
  sb = Math.round(sb / n)

  for (let x = 0; x < bandW; x++) {
    const i = (y * bandW + x) * c
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const L = lum(r, g, b)
    if (L > 28 || isGoldish(r, g, b, L)) {
      scrubbed[i] = sr
      scrubbed[i + 1] = sg
      scrubbed[i + 2] = sb
      scrubbed[i + 3] = 255
    }
  }
}

await sharp(scrubbed, { raw: { width: bandW, height: bandHeight, channels: c } })
  .blur(1.4)
  .resize(w, h, { fit: 'fill', kernel: 'lanczos3' })
  .modulate({ brightness: 0.96, saturation: 1.05 })
  .png()
  .toFile(outPath)

const outMeta = await sharp(outPath).metadata()
console.log({
  out: outPath,
  size: `${outMeta.width}x${outMeta.height}`,
  sourceBand: `y=${bandTop}..${bandTop + bandHeight - 1}`,
})
