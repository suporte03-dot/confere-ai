const COLORS = [
  { name: 'Preto', hex: '#0a0a0a' },
  { name: 'Ouro Metálico', hex: '#D4AF37' },
  { name: 'Ouro Champagne', hex: '#C9A064' },
  { name: 'Mármore', hex: '#F7F5F2' },
]

function ColorPalette() {
  return (
    <section className="lp-palette" aria-label="Paleta de cores Terra & Estilo">
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
