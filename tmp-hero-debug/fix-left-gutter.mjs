import sharp from 'sharp'
import fs from 'fs'

/**
 * Remove baked-in left dark gutter, keep warm campaign look,
 * favor heads + shirt brand under object-fit:cover.
 */

async function findLeftContent(path, threshold = 22, brightRatio = 0.06) {
  const { data, info } = await sharp(path)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height
  for (let x = 0; x < Math.min(160, w); x++) {
    let bright = 0
    let n = 0
    // Sample band covering hats/faces
    for (let y = Math.floor(h * 0.08); y < Math.floor(h * 0.62); y++) {
      const i = (y * w + x) * 4
      const v = (data[i] + data[i + 1] + data[i + 2]) / 3
      n++
      if (v > threshold) bright++
    }
    if (bright / n > brightRatio) return x
  }
  return 0
}

async function sim(srcPath, outPath, panelW, panelH, ox, oy) {
  const meta = await sharp(srcPath).metadata()
  const iw = meta.width
  const ih = meta.height
  const sc = Math.max(panelW / iw, panelH / ih)
  const L = (ox / 100) * (panelW - iw * sc)
  const T = (oy / 100) * (panelH - ih * sc)
  const el = Math.round(
    Math.min(Math.max(0, -L / sc), Math.max(0, iw - panelW / sc)),
  )
  const et = Math.round(
    Math.min(Math.max(0, -T / sc), Math.max(0, ih - panelH / sc)),
  )
  const ew = Math.round(Math.min(panelW / sc, iw - el))
  const eh = Math.round(Math.min(panelH / sc, ih - et))
  console.log(
    outPath,
    `${meta.width}x${meta.height}`,
    `vis ${el},${et} ${ew}x${eh}`,
    `sc ${sc.toFixed(2)}`,
  )
  await sharp(srcPath)
    .extract({ left: el, top: et, width: ew, height: eh })
    .resize(panelW, panelH)
    .png()
    .toFile(outPath)
}

// Prefer lefttrim (already removed extreme left void) then torso backup
const bases = [
  'tmp-hero-debug/raiz-hero-lefttrim.png',
  'src/assets/raiz-hero.before-torso-framing.png',
  'src/assets/raiz-hero.before-head-fix.png',
]

let base = null
for (const b of bases) {
  if (fs.existsSync(b)) {
    base = b
    break
  }
}
if (!base) throw new Error('No base asset')

const left0 = await findLeftContent(base)
console.log('base', base, 'leftContent', left0)

const meta = await sharp(base).metadata()
// Trim a bit past first content so no residual gutter; keep woman hat intact
const cropLeft = Math.max(0, left0 - 4)
const cropWidth = meta.width - cropLeft
// Slight top: keep all rows (hat already tight); no fake sky pad that creates side bars
const cropped = await sharp(base)
  .extract({
    left: cropLeft,
    top: 0,
    width: cropWidth,
    height: meta.height,
  })
  .png()
  .toBuffer()

const cm = await sharp(cropped).metadata()
console.log('cropped', cm.width + 'x' + cm.height, 'from left', cropLeft)

// Backup current if needed
if (!fs.existsSync('src/assets/raiz-hero.before-left-gutter.png')) {
  fs.copyFileSync('src/assets/raiz-hero.png', 'src/assets/raiz-hero.before-left-gutter.png')
}

await sharp(cropped).png({ compressionLevel: 8 }).toFile('src/assets/raiz-hero.png')
await sharp(cropped).png().toFile('tmp-hero-debug/raiz-hero-nogutter.png')

const left1 = await findLeftContent('src/assets/raiz-hero.png')
console.log('shipped leftContent', left1)

const src = 'src/assets/raiz-hero.png'
// Favor slightly right focal X to keep couple in panel without left void;
// low Y for man's head/hat
for (const [ox, oy, h] of [
  [52, 22, 640],
  [54, 24, 640],
  [50, 20, 640],
  [52, 26, 660],
  [54, 28, 440],
]) {
  await sim(src, `tmp-hero-debug/fix-ox${ox}-oy${oy}-h${h}.png`, 790, h, ox, oy)
}
await sim(src, 'tmp-hero-debug/fix-mob.png', 390, 440, 52, 26)
await sim(src, 'tmp-hero-debug/fix-mob2.png', 390, 480, 54, 28)
