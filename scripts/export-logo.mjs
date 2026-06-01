import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const source = path.join(root, 'public/images/brand/brand-board-reference.png')
const output = path.join(root, 'public/images/brand/logo-terraestilo-completa.png')
const outputHeaderTransparent = path.join(
  root,
  'public/images/brand/logo-terraestilo-header-transparent.png',
)

const cream = { r: 244, g: 239, b: 230, alpha: 255 }
const creamTolerance = 18

function isBackgroundPixel(r, g, b) {
  return (
    Math.abs(r - cream.r) <= creamTolerance
    && Math.abs(g - cream.g) <= creamTolerance
    && Math.abs(b - cream.b) <= creamTolerance
  )
}

function removeBackgroundByFloodFill(data, width, height) {
  const visited = new Uint8Array(width * height)
  const queue = []

  const pushIfBackground = (x, y) => {
    const idx = y * width + x
    if (visited[idx]) return
    const offset = idx * 4
    if (!isBackgroundPixel(data[offset], data[offset + 1], data[offset + 2])) return
    visited[idx] = 1
    queue.push(idx)
  }

  for (let x = 0; x < width; x += 1) {
    pushIfBackground(x, 0)
    pushIfBackground(x, height - 1)
  }

  for (let y = 0; y < height; y += 1) {
    pushIfBackground(0, y)
    pushIfBackground(width - 1, y)
  }

  while (queue.length > 0) {
    const idx = queue.pop()
    const x = idx % width
    const y = Math.floor(idx / width)
    const offset = idx * 4
    data[offset + 3] = 0

    if (x > 0) pushIfBackground(x - 1, y)
    if (x < width - 1) pushIfBackground(x + 1, y)
    if (y > 0) pushIfBackground(x, y - 1)
    if (y < height - 1) pushIfBackground(x, y + 1)
  }
}

const roughCrop = await sharp(source)
  .extract({ left: 228, top: 12, width: 568, height: 430 })
  .png()
  .toBuffer()

const trimmed = await sharp(roughCrop).trim({ threshold: 12 }).png().toBuffer()

await sharp(trimmed)
  .extend({ top: 14, bottom: 14, left: 14, right: 28, background: cream })
  .png({ quality: 100 })
  .toFile(output)

const paddedTransparent = await sharp(trimmed)
  .extend({ top: 14, bottom: 14, left: 14, right: 28, background: cream })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

removeBackgroundByFloodFill(
  paddedTransparent.data,
  paddedTransparent.info.width,
  paddedTransparent.info.height,
)

await sharp(paddedTransparent.data, {
  raw: {
    width: paddedTransparent.info.width,
    height: paddedTransparent.info.height,
    channels: 4,
  },
})
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(outputHeaderTransparent)

const meta = await sharp(output).metadata()
console.log('Logo exportada:', output, meta.width, 'x', meta.height)
console.log('Logo header transparente:', outputHeaderTransparent, meta.width, 'x', meta.height)
