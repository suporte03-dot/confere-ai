import sharp from 'sharp'
import fs from 'fs'

const input = 'src/assets/santa-hero.png'
const output = 'src/assets/santa-hero.png'
const backup = 'src/assets/santa-hero.opaque-backup.png'

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

if (!fs.existsSync(backup)) {
  fs.copyFileSync(input, backup)
  console.log('backup written', backup)
}

const out = Buffer.alloc(data.length)
let minX = width
let minY = height
let maxX = 0
let maxY = 0
let kept = 0

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const maxc = Math.max(r, g, b)
    const minc = Math.min(r, g, b)
    const lum = (r + g + b) / 3
    const warm = r - b
    const sat = maxc - minc

    // Keep warm gold / glow strokes; key near-black plate to alpha
    const isGold =
      (warm > 12 && lum > 28 && (r > 70 || g > 55)) ||
      (sat > 18 && warm > 8 && lum > 35) ||
      (r > 140 && g > 100 && b < 140 && lum > 50)

    let a = 0
    if (isGold) {
      a = 255
      kept++
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    } else if (lum < 48 && sat < 22) {
      a = 0
    } else if (warm > 6 && lum > 40) {
      a = Math.min(255, Math.round(((lum - 30) / 50) * 200))
      if (a > 24) {
        kept++
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      } else {
        a = 0
      }
    }

    out[i] = r
    out[i + 1] = g
    out[i + 2] = b
    out[i + 3] = a
  }
}

const pad = 8
const left = Math.max(0, minX - pad)
const top = Math.max(0, minY - pad)
const right = Math.min(width - 1, maxX + pad)
const bottom = Math.min(height - 1, maxY + pad)
const cropW = right - left + 1
const cropH = bottom - top + 1

// Prefer a portrait crop around the central medallion (drop full-width line tails)
const dens = new Array(width).fill(0)
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    if (out[(y * width + x) * channels + 3] > 40) dens[x]++
  }
}

let bestStart = left
let bestEnd = right
let bestScore = -1
const targetW = Math.min(cropW, Math.max(220, Math.round(height * 1.15)))
for (let start = 0; start <= width - targetW; start += 4) {
  let score = 0
  for (let x = start; x < start + targetW; x++) score += dens[x]
  // Prefer center-weighted
  const center = start + targetW / 2
  const centerBias = 1 - Math.abs(center - width / 2) / (width / 2)
  score *= 0.65 + 0.35 * centerBias
  if (score > bestScore) {
    bestScore = score
    bestStart = start
    bestEnd = start + targetW - 1
  }
}

const finalLeft = Math.max(0, bestStart)
const finalRight = Math.min(width - 1, bestEnd)
const finalTop = top
const finalBottom = bottom
const finalW = finalRight - finalLeft + 1
const finalH = finalBottom - finalTop + 1

const cropped = Buffer.alloc(finalW * finalH * 4)
for (let y = 0; y < finalH; y++) {
  for (let x = 0; x < finalW; x++) {
    const si = ((finalTop + y) * width + (finalLeft + x)) * channels
    const di = (y * finalW + x) * 4
    cropped[di] = out[si]
    cropped[di + 1] = out[si + 1]
    cropped[di + 2] = out[si + 2]
    cropped[di + 3] = out[si + 3]
  }
}

await sharp(cropped, { raw: { width: finalW, height: finalH, channels: 4 } })
  .png()
  .toFile(output)

console.log({
  kept,
  bbox: [minX, minY, maxX, maxY],
  crop: [finalLeft, finalTop, finalW, finalH],
  out: output,
})
