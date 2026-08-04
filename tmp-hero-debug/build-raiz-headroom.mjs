import sharp from 'sharp'
import fs from 'fs'

const src = 'tmp-hero-debug/raiz-hero-lefttrim.png'
const meta = await sharp(src).metadata()
const padTop = 56
const newH = meta.height + padTop

const skySample = await sharp(src)
  .extract({ left: 0, top: 0, width: Math.min(180, meta.width), height: 40 })
  .resize(meta.width, padTop + 20, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
  .blur(12)
  .modulate({ brightness: 0.78, saturation: 1.08 })
  .extract({ left: 0, top: 0, width: meta.width, height: padTop })
  .toBuffer()

const fadeH = 16
const fadeSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${fadeH}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="black" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="black" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`,
)

const fade = await sharp(fadeSvg).png().toBuffer()
const photo = await sharp(src).toBuffer()

const composed = await sharp({
  create: {
    width: meta.width,
    height: newH,
    channels: 3,
    background: { r: 14, g: 11, b: 9 },
  },
})
  .composite([
    { input: skySample, top: 0, left: 0 },
    { input: photo, top: padTop, left: 0 },
    { input: fade, top: Math.max(0, padTop - 2), left: 0, blend: 'over' },
  ])
  .png({ compressionLevel: 8 })
  .toBuffer()

await sharp(composed).png().toFile('tmp-hero-debug/raiz-hero-final.png')

if (!fs.existsSync('src/assets/raiz-hero.before-head-fix.png')) {
  fs.copyFileSync('src/assets/raiz-hero.png', 'src/assets/raiz-hero.before-head-fix.png')
}
fs.copyFileSync('tmp-hero-debug/raiz-hero-final.png', 'src/assets/raiz-hero.png')

const out = await sharp('src/assets/raiz-hero.png').metadata()
console.log('wrote raiz-hero.png', `${out.width}x${out.height}`)

async function sim(srcPath, outPath, panelW, panelH, ox, oy) {
  const m = await sharp(srcPath).metadata()
  const iw = m.width
  const ih = m.height
  const sc = Math.max(panelW / iw, panelH / ih)
  const L = (ox / 100) * (panelW - iw * sc)
  const T = (oy / 100) * (panelH - ih * sc)
  const el = Math.round(Math.min(Math.max(0, -L / sc), Math.max(0, iw - panelW / sc)))
  const et = Math.round(Math.min(Math.max(0, -T / sc), Math.max(0, ih - panelH / sc)))
  const ew = Math.round(Math.min(panelW / sc, iw - el))
  const eh = Math.round(Math.min(panelH / sc, ih - et))
  console.log(outPath, 'Y', `${et}-${et + eh}`, '/', ih, 'sc', sc.toFixed(2))
  await sharp(srcPath)
    .extract({ left: el, top: et, width: ew, height: eh })
    .resize(panelW, panelH)
    .png()
    .toFile(outPath)
}

for (const [h, oy] of [
  [640, 34],
  [640, 38],
  [660, 36],
  [600, 32],
]) {
  await sim('src/assets/raiz-hero.png', `tmp-hero-debug/final-h${h}-oy${oy}.png`, 790, h, 46, oy)
}
await sim('src/assets/raiz-hero.png', 'tmp-hero-debug/final-mob-oy38.png', 390, 420, 48, 38)
