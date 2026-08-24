import {
  listActiveCollections,
  listActiveProducts,
} from '../src/lib/catalog'
import { STATIC_INDEX_ROUTES, absoluteUrl } from '../src/lib/seo/site'

export const dynamic = 'force-dynamic'

function entry(path, lastModified = new Date()) {
  return {
    url: absoluteUrl(path),
    lastModified,
  }
}

export default async function sitemap() {
  const [products, collections] = await Promise.all([
    listActiveProducts(),
    listActiveCollections(),
  ])

  const staticEntries = STATIC_INDEX_ROUTES.map((path) => entry(path))

  const collectionEntries = collections
    .filter((item) => item.slug)
    .map((item) => entry(`/colecoes/${item.slug}`))

  const productEntries = products
    .filter((item) => item.active !== false && (item.slug || item.id))
    .map((item) => {
      const slug = item.slug || item.id
      const modified = item.updatedAt || item.createdAt
      return entry(
        `/produto/${slug}`,
        modified ? new Date(modified) : new Date(),
      )
    })

  return [...staticEntries, ...collectionEntries, ...productEntries]
}
