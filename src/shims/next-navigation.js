/**
 * Vite shim for `next/navigation` — thin wrappers over react-router-dom.
 */
import {
  useNavigate,
  useLocation,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()

  return {
    push: (href) => navigate(href),
    replace: (href) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    prefetch: () => {},
    refresh: () => {},
  }
}

export function usePathname() {
  return useLocation().pathname
}

export function useSearchParams() {
  const [params] = useRouterSearchParams()
  return params
}

export function useParams() {
  return useRouterParams()
}
