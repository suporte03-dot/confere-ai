import fs from 'fs'

const svg = fs.readFileSync('temp-br.svg', 'utf8')
const match = svg.match(/d="([^"]+)" id="BRRS"/)
if (!match) throw new Error('BRRS path not found')

const d = match[1]
const nums = [...d.matchAll(/-?\d+\.?\d*/g)].map((m) => Number(m[0]))

let minX = Infinity
let minY = Infinity
let maxX = -Infinity
let maxY = -Infinity

for (let i = 0; i < nums.length - 1; i += 2) {
  const x = nums[i]
  const y = nums[i + 1]
  if (Number.isNaN(x) || Number.isNaN(y)) continue
  minX = Math.min(minX, x)
  minY = Math.min(minY, y)
  maxX = Math.max(maxX, x)
  maxY = Math.max(maxY, y)
}

const pad = 8
const size = 100
const w = maxX - minX
const h = maxY - minY
const scale = Math.min((size - pad * 2) / w, (size - pad * 2) / h)
const offsetX = pad + (size - pad * 2 - w * scale) / 2 - minX * scale
const offsetY = pad + (size - pad * 2 - h * scale) / 2 - minY * scale

const tokens = d.match(/[a-zA-Z]|-?\d+\.?\d*/g) ?? []
let cx = 0
let cy = 0
let cmd = ''
const out = []
let i = 0

const pushPair = (x, y) => {
  const nx = (x * scale + offsetX).toFixed(2)
  const ny = (y * scale + offsetY).toFixed(2)
  out.push(`${nx} ${ny}`)
  cx = x
  cy = y
}

while (i < tokens.length) {
  const t = tokens[i++]
  if (/^[a-zA-Z]$/.test(t)) {
    cmd = t
    if (t === 'Z' || t === 'z') {
      out.push('Z')
    }
    continue
  }

  if (cmd === 'M' || cmd === 'L') {
    const x = Number(t)
    const y = Number(tokens[i++])
    pushPair(x, y)
    if (cmd === 'M') cmd = 'L'
  } else if (cmd === 'l') {
    const dx = Number(t)
    const dy = Number(tokens[i++])
    pushPair(cx + dx, cy + dy)
  } else if (cmd === 'm') {
    const dx = Number(t)
    const dy = Number(tokens[i++])
    pushPair(cx + dx, cy + dy)
    cmd = 'l'
  } else if (cmd === 'z' || cmd === 'Z') {
    // already handled
  } else {
    i++
  }
}

const simplified = `M${out.join(' L').replace(/ L Z/g, ' Z')}`
  .replace(/M([^L]+) L/g, (full, first) => full)
  .replace(/\s+/g, ' ')
  .trim()

// Build proper M/L path
const rebuilt = []
let rebuiltCmd = ''
let curX = 0
let curY = 0
let j = 0
const rebuiltTokens = d.match(/[a-zA-Z]|-?\d+\.?\d*/g) ?? []

while (j < rebuiltTokens.length) {
  const tok = rebuiltTokens[j++]
  if (/^[a-zA-Z]$/.test(tok)) {
    rebuiltCmd = tok
    if (tok === 'Z' || tok === 'z') rebuilt.push('Z')
    continue
  }
  if (rebuiltCmd === 'M' || rebuiltCmd === 'L') {
    const x = Number(tok)
    const y = Number(rebuiltTokens[j++])
    const nx = (x * scale + offsetX).toFixed(1)
    const ny = (y * scale + offsetY).toFixed(1)
    rebuilt.push(`${rebuiltCmd}${nx} ${ny}`)
    curX = x
    curY = y
    if (rebuiltCmd === 'M') rebuiltCmd = 'L'
  } else if (rebuiltCmd === 'l') {
    const dx = Number(tok)
    const dy = Number(rebuiltTokens[j++])
    curX += dx
    curY += dy
    const nx = (curX * scale + offsetX).toFixed(1)
    const ny = (curY * scale + offsetY).toFixed(1)
    rebuilt.push(`L${nx} ${ny}`)
  } else if (rebuiltCmd === 'm') {
    const dx = Number(tok)
    const dy = Number(rebuiltTokens[j++])
    curX += dx
    curY += dy
    const nx = (curX * scale + offsetX).toFixed(1)
    const ny = (curY * scale + offsetY).toFixed(1)
    rebuilt.push(`M${nx} ${ny}`)
    rebuiltCmd = 'l'
  }
}

const path = rebuilt.join('').replace(/Z+/g, 'Z')
console.log('export const RS_MAP =')
console.log(`  '${path}'`)
console.error('points', rebuilt.length, 'bbox', { minX, minY, maxX, maxY, scale: scale.toFixed(3) })
