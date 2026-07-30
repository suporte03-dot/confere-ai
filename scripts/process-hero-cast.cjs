const sharp = require('sharp')
const fs = require('fs')

/**
 * Rebuild couple-hero.png for the hero left panel + featured media.
 * Source: campaign full frame left panel.
 * Output aspect ~0.88 so object-fit:contain fills a ~1:1 stage without
 * collapsing into a skinny floating strip. Soft edge blend only.
 */
async function processCast() {
  const fullPath = 'public/images/terra-estilo-hero-full.jpg'
  const outPath = 'public/images/hero/couple-hero.png'
  const backupPath = 'public/images/hero/couple-hero-source-opaque.png'

  if (!fs.existsSync(fullPath)) {
    throw new Error('Missing source: ' + fullPath)
  }

  const fullMeta = await sharp(fullPath).metadata()
  const extractW = Math.round(fullMeta.width * 0.405)
  const extractH = fullMeta.height

  // Focus waist-up: drop empty lower band so aspect suits the hero stage
  const cropTop = Math.round(extractH * 0.02)
  const cropHeight = Math.round(extractH * 0.72)

  const baseBuf = await sharp(fullPath)
    .extract({
      left: 0,
      top: cropTop,
      width: extractW,
      height: cropHeight,
    })
    .resize(1180, null, { fit: 'inside', kernel: sharp.kernel.lanczos3 })
    .modulate({ brightness: 1.07, saturation: 0.92 })
    .linear(1.05, -4)
    .png()
    .toBuffer()

  await sharp(baseBuf).png().toFile(backupPath)
  console.log('wrote opaque backup', backupPath)

  const { data, info } = await sharp(baseBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height
  const out = Buffer.from(data)

  const fadeL = Math.round(w * 0.035)
  const fadeR = Math.round(w * 0.06)
  const fadeT = Math.round(h * 0.03)
  const fadeB = Math.round(h * 0.06)

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0 || 1)))
    return t * t * (3 - 2 * t)
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const r = out[i]
      const g = out[i + 1]
      const b = out[i + 2]
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const nx = x / w
      const ny = y / h

      const isGoldish = r > 110 && g > 85 && b < 90 && r - b > 35 && Math.abs(r - g) < 55
      if (isGoldish && (nx < 0.14 || ny < 0.1 || (nx > 0.86 && ny < 0.22))) {
        out[i] = Math.round(r * 0.12)
        out[i + 1] = Math.round(g * 0.1)
        out[i + 2] = Math.round(b * 0.08)
      }

      const aL = x < fadeL ? smoothstep(0, fadeL, x) : 1
      const aR = x > w - fadeR - 1 ? smoothstep(0, fadeR, w - 1 - x) : 1
      const aT = y < fadeT ? smoothstep(0, fadeT, y) : 1
      const aB = y > h - fadeB - 1 ? smoothstep(0, fadeB, h - 1 - y) : 1
      let edge = Math.min(aL, aR, aT, aB)

      if (nx > 0.84 && lum < 40) {
        edge *= 1 - smoothstep(0.84, 1, nx) * (1 - smoothstep(16, 48, lum)) * 0.8
      }

      if (lum < 18) {
        const cornerTL = Math.hypot(nx / 0.1, ny / 0.08)
        const cornerBL = Math.hypot(nx / 0.12, Math.max(0, ny - 0.9) / 0.1)
        const corner = Math.min(cornerTL, cornerBL)
        if (corner < 1) edge *= 0.42 + 0.58 * corner
      }

      const alpha = Math.max(0, Math.min(255, Math.round(edge * 255)))
      out[i + 3] = alpha
      if (alpha < 10 && lum < 18) {
        out[i] = 0
        out[i + 1] = 0
        out[i + 2] = 0
        out[i + 3] = 0
      }
    }
  }

  // Side padding widens canvas so group sits centered with breathing room
  const padT = 36
  const padL = 64
  const padR = 80
  const padB = 28
  const nw = w + padL + padR
  const nh = h + padT + padB
  const padded = Buffer.alloc(nw * nh * 4, 0)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4
      const di = ((y + padT) * nw + (x + padL)) * 4
      padded[di] = out[si]
      padded[di + 1] = out[si + 1]
      padded[di + 2] = out[si + 2]
      padded[di + 3] = out[si + 3]
    }
  }

  let transparent = 0
  let partial = 0
  let opaque = 0
  for (let i = 3; i < padded.length; i += 4) {
    const a = padded[i]
    if (a === 0) transparent++
    else if (a === 255) opaque++
    else partial++
  }
  console.log({
    w: nw,
    h: nh,
    aspect: Number((nw / nh).toFixed(3)),
    transparent,
    partial,
    opaque,
  })

  const tmp = outPath + '.tmp.png'
  await sharp(padded, { raw: { width: nw, height: nh, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(tmp)
  fs.renameSync(tmp, outPath)
  console.log('wrote', outPath)

  await sharp({
    create: {
      width: 1600,
      height: 900,
      channels: 3,
      background: { r: 16, g: 14, b: 12 },
    },
  })
    .composite([
      {
        input: await sharp(outPath).resize({ height: 860, fit: 'inside' }).toBuffer(),
        left: 36,
        top: 20,
      },
    ])
    .png()
    .toFile('public/images/_probe/couple-soft-preview.png')
  console.log('preview written')
}

processCast().catch((e) => {
  console.error(e)
  process.exit(1)
})
