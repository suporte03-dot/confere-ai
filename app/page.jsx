import HomePage from '../src/views/HomePage'
import { getFeaturedCollection } from '../src/lib/catalog'

/**
 * Phase 4: full Home parity — same section tree as Vite `/`.
 * Catalog data comes from layout → ShopProvider; featured collection is loaded here.
 */
export default async function Page() {
  const featuredCollection = await getFeaturedCollection()
  return <HomePage featuredCollection={featuredCollection} />
}
