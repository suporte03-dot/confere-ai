import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const source = path.join(root, 'public/images/brand/brand-board-reference.png')
const output = path.join(root, 'public/images/brand/logo-terraestilo-completa.png')

const cream = { r: 244, g: 239, b: 230, alpha: 255 }

// Região aproximada da logo central no brand board
const roughCrop = await sharp(source)
  .extract({ left: 228, top: 12, width: 568, height: 430 })
  .png()
  .toBuffer()

// Remove excesso e adiciona respiro para TerraEstilo e slogan não encostarem na borda
const trimmed = await sharp(roughCrop).trim({ threshold: 12 }).png().toBuffer()

await sharp(trimmed)
  .extend({ top: 14, bottom: 14, left: 14, right: 28, background: cream })
  .png({ quality: 100 })
  .toFile(output)

const meta = await sharp(output).metadata()
console.log('Logo exportada:', output, meta.width, 'x', meta.height)
