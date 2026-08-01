/**
 * Build a clean atmosphere plate inspired by beneficios-compra.png:
 * dark field + edge gold dust. No baked UI / MELHORADO badge.
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

const meta = await sharp(existsSync(backupPath) ? backupPath : srcPath).metadata()
const w = meta.width || 1164
const h = meta.height || 343

const dots = []
const rng = (seed) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rand = rng(42)
for (let i = 0; i < 90; i++) {
  const side = rand() < 0.5
  const x = side ? rand() * 14 : 86 + rand() * 14
  const y = 8 + rand() * 84
  const r = 0.35 + rand() * 1.4
  const op = 0.25 + rand() * 0.55
  dots.push(
    `<circle cx="${x}%" cy="${y}%" r="${r}%" fill="#f0d78a" fill-opacity="${op.toFixed(2)}"/>`,
  )
}

const svg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="top" cx="50%" cy="0%" r="58%">
      <stop offset="0%" stop-color="#c99b32" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0a0908" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="l" cx="3%" cy="42%" r="34%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#c99b32" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0a0908" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="r" cx="97%" cy="58%" r="36%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.26"/>
      <stop offset="50%" stop-color="#c99b32" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#0a0908" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0a0908"/>
  <rect width="100%" height="100%" fill="url(#top)"/>
  <rect width="100%" height="100%" fill="url(#l)"/>
  <rect width="100%" height="100%" fill="url(#r)"/>
  ${dots.join('\n  ')}
</svg>`)

await sharp(svg).blur(0.6).png().toFile(outPath)
console.log({ out: outPath, size: `${w}x${h}` })
