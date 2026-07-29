import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const assets = 'C:/Users/Suporte03/.cursor/projects/c-Users-Suporte03-confere-ai/assets'
const srcs = [
  path.join(
    assets,
    'c__Users_Suporte03_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-14103c05-34fa-40f0-a356-9ad214a76c8f.png',
  ),
  path.join(
    assets,
    'c__Users_Suporte03_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-e7959de8-ff4f-4491-9036-e049853664bb.png',
  ),
  path.join(
    assets,
    'c__Users_Suporte03_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Screenshot_20260728-193824_Instagram-94eec7d5-5d89-404f-bcc2-6225abdd0a9e.png',
  ),
  'public/images/brand/brand-inauguracao-flyer.png',
  'public/images/hero/slide-1.jpg',
]

for (const s of srcs) {
  const m = await sharp(s).metadata()
  console.log(path.basename(s), `${m.width}x${m.height}`, m.format, fs.statSync(s).size)
}

const orig = srcs[0]
const { data, info } = await sharp(orig).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info
console.log('\n=== gold density by row (x 220-520) ===')
for (let y = 0; y < 160; y += 2) {
  let gold = 0
  let bright = 0
  let mean = 0
  let n = 0
  for (let x = 220; x < 520; x++) {
    const i = (y * W + x) * C
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const v = (r + g + b) / 3
    mean += v
    n++
    if (v > 40 && r > b + 10) gold++
    if (v > 50) bright++
  }
  if (gold > 8 || bright > 15) {
    console.log(`y${y} gold ${gold} bright ${bright} mean ${(mean / n).toFixed(1)}`)
  }
}

console.log('\n=== hat candidate rows (x 80-280) mean lum ===')
for (let y = 40; y < 160; y += 4) {
  let sum = 0
  let n = 0
  let mid = 0
  for (let x = 80; x < 280; x++) {
    const i = (y * W + x) * C
    const v = (data[i] + data[i + 1] + data[i + 2]) / 3
    sum += v
    n++
    if (v > 18 && v < 90) mid++
  }
  console.log(`y${y} mean ${(sum / n).toFixed(1)} midtones ${mid}`)
}

const slide = await sharp('public/images/hero/slide-1.jpg')
  .resize(W, H)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
let flatBlackOrig = 0
let flatBlackSlide = 0
let stdOrig = 0
let stdSlide = 0
const samplesO = []
const samplesS = []
for (let y = 10; y < 90; y++) {
  for (let x = 250; x < 480; x++) {
    const i = (y * W + x) * C
    const vo = (data[i] + data[i + 1] + data[i + 2]) / 3
    const vs = (slide.data[i] + slide.data[i + 1] + slide.data[i + 2]) / 3
    if (vo < 4) flatBlackOrig++
    if (vs < 4) flatBlackSlide++
    samplesO.push(vo)
    samplesS.push(vs)
  }
}
const meanO = samplesO.reduce((a, b) => a + b, 0) / samplesO.length
const meanS = samplesS.reduce((a, b) => a + b, 0) / samplesS.length
stdOrig = Math.sqrt(samplesO.reduce((a, b) => a + (b - meanO) ** 2, 0) / samplesO.length)
stdSlide = Math.sqrt(samplesS.reduce((a, b) => a + (b - meanS) ** 2, 0) / samplesS.length)
console.log('\nflatNearBlack y10-90 x250-480 orig', flatBlackOrig, 'slide', flatBlackSlide)
console.log('header mean/std orig', meanO.toFixed(2), stdOrig.toFixed(2), 'slide', meanS.toFixed(2), stdSlide.toFixed(2))

// Export crops of original header for visual inspection
fs.mkdirSync('public/images/_probe', { recursive: true })
await sharp(orig)
  .extract({ left: 180, top: 0, width: 400, height: 130 })
  .png()
  .toFile('public/images/_probe/orig-header.png')
await sharp(orig)
  .extract({ left: 100, top: 40, width: 220, height: 120 })
  .png()
  .toFile('public/images/_probe/orig-hat.png')
console.log('wrote orig crops')
