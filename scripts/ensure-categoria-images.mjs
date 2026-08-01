import { access, mkdir, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const outDir = join(__dirname, '../public/images/categorias')

export const categories = [
  { file: 'calca-jeans-masculinas.jpg', label: 'Calças Jeans', color: '#1e4b3a' },
  { file: 'camisas.jpg', label: 'Camisas', color: '#6B7A4E' },
  { file: 'jaquetas-masculinas.jpg', label: 'Jaquetas', color: '#103126' },
  { file: 'camisetas-masculinas.jpg', label: 'Camisetas', color: '#153d2f' },
  { file: 'polos.jpg', label: 'Polos', color: '#4A2E1D' },
  { file: 'bones.jpg', label: 'Bonés', color: '#A8894A' },
  { file: 'moletons-masculinos.jpg', label: 'Moletons', color: '#1D2A22' },
  { file: 'acessorios.jpg', label: 'Acessórios', color: '#c9a064' },
  { file: 'botas.jpg', label: 'Botas', color: '#4A2E1D' },
]

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function svgForCategory({ label, color }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#f3ede3"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  <text x="400" y="500" text-anchor="middle" dominant-baseline="middle"
    font-family="Georgia, serif" font-size="42" font-weight="700" fill="#f3ede3" opacity="0.92">
    ${escapeXml(label)}
  </text>
  <text x="400" y="560" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial, sans-serif" font-size="18" letter-spacing="4" fill="#f3ede3" opacity="0.7">
    TERRAESTILO
  </text>
</svg>`
}

async function fileExists(path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function createWithSharp(category) {
  const sharp = (await import('sharp')).default
  const svg = svgForCategory(category)
  const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer()
  await writeFile(join(outDir, category.file), jpg)
}

export async function ensureCategoriaImages({ force = false } = {}) {
  await mkdir(outDir, { recursive: true })

  const pending = force
    ? categories
    : (
        await Promise.all(
          categories.map(async (category) =>
            (await fileExists(join(outDir, category.file))) ? null : category,
          ),
        )
      ).filter(Boolean)

  if (pending.length === 0) return { created: 0, skipped: categories.length }

  await Promise.all(pending.map((category) => createWithSharp(category)))
  return { created: pending.length, skipped: categories.length - pending.length }
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const force = process.argv.includes('--force')
  const result = await ensureCategoriaImages({ force })
  console.log(
    `Category images: ${result.created} created, ${result.skipped} skipped (${outDir})`,
  )
}
