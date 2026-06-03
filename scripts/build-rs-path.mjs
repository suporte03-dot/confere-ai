import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const gj = JSON.parse(fs.readFileSync(path.join(__dirname, 'bra-states.geojson'), 'utf8'))
const rs = gj.features.find((f) => f.properties.sigla === 'RS')
const ring = rs.geometry.coordinates[0][0]

let minX = Infinity
let minY = Infinity
let maxX = -Infinity
let maxY = -Infinity

for (const [x, y] of ring) {
  minX = Math.min(minX, x)
  minY = Math.min(minY, y)
  maxX = Math.max(maxX, x)
  maxY = Math.max(maxY, y)
}

const vbW = 100
const vbH = 112
const pad = 2
const w = maxX - minX
const h = maxY - minY
const scale = Math.min((vbW - pad * 2) / w, (vbH - pad * 2) / h)
const offsetX = pad + (vbW - pad * 2 - w * scale) / 2 - minX * scale
const offsetY = pad + (vbH - pad * 2 - h * scale) / 2

const step = Math.max(1, Math.floor(ring.length / 140))
const sampled = []
for (let i = 0; i < ring.length; i += step) sampled.push(ring[i])
if (sampled[sampled.length - 1] !== ring[ring.length - 1]) {
  sampled.push(ring[ring.length - 1])
}

// Norte (lat maior) no topo do SVG
const mapPoint = ([lon, lat]) => {
  const nx = (lon * scale + offsetX).toFixed(1)
  const ny = ((maxY - lat) * scale + offsetY).toFixed(1)
  return `${nx} ${ny}`
}

const d = `M${sampled.map(mapPoint).join(' L')} Z`

const out = `/** Contorno do Rio Grande do Sul — gerado a partir de bra-states.geojson */\nexport const RS_MAP_VIEWBOX = '0 0 ${vbW} ${vbH}'\nexport const RS_MAP_PATH =\n  '${d}'\n`

fs.writeFileSync(path.join(__dirname, '../src/data/rsMapPath.js'), out)
console.log('Wrote rsMapPath.js', { points: sampled.length, length: d.length })
