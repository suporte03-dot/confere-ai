import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const source = path.join(root, 'public/images/brand/brand-board-reference.png')
const output = path.join(root, 'public/images/brand/logo-terraestilo-completa.png')

// Crop central do brand board — margem direita suficiente para o "o" de TerraEstilo
await sharp(source)
  .extract({ left: 235, top: 12, width: 555, height: 445 })
  .png({ quality: 100 })
  .toFile(output)

const meta = await sharp(output).metadata()
console.log('Logo exportada:', output, meta.width, 'x', meta.height)
