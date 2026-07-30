const sharp = require('sharp')
const fs = require('fs')

async function processCast() {
  const outPath = 'public/images/hero/couple-hero.png'
  const backupPath = 'public/images/hero/couple-hero-source-opaque.png'

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(outPath, backupPath)
    console.log('backed up to', backupPath)
  }

  const srcPath = backupPath
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height
  const out = Buffer.from(data)

  // Soft professional cutout:
  // - Multi-axis edge dissolve (esp. right into logo/stage)
  // - Luminance-aware only near edges so black shirts stay solid in the core
  // - Corner vignettes to kill rectangular plate corners
  const fadeL = Math.round(w * 0.06)
  const fadeR = Math.round(w * 0.28)
  const fadeT = Math.round(h * 0.1)
  const fadeB = Math.round(h * 0.14)

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

      const aL = x < fadeL ? smoothstep(0, fadeL, x) : 1
      const aR = x > w - fadeR - 1 ? smoothstep(0, fadeR, w - 1 - x) : 1
      const aT = y < fadeT ? smoothstep(0, fadeT, y) : 1
      const aB = y > h - fadeB - 1 ? smoothstep(0, fadeB, h - 1 - y) : 1

      const nx = x / w
      const ny = y / h
      const dx = Math.max(0, (nx - 0.62) / 0.45)
      const dyTop = Math.max(0, (0.08 - ny) / 0.12)
      const dyBot = Math.max(0, (ny - 0.82) / 0.22)
      const radial = Math.max(0, 1 - (dx * dx * 0.95 + dyTop * dyTop + dyBot * dyBot * 0.7))

      let edge = Math.min(aL, aR, aT, aB) * (0.55 + 0.45 * radial)

      const nearEdge = Math.min(aL, aR, aT, aB) < 0.98
      if (nearEdge) {
        const darkFactor = smoothstep(8, 55, lum)
        edge *= 0.25 + 0.75 * Math.max(darkFactor, Math.min(aL, aR, aT, aB))
      }

      if (nx > 0.72) {
        const plate = 1 - smoothstep(8, 40, lum)
        const rightAmt = smoothstep(0.72, 0.98, nx)
        edge *= 1 - plate * rightAmt * 0.92
      }

      if (nx > 0.55 && (ny < 0.12 || ny > 0.88)) {
        const plate = 1 - smoothstep(10, 45, lum)
        edge *= 1 - plate * 0.85
      }

      if (nx < 0.04) {
        const plate = 1 - smoothstep(6, 35, lum)
        edge *= 1 - plate * 0.7 * (1 - nx / 0.04)
      }

      const alpha = Math.max(0, Math.min(255, Math.round(edge * 255)))
      out[i + 3] = alpha

      if (alpha < 40 && lum < 30) {
        out[i] = 0
        out[i + 1] = 0
        out[i + 2] = 0
        out[i + 3] = 0
      }
    }
  }

  let transparent = 0
  let partial = 0
  let opaque = 0
  for (let i = 3; i < out.length; i += 4) {
    const a = out[i]
    if (a === 0) transparent++
    else if (a === 255) opaque++
    else partial++
  }
  console.log({ transparent, partial, opaque, total: w * h })

  const tmp = outPath + '.tmp.png'
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(tmp)

  fs.renameSync(tmp, outPath)
  console.log('wrote', outPath)

  await sharp({
    create: {
      width: 1400,
      height: 900,
      channels: 3,
      background: { r: 14, g: 12, b: 10 },
    },
  })
    .composite([
      {
        input: await sharp(outPath).resize({ height: 860, fit: 'inside' }).toBuffer(),
        left: 0,
        top: 40,
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
