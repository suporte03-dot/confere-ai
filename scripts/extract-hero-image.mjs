import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const src = path.join(root, 'public/images/brand/brand-inauguracao-reference.png')
const out = path.join(root, 'public/images/terra-estilo-hero.jpg')
const logoSrc = path.join(root, 'public/images/brand/terra-e-estilo-logo.png')
const logoOut = path.join(root, 'public/images/logo-terra-estilo.png')

const post = { left: 18, top: 166, width: 449, height: 620 }
const modelsW = Math.floor(post.width * 0.52)

await sharp(src)
  .extract(post)
  .extract({ left: 0, top: 0, width: modelsW, height: post.height })
  .resize(1200, 1600, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(out)

console.log('wrote', out)
await fs.promises.copyFile(logoSrc, logoOut)
console.log('copied', logoOut)
