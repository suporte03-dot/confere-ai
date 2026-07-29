/**
 * Continuous soft header fill (no rectangular seams) + hat crown + light bottom glyph wipe.
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

await fs.promises.copyFile(sourcePath, workingSrc)
const { data: src, info } = await sharp(sourcePath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
})
const W = info.width
const H = info.height
const C = info.channels
const dst = Buffer.from(src)
const logo = { cx: 384, cy: 205, r: 96 }
const inLogo = (x, y, p = 0) => Math.hypot(x - logo.cx, y - logo.cy) <= logo.r + p

/** Prebuild a gold-dust texture bank from the right side of the ORIGINAL. */
const bank = []
for (let y = 20; y < 180; y++) {
  for (let x = 490; x < 590; x++) {
    const i = (y * W + x) * C
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = (r + g + b) / 3
    if (v >= 6 && v <= 90 && !(v > 45 && r - b > 14)) bank.push([r, g, b])
  }
}
for (let y = 120; y < 200; y++) {
  for (let x = 250; x < 360; x++) {
    if (inLogo(x, y, 20)) continue
    const i = (y * W + x) * C
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = (r + g + b) / 3
    if (v >= 6 && v <= 55) bank.push([r, g, b])
  }
}
console.log('texture bank', bank.length)

function sampleBank(x, y) {
  const idx = Math.floor(hash01(x, y, 11) * bank.length) % bank.length
  const idx2 = Math.floor(hash01(x, y, 12) * bank.length) % bank.length
  const a = bank[idx]
  const b = bank[idx2]
  const t = hash01(x, y, 13)
  const j = (hash01(x, y, 14) - 0.5) * 4
  const spark = hash01(x, y, 15) > 0.97 ? 12 + hash01(x, y, 16) * 22 : 0
  return [
    Math.min(255, Math.max(6, Math.round(a[0] * (1 - t) + b[0] * t + j + spark))),
    Math.min(255, Math.max(5, Math.round(a[1] * (1 - t) + b[1] * t + j * 0.7 + spark * 0.7))),
    Math.min(255, Math.max(4, Math.round(a[2] * (1 - t) + b[2] * t + j * 0.4 + spark * 0.3))),
  ]
}

/**
 * Soft elliptical weight for header (no hard rectangle).
 * Covers CONVITE + INAUGURAÇÃO + flourish, fades before faces.
 */
function headerWeight(x, y) {
  // Ellipse centered on text block
  const cx = 390
  const cy = 58
  const rx = 210
  const ry = 62
  const nx = (x - cx) / rx
  const ny = (y - cy) / ry
  const d = nx * nx + ny * ny
  if (d >= 1.15) return 0
  let w = smoothstep(1 - d / 1.15)
  // Extra protection for face/hat column
  if (x < 210) w *= smoothstep((x - 150) / 60)
  if (x < 150) w = 0
  // Keep below flourish from eating logo glow
  if (y > 105) w *= smoothstep((120 - y) / 15)
  return w
}

// 1) Continuous soft header fill
for (let y = 0; y < 120; y++) {
  for (let x = 140; x < 580; x++) {
    if (inLogo(x, y, 4)) continue
    let a = headerWeight(x, y)
    // Also force-fill very dark top strip across wider area (the band over hat)
    if (y < 42 && x >= 120 && x < 520) {
      const i = (y * W + x) * C
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      const topW = smoothstep((42 - y) / 28) * smoothstep(Math.min(x - 120, 519 - x) / 50)
      if (v < 18) a = Math.max(a, topW * 0.95)
      else if (v < 28) a = Math.max(a, topW * 0.55)
    }
    if (a < 0.03) continue
    const aa = a > 0.55 ? 1 : smoothstep(a / 0.55)
    const [rr, gg, bb] = sampleBank(x, y)
    const i = (y * W + x) * C
    dst[i] = Math.round(dst[i] * (1 - aa) + rr * aa)
    dst[i + 1] = Math.round(dst[i + 1] * (1 - aa) + gg * aa)
    dst[i + 2] = Math.round(dst[i + 2] * (1 - aa) + bb * aa)
  }
}

// 2) Kill leftover bright/gold glyphs in header (second pass, no rect)
for (let y = 0; y < 115; y++) {
  for (let x = 180; x < 560; x++) {
    if (inLogo(x, y, 3)) continue
    if (x < 210 && y > 50) continue // face
    const i = (y * W + x) * C
    const r = dst[i]
    const g = dst[i + 1]
    const b = dst[i + 2]
    const v = (r + g + b) / 3
    if ((v > 28 && r - b > 4) || v > 60) {
      const [rr, gg, bb] = sampleBank(x, y)
      dst[i] = rr
      dst[i + 1] = gg
      dst[i + 2] = bb
    }
  }
}

// 3) Bottom: ONLY wipe bright glyphs / icons (no big black rect)
for (let y = 295; y < H - 2; y++) {
  for (let x = 40; x < 580; x++) {
    if (inLogo(x, y, 14)) continue
    const i = (y * W + x) * C
    const r = dst[i]
    const g = dst[i + 1]
    const b = dst[i + 2]
    const v = (r + g + b) / 3
    if (v < 35 && !(v > 18 && r - b > 8)) continue
    const edge = smoothstep(Math.min(x - 40, 579 - x) / 20) * smoothstep((y - 295) / 12)
    const [rr, gg, bb] = sampleBank(x, y)
    const a = Math.min(1, edge * 0.95)
    dst[i] = Math.round(dst[i] * (1 - a) + rr * a)
    dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + gg * a)
    dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + bb * a)
  }
}

// 4) Hat crown — soft circular reconstruction
{
  const cx = 175
  const cy = 78
  const rx = 58
  const ry = 46
  let br = 0
  let bg = 0
  let bb = 0
  let bn = 0
  for (let y = 85; y < 125; y++) {
    for (let x = cx - 35; x <= cx + 40; x++) {
      const i = (y * W + x) * C
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (v > 24 && v < 100 && dst[i] + dst[i + 1] > dst[i + 2] * 1.15) {
        br += dst[i]
        bg += dst[i + 1]
        bb += dst[i + 2]
        bn++
      }
    }
  }
  if (!bn) {
    br = 34
    bg = 26
    bb = 18
    bn = 1
  }
  br /= bn
  bg /= bn
  bb /= bn

  for (let x = cx - rx; x <= cx + rx; x++) {
    if (x < 4 || x >= W - 4) continue
    const nx = (x - cx) / rx
    if (Math.abs(nx) > 1) continue
    const crownY = Math.round(cy - ry * Math.sqrt(Math.max(0, 1 - nx * nx)))
    let bodyY = -1
    for (let y = Math.max(55, crownY + 8); y < 130; y++) {
      const i = (y * W + x) * C
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (v > 24 && v < 105 && dst[i] + dst[i + 1] > dst[i + 2] * 1.15) {
        bodyY = y
        break
      }
    }
    if (bodyY < 0) bodyY = 95
    for (let y = Math.max(4, crownY); y < bodyY; y++) {
      const t = (y - crownY) / Math.max(1, bodyY - crownY)
      const sy = Math.min(H - 2, bodyY + 4 + Math.floor(t * 12))
      const iSrc = (sy * W + x) * C
      let r = dst[iSrc]
      let g = dst[iSrc + 1]
      let b = dst[iSrc + 2]
      if ((r + g + b) / 3 < 16) {
        r = br
        g = bg
        b = bb
      }
      const shade = 0.6 + t * 0.4
      const j = (hash01(x, y, 3) - 0.5) * 5
      r = Math.min(255, Math.max(8, Math.round(r * shade + j)))
      g = Math.min(255, Math.max(6, Math.round(g * shade + j * 0.7)))
      b = Math.min(255, Math.max(5, Math.round(b * shade * 0.93 + j * 0.35)))
      const edge = smoothstep(1 - Math.abs(nx))
      let a = edge * smoothstep(0.35 + t * 0.65)
      const i = (y * W + x) * C
      const cur = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (cur < 18) a = Math.min(1, a + 0.35)
      if (cur > 45 && t > 0.72) a *= 0.15
      dst[i] = Math.round(dst[i] * (1 - a) + r * a)
      dst[i + 1] = Math.round(dst[i + 1] * (1 - a) + g * a)
      dst[i + 2] = Math.round(dst[i + 2] * (1 - a) + b * a)
    }
  }
}

let cleanedBuf = await sharp(dst, { raw: { width: W, height: H, channels: C } })
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
  const le = await sharp(sourcePath).extract(box).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })
  const cx = logo.r + sidePad
  const cy = logo.r + topPad
  for (let y = 0; y < le.info.height; y++) {
    for (let x = 0; x < le.info.width; x++) {
      const i = (y * le.info.width + x) * le.info.channels
      const dist = Math.hypot(x - cx, y - cy)
      let alpha = 0
      if (dist <= logo.r) alpha = 1
      else if (dist < logo.r + sidePad) alpha = smoothstep(1 - (dist - logo.r) / sidePad)
      le.data[i + 3] = Math.round(255 * alpha)
    }
  }
  const logoMasked = await sharp(le.data, {
    raw: { width: le.info.width, height: le.info.height, channels: le.info.channels },
  })
    .png()
    .toBuffer()
  cleanedBuf = await sharp(cleanedBuf)
    .composite([{ input: logoMasked, left: box.left, top: box.top }])
    .png()
    .toBuffer()
}

// Mild blur on header only to dissolve micro seams, then re-sharpen faces via original? skip faces.
{
  const again = await sharp(cleanedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const d = again.data
  const copy = Buffer.from(d)
  const w = W
  const h = H
  const c = again.info.channels
  for (let y = 4; y < 100; y++) {
    for (let x = 180; x < 560; x++) {
      if (inLogo(x, y, 6)) continue
      if (x < 220 && y > 55) continue
      let r = 0
      let g = 0
      let b = 0
      let n = 0
      for (let oy = -2; oy <= 2; oy++) {
        for (let ox = -2; ox <= 2; ox++) {
          const i = ((y + oy) * w + (x + ox)) * c
          r += copy[i]
          g += copy[i + 1]
          b += copy[i + 2]
          n++
        }
      }
      const i = (y * w + x) * c
      const a = 0.4
      d[i] = Math.round(d[i] * (1 - a) + (r / n) * a)
      d[i + 1] = Math.round(d[i + 1] * (1 - a) + (g / n) * a)
      d[i + 2] = Math.round(d[i + 2] * (1 - a) + (b / n) * a)
    }
  }
  cleanedBuf = await sharp(d, { raw: { width: w, height: h, channels: c } })
    .removeAlpha()
    .png()
    .toBuffer()
}

// Crop gold frame only
const CROP_TOP = 14
const CROP_BOTTOM = 4
const CROP_SIDE = 4
const m0 = await sharp(cleanedBuf).metadata()
cleanedBuf = await sharp(cleanedBuf)
  .extract({
    left: CROP_SIDE,
    top: CROP_TOP,
    width: m0.width - CROP_SIDE * 2,
    height: m0.height - CROP_TOP - CROP_BOTTOM,
  })
  .png()
  .toBuffer()

fs.mkdirSync(probeDir, { recursive: true })
await sharp(cleanedBuf).png().toFile(path.join(probeDir, 'cleaned.png'))
const cm = await sharp(cleanedBuf).metadata()
await sharp(cleanedBuf)
  .extract({ left: 90, top: 0, width: Math.min(420, cm.width - 90), height: Math.min(130, cm.height) })
  .png()
  .toFile(path.join(probeDir, 'check-top.png'))
await sharp(cleanedBuf)
  .extract({ left: 105, top: 0, width: Math.min(200, cm.width - 105), height: Math.min(120, cm.height) })
  .png()
  .toFile(path.join(probeDir, 'check-hat.png'))
await sharp(cleanedBuf)
  .extract({
    left: Math.min(210, cm.width - 320),
    top: 0,
    width: Math.min(320, cm.width - 210),
    height: Math.min(110, cm.height),
  })
  .png()
  .toFile(path.join(probeDir, 'verify-header-close.png'))

{
  const { data: cd, info: ci } = await sharp(cleanedBuf).raw().toBuffer({ resolveWithObject: true })
  let flat = 0
  let gold = 0
  let bright = 0
  for (let y = 0; y < 50; y++) {
    for (let x = 120; x < 220; x++) {
      const i = (y * ci.width + x) * ci.channels
      if ((cd[i] + cd[i + 1] + cd[i + 2]) / 3 < 8) flat++
    }
  }
  for (let y = 0; y < 100; y++) {
    for (let x = 240; x < Math.min(520, ci.width); x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const v = (r + cd[i + 1] + cd[i + 2]) / 3
      if (v > 40 && r > cd[i + 2] + 10) gold++
      if (v > 80) bright++
    }
  }
  console.log('size', ci.width, 'x', ci.height, 'hatFlat', flat, 'gold', gold, 'bright', bright)
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
await sharp(heroJpeg)
  .extract({ left: 350, top: 0, width: 1100, height: 380 })
  .png()
  .toFile(path.join(probeDir, 'verify-s1-top.png'))
await sharp(slide5Jpeg).png().toFile(path.join(probeDir, 'verify-s5-full.png'))
console.log('wrote heroes')
