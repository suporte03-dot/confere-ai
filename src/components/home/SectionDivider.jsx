import santaHero from '../../assets/santa-hero.png'

/**
 * Jewelry-like module separator: thin gold lines + oval medallion.
 * `variant` tunes line color for light (ivory) or dark section contexts.
 */
function SectionDivider({ variant = 'light', showSaint = false, className = '' }) {
  const classes = ['section-divider', `section-divider--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} aria-hidden="true">
      <span className="section-divider__line" />
      <div className="section-divider__medallion">
        {showSaint ? (
          <img
            src={santaHero}
            alt=""
            aria-hidden="true"
            className="section-divider__saint"
            decoding="async"
          />
        ) : null}
      </div>
      <span className="section-divider__line" />
    </div>
  )
}

export default SectionDivider
