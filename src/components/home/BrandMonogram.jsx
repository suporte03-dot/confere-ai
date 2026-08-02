/**
 * Brand crest on the hero split seam — original circular logo over
 * half-dark / half-ivory so the mark reads as part of the page.
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
