import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'

export const metadata = {
  title: 'Acessórios — Terra & Estilo',
  description:
    'Bonés, cintos, mochilas e peças que fecham o look com a assinatura Terra & Estilo — identidade em cada detalhe.',
}

export default function AcessoriosPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="acessorios" />
    </Suspense>
  )
}
