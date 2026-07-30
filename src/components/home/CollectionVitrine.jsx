import FeaturedCollection from './FeaturedCollection'
import CategoryShowcase from './CategoryShowcase'

function CollectionVitrine() {
  return (
    <div className="collection-vitrine" aria-label="Vitrine de coleções Terra & Estilo">
      <FeaturedCollection />
      <CategoryShowcase />
    </div>
  )
}

export default CollectionVitrine
