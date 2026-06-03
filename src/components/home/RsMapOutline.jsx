import { RS_MAP_PATH, RS_MAP_VIEWBOX } from '../../data/rsMapPath'

/**
 * Contorno decorativo do Rio Grande do Sul — camada atrás do monograma TE.
 */
function RsMapOutline({ className = '' }) {
  return (
    <svg
      className={['header-brand__rs-map', className].filter(Boolean).join(' ')}
      viewBox={RS_MAP_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="header-brand__rs-outline"
        d={RS_MAP_PATH}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default RsMapOutline
