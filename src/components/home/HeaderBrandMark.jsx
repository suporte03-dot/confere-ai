/**
 * Composição da marca no header — integrada ao fundo verde (sem card/bege).
 */
import RsMapOutline from './RsMapOutline'
import TerraEstiloWordmark from './TerraEstiloWordmark'

function HeaderBrandMark({ className = '' }) {
  const linkClass = ['brand-logo-composition', 'header-brand__logo-link', className]
    .filter(Boolean)
    .join(' ')

  return (
    <a href="#inicio" className={linkClass} aria-label="TerraEstilo — Página inicial">
      <div className="header-brand__composition">
        <div className="brand-symbol-wrap header-brand__monogram-wrap" aria-hidden="true">
          <RsMapOutline />
          <div className="brand-symbol header-brand__symbol">
            <span className="brand-symbol__t header-brand__letter--t">T</span>
            <span className="brand-symbol__e header-brand__letter--e">E</span>
          </div>
        </div>
        <TerraEstiloWordmark variant="on-dark" className="brand-name header-brand__wordmark" />
        <span className="brand-slogan header-brand__tagline">Moda que veste origens</span>
        <span className="brand-ornament header-brand__rule" aria-hidden="true" />
      </div>
    </a>
  )
}

export default HeaderBrandMark
