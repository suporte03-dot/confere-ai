import Link from 'next/link'
import { privatePageMetadata } from '../src/lib/seo/metadata'

export const metadata = privatePageMetadata.notFound

export default function NotFound() {
  return (
    <main className="catalog-page">
      <div className="container catalog-page__empty">
        <p className="product-detail-page__eyebrow">Terra & Estilo</p>
        <h1>Página não encontrada</h1>
        <p>O endereço que você acessou não existe ou foi movido.</p>
        <Link href="/" className="btn btn--gold">
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
