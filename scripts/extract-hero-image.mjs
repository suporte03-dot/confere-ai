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
  Extract only the models photo frame from the inauguration graphic.
  Avoids gold "INAUGURAÇÃO" type, date row, and invite copy on the right.
  Extra top pad (#15130f) protects hat crowns under object-fit: contain.
*/
const models = { left: 14, top: 168, width: 158, height: 350 }

const modelsPng = await sharp(src).extract(models).png().toBuffer()

const paddedPng = await sharp(modelsPng)
  .extend({
    top: 96,
    bottom: 64,
    left: 40,
    right: 48,
    background: { r: 21, g: 19, b: 15 },
  })
  .png()
  .toBuffer()

const padMeta = await sharp(paddedPng).metadata()
console.log('padded', padMeta.width, 'x', padMeta.height)

await sharp(paddedPng)
  .resize(1200, 1500, {
    fit: 'contain',
    background: { r: 21, g: 19, b: 15 },
  })
  .modulate({ brightness: 1.32, saturation: 1.05 })
  .linear(1.1, -6)
  .jpeg({ quality: 93, mozjpeg: true })
  .toFile(out)

const final = await sharp(out).metadata()
console.log('wrote', out, `${final.width}x${final.height}`)

await fs.promises.copyFile(logoSrc, logoOut)
console.log('copied', logoOut)

// cleanup probes
for (const name of [
  '_probe-models.jpg',
  '_probe-models2.jpg',
  '_probe-models3.jpg',
  '_probe-frame.jpg',
  '_probe-frame2.jpg',
]) {
  const p = path.join(root, 'public/images', name)
  if (fs.existsSync(p)) fs.unlinkSync(p)
}
console.log('probes cleaned')
