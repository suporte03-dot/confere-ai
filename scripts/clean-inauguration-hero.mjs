/**
 * Final reliable hero cleanup from ORIGINAL flyer image-14103c05.
 * - Strong wipe of ALL invite text (never weak alpha on CONVITE/INAUGURAÇÃO)
 * - Clone-from-below textured fill (never solid #000)
 * - Hat crown reconstruction
 * - Crop gold frame
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

function cloneFromBelow(x, y) {
  let r = 0
  let g = 0
  let b = 0
  let n = 0
  for (const dy of [40, 55, 70, 90, 110]) {
    for (const ox of [-8, -3, 0, 3, 8]) {
      const xx = Math.min(W - 2, Math.max(2, x + ox))
      const yy = Math.min(H - 2, Math.max(120, y + dy))
      if (inLogo(xx, yy, 10)) continue
      const i = (yy * W + xx) * C
      const v = (src[i] + src[i + 1] + src[i + 2]) / 3
      if (v < 5 || v > 100) continue
      if (v > 40 && src[i] - src[i + 2] > 12) continue
      r += src[i]
      g += src[i + 1]
      b += src[i + 2]
      n++
    }
  }
  for (const dx of [510, 530, 550, 570]) {
    for (const yy of [40, 70, 100, 130]) {
      const i = (yy * W + dx) * C
      const v = (src[i] + src[i + 1] + src[i + 2]) / 3
      if (v >= 6 && v <= 95) {
        r += src[i]
        g += src[i + 1]
        b += src[i + 2]
        n++
      }
    }
  }
  if (!n) {
    const j = 10 + Math.floor(hash01(x, y) * 12)
    return [j + 2, j + 1, j]
  }
  const j = (hash01(x, y) - 0.5) * 5
  const spark = hash01(x, y, 2) > 0.965 ? 9 + hash01(x, y, 3) * 18 : 0
  return [
    Math.min(255, Math.max(7, Math.round(r / n + j + spark))),
    Math.min(255, Math.max(6, Math.round(g / n + j * 0.7 + spark * 0.7))),
    Math.min(255, Math.max(5, Math.round(b / n + j * 0.4 + spark * 0.3))),
  ]
}

function applyFill(x, y, a) {
  if (a < 0.02 || inLogo(x, y, 2)) return
  const aa = a > 0.5 ? 1 : smoothstep(a / 0.5)
  const [rr, gg, bb] = cloneFromBelow(x, y)
  const i = (y * W + x) * C
  dst[i] = Math.round(dst[i] * (1 - aa) + rr * aa)
  dst[i + 1] = Math.round(dst[i + 1] * (1 - aa) + gg * aa)
  dst[i + 2] = Math.round(dst[i + 2] * (1 - aa) + bb * aa)
}

console.log('source', W, 'x', H)

// PASS 1: FULL strength wipe of invite header text zone (x>=230)
for (let y = 8; y < 115; y++) {
  for (let x = 230; x < 560; x++) {
    const edgeL = smoothstep((x - 230) / 40)
    const edgeR = smoothstep((559 - x) / 40)
    const edgeT = smoothstep((y - 8) / 16)
    const edgeB = smoothstep((114 - y) / 35)
    applyFill(x, y, Math.min(edgeL, edgeR, edgeT, edgeB))
  }
}

// PASS 2: top strip over hat (y<48) — textured, but we'll repaint crown after
for (let y = 0; y < 48; y++) {
  for (let x = 90; x < 230; x++) {
    const i = (y * W + x) * C
    const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
    // Only replace dark/flat band, keep emerging hat midtones lower down
    if (y > 28 && v > 20 && v < 95) continue
    const a = smoothstep((48 - y) / 30)
    applyFill(x, y, a * 0.95)
  }
}

// PASS 3: force any remaining bright/gold glyphs in header to fill
for (let y = 5; y < 115; y++) {
  for (let x = 230; x < 560; x++) {
    if (inLogo(x, y, 3)) continue
    const i = (y * W + x) * C
    const r = dst[i]
    const v = (r + dst[i + 1] + dst[i + 2]) / 3
    if (v > 20 && r - dst[i + 2] > 3) applyFill(x, y, 1)
    if (v > 55) applyFill(x, y, 1) // white-ish CONVITE leftovers
  }
}

// PASS 4: bottom invite + date
for (let y = 290; y < H; y++) {
  for (let x = 30; x < 580; x++) {
    if (inLogo(x, y, 12)) continue
    const a =
      smoothstep((y - 290) / 16) *
      smoothstep(Math.min(x - 30, 579 - x) / 28)
    applyFill(x, y, a)
  }
}
for (let y = 290; y < H; y++) {
  for (let x = 30; x < 580; x++) {
    if (inLogo(x, y, 12)) continue
    const i = (y * W + x) * C
    const r = dst[i]
    const v = (r + dst[i + 1] + dst[i + 2]) / 3
    if (v > 40) applyFill(x, y, 1)
    if (v > 22 && r - dst[i + 2] > 4) applyFill(x, y, 1)
  }
}

// PASS 5: second header wipe to kill ghosts
for (let y = 8; y < 115; y++) {
  for (let x = 235; x < 555; x++) {
    const i = (y * W + x) * C
    const r = dst[i]
    const v = (r + dst[i + 1] + dst[i + 2]) / 3
    if (v > 22) applyFill(x, y, 0.98)
  }
}

// Hat crown paint
{
  const cx = 176
  const cy = 82
  const rx = 62
  const ry = 50
  let br = 0
  let bg = 0
  let bb = 0
  let bn = 0
  for (let y = 78; y < 118; y++) {
    for (let x = cx - 38; x <= cx + 38; x++) {
      const i = (y * W + x) * C
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (v > 22 && v < 95 && dst[i] + dst[i + 1] > dst[i + 2] * 1.2) {
        br += dst[i]
        bg += dst[i + 1]
        bb += dst[i + 2]
        bn++
      }
    }
  }
  if (!bn) {
    br = 32
    bg = 25
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
    for (let y = Math.max(crownY + 6, 55); y < 125; y++) {
      const i = (y * W + x) * C
      const v = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (v > 22 && v < 100 && dst[i] + dst[i + 1] > dst[i + 2] * 1.2) {
        bodyY = y
        break
      }
    }
    if (bodyY < 0) bodyY = 92
    for (let y = Math.max(2, crownY); y < bodyY; y++) {
      const t = (y - crownY) / Math.max(1, bodyY - crownY)
      const sy = Math.min(H - 2, bodyY + 5 + Math.floor(t * 14))
      const sx = Math.min(W - 2, Math.max(2, x + (hash01(x, y) > 0.5 ? 1 : -1)))
      let i = (sy * W + sx) * C
      let r = dst[i]
      let g = dst[i + 1]
      let b = dst[i + 2]
      if ((r + g + b) / 3 < 14) {
        r = br
        g = bg
        b = bb
      }
      const shade = 0.58 + t * 0.42
      const j = (hash01(x, y, 3) - 0.5) * 6
      r = Math.min(255, Math.max(8, Math.round(r * shade + j)))
      g = Math.min(255, Math.max(6, Math.round(g * shade + j * 0.75)))
      b = Math.min(255, Math.max(5, Math.round(b * shade * 0.92 + j * 0.4)))
      const edge = smoothstep(1 - Math.abs(nx))
      let a = edge * (0.6 + 0.4 * smoothstep(t))
      i = (y * W + x) * C
      const cur = (dst[i] + dst[i + 1] + dst[i + 2]) / 3
      if (cur < 16) a = Math.min(1, a + 0.4)
      if (cur > 42 && t > 0.7) a *= 0.2
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

// Crop gold frame
const CROP_TOP = 16
const CROP_BOTTOM = 5
const CROP_SIDE = 5
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

{
  const { data: cd, info: ci } = await sharp(cleanedBuf).raw().toBuffer({ resolveWithObject: true })
  let flat = 0
  let gold = 0
  let bright = 0
  let sum = 0
  let n = 0
  for (let y = 0; y < 55; y++) {
    for (let x = 120; x < 220; x++) {
      const i = (y * ci.width + x) * ci.channels
      const v = (cd[i] + cd[i + 1] + cd[i + 2]) / 3
      if (v < 8) flat++
      sum += v
      n++
    }
  }
  for (let y = 0; y < 100; y++) {
    for (let x = 240; x < Math.min(520, ci.width); x++) {
      const i = (y * ci.width + x) * ci.channels
      const r = cd[i]
      const v = (r + cd[i + 1] + cd[i + 2]) / 3
      if (v > 38 && r > cd[i + 2] + 10) gold++
      if (v > 70) bright++
    }
  }
  console.log(
    'size',
    ci.width,
    'x',
    ci.height,
    'hatFlat',
    flat,
    'hatMean',
    (sum / n).toFixed(1),
    'gold',
    gold,
    'bright',
    bright,
  )
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
