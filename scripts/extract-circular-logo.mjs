import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const src = path.join(
  process.env.USERPROFILE || '',
  '.cursor/projects/c-Users-Suporte03-confere-ai/assets',
  'c__Users_Suporte03_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Screenshot_20260728-193816_Instagram__1_-b4f12bd2-d469-44cb-9c4d-97e9470c9b1e.png',
)

const outPng = path.join(root, 'public/images/brand/terra-e-estilo-logo.png')
const outWebp = path.join(root, 'public/images/brand/terra-e-estilo-logo.webp')

const meta = await sharp(src).metadata()
console.log('source', meta.width, meta.height)

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const w = info.width
const h = info.height

function lumAt(x, y) {
  const i = (y * w + x) * 4
  return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
}

// Find dark circular disc: scan for near-black pixels that form a large blob
const cx = Math.floor(w / 2)
const darkYs = []
for (let y = Math.floor(h * 0.08); y < Math.floor(h * 0.72); y++) {
  if (lumAt(cx, y) < 55) darkYs.push(y)
}

if (darkYs.length < 40) {
  throw new Error('Could not find dark logo disc on center column')
}

const y0 = darkYs[0]
const y1 = darkYs[darkYs.length - 1]
const diameter = y1 - y0 + 1
const cy = Math.round((y0 + y1) / 2)

// Expand left/right from center at mid height to find gold rim / disc edge
let left = cx
let right = cx
const midY = cy
while (left > 0 && lumAt(left, midY) < 90) left--
while (right < w - 1 && lumAt(right, midY) < 90) right++

// Include a few pixels of the gold rim by expanding slightly into brighter ring
const pad = Math.max(4, Math.round(diameter * 0.012))
left = Math.max(0, left - pad)
right = Math.min(w - 1, right + pad)

const boxW = right - left + 1
const boxH = y1 - y0 + 1
const size = Math.max(boxW, boxH) + pad * 2
const left2 = Math.max(0, Math.round(cx - size / 2))
const top2 = Math.max(0, Math.round(cy - size / 2))
const extractW = Math.min(size, w - left2)
const extractH = Math.min(size, h - top2)

console.log({ y0, y1, left, right, cy, cx, diameter, left2, top2, extractW, extractH })

const square = sharp(src).extract({
  left: left2,
  top: top2,
  width: extractW,
  height: extractH,
})

const side = Math.min(extractW, extractH)
const resized = await square
  .resize(side, side, { fit: 'cover', position: 'centre' })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const rw = resized.info.width
const rh = resized.info.height
const out = Buffer.alloc(rw * rh * 4)
const r = rw / 2
const rcx = (rw - 1) / 2
const rcy = (rh - 1) / 2
// Soft edge just outside the gold rim
const soft = 1.15

for (let y = 0; y < rh; y++) {
  for (let x = 0; x < rw; x++) {
    const i = (y * rw + x) * 4
    const dx = x - rcx
    const dy = y - rcy
    const dist = Math.sqrt(dx * dx + dy * dy)
    let a = 255
    if (dist > r - soft) {
      a = dist >= r ? 0 : Math.round(255 * (1 - (dist - (r - soft)) / soft))
    }
    out[i] = resized.data[i]
    out[i + 1] = resized.data[i + 1]
    out[i + 2] = resized.data[i + 2]
    out[i + 3] = Math.min(resized.data[i + 3], a)
  }
}

const finalSize = 1024
await sharp(out, { raw: { width: rw, height: rh, channels: 4 } })
  .resize(finalSize, finalSize, { fit: 'fill', kernel: 'lanczos3' })
  .png({ compressionLevel: 9 })
  .toFile(outPng)

await sharp(outPng).webp({ quality: 92 }).toFile(outWebp)

console.log('wrote', outPng)
console.log('wrote', outWebp)
