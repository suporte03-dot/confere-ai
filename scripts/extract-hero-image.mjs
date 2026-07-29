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
  Inauguration graphic ≈ y 166–648.
  Models only — stop well before gold "INAUGURAÇÃO" (~x 200+ in post space).
  Top pad keeps hat crowns clear under object-fit: cover.
*/
const post = { left: 18, top: 166, width: 449, height: 483 }
const modelsW = 158

const modelsPng = await sharp(src)
  .extract(post)
  .extract({ left: 0, top: 0, width: modelsW, height: post.height })
  .png()
  .toBuffer()

const paddedPng = await sharp(modelsPng)
  .extend({
    top: 40,
    bottom: 8,
    left: 10,
    right: 24,
    background: { r: 18, g: 16, b: 14 },
  })
  .png()
  .toBuffer()

const padMeta = await sharp(paddedPng).metadata()
console.log('padded', padMeta.width, 'x', padMeta.height)

await sharp(paddedPng)
  .resize(1200, 1500, {
    fit: 'cover',
    position: 'top',
  })
  .modulate({ brightness: 1.22, saturation: 1.08 })
  .linear(1.12, -8)
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(out)

const final = await sharp(out).metadata()
console.log('wrote', out, `${final.width}x${final.height}`)

await fs.promises.copyFile(logoSrc, logoOut)
console.log('copied', logoOut)
