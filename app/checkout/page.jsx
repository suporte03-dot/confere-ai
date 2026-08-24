import CheckoutForm from './CheckoutForm'
import { privatePageMetadata } from '../../src/lib/seo/metadata'
import './checkout.css'

export const metadata = privatePageMetadata.checkout

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <div className="checkout-page__inner">
        <header className="checkout-page__head">
          <p className="checkout-page__eyebrow">Checkout</p>
          <h1>Finalize seu pedido</h1>
          <p>
            Preencha seus dados para gerar o pedido. O pagamento será feito por Pix
            ou link externo, com confirmação manual da loja.
          </p>
        </header>
        <CheckoutForm />
      </div>
    </main>
  )
}
