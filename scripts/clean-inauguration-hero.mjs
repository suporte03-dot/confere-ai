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

/** Gaussian-ish 1D blur on a Float32 mask (separable). */
function blurMask(mask, w, h, radius) {
  if (radius <= 0) return mask
  const tmp = new Float32Array(mask.length)
  const out = new Float32Array(mask.length)
  const sigma = radius / 2
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
      out[y * w + x] = acc
    }
  }
  return out
}

function dilateMask(mask, w, h, radius) {
  const out = new Float32Array(mask.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
          m = Math.max(m, mask[yy * w + xx])
        }
      }
      out[y * w + x] = m
    }
  }
  return out
}

/**
 * Soft-inpaint bright/gold glyphs + ornaments inside a box by cloning
 * nearby textured background (not flat #000), with feathered edges.
 */
function softInpaintZone(data, w, h, ch, zone) {
  const {
    left,
    top,
    width: zw,
    height: zh,
    feather = 14,
    dilate = 2,
    glowProtect = null,
    donorXs = [505, 530, 555, 200, 175],
  } = zone

  const mask = new Float32Array(w * h)

  for (let y = top; y < top + zh; y++) {
    for (let x = left; x < left + zw; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      const i = (y * w + x) * ch
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const lum = (r + g + b) / 3

      // Gold / cream type + thin ornaments (bright or warm vs near-black field)
      const warm = r >= g - 5 && r >= b && r - b >= 8
      const bright = lum >= 28
      const midWarm = lum >= 14 && warm
      const edgeFeather = edgeWeight(x, y, left, top, zw, zh, feather)

      if ((bright || midWarm) && edgeFeather > 0) {
        mask[y * w + x] = Math.min(1, edgeFeather * (bright ? 1 : 0.85))
      }
    }
  }

  let soft = dilateMask(mask, w, h, dilate)
  soft = blurMask(soft, w, h, Math.max(6, Math.round(feather * 0.7)))

  // Protect circular logo glow: taper mask near ring so we never cut it flat.
  if (glowProtect) {
    const { cx, cy, rInner, rOuter } = glowProtect
    for (let y = top - feather; y < top + zh + feather; y++) {
      for (let x = left - feather; x < left + zw + feather; x++) {
        if (x < 0 || y < 0 || x >= w || y >= h) continue
        const dx = x - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= rInner) {
          soft[y * w + x] = 0
        } else if (dist < rOuter) {
          const t = (dist - rInner) / (rOuter - rInner)
          soft[y * w + x] *= t * t
        }
      }
    }
  }

  // Pre-read donor columns (textured dark / gold-dust), blur lightly into a plate.
  const donors = donorXs.map((dx) => Math.min(w - 1, Math.max(0, dx)))

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = soft[y * w + x]
      if (a < 0.01) continue

      // Multi-sample clone from donor columns at nearby rows (keeps grain + glitter).
      let rr = 0
      let gg = 0
      let bb = 0
      let n = 0
      for (const dx of donors) {
        for (const oy of [-6, -2, 0, 2, 6]) {
          const yy = Math.min(h - 1, Math.max(0, y + oy))
          // Prefer same-row-ish; jitter x slightly for grain
          for (const ox of [-3, 0, 3]) {
            const xx = Math.min(w - 1, Math.max(0, dx + ox))
            const di = (yy * w + xx) * ch
            // Skip bright glyph pixels in donor (don't clone text into fill)
            const dLum = (data[di] + data[di + 1] + data[di + 2]) / 3
            if (dLum > 55) continue
            rr += data[di]
            gg += data[di + 1]
            bb += data[di + 2]
            n++
          }
        }
      }
      if (n === 0) {
        // Fallback: dark textured sample from mid-right empty field
        const di = (Math.min(h - 1, Math.max(0, y)) * w + 520) * ch
        rr = data[di]
        gg = data[di + 1]
        bb = data[di + 2]
        n = 1
      }
      rr = Math.round(rr / n)
      gg = Math.round(gg / n)
      bb = Math.round(bb / n)

      const i = (y * w + x) * ch
      const aa = Math.min(1, a)
      data[i] = Math.round(data[i] * (1 - aa) + rr * aa)
      data[i + 1] = Math.round(data[i + 1] * (1 - aa) + gg * aa)
      data[i + 2] = Math.round(data[i + 2] * (1 - aa) + bb * aa)
    }
  }
}

function edgeWeight(x, y, left, top, zw, zh, feather) {
  const dl = x - left
  const dr = left + zw - 1 - x
  const dt = y - top
  const db = top + zh - 1 - y
  const d = Math.min(dl, dr, dt, db)
  if (d < 0) return 0
  if (d >= feather) return 1
  // Smoothstep feather
  const t = d / feather
  return t * t * (3 - 2 * t)
}

/**
 * Extra pass: soft-fill residual ornament / thin gold lines with a
 * feathered textured plate (no hard rectangle).
 */
async function featheredTexturePlate(srcPath, region, donor) {
  const { left, top, width, height, feather = 18 } = region
  const pad = feather * 2
  const pw = width + pad * 2
  const ph = height + pad * 2

  const plate = await sharp(srcPath)
    .extract(donor)
    .resize(pw, ph, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .modulate({ brightness: 0.92, saturation: 0.85 })
    .png()
    .toBuffer()

  // Soft elliptical / rounded alpha — never a hard box
  const svg = Buffer.from(
    `<svg width="${pw}" height="${ph}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="f" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="${Math.max(4, feather / 2)}" />
        </filter>
      </defs>
      <rect x="${feather}" y="${feather}" width="${width}" height="${height}"
        rx="${Math.round(feather * 0.9)}" ry="${Math.round(feather * 0.9)}"
        fill="white" filter="url(#f)" />
    </svg>`,
  )

  const masked = await sharp(plate)
    .ensureAlpha()
    .composite([{ input: svg, blend: 'dest-in' }])
    .png()
    .toBuffer()

  return {
    input: masked,
    left: left - pad,
    top: top - pad,
  }
}

const source = pickSource()
await fs.promises.copyFile(source, workingSrc)

const meta = await sharp(workingSrc).metadata()
const W = meta.width
const H = meta.height
console.log('source', W, 'x', H, 'from', source)

const { data, info } = await sharp(workingSrc)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const ch = info.channels

const logoCx = 384
const logoCy = 205
const logoR = 96

// Pass 1: soft glyph inpaint — header invite type + flourish (stay above logo glow)
softInpaintZone(data, W, H, ch, {
  left: 230,
  top: 2,
  width: 310,
  height: 108,
  feather: 16,
  dilate: 3,
  glowProtect: { cx: logoCx, cy: logoCy, rInner: logoR + 2, rOuter: logoR + 22 },
  donorXs: [520, 545, 570, 195, 170, 500],
})

// Pass 2: invitation paragraph under logo
softInpaintZone(data, W, H, ch, {
  left: 220,
  top: 298,
  width: 340,
  height: H - 298 - 2,
  feather: 14,
  dilate: 2,
  glowProtect: { cx: logoCx, cy: logoCy, rInner: logoR + 2, rOuter: logoR + 18 },
  donorXs: [520, 545, 200, 175, 490],
})

let cleanedBuf = await sharp(Buffer.from(data), {
  raw: { width: W, height: H, channels: ch },
})
  .png()
  .toBuffer()

// Pass 3: light feathered texture plate over residual header band (soft edges only)
const headerPlate = await featheredTexturePlate(
  workingSrc,
  { left: 250, top: 8, width: 270, height: 88, feather: 22 },
  { left: 470, top: 150, width: 110, height: 140 },
)
cleanedBuf = await sharp(cleanedBuf)
  .composite([{ ...headerPlate, blend: 'over' }])
  .png()
  .toBuffer()

// Re-run glyph soft inpaint on plate result for any leftover gold crumbs
{
  const again = await sharp(cleanedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  softInpaintZone(again.data, W, H, again.info.channels, {
    left: 230,
    top: 2,
    width: 310,
    height: 108,
    feather: 12,
    dilate: 2,
    glowProtect: { cx: logoCx, cy: logoCy, rInner: logoR + 1, rOuter: logoR + 20 },
    donorXs: [520, 545, 570, 195, 170],
  })
  softInpaintZone(again.data, W, H, again.info.channels, {
    left: 220,
    top: 298,
    width: 340,
    height: H - 298 - 2,
    feather: 12,
    dilate: 2,
    glowProtect: { cx: logoCx, cy: logoCy, rInner: logoR + 1, rOuter: logoR + 18 },
    donorXs: [520, 545, 200, 175],
  })
  cleanedBuf = await sharp(again.data, {
    raw: { width: W, height: H, channels: again.info.channels },
  })
    .png()
    .toBuffer()
}

// Pass 4: restore circular logo + soft glow from pristine original (no hard cut)
{
  const glowPad = 18
  const box = {
    left: logoCx - logoR - glowPad,
    top: logoCy - logoR - glowPad,
    width: (logoR + glowPad) * 2,
    height: (logoR + glowPad) * 2,
  }
  const logoExtract = await sharp(workingSrc).extract(box).ensureAlpha().png().toBuffer()
  const softCircle = Buffer.from(
    `<svg width="${box.width}" height="${box.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="white" stop-opacity="1"/>
          <stop offset="72%" stop-color="white" stop-opacity="1"/>
          <stop offset="88%" stop-color="white" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
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

cleanedBuf = await sharp(cleanedBuf).removeAlpha().png().toBuffer()

fs.mkdirSync(probeDir, { recursive: true })
await sharp(cleanedBuf).png().toFile(path.join(probeDir, 'cleaned.png'))
await sharp(cleanedBuf)
  .extract({ left: 200, top: 0, width: 360, height: 130 })
  .png()
  .toFile(path.join(probeDir, 'check-top.png'))
await sharp(cleanedBuf)
  .extract({ left: 220, top: 290, width: 360, height: 130 })
  .png()
  .toFile(path.join(probeDir, 'check-bottom.png'))
await sharp(cleanedBuf)
  .extract({ left: 300, top: 70, width: 180, height: 80 })
  .png()
  .toFile(path.join(probeDir, 'check-logo-top.png'))

// Variance sanity: header band should not be flat solid paint
{
  const { data: cd, info: ci } = await sharp(cleanedBuf).raw().toBuffer({ resolveWithObject: true })
  let sum = 0
  let sum2 = 0
  let n = 0
  for (let y = 20; y < 90; y++) {
    for (let x = 260; x < 500; x++) {
      const i = (y * ci.width + x) * ci.channels
      const v = (cd[i] + cd[i + 1] + cd[i + 2]) / 3
      sum += v
      sum2 += v * v
      n++
    }
  }
  const mean = sum / n
  const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean))
  console.log('header band mean/std', mean.toFixed(2), std.toFixed(2), std < 0.5 ? 'WARN still flat' : 'ok textured')
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

const final = await sharp(outHero).metadata()
const slide5Meta = await sharp(outSlide5).metadata()
console.log('wrote', outHero, final.width + 'x' + final.height)
console.log('wrote', outSlide1, final.width + 'x' + final.height)
console.log('wrote', outSlide5, slide5Meta.width + 'x' + slide5Meta.height)
console.log('probe', path.join(probeDir, 'check-top.png'))
