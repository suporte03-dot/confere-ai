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

const meta = await sharp(src).metadata()
console.log('source', meta.width, 'x', meta.height)

/*
  Instagram screenshot (485×1024). Inauguration graphic sits ~y 166–648.
  Gold "INAUGURAÇÃO" begins near x≈300 — crop models only (left of text).
  Artwork has hats flush with the top edge, so add black headroom before resize.
*/
const post = { left: 18, top: 166, width: 449, height: 483 }
const modelsW = 270

await sharp(src)
  .extract(post)
  .extract({ left: 0, top: 0, width: modelsW, height: post.height })
  .extend({
    top: 96,
    bottom: 24,
    left: 12,
    right: 12,
    background: { r: 9, g: 9, b: 9, alpha: 1 },
  })
  .resize(1200, 1600, {
    fit: 'cover',
    position: 'top',
  })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(out)

console.log('wrote', out, `(models ${modelsW}×${post.height} + headroom)`)
await fs.promises.copyFile(logoSrc, logoOut)
console.log('copied', logoOut)
