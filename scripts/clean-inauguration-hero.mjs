/**
 * Final pass: kill the flat black band over the man's hat + remove invite text.
 * Starts from ORIGINAL flyer (image-14103c05).
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
const outs = {
  hero: path.join(root, 'public/images/terra-estilo-hero.jpg'),
  full: path.join(root, 'public/images/terra-estilo-hero-full.jpg'),
  s1: path.join(root, 'public/images/hero/slide-1.jpg'),
  s5: path.join(root, 'public/images/hero/slide-5.jpg'),
}
const probeDir = path.join(root, 'public/images/_probe')

const smoothstep = (t) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}
const hash01 = (x, y, s = 0) => {
  const n = Math.sin((x + s * 19) * 127.1 + (y + s * 7) * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function blurMask(mask, w, h, radius) {
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
        acc += mask[y * w + Math.min(w - 1, Math.max(0, x + k))] * kernel[k + radius]
      }
      tmp[y * w + x] = acc
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0
      for (let k = -radius; k <= radius; k++) {
        acc += tmp[Math.min(h - 1, Math.max(0, y + k)) * w + x] * kernel[k + radius]
      }
      out[y * w + x] = Math.min(1, acc)
    }
  }
  return out
}

function edgeWeight(x, y, box) {
  const dl = x - box.left
  const dr = box.left + box.width - 1 - x
  const dt = y - box.top
  const db = box.top + box.height - 1 - y
  if (dl < 0 || dr < 0 || dt < 0 || db < 0) return 0
  return Math.min(
    box.featherL ? smoothstep(dl / box.featherL) : 1,
    box.featherR ? smoothstep(dr / box.featherR) : 1,
    box.featherT ? smoothstep(dt / box.featherT) : 1,
    box.featherB ? smoothstep(db / box.featherB) : 1,
  )
}

function inLogo(x, y, logo, pad = 0) {
  return Math.hypot(x - logo.cx, y - logo.cy) <= logo.r + pad
}

/** Textured charcoal + subtle gold dust — never #000. */
function sampleBg(src, w, h, ch, x, y, logo) {
  const donors = []
  const take = (xx, yy, weight) => {
    if (xx < 6 || yy < 6 || xx >= w - 6 || yy >= h - 6) return
    if (inLogo(xx, yy, logo, 6)) return
    const i = (yy * w + xx) * ch
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = (r + g + b) / 3
    if (v < 4 || v > 110) return
    // skip bright gold lettering
    if (v > 40 && r - b > 10) return
    donors.push({ r, g, b, v, weight })
  }

  // Gold-dust column (right)
  for (const dx of [500, 520, 540, 560]) {
    for (let oy = -30; oy <= 40; oy += 5) {
      take(dx, Math.min(160, Math.max(14, 40 + ((y + oy + 200) % 120))), 2.5)
    }
  }
  // Clean mid field below header
  for (const yy of [115, 125, 135, 145, 155]) {
    for (const ox of [-20, -10, 0, 10, 20]) take(Math.min(560, Math.max(250, x + ox)), yy, 2.2)
  }
  // Soft smoke left of couple (not face)
  for (const dx of [40, 55, 70]) {
    for (const yy of [120, 140, 160, 180]) take(dx, yy, 1.0)
  }

  if (!donors.length) {
    const j = hash01(x, y)
    const base = 11 + Math.floor(j * 12)
    return [base + 2, base + 1, base]
  }
  donors.sort((a, b) => b.weight - a.weight)
  let r = 0
  let g = 0
  let b = 0
  let wt = 0
  for (const d of donors.slice(0, 24)) {
    const live = 0.55 + Math.min(1, d.v / 20) * 0.45
    const wgt = d.weight * live
    r += d.r * wgt
    g += d.g * wgt
    b += d.b * wgt
    wt += wgt
  }
  const j1 = (hash01(x, y, 1) - 0.5) * 9
  const j2 = (hash01(x, y, 2) - 0.5) * 5
  const spark = hash01(x, y, 3) > 0.93 ? 12 + hash01(x, y, 4) * 22 : 0
  return [
    Math.min(255, Math.max(6, Math.round(r / wt + j1 + spark))),
    Math.min(255, Math.max(5, Math.round(g / wt + j2 + spark * 0.7))),
    Math.min(255, Math.max(4, Math.round(b / wt + j2 * 0.5 + spark * 0.3))),
  ]
}

function applyZone(dst, src, w, h, ch, zone, logo) {
  const mask = new Float32Array(w * h)
  for (let y = zone.top; y < zone.top + zone.height; y++) {
    for (let x = zone.left; x < zone.left + zone.width; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      if (inLogo(x, y, logo, zone.logoPad ?? 0)) continue
      mask[y * w + x] = edgeWeight(x, y, zone)
    }
  }
  const soft = blurMask(mask, w, h, zone.blur ?? 16)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = soft[y * w + x]
      if (a < 0.02) continue
      if (inLogo(x, y, logo, 2)) continue
      a = a > 0.4 ? 1 : smoothstep(a / 0.4)
      const [rr, gg, bb] = sampleBg(src, w, h, ch, x, y, logo)
      const i = (y * w + x) * ch
      dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
    }
  }
}

/**
 * Nuke ANY near-black flat pixel in the top band (including over the hat),
 * then paint a rounded hat crown back on top.
 */
function eraseTopBlackBand(dst, src, w, h, ch, logo) {
  for (let y = 6; y < 58; y++) {
    for (let x = 90; x < 580; x++) {
      if (inLogo(x, y, logo, 4)) continue
      const i = (y * w + x) * ch
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      const warm = dst[i] - dst[i + 2]
      // Dead black OR leftover gold glyph crumbs in top strip
      const kill = v < 11 || (v > 28 && warm > 6 && x > 200)
      if (!kill) continue
      // Soften toward face/hat body — don't erase real midtones of face
      if (v > 18 && v < 85 && warm < 8 && x < 220 && y > 40) continue
      const [rr, gg, bb] = sampleBg(src, w, h, ch, x, y, logo)
      const a = v < 8 ? 1 : v < 14 ? 0.92 : 0.88
      dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
    }
  }
}

function rebuildHatCrown(dst, w, h, ch) {
  // Man's hat crown (behind woman) — extend rounded top into former black band
  const cx = 178
  const cy = 82
  const rx = 56
  const ry = 44
  for (let x = cx - rx; x <= cx + rx; x++) {
    if (x < 12 || x >= w - 12) continue
    const nx = (x - cx) / rx
    if (Math.abs(nx) > 1) continue
    const crownY = Math.round(cy - ry * Math.sqrt(Math.max(0, 1 - nx * nx)))
    if (crownY < 12) continue

    // Find reliable hat body sample below
    let bodyY = -1
    for (let y = Math.max(crownY + 8, 55); y < 115; y++) {
      const i = (y * w + x) * ch
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (v > 18 && v < 110 && dst[i] + dst[i + 1] > dst[i + 2] * 1.25) {
        bodyY = y
        break
      }
    }
    if (bodyY < 0) bodyY = 88

    for (let y = crownY; y < Math.min(bodyY, crownY + 55); y++) {
      const t = (y - crownY) / Math.max(1, bodyY - crownY)
      const sy = Math.min(h - 2, bodyY + Math.floor(4 + t * 14))
      const sx = Math.min(w - 2, Math.max(2, x + (hash01(x, y) > 0.5 ? 1 : -1)))
      const si = (sy * w + sx) * ch
      const shade = 0.62 + t * 0.38
      const j = (hash01(x, y, 9) - 0.5) * 8
      const r = Math.min(255, Math.max(6, Math.round(dst[si] * shade + j)))
      const g = Math.min(255, Math.max(5, Math.round(dst[si + 1] * shade + j * 0.75)))
      const b = Math.min(255, Math.max(4, Math.round(dst[si + 2] * shade * 0.92 + j * 0.4)))
      const edge = smoothstep(1 - Math.abs(nx) * 1.05)
      const a = edge * (0.55 + 0.45 * smoothstep(t * 0.8 + 0.2))
      const i = (y * w + x) * ch
      // Always paint crown; stronger where currently flat/bg
      const curV = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      const aa = curV < 16 ? Math.min(1, a + 0.25) : a * 0.85
      dst[i] = Math.round(dst[i] * (1 - aa) + r * aa)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - aa) + g * aa)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - aa) + b * aa)
    }
  }
}

function killGoldGhosts(dst, src, w, h, ch, logo) {
  for (let y = 8; y < 115; y++) {
    for (let x = 200; x < 560; x++) {
      if (inLogo(x, y, logo, 3)) continue
      const i = (y * w + x) * ch
      const r = dst[i]
      const g = dst[i + 1]
      const b = dst[i + 2]
      const v = (r + g + b) / 3
      if (!(v > 26 && r - b > 5)) continue
      const [rr, gg, bb] = sampleBg(src, w, h, ch, x, y, logo)
      dst[i] = rr
      dst[i + 1] = gg
      dst[i + 2] = bb
    }
  }
}

await fs.promises.copyFile(sourcePath, workingSrc)
const { data: srcData, info } = await sharp(workingSrc)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const ch = info.channels
const data = Buffer.from(srcData)
const logo = { cx: 384, cy: 205, r: 96 }
console.log('source', W, 'x', H)

// 1) Smaller header patches for invite text (hat-safe left start ~210 for text; separate hat band)
const zones = [
  // CRITICAL: black band over hat + top strip — textured, wide feather into hat
  {
    left: 100,
    top: 6,
    width: 480,
    height: 42,
    featherL: 28,
    featherR: 40,
    featherT: 4,
    featherB: 22,
    blur: 18,
  },
  // CONVITE
  {
    left: 210,
    top: 30,
    width: 350,
    height: 30,
    featherL: 42,
    featherR: 44,
    featherT: 14,
    featherB: 14,
    blur: 18,
  },
  // INAUGURAÇÃO
  {
    left: 208,
    top: 52,
    width: 360,
    height: 42,
    featherL: 44,
    featherR: 46,
    featherT: 14,
    featherB: 14,
    blur: 20,
  },
  // Flourish
  {
    left: 230,
    top: 88,
    width: 320,
    height: 24,
    featherL: 40,
    featherR: 42,
    featherT: 12,
    featherB: 14,
    blur: 16,
  },
  // Invite paragraph
  {
    left: 205,
    top: 292,
    width: 380,
    height: H - 295,
    featherL: 30,
    featherR: 36,
    featherT: 18,
    featherB: 3,
    blur: 14,
    logoPad: 10,
  },
  // Date row
  {
    left: 30,
    top: 365,
    width: 540,
    height: H - 367,
    featherL: 16,
    featherR: 20,
    featherT: 14,
    featherB: 2,
    blur: 10,
  },
]

for (const z of zones) applyZone(data, srcData, W, H, ch, z, logo)
for (const z of zones.slice(0, 4)) {
  applyZone(data, data, W, H, ch, { ...z, blur: (z.blur ?? 16) + 4 }, logo)
}

eraseTopBlackBand(data, srcData, W, H, ch, logo)
killGoldGhosts(data, srcData, W, H, ch, logo)
rebuildHatCrown(data, W, H, ch)
eraseTopBlackBand(data, srcData, W, H, ch, logo)
rebuildHatCrown(data, W, H, ch)
killGoldGhosts(data, srcData, W, H, ch, logo)

let cleanedBuf = await sharp(data, { raw: { width: W, height: H, channels: ch } })
  .png()
  .toBuffer()

// Restore logo
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

{
  const again = await sharp(cleanedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  killGoldGhosts(again.data, srcData, W, H, again.info.channels, logo)
  eraseTopBlackBand(again.data, srcData, W, H, again.info.channels, logo)
  rebuildHatCrown(again.data, W, H, again.info.channels)
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
  .extract({ left: 110, top: 0, width: 420, height: 130 })
  .png()
  .toFile(path.join(probeDir, 'check-top.png'))
await sharp(cleanedBuf)
  .extract({ left: 120, top: 5, width: 180, height: 110 })
  .png()
  .toFile(path.join(probeDir, 'check-hat.png'))
await sharp(cleanedBuf)
  .extract({ left: 200, top: 5, width: 320, height: 110 })
  .png()
  .toFile(path.join(probeDir, 'verify-header-close.png'))

{
  const { data: cd, info: ci } = await sharp(cleanedBuf).raw().toBuffer({ resolveWithObject: true })
  let flatHat = 0
  let gold = 0
  let sum = 0
  let sum2 = 0
  let n = 0
  for (let y = 10; y < 50; y++) {
    for (let x = 140; x < 220; x++) {
      const i = (y * ci.width + x) * ci.channels
      const v = (cd[i] + cd[i + 1] + cd[i + 2]) / 3
      if (v < 4) flatHat++
    }
  }
  for (let y = 10; y < 105; y++) {
    for (let x = 230; x < 520; x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const v = (r + cd[i + 1] + cd[i + 2]) / 3
      sum += v
      sum2 += v * v
      n++
      if (v > 35 && r > cd[i + 2] + 8) gold++
    }
  }
  const mean = sum / n
  const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean))
  console.log('hatFlat y10-50', flatHat, 'header gold/mean/std', gold, mean.toFixed(2), std.toFixed(2))
}

const targetW = 1920
const targetH = Math.round((targetW * H) / W)
const heroJpeg = await sharp(cleanedBuf)
  .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer()
const slide5Jpeg = await sharp(cleanedBuf).jpeg({ quality: 92, mozjpeg: true }).toBuffer()
await fs.promises.writeFile(outs.hero, heroJpeg)
await fs.promises.writeFile(outs.full, heroJpeg)
await fs.promises.writeFile(outs.s1, heroJpeg)
await fs.promises.writeFile(outs.s5, slide5Jpeg)
await sharp(outs.s1)
  .extract({ left: 400, top: 0, width: 1100, height: 380 })
  .png()
  .toFile(path.join(probeDir, 'verify-s1-top.png'))
await sharp(outs.s5).png().toFile(path.join(probeDir, 'verify-s5-full.png'))
console.log('wrote heroes')
