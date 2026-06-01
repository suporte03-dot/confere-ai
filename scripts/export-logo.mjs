import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const source = path.join(root, 'public/images/brand/brand-board-reference.png')
const output = path.join(root, 'public/images/brand/logo-terraestilo-completa.png')
const outputTransparent = path.join(root, 'public/images/brand/logo-terraestilo-transparent.png')

const cream = { r: 244, g: 239, b: 230, alpha: 255 }

const roughCrop = await sharp(source)
  .extract({ left: 228, top: 12, width: 568, height: 430 })
  .png()
  .toBuffer()

const trimmed = await sharp(roughCrop).trim({ threshold: 12 }).png().toBuffer()

const padded = await sharp(trimmed)
  .extend({ top: 14, bottom: 14, left: 14, right: 28, background: cream })
  .png({ quality: 100 })
  .toBuffer()

await sharp(padded).toFile(output)

const { data, info } = await sharp(padded)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const threshold = 24
for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]

  if (
    Math.abs(r - cream.r) <= threshold
    && Math.abs(g - cream.g) <= threshold
    && Math.abs(b - cream.b) <= threshold
  ) {
    data[i + 3] = 0
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ quality: 100 })
  .toFile(outputTransparent)

const meta = await sharp(output).metadata()
console.log('Logo exportada:', output, meta.width, 'x', meta.height)
console.log('Logo transparente:', outputTransparent, meta.width, 'x', meta.height)
