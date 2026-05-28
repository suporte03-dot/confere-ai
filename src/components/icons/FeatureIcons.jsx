const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconPdfExcel() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-5-6z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
      <rect x="15" y="14" width="7" height="7" rx="1" stroke="#059669" />
      <path d="M16.5 17.5h4M16.5 19.5h3" stroke="#059669" />
    </svg>
  )
}

export function IconMissingNotes() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
      <path d="M8 11h6" stroke="#EF4444" />
    </svg>
  )
}

export function IconDivergentValues() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5" />
      <circle cx="18" cy="6" r="3" stroke="#F59E0B" />
    </svg>
  )
}

export function IconOfx() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4M15 15h2" />
      <path d="M17 3v4M15 5h4" stroke="#2563EB" />
    </svg>
  )
}

export function IconNcm() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M4 7h16v10H4z" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M9 12h6M9 15h4" />
      <path d="M16 12l2 2-2 2" stroke="#06B6D4" />
    </svg>
  )
}

export function IconReportExcel() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-5-6z" />
      <path d="M14 3v6h6" />
      <path d="M8 13v5M12 11v7M16 14v4" stroke="#059669" />
    </svg>
  )
}

export function IconUpload() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

export function IconCheck() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2" />
    </svg>
  )
}

export function IconShield() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
      <path d="M9 12l2 2 4-4" stroke="#06B6D4" />
    </svg>
  )
}

export function IconExport() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 3v12M8 11l4 4 4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

const featureIconMap = {
  'pdf-excel': IconPdfExcel,
  'missing-notes': IconMissingNotes,
  'divergent-values': IconDivergentValues,
  ofx: IconOfx,
  ncm: IconNcm,
  'report-excel': IconReportExcel,
}

export function FeatureIcon({ name }) {
  const Icon = featureIconMap[name]
  if (!Icon) return null
  return <Icon />
}
