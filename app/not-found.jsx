import Link from 'next/link'

export const metadata = {
  title: 'Página não encontrada — Terra & Estilo',
  description:
    'Terra & Estilo — A marca do agro brasileiro. Moda premium com identidade, elegância e autenticidade.',
}

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
