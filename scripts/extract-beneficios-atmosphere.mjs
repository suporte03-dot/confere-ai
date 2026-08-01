/**
 * Atmosphere from mockup: L/R gold dust only.
 * Clears MELHORADO badge and any baked card/text on the edges.
 */
import sharp from 'sharp'
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = join(root, 'src/assets/beneficios-compra.png')
const backupPath = join(root, 'src/assets/beneficios-compra.full-mockup.png')
const outPath = join(root, 'src/assets/beneficios-compra-atmosphere.png')

if (!existsSync(backupPath) && existsSync(srcPath)) {
  copyFileSync(srcPath, backupPath)
}

const input = existsSync(backupPath) ? backupPath : srcPath
const meta = await sharp(input).metadata()
const w = meta.width || 1164
const h = meta.height || 343
const edge = Math.round(w * 0.11)
const cardTop = Math.round(h * 0.32)
const cardBot = Math.round(h * 0.86)
const badgeW = Math.round(w * 0.14)
const badgeH = Math.round(h * 0.14)

const base = await sharp(input).ensureAlpha().raw().toBuffer()
const out = Buffer.alloc(w * h * 4, 0)
const dark = [10, 9, 8]

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4
    out[i] = dark[0]
    out[i + 1] = dark[1]
    out[i + 2] = dark[2]
    out[i + 3] = 255

    const onLeft = x < edge
    const onRight = x >= w - edge
    if (!onLeft && !onRight) continue
    if (x < badgeW && y < badgeH) continue
    // Remove card band remnants on edges (icons/borders baked into mockup)
    if (y >= cardTop && y <= cardBot) continue

    const r = base[i]
    const g = base[i + 1]
    const b = base[i + 2]
    const lum = (r + g + b) / 3
    const isGoldDust = lum > 45 && r > 80 && g > 55 && r >= g && r - b > 15
    if (!isGoldDust) continue

    const nx = onLeft ? x / edge : (w - 1 - x) / edge
    const fade = Math.max(0, 1 - nx)
    out[i] = Math.round(r * fade + dark[0] * (1 - fade))
    out[i + 1] = Math.round(g * fade + dark[1] * (1 - fade))
    out[i + 2] = Math.round(b * fade + dark[2] * (1 - fade))
  }
}

// Soft synthetic dust fill so edges still read as gold atmosphere after card wipe
const rng = (seed) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rand = rng(77)
const dots = []
for (let i = 0; i < 120; i++) {
  const side = rand() < 0.5
  const x = side ? rand() * 11 : 89 + rand() * 11
  const y = 4 + rand() * 92
  // skip card mid-band a bit less aggressively for dust
  const r = 0.2 + rand() * 1.1
  const op = 0.2 + rand() * 0.5
  dots.push(
    `<circle cx="${x}%" cy="${y}%" r="${r}%" fill="#e2c56a" fill-opacity="${op.toFixed(2)}"/>`,
  )
}

const overlaySvg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="l" cx="2%" cy="40%" r="28%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#0a0908" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="r" cx="98%" cy="55%" r="30%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#0a0908" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#l)"/>
  <rect width="100%" height="100%" fill="url(#r)"/>
  ${dots.join('\n  ')}
</svg>`)

const dustPlate = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .png()
  .toBuffer()

const overlay = await sharp(overlaySvg).blur(0.8).png().toBuffer()

await sharp(dustPlate)
  .composite([{ input: overlay, blend: 'screen' }])
  .blur(0.5)
  .png()
  .toFile(outPath)

console.log({ out: outPath, size: `${w}x${h}` })
