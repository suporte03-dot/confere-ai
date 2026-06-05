import CategoryShowcase from './CategoryShowcase'
import FeaturedCollection from './FeaturedCollection'

function CollectionVitrine() {
  return (
    <div className="collection-vitrine" aria-label="Vitrine de coleções TerraEstilo">
      <CategoryShowcase />
      <FeaturedCollection />
    </div>
  )
}

export default CollectionVitrine
