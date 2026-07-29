const COLORS = [
  { name: 'Preto', hex: '#0B0B0B' },
  { name: 'Ouro', hex: '#C9A24D' },
  { name: 'Ouro suave', hex: '#D8B56A' },
  { name: 'Branco suave', hex: '#F8F6F1' },
  { name: 'Fundo claro', hex: '#F7F4EE' },
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
