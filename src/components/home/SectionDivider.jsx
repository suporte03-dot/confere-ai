import santaHero from '../../assets/santa-hero.png'

/**
 * Major-section separator: thin gold lines + centered Nossa Senhora.
 * Fully transparent — image integrates into the page background.
 */
function SectionDivider({ variant = 'light', showSaint = true, className = '' }) {
  const classes = ['section-divider', `section-divider--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} aria-hidden="true">
      <span className="section-divider__line" />
      {showSaint ? (
        <div className="section-divider__medallion section-divider__medallion--saint">
          <img
            src={santaHero}
            alt=""
            aria-hidden="true"
            className="section-divider__saint"
            decoding="async"
          />
        </div>
      ) : (
        <div className="section-divider__medallion" />
      )}
      <span className="section-divider__line" />
    </div>
  )
}

export default SectionDivider
