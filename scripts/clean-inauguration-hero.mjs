import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const assetsDir = path.join(
  'C:',
  'Users',
  'Suporte03',
  '.cursor',
  'projects',
  'c-Users-Suporte03-confere-ai',
  'assets',
)

const candidateSources = [
  path.join(
    assetsDir,
    'c__Users_Suporte03_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-14103c05-34fa-40f0-a356-9ad214a76c8f.png',
  ),
  path.join(root, 'public/images/brand/brand-inauguracao-flyer.png'),
]

const workingSrc = path.join(root, 'public/images/brand/brand-inauguracao-flyer.png')
const outHero = path.join(root, 'public/images/terra-estilo-hero.jpg')
const outFullBleed = path.join(root, 'public/images/terra-estilo-hero-full.jpg')
const outSlide1 = path.join(root, 'public/images/hero/slide-1.jpg')
const outSlide5 = path.join(root, 'public/images/hero/slide-5.jpg')
const probeDir = path.join(root, 'public/images/_probe')

function pickSource() {
  for (const candidate of candidateSources) {
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error('No inauguration flyer source found')
}

function blurMask(mask, w, h, radius) {
  if (radius <= 0) return mask
  const tmp = new Float32Array(mask.length)
  const out = new Float32Array(mask.length)
  const sigma = Math.max(0.8, radius / 2)
  const kernel = []
  let ksum = 0
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma))
    kernel.push(v)
    ksum += v
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= ksum

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0
      for (let k = -radius; k <= radius; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k))
        acc += mask[y * w + xx] * kernel[k + radius]
      }
      tmp[y * w + x] = acc
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0
      for (let k = -radius; k <= radius; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k))
        acc += tmp[yy * w + x] * kernel[k + radius]
      }
      out[y * w + x] = Math.min(1, acc)
    }
  }
  return out
}

function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Asymmetric edge weight — full cover in core, soft only where requested. */
function edgeWeight(x, y, box) {
  const { left, top, width: zw, height: zh, featherL, featherR, featherT, featherB } = box
  const dl = x - left
  const dr = left + zw - 1 - x
  const dt = y - top
  const db = top + zh - 1 - y
  if (dl < 0 || dr < 0 || dt < 0 || db < 0) return 0

  const wl = featherL > 0 ? smoothstep(dl / featherL) : 1
  const wr = featherR > 0 ? smoothstep(dr / featherR) : 1
  const wt = featherT > 0 ? smoothstep(dt / featherT) : 1
  const wb = featherB > 0 ? smoothstep(db / featherB) : 1
  return Math.min(wl, wr, wt, wb)
}

/**
 * Build a textured fill plate from large donor patches (dark grain + gold dust),
 * then soft-composite over a zone. Core of the zone is 100% replaced — no ghosts.
 */
async function buildTexturePlate(srcPath, w, h) {
  // Large mid-right dark textured field (subtle grain, no glyphs)
  const dark = await sharp(srcPath)
    .extract({ left: 470, top: 150, width: 120, height: 160 })
    .resize(w, h, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer()

  // Gold-dust strip from upper-right, darkened so it doesn't dominate
  const dust = await sharp(srcPath)
    .extract({ left: 520, top: 20, width: 70, height: 120 })
    .resize(w, h, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .modulate({ brightness: 0.55, saturation: 0.7 })
    .blur(1.2)
    .png()
    .toBuffer()

  // Soft blend dust into dark plate at low opacity for natural sparkle
  return sharp(dark)
    .composite([{ input: dust, blend: 'screen', gravity: 'centre' }])
    .modulate({ brightness: 0.88, saturation: 0.75 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
}

function applySoftZone(base, plate, w, h, ch, zone, blurRadius = 10) {
  const mask = new Float32Array(w * h)
  for (let y = zone.top; y < zone.top + zone.height; y++) {
    for (let x = zone.left; x < zone.left + zone.width; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      // Force full strength in core; feather only at configured edges
      mask[y * w + x] = edgeWeight(x, y, zone)
    }
  }
  const soft = blurMask(mask, w, h, blurRadius)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = soft[y * w + x]
      if (a < 0.01) continue
      // Boost core so residual ghosts cannot survive mid-tones
      if (a > 0.55) a = 1
      else a = smoothstep(a / 0.55)

      const i = (y * w + x) * ch
      const pi = (y * w + x) * plate.info.channels
      const pr = plate.data[pi]
      const pg = plate.data[pi + 1]
      const pb = plate.data[pi + 2]
      base[i] = Math.round(base[i] * (1 - a) + pr * a)
      base[i + 1] = Math.round(base[i + 1] * (1 - a) + pg * a)
      base[i + 2] = Math.round(base[i + 2] * (1 - a) + pb * a)
    }
  }
}

/** Extra pass: wipe any remaining warm/bright crumbs inside zone. */
function wipeBrightCrumbs(base, plate, w, h, ch, zone) {
  const { left, top, width: zw, height: zh } = zone
  for (let y = top; y < top + zh; y++) {
    for (let x = left; x < left + zw; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      const i = (y * w + x) * ch
      const r = base[i]
      const g = base[i + 1]
      const b = base[i + 2]
      const lum = (r + g + b) / 3
      const warm = r >= b && r - b >= 3
      // Catch faint bronze ghosts + gold flourish crumbs
      if (lum < 10 && !warm) continue
      if (lum < 14 && !warm) continue
      if (!(lum >= 14 || (warm && lum >= 10))) continue

      const ew = edgeWeight(x, y, zone)
      if (ew < 0.2) continue
      const a = ew > 0.5 ? 1 : ew
      const pi = (y * w + x) * plate.info.channels
      base[i] = Math.round(base[i] * (1 - a) + plate.data[pi] * a)
      base[i + 1] = Math.round(base[i + 1] * (1 - a) + plate.data[pi + 1] * a)
      base[i + 2] = Math.round(base[i + 2] * (1 - a) + plate.data[pi + 2] * a)
    }
  }
}

const source = pickSource()
await fs.promises.copyFile(source, workingSrc)

const meta = await sharp(workingSrc).metadata()
const W = meta.width
const H = meta.height
console.log('source', W, 'x', H, 'from', path.basename(source))

const { data, info } = await sharp(workingSrc)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const ch = info.channels

const logoCx = 384
const logoCy = 205
const logoR = 96

const plate = await buildTexturePlate(workingSrc, W, H)

// Header: CONVITE ESPECIAL + INAUGURAÇÃO + gold leaf flourish (y≈10–92).
// NO logo-protect during fill — restore logo after so flourish can be wiped.
const headerZone = {
  left: 210,
  top: 0,
  width: 360,
  height: 104,
  featherL: 22,
  featherR: 28,
  featherT: 2, // almost full at top (kills CONVITE lines)
  featherB: 16, // soft into logo glow area
}

applySoftZone(data, plate, W, H, ch, headerZone, 12)
wipeBrightCrumbs(data, plate, W, H, ch, headerZone)
// Second hard pass on flourish band specifically
const flourishZone = {
  left: 250,
  top: 82,
  width: 280,
  height: 22,
  featherL: 18,
  featherR: 18,
  featherT: 6,
  featherB: 8,
}
applySoftZone(data, plate, W, H, ch, flourishZone, 8)
wipeBrightCrumbs(data, plate, W, H, ch, flourishZone)

// Invitation paragraph under logo
const bottomZone = {
  left: 210,
  top: 298,
  width: 360,
  height: H - 298 - 2,
  featherL: 18,
  featherR: 22,
  featherT: 14,
  featherB: 4,
}
applySoftZone(data, plate, W, H, ch, bottomZone, 10)
wipeBrightCrumbs(data, plate, W, H, ch, bottomZone)

let cleanedBuf = await sharp(Buffer.from(data), {
  raw: { width: W, height: H, channels: ch },
})
  .png()
  .toBuffer()

// Restore circular logo + soft outer glow from pristine original (after text wipe)
{
  const glowPad = 20
  const box = {
    left: logoCx - logoR - glowPad,
    top: logoCy - logoR - glowPad,
    width: (logoR + glowPad) * 2,
    height: (logoR + glowPad) * 2,
  }
  const logoExtract = await sharp(workingSrc).extract(box).ensureAlpha().png().toBuffer()
  // Hard-exclude anything above the ring interior so we don't bring INAUGURAÇÃO back
  const softCircle = Buffer.from(
    `<svg width="${box.width}" height="${box.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="white" stop-opacity="1"/>
          <stop offset="70%" stop-color="white" stop-opacity="1"/>
          <stop offset="85%" stop-color="white" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <mask id="m">
          <rect width="100%" height="100%" fill="black"/>
          <circle cx="${logoR + glowPad}" cy="${logoR + glowPad}" r="${logoR + glowPad}" fill="url(#g)"/>
        </mask>
      </defs>
      <circle cx="${logoR + glowPad}" cy="${logoR + glowPad}" r="${logoR + glowPad}" fill="url(#g)"/>
    </svg>`,
  )
  const logoMasked = await sharp(logoExtract)
    .composite([{ input: softCircle, blend: 'dest-in' }])
    .png()
    .toBuffer()

  cleanedBuf = await sharp(cleanedBuf)
    .composite([{ input: logoMasked, left: box.left, top: box.top, blend: 'over' }])
    .png()
    .toBuffer()
}

// Final crumb wipe ABOVE the logo ring only (don't touch restored logo)
{
  const again = await sharp(cleanedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const plate2 = await buildTexturePlate(workingSrc, W, H)
  const aboveLogo = {
    left: 220,
    top: 0,
    width: 350,
    height: 108,
    featherL: 16,
    featherR: 20,
    featherT: 1,
    featherB: 10,
  }
  // Only wipe pixels that are still warm/bright AND outside the logo circle
  const { left, top, width: zw, height: zh } = aboveLogo
  for (let y = top; y < top + zh; y++) {
    for (let x = left; x < left + zw; x++) {
      const dist = Math.hypot(x - logoCx, y - logoCy)
      if (dist <= logoR + 6) continue
      const i = (y * again.info.width + x) * again.info.channels
      const r = again.data[i]
      const g = again.data[i + 1]
      const b = again.data[i + 2]
      const lum = (r + g + b) / 3
      const warm = r >= b && r - b >= 3
      if (lum < 12 && !(warm && lum >= 9)) continue
      const ew = edgeWeight(x, y, aboveLogo)
      if (ew < 0.15) continue
      const a = ew > 0.45 ? 1 : Math.max(ew, 0.85)
      const pi = (y * W + x) * plate2.info.channels
      again.data[i] = Math.round(again.data[i] * (1 - a) + plate2.data[pi] * a)
      again.data[i + 1] = Math.round(again.data[i + 1] * (1 - a) + plate2.data[pi + 1] * a)
      again.data[i + 2] = Math.round(again.data[i + 2] * (1 - a) + plate2.data[pi + 2] * a)
    }
  }
  cleanedBuf = await sharp(again.data, {
    raw: { width: W, height: H, channels: again.info.channels },
  })
    .removeAlpha()
    .png()
    .toBuffer()
}

fs.mkdirSync(probeDir, { recursive: true })
await sharp(cleanedBuf).png().toFile(path.join(probeDir, 'cleaned.png'))
await sharp(cleanedBuf)
  .extract({ left: 200, top: 0, width: 360, height: 130 })
  .png()
  .toFile(path.join(probeDir, 'check-top.png'))
await sharp(cleanedBuf)
  .extract({ left: 240, top: 15, width: 280, height: 95 })
  .png()
  .toFile(path.join(probeDir, 'verify-header-close.png'))
await sharp(cleanedBuf)
  .extract({ left: 300, top: 70, width: 180, height: 80 })
  .png()
  .toFile(path.join(probeDir, 'check-logo-top.png'))
await sharp(cleanedBuf)
  .extract({ left: 220, top: 290, width: 360, height: 130 })
  .png()
  .toFile(path.join(probeDir, 'check-bottom.png'))

{
  const { data: cd, info: ci } = await sharp(cleanedBuf).raw().toBuffer({ resolveWithObject: true })
  let gold = 0
  let bright = 0
  let sum = 0
  let sum2 = 0
  let n = 0
  let flat = 0
  for (let y = 8; y < 100; y++) {
    let rowSum = 0
    let rowSum2 = 0
    let rowN = 0
    for (let x = 240; x < 520; x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const g = cd[i + 1]
      const b = cd[i + 2]
      const v = (r + g + b) / 3
      sum += v
      sum2 += v * v
      n++
      rowSum += v
      rowSum2 += v * v
      rowN++
      if (v > 35 && r > b + 8) gold++
      if (v > 45) bright++
    }
    const m = rowSum / rowN
    const sd = Math.sqrt(Math.max(0, rowSum2 / rowN - m * m))
    if (sd < 1.0 && m < 6) flat++
  }
  const mean = sum / n
  const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean))
  console.log(
    'header gold/bright/mean/std/flatRows',
    gold,
    bright,
    mean.toFixed(2),
    std.toFixed(2),
    flat,
  )
  if (gold > 30) console.warn('WARN: residual gold still high')
  if (flat > 40) console.warn('WARN: too many flat rows (mancha risk)')
}

const targetW = 1920
const targetH = Math.round((targetW * H) / W)
const heroJpeg = await sharp(cleanedBuf)
  .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer()

const slide5Jpeg = await sharp(cleanedBuf)
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer()

await fs.promises.writeFile(outHero, heroJpeg)
await fs.promises.writeFile(outFullBleed, heroJpeg)
await fs.promises.writeFile(outSlide1, heroJpeg)
await fs.promises.writeFile(outSlide5, slide5Jpeg)

await sharp(outSlide1)
  .extract({ left: 700, top: 0, width: 900, height: 420 })
  .png()
  .toFile(path.join(probeDir, 'verify-s1-top.png'))
await sharp(outSlide5)
  .extract({ left: 200, top: 0, width: 360, height: 140 })
  .png()
  .toFile(path.join(probeDir, 'verify-s5-top.png'))
await sharp(outSlide5).png().toFile(path.join(probeDir, 'verify-s5-full.png'))

console.log('wrote', path.basename(outHero), targetW + 'x' + targetH)
console.log('wrote', path.basename(outSlide1))
console.log('wrote', path.basename(outSlide5), '601x433')
