/**
 * Extract header atmosphere from nova-parte.png (full UI mockup).
 * Scrubs baked logo / nav / icons; keeps gold silk texture for .site-chrome.
 */
import sharp from 'sharp'
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = join(root, 'src/assets/nova-parte.png')
const backupPath = join(root, 'src/assets/nova-parte.full-mockup.png')
const outPath = join(root, 'src/assets/header-atmosphere.png')

const source = existsSync(backupPath) ? backupPath : srcPath
if (!existsSync(backupPath)) {
  copyFileSync(srcPath, backupPath)
  console.log('saved full mockup backup')
}

const meta = await sharp(source).metadata()
const w = meta.width
const h = meta.height

// Wider silk band from original; scrub bright glyphs inside it, then stretch full-width.
const bandLeft = 190
const bandRight = 520
const bandW = bandRight - bandLeft

const { data, info } = await sharp(source)
  .extract({ left: bandLeft, top: 0, width: bandW, height: h })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { channels: c } = info
const scrubbed = Buffer.from(data)

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

for (let y = 0; y < h; y++) {
  let sr = 0
  let sg = 0
  let sb = 0
  let n = 0
  for (let x = 0; x < Math.floor(bandW * 0.45); x++) {
    const i = (y * bandW + x) * c
    const L = lum(data[i], data[i + 1], data[i + 2])
    if (L < 95) {
      sr += data[i]
      sg += data[i + 1]
      sb += data[i + 2]
      n++
    }
  }
  if (!n) {
    sr = 20
    sg = 16
    sb = 12
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
    if (L > 100 || (r > 145 && g > 105 && b < 145 && L > 72 && x > bandW * 0.42)) {
      scrubbed[i] = sr
      scrubbed[i + 1] = sg
      scrubbed[i + 2] = sb
      scrubbed[i + 3] = 255
    }
  }
}

const pass2 = Buffer.from(scrubbed)
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < bandW - 1; x++) {
    const i = (y * bandW + x) * c
    let brightN = 0
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const j = ((y + dy) * bandW + (x + dx)) * c
        if (lum(data[j], data[j + 1], data[j + 2]) > 105) brightN++
      }
    }
    if (brightN >= 3) {
      const sx = Math.min(x, Math.floor(bandW * 0.35))
      const si = (y * bandW + sx) * c
      const t = Math.min(1, brightN / 8)
      pass2[i] = Math.round(scrubbed[i] * (1 - t) + scrubbed[si] * t)
      pass2[i + 1] = Math.round(scrubbed[i + 1] * (1 - t) + scrubbed[si + 1] * t)
      pass2[i + 2] = Math.round(scrubbed[i + 2] * (1 - t) + scrubbed[si + 2] * t)
    }
  }
}

await sharp(pass2, { raw: { width: bandW, height: h, channels: c } })
  .blur(3)
  .resize(w, h, { fit: 'fill', kernel: 'lanczos3' })
  .modulate({ brightness: 0.97, saturation: 1.06 })
  .png()
  .toFile(outPath)

const outMeta = await sharp(outPath).metadata()
console.log({ out: outPath, size: `${outMeta.width}x${outMeta.height}` })
