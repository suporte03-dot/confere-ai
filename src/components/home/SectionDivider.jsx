import santaNova from '../../assets/santa-nova-hero.png'
import { assetUrl } from '../../utils/assetUrl'

const PATTERN_SRC = assetUrl('/images/brand/te-monogram-pattern.svg')

/**
 * Site-wide module separator: black strip + gold lines + T&E pattern.
 * Pass `withSanta` only for Featured Collection (transparent santa on the band).
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
      <div className="section-divider__gold-line section-divider__gold-line--top" />
      <div className="section-divider__body">
        <span className="section-divider__pattern" />
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
      <div className="section-divider__gold-line section-divider__gold-line--bottom" />
    </div>
  )
}

export default SectionDivider
