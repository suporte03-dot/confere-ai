import CheckoutForm from './CheckoutForm'
import { privatePageMetadata } from '../../src/lib/seo/metadata'
import HeaderBrandMark from '../../src/components/home/HeaderBrandMark'
import { fetchStoreSettings } from '../../src/lib/store/settings'
import './checkout.css'

export const metadata = privatePageMetadata.checkout

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="1.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 3 27 7v7c0 7.2-4.6 12.2-11 15-6.4-2.8-11-7.8-11-15V7l11-4Z" />
      <path d="m11 16 3.2 3.2L21.5 12" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3 7h17v15H3zM20 13h5l4 4v5h-9z" />
      <circle cx="9" cy="24" r="3" />
      <circle cx="25" cy="24" r="3" />
      <path d="M20 18h9" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 4a12 12 0 0 0-10.4 18l-1.4 5.1 5.2-1.4A12 12 0 1 0 16 4Z" />
      <path d="M11.5 11.2c.3-.6.6-.6 1-.6h.7c.3 0 .5.1.7.5l1 2.2c.1.3.1.5-.1.8l-.6.8c-.2.2-.2.4 0 .7.5.8 1.2 1.5 2 2 .3.2.5.2.7 0l.8-.9c.2-.2.5-.3.8-.1l2.2 1c.3.1.4.3.4.6v.7c0 .4-.1.7-.6 1-1 .5-2.1.4-3.1 0-1.6-.7-3-1.8-4.1-3.1-1-1.2-1.7-2.5-1.9-3.5-.2-.8-.1-1.6.2-2.1Z" />
    </svg>
  )
}

function CheckoutHeader() {
  return (
    <header className="checkout-header">
      <div className="checkout-header__inner">
        <HeaderBrandMark className="checkout-brand" showWordmark />
        <nav className="checkout-steps" aria-label="Etapas do checkout">
          <span className="checkout-step checkout-step--complete">
            <b>1</b>
            <span>Carrinho</span>
          </span>
          <i aria-hidden="true" />
          <span className="checkout-step checkout-step--active" aria-current="step">
            <b>2</b>
            <span>Entrega</span>
          </span>
          <i aria-hidden="true" />
          <span className="checkout-step">
            <b>3</b>
            <span>Pagamento</span>
          </span>
        </nav>
        <div className="checkout-safe">
          <LockIcon />
          <span>
            <strong>Ambiente seguro</strong>
            <small>Seus dados protegidos</small>
          </span>
        </div>
      </div>
    </header>
  )
}

function CheckoutFooter({ whatsapp }) {
  const rawWhatsApp = String(whatsapp || '').trim()
  const whatsappDigits = rawWhatsApp.replace(/\D/g, '')
  const whatsappHref = rawWhatsApp
    ? /^https?:\/\//i.test(rawWhatsApp)
      ? rawWhatsApp
      : whatsappDigits
        ? `https://wa.me/${whatsappDigits.startsWith('55') ? whatsappDigits : `55${whatsappDigits}`}`
        : ''
    : ''

  return (
    <footer className="checkout-trust">
      <div className="checkout-trust__inner">
        <div className="checkout-trust__item">
          <ShieldIcon />
          <span>
            <strong>Compra segura</strong>
            <small>Seus dados e pagamentos estão protegidos.</small>
          </span>
        </div>
        <div className="checkout-trust__item">
          <TruckIcon />
          <span>
            <strong>Entrega para todo o Brasil</strong>
            <small>Receba no conforto da sua casa.</small>
          </span>
        </div>
        <div className="checkout-trust__item">
          <WhatsAppIcon />
          <span>
            <strong>Dúvidas?</strong>
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                Fale conosco pelo WhatsApp.
              </a>
            ) : (
              <small>Consulte nossos canais de atendimento.</small>
            )}
          </span>
        </div>
      </div>
    </footer>
  )
}

export default async function CheckoutPage() {
  const settings = await fetchStoreSettings()

  return (
    <main className="checkout-page">
      <CheckoutHeader />
      <CheckoutForm />
      <CheckoutFooter whatsapp={settings.whatsapp} />
    </main>
  )
}
