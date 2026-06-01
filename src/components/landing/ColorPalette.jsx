const COLORS = [
  { name: 'Verde Floresta', hex: '#1F3D2E' },
  { name: 'Oliva', hex: '#6B7A4E' },
  { name: 'Ouro Champagne', hex: '#C9A86A' },
  { name: 'Creme', hex: '#F4EFE6' },
]

function ColorPalette() {
  return (
    <section className="lp-palette" aria-label="Paleta de cores TerraEstilo">
      <div className="lp-container">
        <header className="lp-section-head lp-section-head--light">
          <p className="lp-eyebrow">Paleta cromática</p>
          <h2>Cores que contam a nossa história</h2>
        </header>

        <div className="lp-palette__grid">
          {COLORS.map((color) => (
            <div key={color.hex} className="lp-palette__item">
              <div className="lp-palette__swatch" style={{ backgroundColor: color.hex }} />
              <div className="lp-palette__meta">
                <strong>{color.name}</strong>
                <span>{color.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ColorPalette
