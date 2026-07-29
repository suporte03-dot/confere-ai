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
 * Clone from nearby textured columns (left smoke + right gold-dust),
 * skipping bright glyph/ornament donors. Adds tiny hash noise so fill
 * never looks like a flat #000 rectangle.
 */
function sampleClone(src, w, h, ch, x, y, donorXs, maxDonorLum = 38) {
  let rr = 0
  let gg = 0
  let bb = 0
  let n = 0
  for (const dx of donorXs) {
    // Bias donor Y toward mid-dark field when wiping header (avoid frame gold)
    const baseY = y < 120 ? Math.max(140, Math.min(h - 30, 160 + (y % 40))) : y
    for (const oy of [-10, -5, -2, 0, 2, 5, 10]) {
      const yy = Math.min(h - 1, Math.max(0, baseY + oy))
      for (const ox of [-6, -3, 0, 3, 6]) {
        const xx = Math.min(w - 1, Math.max(0, dx + ox))
        const di = (yy * w + xx) * ch
        const dLum = (src[di] + src[di + 1] + src[di + 2]) / 3
        if (dLum > maxDonorLum) continue
        // Skip warm gold ornaments in donors
        if (src[di] - src[di + 2] > 18 && dLum > 22) continue
        rr += src[di]
        gg += src[di + 1]
        bb += src[di + 2]
        n++
      }
    }
  }
  if (n === 0) {
    const di = (Math.min(h - 1, Math.max(150, y)) * w + 510) * ch
    return [src[di], src[di + 1], src[di + 2]]
  }
  // Micro grain from position hash so fill isn't poster-flat
  const jitter = ((x * 374761 + y * 668265) % 7) - 3
  return [
    Math.min(255, Math.max(0, Math.round(rr / n) + jitter)),
    Math.min(255, Math.max(0, Math.round(gg / n) + jitter)),
    Math.min(255, Math.max(0, Math.round(bb / n) + Math.floor(jitter * 0.5))),
  ]
}

function wipeZone(dst, src, w, h, ch, zone, donorXs, blurRadius = 10) {
  const mask = new Float32Array(w * h)
  for (let y = zone.top; y < zone.top + zone.height; y++) {
    for (let x = zone.left; x < zone.left + zone.width; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      mask[y * w + x] = edgeWeight(x, y, zone)
    }
  }
  const soft = blurMask(mask, w, h, blurRadius)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = soft[y * w + x]
      if (a < 0.012) continue
      // Core = full replace (kills ghost lettering + gold line)
      if (a > 0.5) a = 1
      else a = smoothstep(a / 0.5)

      const [rr, gg, bb] = sampleClone(src, w, h, ch, x, y, donorXs)
      const i = (y * w + x) * ch
      dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
    }
  }
}

/** Aggressive pass: any warm/bright pixel in zone is forced to clone. */
function wipeCrumbs(dst, src, w, h, ch, zone, donorXs, logoSkip = null) {
  for (let y = zone.top; y < zone.top + zone.height; y++) {
    for (let x = zone.left; x < zone.left + zone.width; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      if (logoSkip) {
        const dist = Math.hypot(x - logoSkip.cx, y - logoSkip.cy)
        if (dist <= logoSkip.r) continue
      }
      const i = (y * w + x) * ch
      const r = dst[i]
      const g = dst[i + 1]
      const b = dst[i + 2]
      const lum = (r + g + b) / 3
      const warm = r - b >= 4
      // Faint bronze ghosts + any gold leaf crumbs
      if (lum < 9 && !warm) continue
      if (lum < 11 && !(warm && lum >= 8)) continue
      const ew = edgeWeight(x, y, zone)
      if (ew < 0.12) continue
      const a = ew > 0.4 ? 1 : Math.max(0.9, ew)
      const [rr, gg, bb] = sampleClone(src, w, h, ch, x, y, donorXs)
      dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
    }
  }
}

const source = pickSource()
await fs.promises.copyFile(source, workingSrc)

const meta = await sharp(workingSrc).metadata()
const W = meta.width
const H = meta.height
console.log('source', W, 'x', H, 'from', path.basename(source))

const { data: srcData, info } = await sharp(workingSrc)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const ch = info.channels
const data = Buffer.from(srcData)

const logoCx = 384
const logoCy = 205
const logoR = 96
const donors = [175, 195, 490, 515, 540, 565]

// Pass 1: full soft wipe of header (CONVITE + INAUGURAÇÃO + flourish)
// Height to 108 covers flourish (y≈86–95). Logo restored AFTER.
const headerZone = {
  left: 200,
  top: 0,
  width: 380,
  height: 108,
  featherL: 24,
  featherR: 30,
  featherT: 1,
  featherB: 14,
}
wipeZone(data, srcData, W, H, ch, headerZone, donors, 11)
wipeCrumbs(data, srcData, W, H, ch, headerZone, donors)

// Pass 2: dedicated flourish band (force obliterate gold line + leaf)
const flourishZone = {
  left: 240,
  top: 78,
  width: 300,
  height: 28,
  featherL: 16,
  featherR: 16,
  featherT: 5,
  featherB: 6,
}
wipeZone(data, srcData, W, H, ch, flourishZone, donors, 7)
wipeCrumbs(data, srcData, W, H, ch, flourishZone, donors)

// Pass 3: invitation paragraph
const bottomZone = {
  left: 205,
  top: 295,
  width: 365,
  height: H - 295 - 2,
  featherL: 18,
  featherR: 24,
  featherT: 12,
  featherB: 3,
}
wipeZone(data, srcData, W, H, ch, bottomZone, donors, 10)
wipeCrumbs(data, srcData, W, H, ch, bottomZone, donors)

let cleanedBuf = await sharp(data, { raw: { width: W, height: H, channels: ch } })
  .png()
  .toBuffer()

// Restore logo ring + soft glow, but NEVER reintroduce flourish above the ring.
{
  const sidePad = 18
  const topPad = 4 // stay below flourish (flourish ends ~y95, ring top=109)
  const botPad = 18
  const box = {
    left: logoCx - logoR - sidePad,
    top: logoCy - logoR - topPad,
    width: (logoR + sidePad) * 2,
    height: logoR + topPad + logoR + botPad,
  }
  const logoExtract = await sharp(workingSrc).extract(box).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })

  // Zero-out any pixels above the true ring top inside the extract
  const ringTopLocal = topPad // global y = logoCy - logoR
  const cx = logoR + sidePad
  const cy = logoR + topPad
  const { data: ld, info: li } = logoExtract
  for (let y = 0; y < li.height; y++) {
    for (let x = 0; x < li.width; x++) {
      const i = (y * li.width + x) * li.channels
      const dist = Math.hypot(x - cx, y - cy)
      // Soft radial alpha for glow; hard-kill rows above ring with only tiny pad
      let alpha = 0
      if (y < ringTopLocal - 1) {
        alpha = 0
      } else if (dist <= logoR) {
        alpha = 1
      } else if (dist < logoR + sidePad) {
        const t = 1 - (dist - logoR) / sidePad
        alpha = smoothstep(t)
      }
      ld[i + 3] = Math.round(255 * alpha)
    }
  }

  const logoMasked = await sharp(ld, {
    raw: { width: li.width, height: li.height, channels: li.channels },
  })
    .png()
    .toBuffer()

  cleanedBuf = await sharp(cleanedBuf)
    .composite([{ input: logoMasked, left: box.left, top: box.top, blend: 'over' }])
    .png()
    .toBuffer()
}

// Final crumb wipe above logo (outside ring)
{
  const again = await sharp(cleanedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  wipeCrumbs(
    again.data,
    srcData,
    W,
    H,
    again.info.channels,
    {
      left: 210,
      top: 0,
      width: 370,
      height: 110,
      featherL: 14,
      featherR: 18,
      featherT: 1,
      featherB: 8,
    },
    donors,
    { cx: logoCx, cy: logoCy, r: logoR + 3 },
  )
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
  const goldRows = []
  for (let y = 5; y < 105; y++) {
    let rowGold = 0
    for (let x = 250; x < 500; x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const g = cd[i + 1]
      const b = cd[i + 2]
      const v = (r + g + b) / 3
      sum += v
      sum2 += v * v
      n++
      if (v > 35 && r > b + 8) {
        gold++
        rowGold++
      }
      if (v > 45) bright++
    }
    if (rowGold > 5) goldRows.push(`y${y}:${rowGold}`)
  }
  const mean = sum / n
  const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean))
  console.log('header gold/bright/mean/std', gold, bright, mean.toFixed(2), std.toFixed(2))
  console.log('gold rows', goldRows.join(' ') || 'none')
  // Flourish band must be clean
  let flourishGold = 0
  for (let y = 80; y < 98; y++) {
    for (let x = 260; x < 500; x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const b = cd[i + 2]
      const v = (r + cd[i + 1] + b) / 3
      if (v > 30 && r > b + 6) flourishGold++
    }
  }
  console.log('flourish-band gold', flourishGold, flourishGold > 20 ? 'FAIL' : 'ok')
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

console.log('wrote heroes')
