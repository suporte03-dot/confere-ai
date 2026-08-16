'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * NavLink-style helper compatible with Next Link + Vite `next/*` shims.
 * Mirrors react-router NavLink `className={({ isActive }) => ...}` and `end`.
 */
function AppNavLink({
  href,
  to,
  end = false,
  className,
  children,
  onClick,
  ...rest
}) {
  const pathname = usePathname() || ''
  const dest = href ?? to ?? '/'
  const pathOnly = String(dest).split('?')[0].split('#')[0] || '/'
  const isActive = end
    ? pathname === pathOnly
    : pathname === pathOnly || (pathOnly !== '/' && pathname.startsWith(`${pathOnly}/`))

  const resolvedClass =
    typeof className === 'function' ? className({ isActive }) : className

  return (
    <Link href={dest} className={resolvedClass} onClick={onClick} {...rest}>
      {children}
    </Link>
  )
}

export default AppNavLink
