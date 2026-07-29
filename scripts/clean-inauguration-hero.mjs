/**
 * Reliable hero fix from ORIGINAL flyer:
 * 1) Crop top frame strip
 * 2) Wipe invite text ONLY to the right of the hat (x>=230)
 * 3) Reconstruct man's hat crown into the original black cut
 * 4) Luminance-matched textured fill (no solid black rects)
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
  const n = Math.sin((x + s * 17.3) * 127.1 + (y + s * 9.1) * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function inLogo(x, y, logo, pad = 0) {
  return Math.hypot(x - logo.cx, y - logo.cy) <= logo.r + pad
}

function pix(src, w, h, ch, x, y) {
  const xx = Math.min(w - 1, Math.max(0, x))
  const yy = Math.min(h - 1, Math.max(0, y))
  const i = (yy * w + xx) * ch
  return [src[i], src[i + 1], src[i + 2]]
}

/** Prefer pixels from BELOW / RIGHT with similar local luminance — never #000. */
function sampleMatched(src, w, h, ch, x, y, logo, targetLum) {
  const donors = []
  const take = (xx, yy, weight) => {
    if (xx < 4 || yy < 4 || xx >= w - 4 || yy >= h - 4) return
    if (inLogo(xx, yy, logo, 6)) return
    const [r, g, b] = pix(src, w, h, ch, xx, yy)
    const v = (r + g + b) / 3
    if (v < 5 || v > 115) return
    if (v > 40 && r - b > 12) return // skip gold glyphs
    const lumDist = Math.abs(v - targetLum)
    donors.push({ r, g, b, v, weight: weight / (1 + lumDist * 0.08) })
  }

  // Primary: same column below (continuation of field)
  for (const dy of [18, 28, 40, 55, 70, 90]) take(x, y + dy, 3.2)
  for (const dy of [18, 28, 40, 55]) {
    take(x - 8, y + dy, 2.0)
    take(x + 8, y + dy, 2.0)
  }
  // Right gold-dust (liveliness)
  for (const dx of [510, 530, 550, 570]) {
    for (const yy of [30, 50, 70, 100, 130]) take(dx, yy, 1.6)
  }
  // Mid field
  for (const yy of [130, 150, 170]) take(Math.min(500, Math.max(260, x)), yy, 1.4)

  if (!donors.length) {
    const base = Math.max(8, Math.round(targetLum * 0.85))
    return [base + 2, base + 1, base]
  }
  donors.sort((a, b) => b.weight - a.weight)
  let r = 0
  let g = 0
  let b = 0
  let wt = 0
  for (const d of donors.slice(0, 16)) {
    r += d.r * d.weight
    g += d.g * d.weight
    b += d.b * d.weight
    wt += d.weight
  }
  const j = (hash01(x, y, 1) - 0.5) * 5
  const spark = hash01(x, y, 2) > 0.97 ? 8 + hash01(x, y, 3) * 16 : 0
  return [
    Math.min(255, Math.max(6, Math.round(r / wt + j + spark))),
    Math.min(255, Math.max(5, Math.round(g / wt + j * 0.7 + spark * 0.65))),
    Math.min(255, Math.max(4, Math.round(b / wt + j * 0.4 + spark * 0.25))),
  ]
}

function softWipe(dst, src, w, h, ch, box, logo) {
  const { left, top, width: bw, height: bh, feather = 45 } = box
  // Target luminance from just below the box
  let lumSum = 0
  let lumN = 0
  const ly = Math.min(h - 2, top + bh + 8)
  for (let x = left; x < left + bw; x += 3) {
    if (inLogo(x, ly, logo, 4)) continue
    const [r, g, b] = pix(src, w, h, ch, x, ly)
    const v = (r + g + b) / 3
    if (v > 5 && v < 80) {
      lumSum += v
      lumN++
    }
  }
  const targetLum = lumN ? lumSum / lumN : 14

  for (let y = top; y < top + bh; y++) {
    for (let x = left; x < left + bw; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      if (inLogo(x, y, logo, 3)) continue
      const dl = x - left
      const dr = left + bw - 1 - x
      const dt = y - top
      const db = top + bh - 1 - y
      let a = Math.min(
        smoothstep(Math.min(dl, dr) / feather),
        smoothstep(dt / (feather * 0.6)),
        smoothstep(db / (feather * 0.75)),
      )
      if (a < 0.02) continue
      a = a > 0.5 ? 1 : smoothstep(a / 0.5)
      const [rr, gg, bb] = sampleMatched(src, w, h, ch, x, y, logo, targetLum)
      const i = (y * w + x) * ch
      dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
    }
  }
}

function killGoldIn(dst, src, w, h, ch, logo, x0, y0, x1, y1) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (inLogo(x, y, logo, 3)) continue
      const i = (y * w + x) * ch
      const r = dst[i]
      const g = dst[i + 1]
      const b = dst[i + 2]
      const v = (r + g + b) / 3
      if (v > 22 && r - b > 4) {
        const [rr, gg, bb] = sampleMatched(src, w, h, ch, x, y, logo, 14)
        dst[i] = rr
        dst[i + 1] = gg
        dst[i + 2] = bb
      }
    }
  }
}

/**
 * Paint a continuous rounded cowboy-hat crown where the flyer had a hard black cut.
 * Uses real hat-body colors from lower rows.
 */
function paintHatCrown(dst, w, h, ch) {
  const cx = 176
  const cy = 78
  const rx = 58
  const ry = 46

  // Collect body color samples once
  const bodySamples = []
  for (let y = 70; y < 120; y++) {
    for (let x = cx - 40; x <= cx + 40; x++) {
      const i = (y * w + x) * ch
      const r = dst[i]
      const g = dst[i + 1]
      const b = dst[i + 2]
      const v = (r + g + b) / 3
      if (v > 20 && v < 95 && r + g > b * 1.2) bodySamples.push([r, g, b, v])
    }
  }
  const avg = bodySamples.length
    ? bodySamples
        .reduce((a, s) => [a[0] + s[0], a[1] + s[1], a[2] + s[2]], [0, 0, 0])
        .map((v) => v / bodySamples.length)
    : [28, 22, 16]

  for (let x = cx - rx; x <= cx + rx; x++) {
    if (x < 8 || x >= w - 8) continue
    const nx = (x - cx) / rx
    if (Math.abs(nx) > 1) continue
    const crownY = Math.round(cy - ry * Math.sqrt(Math.max(0, 1 - nx * nx)))

    // Find first existing hat/midtone going down
    let bodyY = -1
    for (let y = Math.max(crownY, 35); y < 125; y++) {
      const i = (y * w + x) * ch
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (v > 18 && v < 100 && dst[i] + dst[i + 1] > dst[i + 2] * 1.2) {
        bodyY = y
        break
      }
    }
    if (bodyY < 0) bodyY = 85

    for (let y = Math.max(8, crownY); y < bodyY; y++) {
      const t = (y - crownY) / Math.max(1, bodyY - crownY)
      // Sample from body with slight jitter
      const sy = Math.min(h - 2, bodyY + 4 + Math.floor(t * 16))
      const sx = Math.min(w - 2, Math.max(2, x + Math.floor((hash01(x, y) - 0.5) * 4)))
      let [r, g, b] = pix(dst, w, h, ch, sx, sy)
      const bv = (r + g + b) / 3
      if (bv < 12) {
        r = avg[0]
        g = avg[1]
        b = avg[2]
      }
      const shade = 0.55 + t * 0.45
      const j = (hash01(x, y, 4) - 0.5) * 6
      r = Math.min(255, Math.max(8, Math.round(r * shade + j)))
      g = Math.min(255, Math.max(6, Math.round(g * shade + j * 0.75)))
      b = Math.min(255, Math.max(5, Math.round(b * shade * 0.92 + j * 0.4)))

      const edge = smoothstep(1 - Math.abs(nx) * 1.02)
      // Stronger fill where current pixel is dead/dark band
      const i = (y * w + x) * ch
      const curV = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      let a = edge * (0.5 + 0.5 * smoothstep(0.2 + t))
      if (curV < 14) a = Math.min(1, a + 0.35)
      if (curV > 35 && t > 0.65) a *= 0.35 // don't clobber face
      dst[i] = Math.round(dst[i] * (1 - a) + r * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + g * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + b * a)
    }
  }
}

/** Soften any remaining hard horizontal seam across the hat/header. */
function blurSeam(dst, w, h, ch, y0, y1, x0, x1) {
  const copy = Buffer.from(dst)
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      let r = 0
      let g = 0
      let b = 0
      let n = 0
      for (let oy = -3; oy <= 3; oy++) {
        for (let ox = -2; ox <= 2; ox++) {
          const xx = x + ox
          const yy = y + oy
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
          const i = (yy * w + xx) * ch
          r += copy[i]
          g += copy[i + 1]
          b += copy[i + 2]
          n++
        }
      }
      const i = (y * w + x) * ch
      const a = 0.55
      dst[i] = Math.round(dst[i] * (1 - a) + (r / n) * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + (g / n) * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + (b / n) * a)
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

// Text wipes — LEFT EDGE CLEAR OF HAT (hat ~x100-220)
softWipe(data, srcData, W, H, ch, { left: 232, top: 20, width: 330, height: 34, feather: 48 }, logo)
softWipe(data, srcData, W, H, ch, { left: 228, top: 46, width: 340, height: 50, feather: 52 }, logo)
softWipe(data, srcData, W, H, ch, { left: 240, top: 88, width: 300, height: 28, feather: 46 }, logo)
softWipe(data, srcData, W, H, ch, { left: 210, top: 292, width: 370, height: H - 294, feather: 40 }, logo)
softWipe(data, srcData, W, H, ch, { left: 30, top: 362, width: 540, height: H - 364, feather: 28 }, logo)
softWipe(data, data, W, H, ch, { left: 235, top: 24, width: 320, height: 88, feather: 55 }, logo)
killGoldIn(data, srcData, W, H, ch, logo, 230, 12, 560, 115)
killGoldIn(data, srcData, W, H, ch, logo, 40, 290, 580, H - 1)

// Reconstruct hat crown INTO the original black cut (before crop)
paintHatCrown(data, W, H, ch)
blurSeam(data, W, H, ch, 25, 70, 130, 230)
paintHatCrown(data, W, H, ch)

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

// Crop only the thin gold frame / outer margin (hat crown already rebuilt)
const CROP_TOP = 10
const CROP_BOTTOM = 6
const CROP_SIDE = 5
const meta0 = await sharp(cleanedBuf).metadata()
cleanedBuf = await sharp(cleanedBuf)
  .extract({
    left: CROP_SIDE,
    top: CROP_TOP,
    width: meta0.width - CROP_SIDE * 2,
    height: meta0.height - CROP_TOP - CROP_BOTTOM,
  })
  .png()
  .toBuffer()

fs.mkdirSync(probeDir, { recursive: true })
await sharp(cleanedBuf).png().toFile(path.join(probeDir, 'cleaned.png'))
const cm = await sharp(cleanedBuf).metadata()
await sharp(cleanedBuf)
  .extract({ left: 90, top: 0, width: Math.min(400, cm.width - 90), height: Math.min(130, cm.height) })
  .png()
  .toFile(path.join(probeDir, 'check-top.png'))
await sharp(cleanedBuf)
  .extract({ left: 100, top: 0, width: Math.min(200, cm.width - 100), height: Math.min(120, cm.height) })
  .png()
  .toFile(path.join(probeDir, 'check-hat.png'))
await sharp(cleanedBuf)
  .extract({
    left: Math.min(200, cm.width - 320),
    top: 0,
    width: Math.min(320, cm.width - 200),
    height: Math.min(110, cm.height),
  })
  .png()
  .toFile(path.join(probeDir, 'verify-header-close.png'))
await sharp(cleanedBuf)
  .extract({
    left: Math.min(200, cm.width - 360),
    top: Math.max(0, cm.height - 140),
    width: Math.min(360, cm.width - 200),
    height: Math.min(140, cm.height),
  })
  .png()
  .toFile(path.join(probeDir, 'check-bottom.png'))

{
  const { data: cd, info: ci } = await sharp(cleanedBuf).raw().toBuffer({ resolveWithObject: true })
  let flatBand = 0
  let gold = 0
  // Check for hard dark band over hat (y 20-55, x 120-220)
  for (let y = 20; y < 55; y++) {
    for (let x = 120; x < 220; x++) {
      const i = (y * ci.width + x) * ci.channels
      const v = (cd[i] + cd[i + 1] + cd[i + 2]) / 3
      if (v < 8) flatBand++
    }
  }
  for (let y = 5; y < 100; y++) {
    for (let x = 240; x < Math.min(520, ci.width - 2); x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const v = (r + cd[i + 1] + cd[i + 2]) / 3
      if (v > 38 && r > cd[i + 2] + 10) gold++
    }
  }
  console.log('size', ci.width, 'x', ci.height, 'hatBandFlat', flatBand, 'headerGold', gold)
}

const targetW = 1920
const targetH = Math.round((targetW * cm.height) / cm.width)
const heroJpeg = await sharp(cleanedBuf)
  .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 93, mozjpeg: true })
  .toBuffer()
const slide5Jpeg = await sharp(cleanedBuf).jpeg({ quality: 93, mozjpeg: true }).toBuffer()

await fs.promises.writeFile(path.join(root, 'public/images/terra-estilo-hero.jpg'), heroJpeg)
await fs.promises.writeFile(path.join(root, 'public/images/terra-estilo-hero-full.jpg'), heroJpeg)
await fs.promises.writeFile(path.join(root, 'public/images/hero/slide-1.jpg'), heroJpeg)
await fs.promises.writeFile(path.join(root, 'public/images/hero/slide-5.jpg'), slide5Jpeg)

await sharp(path.join(root, 'public/images/hero/slide-1.jpg'))
  .extract({ left: 350, top: 0, width: 1100, height: 380 })
  .png()
  .toFile(path.join(probeDir, 'verify-s1-top.png'))
await sharp(path.join(root, 'public/images/hero/slide-5.jpg'))
  .png()
  .toFile(path.join(probeDir, 'verify-s5-full.png'))

console.log('wrote heroes')
