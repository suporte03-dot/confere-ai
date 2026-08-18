import Link from 'next/link'

export function AdminIcon({ name, className, title }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  )
}

const PATHS = {
  overview: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </>
  ),
  products: (
    <>
      <path d="M4 7.5h16l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3L4 7.5Z" />
      <path d="M8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5" />
    </>
  ),
  categories: (
    <>
      <path d="M4.5 7.5 12 3.5l7.5 4v9l-7.5 4-7.5-4v-9Z" />
      <path d="M12 12.5v8" />
      <path d="M4.5 7.5 12 12.5l7.5-5" />
    </>
  ),
  collections: (
    <>
      <rect x="4" y="6" width="16" height="12.5" rx="1.4" />
      <path d="M8 6V4.8A1.8 1.8 0 0 1 9.8 3h4.4A1.8 1.8 0 0 1 16 4.8V6" />
    </>
  ),
  stock: (
    <>
      <path d="M3.8 8.2 12 4.2l8.2 4-8.2 4-8.2-4Z" />
      <path d="M3.8 8.2v7.6L12 20l8.2-4.2V8.2" />
      <path d="M12 12.2V20" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.2 19.2a6.8 6.8 0 0 1 13.6 0" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4.5H6.8A1.8 1.8 0 0 0 5 6.3v11.4a1.8 1.8 0 0 0 1.8 1.8H10" />
      <path d="M10 12h9" />
      <path d="M16.2 8.5 19.7 12l-3.5 3.5" />
    </>
  ),
  bell: (
    <>
      <path d="M15.8 17.8a3.8 3.8 0 0 1-7.6 0" />
      <path d="M6.2 17.8h11.6S16.5 15.6 16.5 10a4.5 4.5 0 0 0-9 0c0 5.6-1.3 7.8-1.3 7.8Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7.2" />,
  out: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
    </>
  ),
  critical: (
    <>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4.2" />
      <path d="M12 16.8h.01" />
    </>
  ),
  low: (
    <>
      <path d="M12 7v5" />
      <path d="M12 16.5h.01" />
      <circle cx="12" cy="12" r="8" />
    </>
  ),
  close: (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),
  chevron: <path d="m7 10 5 5 5-5" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6.2 5.8 12 5.8 21.5 12 21.5 12 17.8 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  pencil: (
    <>
      <path d="M13.4 5.4 18.6 10.6" />
      <path d="M4.5 19.5 5.8 14.6 16.2 4.2a2.1 2.1 0 0 1 3 3L8.8 17.6 4.5 19.5Z" />
    </>
  ),
  power: (
    <>
      <path d="M12 3.5v8" />
      <path d="M7.2 6.4a7 7 0 1 0 9.6 0" />
    </>
  ),
  star: (
    <path
      d="M12 3.6 14.4 9l6 .6-4.5 4 1.3 5.8L12 16.8 6.8 19.4l1.3-5.8-4.5-4 6-.6L12 3.6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  starOff: (
    <path d="M12 3.6 14.4 9l6 .6-4.5 4 1.3 5.8L12 16.8 6.8 19.4l1.3-5.8-4.5-4 6-.6L12 3.6Z" />
  ),
  shield: (
    <>
      <path d="M12 3.5 19.5 6.5v5.4c0 4.3-3 6.8-7.5 8.6-4.5-1.8-7.5-4.3-7.5-8.6V6.5L12 3.5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </>
  ),
  monitor: (
    <>
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.4" />
      <path d="M8.5 20h7" />
      <path d="M12 16v4" />
    </>
  ),
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.4" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 10.5V17" />
      <path d="M12 7.4h.01" />
    </>
  ),
  up: <path d="m6 14 6-6 6 6" />,
  down: <path d="m6 10 6 6 6-6" />,
  tag: (
    <>
      <path d="M3.8 12.4 11.4 4.8h7.3v7.3L11.1 20.7a1.4 1.4 0 0 1-2 0L3.8 14.4a1.4 1.4 0 0 1 0-2Z" />
      <circle cx="16.2" cy="7.8" r="1.1" />
    </>
  ),
  list: (
    <>
      <path d="M8 7h12" />
      <path d="M8 12h12" />
      <path d="M8 17h12" />
      <path d="M4 7h.01" />
      <path d="M4 12h.01" />
      <path d="M4 17h.01" />
    </>
  ),
  prev: <path d="m14 6-6 6 6 6" />,
  next: <path d="m10 6 6 6-6 6" />,
}

export function AdminIconAction({
  href,
  icon,
  label,
  danger,
  gold,
  className = '',
  type = 'button',
  ...props
}) {
  const cls = [
    'admin-icon-action',
    danger ? 'admin-icon-action--danger' : '',
    gold ? 'admin-icon-action--gold' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const inner = (
    <>
      <AdminIcon name={icon} />
      <span>{label}</span>
    </>
  )
  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {inner}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} {...props}>
      {inner}
    </button>
  )
}
