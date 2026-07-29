/**
 * Rebuild hero: clean gold-dust canvas + couple (no invite text) + logo.
 * Aggressively excludes header text / black band pixels from the people layer.
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
console.log('source', W, 'x', H)

const bank = []
for (let y = 10; y < H - 10; y++) {
  for (let x = 470; x < W - 6; x++) {
    const i = (y * W + x) * C
    const r = src[i]
    const g = src[i + 1]
    const b = src[i + 2]
    const v = (r + g + b) / 3
    if (v >= 5 && v <= 80 && !(v > 38 && r - b > 14)) bank.push([r, g, b])
  }
}
for (let y = 140; y < 260; y++) {
  for (let x = 250; x < 350; x++) {
    const i = (y * W + x) * C
    const v = (src[i] + src[i + 1] + src[i + 2]) / 3
    if (v >= 5 && v <= 40) bank.push([src[i], src[i + 1], src[i + 2]])
  }
}

const bg = Buffer.alloc(W * H * 3)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i3 = (y * W + x) * 3
    const a = bank[Math.floor(hash01(x, y, 1) * bank.length) % bank.length]
    const b = bank[Math.floor(hash01(x, y, 2) * bank.length) % bank.length]
    const t = hash01(x, y, 3)
    const j = (hash01(x, y, 4) - 0.5) * 4
    const spark = hash01(x, y, 5) > 0.97 ? 11 + hash01(x, y, 6) * 26 : 0
    bg[i3] = Math.min(255, Math.max(6, Math.round(a[0] * (1 - t) + b[0] * t + j + spark)))
    bg[i3 + 1] = Math.min(
      255,
      Math.max(5, Math.round(a[1] * (1 - t) + b[1] * t + j * 0.7 + spark * 0.7)),
    )
    bg[i3 + 2] = Math.min(
      255,
      Math.max(4, Math.round(a[2] * (1 - t) + b[2] * t + j * 0.4 + spark * 0.25)),
    )
  }
}

let canvas = await sharp(bg, { raw: { width: W, height: H, channels: 3 } })
  .blur(0.55)
  .png()
  .toBuffer()

// People cutout — stop before "INAUGURAÇÃO" glyphs (~x230+)
{
  const peopleW = 235
  const rgba = Buffer.alloc(peopleW * H * 4)

  // First copy + alpha
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < peopleW; x++) {
      const si = (y * W + x) * C
      const di = (y * peopleW + x) * 4
      const r = src[si]
      const g = src[si + 1]
      const b = src[si + 2]
      const v = (r + g + b) / 3
      let alpha = smoothstep((peopleW - 1 - x) / 55)

      // Transparent where original had flat black header band (let clean bg show)
      if (y < 58 && v < 16) alpha = 0
      else if (y < 75 && v < 11) alpha *= 0.08

      // Kill gold lettering crumbs that leak into cutout
      if (y < 120 && v > 28 && r - b > 6) alpha = 0
      if (y < 120 && v > 55) alpha = 0

      // Bottom invite icons if any
      if (y > 355 && ((v > 35 && r - b > 6) || v > 60)) alpha *= 0.05

      rgba[di] = r
      rgba[di + 1] = g
      rgba[di + 2] = b
      rgba[di + 3] = Math.round(255 * Math.min(1, alpha))
    }
  }

  // Paint soft hat crown into cutout (man's hat)
  {
    const cx = 175
    const cy = 78
    const rx = 56
    const ry = 44
    let br = 0
    let bgc = 0
    let bb = 0
    let bn = 0
    for (let y = 90; y < 130; y++) {
      for (let x = 140; x < 210; x++) {
        if (x >= peopleW) continue
        const di = (y * peopleW + x) * 4
        if (rgba[di + 3] < 80) continue
        const v = (rgba[di] + rgba[di + 1] + rgba[di + 2]) / 3
        if (v > 22 && v < 100) {
          br += rgba[di]
          bgc += rgba[di + 1]
          bb += rgba[di + 2]
          bn++
        }
      }
    }
    if (!bn) {
      br = 36
      bgc = 28
      bb = 18
      bn = 1
    }
    br /= bn
    bgc /= bn
    bb /= bn

    for (let x = cx - rx; x <= cx + rx; x++) {
      if (x < 2 || x >= peopleW - 2) continue
      const nx = (x - cx) / rx
      if (Math.abs(nx) > 1) continue
      const crownY = Math.round(cy - ry * Math.sqrt(Math.max(0, 1 - nx * nx)))
      let bodyY = -1
      for (let y = Math.max(60, crownY + 10); y < 130; y++) {
        const di = (y * peopleW + x) * 4
        if (rgba[di + 3] < 100) continue
        const v = (rgba[di] + rgba[di + 1] + rgba[di + 2]) / 3
        if (v > 22 && v < 105) {
          bodyY = y
          break
        }
      }
      if (bodyY < 0) bodyY = 96
      for (let y = Math.max(2, crownY); y < bodyY; y++) {
        const t = (y - crownY) / Math.max(1, bodyY - crownY)
        const shade = 0.58 + t * 0.42
        const j = (hash01(x, y, 8) - 0.5) * 5
        const edge = smoothstep(1 - Math.abs(nx))
        const a = edge * (0.65 + 0.35 * smoothstep(t))
        const di = (y * peopleW + x) * 4
        const r = Math.min(255, Math.max(8, Math.round(br * shade + j)))
        const g = Math.min(255, Math.max(6, Math.round(bgc * shade + j * 0.7)))
        const b = Math.min(255, Math.max(5, Math.round(bb * shade * 0.92 + j * 0.35)))
        const oa = rgba[di + 3] / 255
        const na = Math.min(1, Math.max(oa, a))
        rgba[di] = Math.round(rgba[di] * (1 - a) + r * a)
        rgba[di + 1] = Math.round(rgba[di + 1] * (1 - a) + g * a)
        rgba[di + 2] = Math.round(rgba[di + 2] * (1 - a) + b * a)
        rgba[di + 3] = Math.round(255 * na)
      }
    }
  }

  const peoplePng = await sharp(rgba, {
    raw: { width: peopleW, height: H, channels: 4 },
  })
    .png()
    .toBuffer()

  canvas = await sharp(canvas)
    .composite([{ input: peoplePng, left: 0, top: 0, blend: 'over' }])
    .png()
    .toBuffer()
}

// Logo
{
  const logoCx = 384
  const logoCy = 205
  const logoR = 96
  const pad = 24
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
      if (y < pad - 6 && dist > logoR - 4) alpha = 0
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

// Final: scrub ANY leftover gold/white invitation glyphs outside logo
{
  const again = await sharp(canvas).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const d = again.data
  const w = again.info.width
  const h = again.info.height
  const c = again.info.channels
  const logoCx = 384
  const logoCy = 205
  const logoR = 100
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (Math.hypot(x - logoCx, y - logoCy) <= logoR) continue
      const i = (y * w + x) * c
      const r = d[i]
      const g = d[i + 1]
      const b = d[i + 2]
      const v = (r + g + b) / 3
      const isGlyph =
        (y < 120 && ((v > 30 && r - b > 5) || v > 55)) ||
        (y > 290 && ((v > 32 && r - b > 4) || v > 55 || (Math.abs(r - g) < 20 && v > 45)))
      if (!isGlyph) continue
      const a = bank[Math.floor(hash01(x, y, 20) * bank.length) % bank.length]
      const j = (hash01(x, y, 21) - 0.5) * 4
      d[i] = Math.min(255, Math.max(6, a[0] + j))
      d[i + 1] = Math.min(255, Math.max(5, a[1] + j * 0.7))
      d[i + 2] = Math.min(255, Math.max(4, a[2] + j * 0.4))
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
  .extract({ left: 105, top: 0, width: Math.min(210, cm.width - 105), height: Math.min(125, cm.height) })
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
  let gold = 0
  let bright = 0
  let sum = 0
  let sum2 = 0
  let n = 0
  for (let y = 0; y < 55; y++) {
    for (let x = 120; x < 500; x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const v = (r + cd[i + 1] + cd[i + 2]) / 3
      sum += v
      sum2 += v * v
      n++
      if (v < 4) flat++
      if (v > 40 && r > cd[i + 2] + 12) gold++
      if (v > 70) bright++
    }
  }
  let bBright = 0
  for (let y = 300; y < ci.height - 4; y++) {
    for (let x = 200; x < 520; x++) {
      const i = (y * ci.width + x) * ci.channels
      const v = (cd[i] + cd[i + 1] + cd[i + 2]) / 3
      if (v > 55) bBright++
    }
  }
  console.log(
    'header flat/gold/bright/mean/std',
    flat,
    gold,
    bright,
    (sum / n).toFixed(1),
    Math.sqrt(Math.max(0, sum2 / n - (sum / n) ** 2)).toFixed(1),
    'bottomBright',
    bBright,
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
