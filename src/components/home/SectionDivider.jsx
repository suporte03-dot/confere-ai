import santaNova from '../../assets/santa-nova-hero.png'
import { assetUrl } from '../../utils/assetUrl'

const PATTERN_SRC = assetUrl('/images/brand/te-monogram-pattern.svg')

/**
 * Site-wide module separator: black strip + gold lines + T&E pattern.
 * Pass `withSanta` only for Featured Collection (uses full-strip santa-nova asset).
 */
function SectionDivider({ withSanta = false, className = '', embedded = false }) {
  const classes = [
    'section-divider',
    withSanta ? 'section-divider--santa' : '',
    embedded ? 'section-divider--embedded' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      aria-hidden="true"
      style={{ '--section-divider-pattern': `url(${PATTERN_SRC})` }}
    >
      {!withSanta ? (
        <div className="section-divider__gold-line section-divider__gold-line--top" />
      ) : null}
      <div className="section-divider__body">
        {!withSanta ? <span className="section-divider__pattern" /> : null}
        {withSanta ? (
          <div className="section-divider__saint-wrapper">
            <img
              src={santaNova}
              alt=""
              className="section-divider__saint"
              decoding="async"
            />
          </div>
        ) : null}
      </div>
      {!withSanta ? (
        <div className="section-divider__gold-line section-divider__gold-line--bottom" />
      ) : null}
    </div>
  )
}

export default SectionDivider
