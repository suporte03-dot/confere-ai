/**
 * Aggressive but textured rebuild of Terra & Estilo hero.
 * Source: ORIGINAL flyer with gold invitation text (no prior black paint).
 * Strategy: multiple small patch strips clone from ABOVE/BELOW/RIGHT gold-dust,
 * heavy feather, hat-safe left edge, crown reconstruction. Never solid #000 fill.
 */
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

const sourcePath = path.join(
  assetsDir,
  'c__Users_Suporte03_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-14103c05-34fa-40f0-a356-9ad214a76c8f.png',
)
const workingSrc = path.join(root, 'public/images/brand/brand-inauguracao-flyer.png')
const outHero = path.join(root, 'public/images/terra-estilo-hero.jpg')
const outFullBleed = path.join(root, 'public/images/terra-estilo-hero-full.jpg')
const outSlide1 = path.join(root, 'public/images/hero/slide-1.jpg')
const outSlide5 = path.join(root, 'public/images/hero/slide-5.jpg')
const probeDir = path.join(root, 'public/images/_probe')

function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function hash01(x, y, salt = 0) {
  const n = Math.sin((x + salt * 19.1) * 127.1 + (y + salt * 7.3) * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function blurMask(mask, w, h, radius) {
  if (radius <= 0) return mask
  const tmp = new Float32Array(mask.length)
  const out = new Float32Array(mask.length)
  const sigma = Math.max(0.8, radius / 2.2)
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

function inLogo(x, y, logo, pad = 0) {
  return Math.hypot(x - logo.cx, y - logo.cy) <= logo.r + pad
}

function isGoldish(r, g, b) {
  const v = (r + g + b) / 3
  return v > 26 && r - b > 6 && r > 30
}

/**
 * Build a lively charcoal+gold-dust pixel from multiple donor regions.
 * Always returns grainy mid-dark — never pure 0,0,0.
 */
function sampleLively(src, w, h, ch, x, y, logo) {
  const donors = []
  const take = (xx, yy, weight) => {
    if (xx < 8 || yy < 8 || xx >= w - 8 || yy >= h - 8) return
    if (inLogo(xx, yy, logo, 4)) return
    const i = (yy * w + xx) * ch
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = (r + g + b) / 3
    // Prefer textured dark / soft gold dust — skip bright glyphs & dead black
    if (v < 3 || v > 120) return
    if (isGoldish(r, g, b) && v > 55) return
    donors.push({ r, g, b, v, weight })
  }

  // RIGHT gold-dust field (primary texture bank)
  for (const dx of [495, 510, 525, 540, 555, 570]) {
    for (const oy of [-20, -10, -4, 0, 4, 10, 20, 30]) {
      const yy = Math.min(h - 10, Math.max(12, ((y + oy) % 140) + 12))
      take(dx, yy, 2.4)
    }
  }

  // BELOW header (clean dark between flourish and logo)
  for (const yy of [108, 112, 118, 124, 132, 140]) {
    for (const ox of [-16, -8, 0, 8, 16]) take(x + ox, yy, 2.0)
  }

  // ABOVE / near frame but past dead strip
  for (const yy of [14, 18, 22, 26]) {
    for (const ox of [-12, 0, 12]) take(Math.min(580, Math.max(460, x + ox)), yy, 1.2)
  }

  // LEFT smoke (away from hat face detail)
  for (const dx of [70, 90, 110]) {
    for (const oy of [0, 8, 16]) take(dx, Math.min(200, 150 + oy), 0.9)
  }

  let r = 0
  let g = 0
  let b = 0
  let wt = 0
  if (donors.length === 0) {
    const j = hash01(x, y)
    const base = 10 + Math.floor(j * 14)
    return [base + 3, base + 1, base]
  }
  donors.sort((a, b) => b.weight - a.weight)
  for (const d of donors.slice(0, 22)) {
    // Bias toward samples with some liveliness
    const live = 0.5 + Math.min(1, d.v / 18) * 0.5
    const wgt = d.weight * live
    r += d.r * wgt
    g += d.g * wgt
    b += d.b * wgt
    wt += wgt
  }
  // Multi-frequency grain so fill never reads as a flat rectangle
  const j1 = (hash01(x, y, 1) - 0.5) * 10
  const j2 = (hash01(x, y, 2) - 0.5) * 6
  const j3 = (hash01(x * 2, y * 3, 3) - 0.5) * 4
  const sparkle = hash01(x, y, 4) > 0.94 ? 18 + hash01(x, y, 5) * 30 : 0
  return [
    Math.min(255, Math.max(5, Math.round(r / wt + j1 + sparkle))),
    Math.min(255, Math.max(4, Math.round(g / wt + j2 + sparkle * 0.75))),
    Math.min(255, Math.max(3, Math.round(b / wt + j3 + sparkle * 0.35))),
  ]
}

function patchZone(dst, src, w, h, ch, zone, logo, force = 1) {
  const mask = new Float32Array(w * h)
  for (let y = zone.top; y < zone.top + zone.height; y++) {
    for (let x = zone.left; x < zone.left + zone.width; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      if (inLogo(x, y, logo, zone.logoPad ?? 0)) continue
      mask[y * w + x] = edgeWeight(x, y, zone)
    }
  }
  const soft = blurMask(mask, w, h, zone.blur ?? 14)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = soft[y * w + x] * force
      if (a < 0.015) continue
      if (inLogo(x, y, logo, 2)) continue
      if (a > 0.45) a = 1
      else a = smoothstep(a / 0.45)
      const [rr, gg, bb] = sampleLively(src, w, h, ch, x, y, logo)
      const i = (y * w + x) * ch
      dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
    }
  }
}

function repairHatCrown(dst, w, h, ch) {
  const cx = 172
  const cy = 76
  const rx = 52
  const ry = 40
  for (let x = cx - rx; x <= cx + rx; x++) {
    if (x < 10 || x >= w - 10) continue
    const nx = (x - cx) / rx
    if (Math.abs(nx) > 1) continue
    const crownY = Math.round(cy - ry * Math.sqrt(Math.max(0, 1 - nx * nx)))
    if (crownY < 14) continue

    let bodyY = -1
    for (let y = Math.max(crownY, 20); y < 100; y++) {
      const i = (y * w + x) * ch
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (v > 15 && v < 100 && dst[i] + dst[i + 1] > dst[i + 2] * 1.3) {
        bodyY = y
        break
      }
    }
    if (bodyY < 0 || bodyY <= crownY + 1) continue

    for (let y = crownY; y < bodyY; y++) {
      const t = (y - crownY) / Math.max(1, bodyY - crownY)
      const sy = Math.min(h - 2, bodyY + 6 + Math.floor(t * 12))
      const sx = Math.min(w - 2, Math.max(2, x + (hash01(x, y) > 0.5 ? 1 : -1)))
      const si = (sy * w + sx) * ch
      const shade = 0.7 + t * 0.3
      const j = (hash01(x, y, 8) - 0.5) * 7
      const r = Math.min(255, Math.max(5, Math.round(dst[si] * shade + j)))
      const g = Math.min(255, Math.max(4, Math.round(dst[si + 1] * shade + j * 0.7)))
      const b = Math.min(255, Math.max(3, Math.round(dst[si + 2] * shade * 0.95 + j * 0.4)))
      const a = smoothstep(1 - Math.abs(nx)) * smoothstep(0.55 + t * 0.45) * 0.95
      const i = (y * w + x) * ch
      const curV = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      // Overwrite flat/black gap; keep existing hat if already present
      if (curV > 24 && t > 0.5) continue
      dst[i] = Math.round(dst[i] * (1 - a) + r * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + g * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + b * a)
    }
  }
}

/** Final pass: any remaining ultra-flat near-black in header gets forced texture. */
function vaporizeFlatBands(dst, src, w, h, ch, logo) {
  for (let y = 10; y < 118; y++) {
    for (let x = 200; x < 575; x++) {
      if (inLogo(x, y, logo, 2)) continue
      const i = (y * w + x) * ch
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      let sum = 0
      let sum2 = 0
      let n = 0
      for (let oy = -2; oy <= 2; oy++) {
        for (let ox = -5; ox <= 5; ox++) {
          const xx = x + ox
          const yy = y + oy
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
          const ii = (yy * w + xx) * ch
          const vv = (dst[ii] + dst[ii + 1] + dst[ii + 2]) / 3
          sum += vv
          sum2 += vv * vv
          n++
        }
      }
      const mean = sum / n
      const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean))
      // Flat band OR leftover bright ghost lettering
      const ghost = v > 32 && dst[i] - dst[i + 2] > 5
      const flat = v < 12 && std < 5
      if (!ghost && !flat) continue
      const [rr, gg, bb] = sampleLively(src, w, h, ch, x, y, logo)
      const a = ghost ? 0.98 : std < 2.5 ? 0.97 : 0.85
      dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
    }
  }
}

if (!fs.existsSync(sourcePath)) throw new Error('Missing original flyer source')
await fs.promises.copyFile(sourcePath, workingSrc)

const meta = await sharp(workingSrc).metadata()
const W = meta.width
const H = meta.height
console.log('source', W, 'x', H)

const { data: srcData, info } = await sharp(workingSrc)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const ch = info.channels
const data = Buffer.from(srcData)
const logo = { cx: 384, cy: 205, r: 96 }

// Multiple smaller patches (not one giant black rect). Left edge stays clear of hat (~x215+).
const patches = [
  // CONVITE ESPECIAL strip
  {
    left: 218,
    top: 28,
    width: 340,
    height: 28,
    featherL: 36,
    featherR: 40,
    featherT: 12,
    featherB: 12,
    blur: 16,
    logoPad: 0,
  },
  // INAUGURAÇÃO main word — upper half
  {
    left: 215,
    top: 52,
    width: 350,
    height: 28,
    featherL: 40,
    featherR: 42,
    featherT: 14,
    featherB: 10,
    blur: 18,
    logoPad: 0,
  },
  // INAUGURAÇÃO lower half
  {
    left: 215,
    top: 72,
    width: 350,
    height: 26,
    featherL: 40,
    featherR: 42,
    featherT: 10,
    featherB: 12,
    blur: 18,
    logoPad: 0,
  },
  // Flourish / gold divider under title
  {
    left: 230,
    top: 88,
    width: 310,
    height: 22,
    featherL: 36,
    featherR: 40,
    featherT: 10,
    featherB: 12,
    blur: 14,
    logoPad: 0,
  },
  // Soft bridge above CONVITE (kills any residual top band seam)
  {
    left: 230,
    top: 8,
    width: 320,
    height: 26,
    featherL: 44,
    featherR: 48,
    featherT: 6,
    featherB: 14,
    blur: 16,
    logoPad: 0,
  },
  // Invitation paragraph
  {
    left: 210,
    top: 295,
    width: 370,
    height: H - 298,
    featherL: 28,
    featherR: 36,
    featherT: 18,
    featherB: 4,
    blur: 14,
    logoPad: 8,
  },
  // Date / time / address row
  {
    left: 40,
    top: 370,
    width: 520,
    height: H - 372,
    featherL: 20,
    featherR: 24,
    featherT: 12,
    featherB: 2,
    blur: 10,
    logoPad: 0,
  },
]

for (const zone of patches) {
  patchZone(data, srcData, W, H, ch, zone, logo, 1)
}

// Second pass on header strips to kill ghosts
for (const zone of patches.slice(0, 5)) {
  patchZone(data, data, W, H, ch, { ...zone, blur: (zone.blur ?? 14) + 4 }, logo, 1)
}

vaporizeFlatBands(data, srcData, W, H, ch, logo)
repairHatCrown(data, W, H, ch)
vaporizeFlatBands(data, srcData, W, H, ch, logo)

let cleanedBuf = await sharp(data, { raw: { width: W, height: H, channels: ch } })
  .png()
  .toBuffer()

// Restore logo ring from original
{
  const sidePad = 18
  const topPad = 2
  const botPad = 18
  const box = {
    left: logo.cx - logo.r - sidePad,
    top: logo.cy - logo.r - topPad,
    width: (logo.r + sidePad) * 2,
    height: logo.r + topPad + logo.r + botPad,
  }
  const logoExtract = await sharp(workingSrc).extract(box).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })
  const cx = logo.r + sidePad
  const cy = logo.r + topPad
  const { data: ld, info: li } = logoExtract
  for (let y = 0; y < li.height; y++) {
    for (let x = 0; x < li.width; x++) {
      const i = (y * li.width + x) * li.channels
      const dist = Math.hypot(x - cx, y - cy)
      let alpha = 0
      if (dist <= logo.r) alpha = 1
      else if (dist < logo.r + sidePad) alpha = smoothstep(1 - (dist - logo.r) / sidePad)
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

// Final flat/ghost cleanup after logo restore
{
  const again = await sharp(cleanedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  vaporizeFlatBands(again.data, srcData, W, H, again.info.channels, logo)
  repairHatCrown(again.data, W, H, again.info.channels)
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
  .extract({ left: 160, top: 0, width: 420, height: 130 })
  .png()
  .toFile(path.join(probeDir, 'check-top.png'))
await sharp(cleanedBuf)
  .extract({ left: 110, top: 8, width: 200, height: 110 })
  .png()
  .toFile(path.join(probeDir, 'check-hat.png'))
await sharp(cleanedBuf)
  .extract({ left: 220, top: 8, width: 300, height: 105 })
  .png()
  .toFile(path.join(probeDir, 'verify-header-close.png'))
await sharp(cleanedBuf)
  .extract({ left: 210, top: 285, width: 370, height: 140 })
  .png()
  .toFile(path.join(probeDir, 'check-bottom.png'))

{
  const { data: cd, info: ci } = await sharp(cleanedBuf).raw().toBuffer({ resolveWithObject: true })
  let gold = 0
  let flat = 0
  let sum = 0
  let sum2 = 0
  let n = 0
  for (let y = 10; y < 105; y++) {
    for (let x = 230; x < 520; x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const g = cd[i + 1]
      const b = cd[i + 2]
      const v = (r + g + b) / 3
      sum += v
      sum2 += v * v
      n++
      if (v > 35 && r > b + 8) gold++
      if (v < 4) flat++
    }
  }
  const mean = sum / n
  const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean))
  console.log('header gold/flat/mean/std', gold, flat, mean.toFixed(2), std.toFixed(2))
  if (std < 4) console.log('WARN flat header')
  if (flat > 400) console.log('WARN flat pixels')
  if (gold > 80) console.log('WARN gold ghosts')
}

const targetW = 1920
const targetH = Math.round((targetW * H) / W)
const heroJpeg = await sharp(cleanedBuf)
  .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer()
const slide5Jpeg = await sharp(cleanedBuf).jpeg({ quality: 92, mozjpeg: true }).toBuffer()

await fs.promises.writeFile(outHero, heroJpeg)
await fs.promises.writeFile(outFullBleed, heroJpeg)
await fs.promises.writeFile(outSlide1, heroJpeg)
await fs.promises.writeFile(outSlide5, slide5Jpeg)

await sharp(outSlide1)
  .extract({ left: 450, top: 0, width: 1100, height: 400 })
  .png()
  .toFile(path.join(probeDir, 'verify-s1-top.png'))
await sharp(outSlide5)
  .extract({ left: 110, top: 0, width: 400, height: 140 })
  .png()
  .toFile(path.join(probeDir, 'verify-s5-top.png'))
await sharp(outSlide5).png().toFile(path.join(probeDir, 'verify-s5-full.png'))

console.log('wrote heroes')
