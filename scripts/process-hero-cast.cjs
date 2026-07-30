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

  // Wider soft dissolves — kill rectangular plate while protecting faces/torso core
  const fadeL = Math.round(w * 0.1)
  const fadeR = Math.round(w * 0.34)
  const fadeT = Math.round(h * 0.16)
  const fadeB = Math.round(h * 0.18)

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

      // Subject core: woman left-foreground + man mid — keep solid
      const coreX = Math.max(0, Math.min(1, 1 - Math.abs(nx - 0.38) / 0.42))
      const coreY = Math.max(0, Math.min(1, 1 - Math.abs(ny - 0.42) / 0.48))
      const core = Math.pow(coreX * coreY, 0.55)

      let edge = Math.min(aL, aR, aT, aB)
      // Blend edge dissolve with core retention
      edge = edge * (0.35 + 0.65 * Math.max(core, edge))

      // Extra right plate dissolve into stage/logo
      if (nx > 0.58) {
        const plate = 1 - smoothstep(6, 48, lum)
        const rightAmt = smoothstep(0.58, 1, nx)
        edge *= 1 - plate * rightAmt * 0.95
      }

      // Top strip: dissolve flat plate above hats without ghosting faces
      if (ny < 0.14) {
        const plate = 1 - smoothstep(10, 55, lum)
        edge *= 1 - plate * smoothstep(0, 0.14, 0.14 - ny) * 0.9
      }

      // Bottom dissolve
      if (ny > 0.82) {
        const plate = 1 - smoothstep(8, 45, lum)
        edge *= 1 - plate * smoothstep(0.82, 1, ny) * 0.88
      }

      // Left grey bar / hard shoulder edge
      if (nx < 0.08) {
        const plate = 1 - smoothstep(5, 40, lum)
        edge *= 1 - plate * (1 - nx / 0.08) * 0.85
        edge *= smoothstep(0, 0.07, nx) * 0.55 + 0.45
      }

      // Corners always dissolve
      const cornerR = Math.hypot(Math.max(0, nx - 0.7) / 0.3, Math.max(0, 0.12 - ny) / 0.12)
      const cornerRB = Math.hypot(Math.max(0, nx - 0.65) / 0.35, Math.max(0, ny - 0.85) / 0.15)
      if (cornerR > 0) edge *= 1 - Math.min(1, cornerR) * (1 - smoothstep(8, 40, lum)) * 0.9
      if (cornerRB > 0) edge *= 1 - Math.min(1, cornerRB) * (1 - smoothstep(8, 40, lum)) * 0.85

      const alpha = Math.max(0, Math.min(255, Math.round(edge * 255)))
      out[i + 3] = alpha

      if (alpha < 28 && lum < 35) {
        out[i] = 0
        out[i + 1] = 0
        out[i + 2] = 0
        out[i + 3] = 0
      }
    }
  }

  // Add transparent breathing room so hats aren't flush against the canvas edge
  const padT = 48
  const padL = 24
  const padR = 80
  const padB = 40
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
  console.log({ w: nw, h: nh, transparent, partial, opaque, total: nw * nh })

  const tmp = outPath + '.tmp.png'
  await sharp(padded, { raw: { width: nw, height: nh, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(tmp)

  fs.renameSync(tmp, outPath)
  console.log('wrote', outPath)

  await sharp({
    create: {
      width: 1600,
      height: 920,
      channels: 3,
      background: { r: 16, g: 14, b: 12 },
    },
  })
    .composite([
      {
        input: await sharp(outPath).resize({ height: 880, fit: 'inside' }).toBuffer(),
        left: 0,
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
