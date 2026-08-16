/**
 * Vite shim for `next/link` — maps Next `href` API onto react-router-dom Link.
 */
import { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const Link = forwardRef(function NextLinkShim(
  {
    href,
    replace,
    prefetch: _prefetch,
    scroll: _scroll,
    shallow: _shallow,
    locale: _locale,
    legacyBehavior: _legacyBehavior,
    passHref: _passHref,
    children,
    ...rest
  },
  ref,
) {
  return (
    <RouterLink ref={ref} to={href} replace={replace} {...rest}>
      {children}
    </RouterLink>
  )
})

export default Link
