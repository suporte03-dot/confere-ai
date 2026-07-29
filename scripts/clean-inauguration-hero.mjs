/**
 * Most reliable fix: rebuild hero on a CLEAN gold-dust field.
 * Keep only the couple (left) + circular logo from the ORIGINAL flyer.
 * Invitation text / black header band are never copied over.
 */
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sourcePath = path.join(
  'C:',
  'Users',
  'Suporte03',
  '.cursor',
  'projects',
  'c-Users-Suporte03-confere-ai',
  'assets',
  'c__Users_Suporte03_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-14103c05-34fa-40f0-a356-9ad214a76c8f.png',
)
const workingSrc = path.join(root, 'public/images/brand/brand-inauguracao-flyer.png')
const probeDir = path.join(root, 'public/images/_probe')

const smoothstep = (t) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}
const hash01 = (x, y, s = 0) => {
  const n = Math.sin((x + s * 17) * 127.1 + (y + s * 9) * 311.7) * 43758.5453
  return n - Math.floor(n)
}

if (!fs.existsSync(sourcePath)) throw new Error('missing original flyer')
await fs.promises.copyFile(sourcePath, workingSrc)

const meta = await sharp(sourcePath).metadata()
const W = meta.width
const H = meta.height
console.log('source', W, 'x', H)

const { data: src, info } = await sharp(sourcePath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
})
const C = info.channels

// --- Build clean background from gold-dust bank (right side + mid field) ---
const bank = []
for (let y = 15; y < H - 15; y++) {
  for (let x = 480; x < W - 8; x++) {
    const i = (y * W + x) * C
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = (r + g + b) / 3
    if (v >= 5 && v <= 85 && !(v > 40 && r - b > 16)) bank.push([r, g, b])
  }
}
for (let y = 130; y < 250; y++) {
  for (let x = 240; x < 340; x++) {
    const i = (y * W + x) * C
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = (r + g + b) / 3
    if (v >= 5 && v <= 45) bank.push([r, g, b])
  }
}
console.log('bank', bank.length)

const bg = Buffer.alloc(W * H * 3)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i3 = (y * W + x) * 3
    const idx = Math.floor(hash01(x, y, 1) * bank.length) % bank.length
    const idx2 = Math.floor(hash01(x + 3, y + 5, 2) * bank.length) % bank.length
    const t = hash01(x, y, 3)
    const a = bank[idx]
    const b = bank[idx2]
    const j = (hash01(x, y, 4) - 0.5) * 5
    const spark = hash01(x, y, 5) > 0.968 ? 10 + hash01(x, y, 6) * 28 : 0
    bg[i3] = Math.min(255, Math.max(5, Math.round(a[0] * (1 - t) + b[0] * t + j + spark)))
    bg[i3 + 1] = Math.min(
      255,
      Math.max(4, Math.round(a[1] * (1 - t) + b[1] * t + j * 0.7 + spark * 0.7)),
    )
    bg[i3 + 2] = Math.min(
      255,
      Math.max(3, Math.round(a[2] * (1 - t) + b[2] * t + j * 0.4 + spark * 0.3)),
    )
  }
}

// Mild blur of bg so it doesn't look noisy/hashy
let canvas = await sharp(bg, { raw: { width: W, height: H, channels: 3 } })
  .blur(0.6)
  .png()
  .toBuffer()

// --- Extract couple with soft alpha (left side), skip flat-black header band over hats ---
{
  const peopleW = 300
  const peopleH = H
  const rgba = Buffer.alloc(peopleW * peopleH * 4)
  for (let y = 0; y < peopleH; y++) {
    for (let x = 0; x < peopleW; x++) {
      const si = (y * W + x) * C
      const di = (y * peopleW + x) * 4
      const r = src[si]
      const g = src[si + 1]
      const b = src[si + 2]
      const v = (r + g + b) / 3

      // Soft horizontal falloff toward right (blend into bg)
      let alpha = smoothstep((peopleW - 1 - x) / 70)

      // Drop near-black header band pixels so bg texture shows through over hat crown
      if (y < 55 && v < 14) alpha *= 0.05
      else if (y < 70 && v < 10) alpha *= 0.15

      // Drop invitation / date chrome at bottom if any bright gold icons on left
      if (y > 360 && v > 40 && r - b > 8) alpha *= 0.1

      // Keep faces/clothes strongly
      if (v > 18 && y > 50 && y < 360) alpha = Math.max(alpha, smoothstep((peopleW - x) / 90))

      rgba[di] = r
      rgba[di + 1] = g
      rgba[di + 2] = b
      rgba[di + 3] = Math.round(255 * Math.min(1, alpha))
    }
  }
  const peoplePng = await sharp(rgba, {
    raw: { width: peopleW, height: peopleH, channels: 4 },
  })
    .png()
    .toBuffer()

  canvas = await sharp(canvas)
    .composite([{ input: peoplePng, left: 0, top: 0, blend: 'over' }])
    .png()
    .toBuffer()
}

// --- Extract circular logo with soft glow ---
{
  const logoCx = 384
  const logoCy = 205
  const logoR = 96
  const pad = 22
  const box = {
    left: logoCx - logoR - pad,
    top: logoCy - logoR - pad,
    width: (logoR + pad) * 2,
    height: (logoR + pad) * 2,
  }
  const extract = await sharp(sourcePath).extract(box).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })
  const cx = logoR + pad
  const cy = logoR + pad
  const { data: ld, info: li } = extract
  for (let y = 0; y < li.height; y++) {
    for (let x = 0; x < li.width; x++) {
      const i = (y * li.width + x) * li.channels
      const dist = Math.hypot(x - cx, y - cy)
      let alpha = 0
      if (dist <= logoR) alpha = 1
      else if (dist < logoR + pad) alpha = smoothstep(1 - (dist - logoR) / pad)
      // Kill any flourish pixels above ring that sneak into pad
      if (y < pad - 4 && dist > logoR - 2) alpha = 0
      ld[i + 3] = Math.round(255 * alpha)
    }
  }
  const logoPng = await sharp(ld, {
    raw: { width: li.width, height: li.height, channels: li.channels },
  })
    .png()
    .toBuffer()

  canvas = await sharp(canvas)
    .composite([{ input: logoPng, left: box.left, top: box.top, blend: 'over' }])
    .png()
    .toBuffer()
}

// Thin gold frame (subtle, not a black bar)
{
  const frame = await sharp(canvas).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const d = frame.data
  const w = frame.info.width
  const h = frame.info.height
  const c = frame.info.channels
  for (let x = 8; x < w - 8; x++) {
    for (const y of [6, 7, h - 8, h - 7]) {
      const i = (y * w + x) * c
      d[i] = Math.min(255, d[i] + 40)
      d[i + 1] = Math.min(255, d[i + 1] + 28)
      d[i + 2] = Math.min(255, d[i + 2] + 8)
    }
  }
  for (let y = 8; y < h - 8; y++) {
    for (const x of [6, 7, w - 8, w - 7]) {
      const i = (y * w + x) * c
      d[i] = Math.min(255, d[i] + 40)
      d[i + 1] = Math.min(255, d[i + 1] + 28)
      d[i + 2] = Math.min(255, d[i + 2] + 8)
    }
  }
  canvas = await sharp(d, { raw: { width: w, height: h, channels: c } })
    .removeAlpha()
    .png()
    .toBuffer()
}

fs.mkdirSync(probeDir, { recursive: true })
await sharp(canvas).png().toFile(path.join(probeDir, 'cleaned.png'))
const cm = await sharp(canvas).metadata()
await sharp(canvas)
  .extract({ left: 80, top: 0, width: Math.min(420, cm.width - 80), height: Math.min(140, cm.height) })
  .png()
  .toFile(path.join(probeDir, 'check-top.png'))
await sharp(canvas)
  .extract({ left: 100, top: 0, width: Math.min(220, cm.width - 100), height: Math.min(130, cm.height) })
  .png()
  .toFile(path.join(probeDir, 'check-hat.png'))
await sharp(canvas)
  .extract({
    left: Math.min(220, cm.width - 320),
    top: 0,
    width: Math.min(320, cm.width - 220),
    height: Math.min(120, cm.height),
  })
  .png()
  .toFile(path.join(probeDir, 'verify-header-close.png'))
await sharp(canvas)
  .extract({
    left: Math.min(200, cm.width - 360),
    top: Math.max(0, cm.height - 150),
    width: Math.min(360, cm.width - 200),
    height: Math.min(150, cm.height),
  })
  .png()
  .toFile(path.join(probeDir, 'check-bottom.png'))

{
  const { data: cd, info: ci } = await sharp(canvas).raw().toBuffer({ resolveWithObject: true })
  let flat = 0
  let goldText = 0
  let sum = 0
  let sum2 = 0
  let n = 0
  for (let y = 0; y < 60; y++) {
    for (let x = 120; x < 500; x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const v = (r + cd[i + 1] + cd[i + 2]) / 3
      sum += v
      sum2 += v * v
      n++
      if (v < 4) flat++
      if (v > 45 && r > cd[i + 2] + 12) goldText++
    }
  }
  const mean = sum / n
  const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean))
  console.log(
    'header flat/goldText/mean/std',
    flat,
    goldText,
    mean.toFixed(2),
    std.toFixed(2),
    std < 2.5 ? 'WARN-FLAT' : 'ok',
  )
}

const targetW = 1920
const targetH = Math.round((targetW * cm.height) / cm.width)
const heroJpeg = await sharp(canvas)
  .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 93, mozjpeg: true })
  .toBuffer()
const slide5Jpeg = await sharp(canvas).jpeg({ quality: 93, mozjpeg: true }).toBuffer()

await fs.promises.writeFile(path.join(root, 'public/images/terra-estilo-hero.jpg'), heroJpeg)
await fs.promises.writeFile(path.join(root, 'public/images/terra-estilo-hero-full.jpg'), heroJpeg)
await fs.promises.writeFile(path.join(root, 'public/images/hero/slide-1.jpg'), heroJpeg)
await fs.promises.writeFile(path.join(root, 'public/images/hero/slide-5.jpg'), slide5Jpeg)

await sharp(heroJpeg)
  .extract({ left: 350, top: 0, width: 1100, height: 400 })
  .png()
  .toFile(path.join(probeDir, 'verify-s1-top.png'))
await sharp(slide5Jpeg).png().toFile(path.join(probeDir, 'verify-s5-full.png'))

console.log('wrote heroes')
