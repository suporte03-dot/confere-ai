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
}
