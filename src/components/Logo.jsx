const LOGO_SRC = '/images/terrabrasil/logo-terrabrasil.png'

function Logo({ size = 'md', variant = 'default' }) {
  return (
    <span className={`logo logo--${size} logo--${variant}`}>
      <img
        src={LOGO_SRC}
        alt="TerraBrasil"
        className="logo__image"
        width={220}
        height={72}
        decoding="async"
      />
    </span>
  )
}

export default Logo
