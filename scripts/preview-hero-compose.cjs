const sharp = require('sharp')
const fs = require('fs')

async function main() {
  const W = 1600
  const H = 900
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="g1" cx="50%" cy="46%" r="40%">
        <stop offset="0%" stop-color="#c9a227" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g2" cx="16%" cy="52%" r="45%">
        <stop offset="0%" stop-color="#5c442a" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="#0c0a08"/>
    <rect width="100%" height="100%" fill="url(#g2)"/>
    <rect width="100%" height="100%" fill="url(#g1)"/>
  </svg>`)

  const cast = await sharp('public/images/hero/couple-hero.png')
    .resize({ height: 860, fit: 'inside' })
    .toBuffer()

  const layers = [
    { input: svg, left: 0, top: 0 },
    { input: cast, left: -20, top: 40 },
  ]

  const logoSrc = 'public/images/brand/terra-e-estilo-logo.png'
  if (fs.existsSync(logoSrc)) {
    const logoBuf = await sharp(logoSrc).resize(280, 280).toBuffer()
    layers.push({ input: logoBuf, left: 620, top: 300 })
  }

  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 12, g: 10, b: 8 } },
  })
    .composite(layers)
    .png()
    .toFile('public/images/_probe/hero-compose-preview.png')

  console.log('compose ok')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
