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
const probeDir = path.join(root, 'public/images/_probe')

function pickSource() {
  for (const candidate of candidateSources) {
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error('No inauguration flyer source found')
}

async function solidPatch(width, height, rgb) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: rgb[0], g: rgb[1], b: rgb[2], alpha: 255 },
    },
  })
    .png()
    .toBuffer()
}

const source = pickSource()
await fs.promises.copyFile(source, workingSrc)

const meta = await sharp(workingSrc).metadata()
const W = meta.width
const H = meta.height
console.log('source', W, 'x', H)

// Near-black sample in empty mid-right field.
const sample = await sharp(workingSrc)
  .extract({ left: 520, top: 200, width: 24, height: 24 })
  .raw()
  .toBuffer({ resolveWithObject: true })
let br = 0
let bg = 0
let bb = 0
const sn = sample.data.length / 3
for (let i = 0; i < sample.data.length; i += 3) {
  br += sample.data[i]
  bg += sample.data[i + 1]
  bb += sample.data[i + 2]
}
const bgRgb = [Math.round(br / sn), Math.round(bg / sn), Math.round(bb / sn)]
console.log('bg', bgRgb)

const regions = [
  // CONVITE ESPECIAL + INAUGURAÇÃO (stay right of models)
  { left: 242, top: 4, width: 290, height: 108 },
  // Invitation paragraph / last line below logo
  { left: 232, top: 300, width: 320, height: H - 300 - 5 },
]

const composites = []
for (const region of regions) {
  composites.push({
    input: await solidPatch(region.width, region.height, bgRgb),
    left: region.left,
    top: region.top,
  })
}

let cleanedBuf = await sharp(workingSrc).ensureAlpha().composite(composites).png().toBuffer()

// Restore circular logo tightly so header ornament above the ring is not brought back.
const logoCx = 384
const logoCy = 205
const logoR = 96
const logoBox = {
  left: logoCx - logoR,
  top: logoCy - logoR,
  width: logoR * 2,
  height: logoR * 2,
}
const logoExtract = await sharp(workingSrc).extract(logoBox).ensureAlpha().png().toBuffer()
const circleMaskSvg =
  '<svg width="' +
  logoBox.width +
  '" height="' +
  logoBox.height +
  '"><circle cx="' +
  logoR +
  '" cy="' +
  logoR +
  '" r="' +
  logoR +
  '" fill="white"/></svg>'
const logoMasked = await sharp(logoExtract)
  .composite([{ input: Buffer.from(circleMaskSvg), blend: 'dest-in' }])
  .png()
  .toBuffer()

cleanedBuf = await sharp(cleanedBuf)
  .composite([{ input: logoMasked, left: logoBox.left, top: logoBox.top }])
  .png()
  .toBuffer()

// Cover the gold leaf ornament that sits just above the logo ring.
cleanedBuf = await sharp(cleanedBuf)
  .composite([
    {
      input: await solidPatch(160, 16, bgRgb),
      left: 304,
      top: 95,
    },
  ])
  .removeAlpha()
  .png()
  .toBuffer()

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
  .extract({ left: 100, top: 30, width: 140, height: 120 })
  .png()
  .toFile(path.join(probeDir, 'check-models.png'))
console.log('probe cleaned')

const targetW = 1920
const targetH = Math.round((targetW * H) / W)
const heroJpeg = await sharp(cleanedBuf)
  .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer()

await fs.promises.writeFile(outHero, heroJpeg)
await fs.promises.writeFile(outFullBleed, heroJpeg)
const final = await sharp(outHero).metadata()
console.log('wrote', outHero, final.width + 'x' + final.height)
