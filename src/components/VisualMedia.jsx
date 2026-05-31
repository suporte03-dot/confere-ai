import { useState } from 'react'

const ICONS = {
  hero: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M8 48V20l24-10 24 10v28" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 48V30h8v18M36 48V30h8v18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="16" r="4" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  masculino: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 14h28l-4 12H22L18 14z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 26v22M42 26v22M16 48h32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  feminino: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 10v16M24 18h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 26c0 8 5 14 12 14s12-6 12-14" stroke="currentColor" strokeWidth="2.5" />
      <path d="M32 40v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  infantil: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="18" r="8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 48c2-12 10-18 16-18s14 6 16 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 34h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  calcados: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 38c8-2 14-2 22 0 8 2 14 2 22 0v8c-8 4-14 6-22 6s-14-2-22-6v-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 38V28c0-4 4-8 8-8h12c4 0 8 4 8 8v10" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  acessorios: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="36" rx="18" ry="8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 36c0-10 8-16 18-16s18 6 18 16" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="14" r="3" fill="currentColor" />
    </svg>
  ),
  outlet: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 22l6-10h28l6 10v26H12V22z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 22v26M40 22v26" stroke="currentColor" strokeWidth="2.5" />
      <path d="M22 14h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  camisetas: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M16 18l8-6 8 6 8-6 8 6v30H16V18z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  camisas: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 14h24v6l6 8v24H14V28l6-8v-6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 14v40" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  polos: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 18h28l-4 10v24H22V28l-4-10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 18v8l4 4 4-4v-8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  jaquetas: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 22l18-8 18 8v28H14V22z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 14v36M14 30h18M32 30h18" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  jeans: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M22 12h20l-2 36H24L22 12z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 12v36" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  botas: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 16h24v16c0 10-6 18-12 18s-12-8-12-18V16z" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 34h32" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  camisaWorker: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 16h28l-6 10v26H24V26l-6-10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 24h28M18 32h28M18 40h28" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  ),
  camisetaEssencial: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M16 20l10-8 6 6 6-6 10 8v28H16V20z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  jaquetaCampo: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 24l20-10 20 10v26H12V24z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 14v36" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  jeansHorizonte: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 10h24l-2 38H22L20 10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 10v38" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  botaEstrada: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 14h28v18c0 12-8 20-14 20s-14-8-14-20V14z" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 32h32" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  poloOliva: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 18h28l-4 10v24H22V28l-4-10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 18v6l4 4 4-4v-6" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  bermudaSarja: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 18h28v8l-4 22H22l-4-22v-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 26v22" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  boneBordado: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="38" rx="20" ry="9" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 38c0-12 9-20 20-20s20 8 20 20" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  vestidoAurora: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 12v10M24 22h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 22l14 30 14-30H18z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  camisaSerena: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 16h24v8l4 6v26H16V30l4-6v-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  cintoTerra: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="28" width="44" height="8" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <rect x="42" y="26" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  mochilaCampo: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="16" y="20" width="32" height="34" rx="6" stroke="currentColor" strokeWidth="2.5" />
      <path d="M24 20v-6c0-3 3-6 8-6s8 3 8 6v6" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  moletons: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 22l18-8 18 8v26H14V22z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 14v34M14 28h18" stroke="currentColor" strokeWidth="2.5" />
      <path d="M22 28v8M42 28v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  banner: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M8 20l24-8 24 8v28H8V20z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 32h48" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  newsletter: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="16" width="44" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M10 20l22 16 22-16" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  moletomInfantil: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="18" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 22l18-8 18 8v26H14V22z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  croppedCampo: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 24h24v20H20V24z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 24V18h16v6" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  bodyCanelado: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M24 16h16v32H24V16z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 24h16" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  calcaInfantil: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M22 14h20l-2 34H24L22 14z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  vestidoInfantil: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 12v8M26 20h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 20l12 28 12-28H20z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  conjuntoInfantil: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="18" y="18" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M18 30h28" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  tenisHorizonte: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M8 36c10-4 18-4 28 0 10 4 18 4 28 0v10c-10 6-18 8-28 8s-18-2-28-8V36z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  chineloTerra: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 38c12-6 20-6 32 0 12 6 20 6 32 0v6c-12 8-20 10-32 10S22 52 10 44v-6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  coturnoUrbano: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M16 12h32v22c0 14-10 22-16 22s-16-8-16-22V12z" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 34h40" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  camisaFlanela: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 16h28l-6 10v26H24V26l-6-10z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 26h28M18 34h28" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
    </svg>
  ),
  jaquetaSarja: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 24l20-10 20 10v28H12V24z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 14v38" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  moletomCampoSul: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 22l18-8 18 8v26H14V22z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 28v8M42 28v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  bolsaCasual: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 24h28l4 28H14l4-28z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 24v-6c0-3 3-6 8-6s8 3 8 6v6" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  product: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 14h28v6l-6 8v24H24V28l-6-8v-6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 22h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
}

export function VisualPlaceholder({ variant = 'product', label, alt, compact = false }) {
  const icon = ICONS[variant] || ICONS.product

  return (
    <div
      className={`visual-placeholder visual-placeholder--${variant}${compact ? ' visual-placeholder--compact' : ''}`}
      role="img"
      aria-label={alt || label || 'Imagem TerraEstilo'}
    >
      <div className="visual-placeholder__pattern" aria-hidden="true" />
      <div className="visual-placeholder__icon">{icon}</div>
      {label && !compact && <p className="visual-placeholder__label">{label}</p>}
      {!compact && <span className="visual-placeholder__brand">TerraEstilo</span>}
    </div>
  )
}

export default function VisualMedia({
  src,
  alt,
  label,
  variant = 'product',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  compact = false,
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(!src)

  const showPlaceholder = !src || failed || !loaded

  return (
    <div className={`visual-media ${className}`.trim()}>
      {showPlaceholder && (
        <VisualPlaceholder variant={variant} label={label} alt={alt} compact={compact} />
      )}
      {src && !failed && (
        <img
          src={src}
          alt={alt || label || ''}
          className={`visual-media__img ${imgClassName} ${loaded ? 'visual-media__img--loaded' : ''}`.trim()}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true)
            setLoaded(false)
          }}
        />
      )}
    </div>
  )
}
