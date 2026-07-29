/**
 * Build couple-only hero photo (no burned-in logo / INAUGURAÇÃO text).
 * Emblem stays a separate HTML element in HeroSection.
 */
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const heroDir = path.join(root, 'public/images/hero')
const flyer = path.join(root, 'public/images/brand/brand-inauguracao-flyer.png')
const heroFull = path.join(root, 'public/images/terra-estilo-hero-full.jpg')

fs.mkdirSync(heroDir, { recursive: true })

async function cropCoupleFromFlyer() {
  const fm = await sharp(flyer).metadata()
  const left = 2
  const top = 4
  const width = Math.round(fm.width * 0.38)
  const height = fm.height - top - 2
  return sharp(flyer)
    .extract({ left, top, width, height })
    .resize(900, 1125, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 1.12, saturation: 1.04 })
    .linear(1.08, -6)
    .jpeg({ quality: 94, mozjpeg: true })
    .toBuffer()
}

async function cropCoupleFromHeroFull() {
  if (!fs.existsSync(heroFull)) return null
  const hm = await sharp(heroFull).metadata()
  return sharp(heroFull)
    .extract({
      left: 20,
      top: 18,
      width: Math.round(hm.width * 0.36),
      height: hm.height - 36,
    })
    .resize(900, 1125, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 94, mozjpeg: true })
    .toBuffer()
}

const fromFlyer = await cropCoupleFromFlyer()
const fromHero = await cropCoupleFromHeroFull()
const chosen = fromHero && fromHero.length >= fromFlyer.length ? fromHero : fromFlyer

const couplePath = path.join(heroDir, 'couple.jpg')
await fs.promises.writeFile(couplePath, chosen)
await fs.promises.writeFile(path.join(heroDir, 'slide-1.jpg'), chosen)

await sharp(chosen)
  .resize(360, 480, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 90 })
  .toFile(path.join(heroDir, 'thumb-couple-detail.jpg'))

for (const [src, dest] of [
  ['slide-2.jpg', 'thumb-bag-marble.jpg'],
  ['slide-3.jpg', 'thumb-bag-side.jpg'],
  ['slide-4.jpg', 'thumb-bag-gloss.jpg'],
]) {
  const from = path.join(heroDir, src)
  if (fs.existsSync(from)) {
    await fs.promises.copyFile(from, path.join(heroDir, dest))
  }
}

const meta = await sharp(couplePath).metadata()
console.log('wrote', couplePath, `${meta.width}x${meta.height}`)
