import TerraEstiloLogo from './TerraEstiloLogo'

function BrandPlaque() {
  return (
    <aside className="brand-plaque" aria-label="Terra & Estilo">
      <div className="logo-shell logo-shell--header logo-shell--plaque">
        <a
          href="#inicio"
          className="site-header__logo header-logo logo-container site-logo"
          aria-label="Terra & Estilo — Página inicial"
        >
          <TerraEstiloLogo variant="header" />
        </a>
      </div>
    </aside>
  )
}

export default BrandPlaque
