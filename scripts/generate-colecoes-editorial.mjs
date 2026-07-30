import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public/images/categorias')
const couplePath = join(root, 'public/images/hero/couple.jpg')

const W = 720
const H = 900
/** Uniform subject scale so every character matches visually */
const SUBJECT_SCALE = 0.98

function bgSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0B0B"/>
      <stop offset="45%" stop-color="#1A120C"/>
      <stop offset="78%" stop-color="#2A1C12"/>
      <stop offset="100%" stop-color="#3A2A18"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="62%" r="52%">
      <stop offset="0%" stop-color="#C9A24D" stop-opacity="0.2"/>
      <stop offset="55%" stop-color="#8B6914" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
</svg>`
}

async function makePortrait({ file, left, width }) {
  const bg = await sharp(Buffer.from(bgSvg())).png().toBuffer()
  const mediaW = Math.round(W * SUBJECT_SCALE)
  const mediaH = Math.round(H * SUBJECT_SCALE)
  const subject = await sharp(couplePath)
    .extract({ left, top: 0, width, height: 1125 })
    .resize(mediaW, mediaH, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  const meta = await sharp(subject).metadata()
  const leftPos = Math.round((W - meta.width) / 2)
  // Align all subjects to the same baseline
  const baseline = H - 8
  const topPos = baseline - meta.height

  const shadowW = Math.max(1, Math.round(meta.width * 0.78))
  const shadow = await sharp({
    create: {
      width: shadowW,
      height: 34,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.36 },
    },
  })
    .blur(18)
    .png()
    .toBuffer()

  await sharp(bg)
    .composite([
      {
        input: shadow,
        left: Math.round((W - shadowW) / 2),
        top: baseline - 16,
      },
      { input: subject, left: leftPos, top: Math.max(8, topPos) },
    ])
    .jpeg({ quality: 91 })
    .toFile(join(outDir, file))

  console.log('ok', file, `${meta.width}x${meta.height}`, `top=${Math.max(20, topPos)}`)
}

async function makeFromProduct({ file, source }) {
  const bg = await sharp(Buffer.from(bgSvg())).png().toBuffer()
  const mediaW = Math.round(W * 0.7)
  const mediaH = Math.round(H * 0.68)
  const subject = await sharp(join(root, source))
    .resize(mediaW, mediaH, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  const meta = await sharp(subject).metadata()
  const leftPos = Math.round((W - meta.width) / 2)
  const baseline = H - 28
  const topPos = Math.round((H - meta.height) / 2)

  const shadowW = Math.max(1, Math.round(meta.width * 0.85))
  const shadow = await sharp({
    create: {
      width: shadowW,
      height: 28,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.4 },
    },
  })
    .blur(16)
    .png()
    .toBuffer()

  await sharp(bg)
    .composite([
      {
        input: shadow,
        left: Math.round((W - shadowW) / 2),
        top: Math.min(baseline - 16, topPos + meta.height - 12),
      },
      { input: subject, left: leftPos, top: topPos },
    ])
    .jpeg({ quality: 91 })
    .toFile(join(outDir, file))

  console.log('ok', file)
}

await mkdir(outDir, { recursive: true })

// Same editorial framing for every character card — uniform scale & baseline.
// Category identity comes from titles/links; accessories uses product art.
const characterFrame = { left: 20, width: 860 }
await makePortrait({ file: 'camisas.jpg', ...characterFrame })
await makePortrait({ file: 'jaquetas-masculinas.jpg', ...characterFrame })
await makePortrait({ file: 'camisetas-masculinas.jpg', ...characterFrame })
await makePortrait({ file: 'polos.jpg', ...characterFrame })
await makePortrait({ file: 'bones.jpg', ...characterFrame })
await makePortrait({ file: 'calca-jeans-masculinas.jpg', ...characterFrame })
await makePortrait({ file: 'moletons-masculinos.jpg', ...characterFrame })
await makeFromProduct({
  file: 'acessorios.jpg',
  source: 'public/images/hero/slide-3.jpg',
})

console.log('editorial category images ready')
