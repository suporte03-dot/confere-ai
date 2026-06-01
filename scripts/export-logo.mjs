import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const source = path.join(root, 'public/images/brand/brand-board-reference.png')
const output = path.join(root, 'public/images/brand/logo-terraestilo-completa.png')

await sharp(source)
  .extract({ left: 292, top: 28, width: 448, height: 418 })
  .png({ quality: 100 })
  .toFile(output)

const meta = await sharp(output).metadata()
console.log('Logo exportada:', output, meta.width, 'x', meta.height)
