/**
 * Center header crest — original brand logo on the hero split seam.
 */
import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

function BrandMonogram() {
  return (
    <div className="brand-monogram" aria-hidden="true">
      <img
        src={BRAND_LOGO_CIRCULAR_SRC}
        alt=""
        className="brand-monogram__logo"
        width={512}
        height={512}
        decoding="async"
      />
    </div>
  )
}

export default BrandMonogram
