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
  Inauguration graphic ≈ y 166–648 in the Instagram screenshot.
  Models occupy the left ~42% — stop before gold "INAUGURAÇÃO".
  Output a slightly wider hero crop so desktop media cells (landscape)
  still frame faces/hats under object-fit: cover.
*/
const post = { left: 18, top: 166, width: 449, height: 483 }
const modelsW = 188

const modelsPng = await sharp(src)
  .extract(post)
  .extract({ left: 0, top: 0, width: modelsW, height: post.height })
  .png()
  .toBuffer()

/*
  Pad sides only (keep hats at the top of the bitmap).
  Target ~4:5 so cover in a wide cell crops less aggressively than 3:4.
*/
const paddedPng = await sharp(modelsPng)
  .extend({
    top: 0,
    bottom: 0,
    left: 16,
    right: 16,
    background: { r: 9, g: 9, b: 9 },
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
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(out)

const final = await sharp(out).metadata()
console.log('wrote', out, `${final.width}x${final.height}`)

await fs.promises.copyFile(logoSrc, logoOut)
console.log('copied', logoOut)
