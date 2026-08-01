import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/images/categorias')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A2E1D"/>
      <stop offset="55%" stop-color="#6B4423"/>
      <stop offset="100%" stop-color="#C4A574"/>
    </linearGradient>
    <linearGradient id="boot" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F3EDE3"/>
      <stop offset="100%" stop-color="#E0C9A0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <g transform="translate(400 500)" fill="url(#boot)" fill-opacity="0.22" stroke="#F3EDE3" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-78 -230 L-78 20 Q-78 78 -22 98 L118 98 Q162 98 168 68 L168 42 Q168 22 140 16 L18 16 Q-14 16 -24 -6 L-24 -230 Z"/>
    <path d="M-22 98 L118 98" fill="none" stroke-width="16"/>
    <path d="M-60 -50 L8 -50" fill="none" stroke-width="7" opacity="0.75"/>
    <path d="M-60 0 L20 0" fill="none" stroke-width="7" opacity="0.75"/>
  </g>
  <text x="400" y="820" text-anchor="middle" font-family="Georgia, serif" font-size="40" font-weight="700" fill="#F3EDE3" opacity="0.92">Botas</text>
  <text x="400" y="870" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" letter-spacing="4" fill="#F3EDE3" opacity="0.7">TERRAESTILO</text>
</svg>`

await mkdir(outDir, { recursive: true })
const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer()
const out = join(outDir, 'botas.jpg')
await writeFile(out, jpg)
console.log(`Wrote ${out} (${jpg.length} bytes)`)
