/**
 * Aggressive atmosphere extract from desejados.png:
 * keep top spotlight + bottom hairline; replace copy/tab band with edge plate.
 */
import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyFileSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = join(root, 'src/assets/desejados.png')
const outPath = join(root, 'src/assets/desejados-atmosphere.png')
const backupPath = join(root, 'src/assets/desejados.full-mockup.png')

copyFileSync(srcPath, backupPath)

const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
})
const { width: w, height: h, channels: c } = info

// Sample left + right margins into a full-width plate, then blur heavily.
const edgeW = Math.max(32, Math.round(w * 0.14))
const plate = Buffer.alloc(w * h * c)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const t = x / (w - 1)
    // Blend left edge column → right edge column across width
    const leftX = Math.min(edgeW - 1, Math.floor(t * (edgeW - 1)))
    const rightX = w - edgeW + Math.min(edgeW - 1, Math.floor(t * (edgeW - 1)))
    const li = (y * w + leftX) * c
    const ri = (y * w + rightX) * c
    const di = (y * w + x) * c
    const blend = t
    plate[di] = Math.round(data[li] * (1 - blend) + data[ri] * blend)
    plate[di + 1] = Math.round(data[li + 1] * (1 - blend) + data[ri + 1] * blend)
    plate[di + 2] = Math.round(data[li + 2] * (1 - blend) + data[ri + 2] * blend)
    plate[di + 3] = 255
  }
}

const softPlate = await sharp(plate, { raw: { width: w, height: h, channels: c } })
  .blur(28)
  .modulate({ brightness: 0.92 })
  .raw()
  .toBuffer()

const out = Buffer.alloc(w * h * c)
const keepTop = Math.round(h * 0.06)
const keepBot = Math.round(h * 0.94)
const feather = Math.round(h * 0.05)

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * c
    let mix = 1 // default: full plate (no glyphs)

    if (y < keepTop) {
      mix = 0
    } else if (y < keepTop + feather) {
      mix = (y - keepTop) / feather
    } else if (y > keepBot) {
      mix = 0
    } else if (y > keepBot - feather) {
      mix = (keepBot - y) / feather
    }

    // Also keep extreme side grain a bit more (optional subtlety)
    const cx = Math.abs(x / w - 0.5) * 2
    if (cx > 0.85 && mix > 0.4) mix = 0.4

    out[i] = Math.round(data[i] * (1 - mix) + softPlate[i] * mix)
    out[i + 1] = Math.round(data[i + 1] * (1 - mix) + softPlate[i + 1] * mix)
    out[i + 2] = Math.round(data[i + 2] * (1 - mix) + softPlate[i + 2] * mix)
    out[i + 3] = 255
  }
}

const base = await sharp(out, { raw: { width: w, height: h, channels: c } })
  .png()
  .toBuffer()

const spotlightSvg = Buffer.from(`
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="8%" r="62%">
      <stop offset="0%" stop-color="#d4a84b" stop-opacity="0.28"/>
      <stop offset="40%" stop-color="#c99b32" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c99b32" stop-opacity="0"/>
      <stop offset="50%" stop-color="#c99b32" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#c99b32" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="12%" y="${h - 3}" width="76%" height="1.5" fill="url(#line)"/>
</svg>`)

await sharp(base)
  .composite([{ input: await sharp(spotlightSvg).png().toBuffer(), blend: 'screen' }])
  .png()
  .toFile(outPath)

const meta = await sharp(outPath).metadata()
console.log({ out: outPath, size: `${meta.width}x${meta.height}` })
