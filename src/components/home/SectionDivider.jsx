import santaHero from '../../assets/santa-hero.png'

/**
 * Module separator: thin gold lines + centered saint (when shown).
 * `variant` tunes line color for light (ivory) or dark section contexts.
 * Pass `className="section-divider--after-hero"` for the compact hero bridge.
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
