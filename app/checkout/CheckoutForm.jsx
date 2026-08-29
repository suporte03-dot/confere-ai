'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '../../src/data/mockData'
import { useShop } from '../../src/context/ShopContext'
import { createCheckoutOrder } from './actions'

const FALLBACK_IMAGE = '/images/categorias/camisas.jpg'

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

function resolveVariantId(item, products) {
  if (item.variantId) return item.variantId
  const product = products.find((p) => p.id === item.id)
  const variants = product?.variants || item.variants || []
  const match = variants.find((v) => {
    const sizeOk = !item.selectedSize || v.size === item.selectedSize
    const colorOk = !item.selectedColor || v.color === item.selectedColor
    return sizeOk && colorOk
  })
  return match?.id || null
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function maskPhone(value) {
  const raw = digits(value).slice(0, 11)
  if (raw.length <= 2) return raw
  if (raw.length <= 6) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`
  if (raw.length <= 10) return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`
  return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`
}

function maskCpf(value) {
  const raw = digits(value).slice(0, 11)
  return raw
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

function maskCep(value) {
  return digits(value).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
}

function validateBeforeSubmit(form, lines) {
  if (!lines.length) return 'Seu carrinho está vazio.'
  if (lines.some((line) => !line.variantId)) {
    return 'Alguns itens estão sem tamanho selecionado. Volte ao carrinho e ajuste.'
  }
  if (form.name.trim().length < 3) return 'Informe o nome completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Informe um e-mail válido.'
  }
  if (digits(form.phone).length < 10) return 'Informe um telefone válido com DDD.'
  if (digits(form.cep).length !== 8) return 'Informe um CEP válido.'
  if (!form.street.trim()) return 'Informe o endereço.'
  if (!form.number.trim()) return 'Informe o número.'
  if (!form.district.trim()) return 'Informe o bairro.'
  if (!form.city.trim()) return 'Informe a cidade.'
  if (!form.state) return 'Informe o estado (UF).'
  return ''
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="1.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5M10 6.2v.1" />
    </svg>
  )
}

function Spinner() {
  return <span className="checkout-spinner" aria-hidden="true" />
}

export default function CheckoutForm() {
  const router = useRouter()
  const { cart, cartCount, cartSubtotal, products, clearCart, showToast } = useShop()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: 'SP',
    cep: '',
    notes: '',
  })

  const lines = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        variantId: resolveVariantId(item, products),
      })),
    [cart, products],
  )

  const missingVariant = lines.some((line) => !line.variantId)

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onSubmit(event) {
    event.preventDefault()
    const validationError = validateBeforeSubmit(form, lines)
    setError(validationError)
    if (validationError) {
      return
    }

    startTransition(async () => {
      let result
      try {
        result = await createCheckoutOrder({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            cpf: form.cpf,
          },
          address: {
            street: form.street,
            number: form.number,
            complement: form.complement,
            district: form.district,
            city: form.city,
            state: form.state,
            cep: form.cep,
          },
          notes: form.notes,
          items: lines.map((line) => ({
            variantId: line.variantId,
            quantity: line.qty,
          })),
        })
      } catch {
        result = { ok: false, error: 'Não foi possível conectar ao servidor. Tente novamente.' }
      }

      if (!result.ok) {
        setError(result.error || 'Não foi possível finalizar o pedido.')
        return
      }

      clearCart()
      showToast(`Pedido ${result.orderNumber} criado.`)
      router.push(`/pedido/${result.publicToken}`)
    })
  }

  if (!cart.length) {
    return (
      <div className="checkout-empty checkout-page__inner">
        <p className="checkout-page__eyebrow">Checkout</p>
        <h1>Finalize seu pedido</h1>
        <div className="checkout-empty__icon" aria-hidden="true">∅</div>
        <p>Seu carrinho está vazio.</p>
        <Link href="/" className="checkout-button checkout-button--gold">
          Continuar comprando
        </Link>
      </div>
    )
  }

  return (
    <form className="checkout-form" onSubmit={onSubmit} noValidate>
      <div className="checkout-page__inner checkout-grid">
        <div className="checkout-main">
          <header className="checkout-page__head">
            <p className="checkout-page__eyebrow">Checkout</p>
            <h1>Finalize seu pedido</h1>
            <p>
              Preencha seus dados para gerar o pedido. O pagamento será feito por Pix
              ou link externo, com confirmação manual da loja.
            </p>
          </header>
          <section className="checkout-panel" aria-labelledby="checkout-data-title">
          <h2 id="checkout-data-title">Seus dados</h2>
          <div className="checkout-fields">
            <label htmlFor="checkout-name">
              Nome completo
              <input
                id="checkout-name"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                autoComplete="name"
                placeholder="Digite seu nome completo"
              />
            </label>
            <label htmlFor="checkout-email">
              E-mail
              <input
                id="checkout-email"
                required
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                autoComplete="email"
                placeholder="seu@email.com"
              />
            </label>
            <div className="checkout-fields__split">
            <label htmlFor="checkout-phone">
              Telefone / WhatsApp
              <input
                id="checkout-phone"
                required
                value={form.phone}
                onChange={(e) => setField('phone', maskPhone(e.target.value))}
                autoComplete="tel"
                placeholder="(00) 00000-0000"
              />
            </label>
            <label htmlFor="checkout-cpf">
              CPF <span className="checkout-optional">(opcional)</span>
              <input
                id="checkout-cpf"
                value={form.cpf}
                onChange={(e) => setField('cpf', maskCpf(e.target.value))}
                inputMode="numeric"
                placeholder="000.000.000-00"
              />
            </label>
            </div>
          </div>

          <div className="checkout-section-divider" />
          <h2 id="checkout-address-title">Endereço de entrega</h2>
          <div className="checkout-fields checkout-fields--address" aria-labelledby="checkout-address-title">
            <div className="checkout-cep-row">
            <label htmlFor="checkout-cep">
              CEP
              <input
                id="checkout-cep"
                required
                value={form.cep}
                onChange={(e) => setField('cep', maskCep(e.target.value))}
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder="Digite seu CEP"
              />
            </label>
            <button type="button" className="checkout-cep-button" disabled title="Consulta de CEP disponível em uma próxima etapa">
              Buscar endereço
            </button>
            </div>
            <div className="checkout-address-row">
            <label htmlFor="checkout-street">
              Endereço
              <input
                id="checkout-street"
                required
                value={form.street}
                onChange={(e) => setField('street', e.target.value)}
                autoComplete="street-address"
                placeholder="Rua, número, complemento"
              />
            </label>
            <label htmlFor="checkout-number">
              Número
              <input
                id="checkout-number"
                required
                value={form.number}
                onChange={(e) => setField('number', e.target.value)}
                inputMode="numeric"
              />
            </label>
            <label htmlFor="checkout-complement">
              Complemento
              <input
                id="checkout-complement"
                value={form.complement}
                onChange={(e) => setField('complement', e.target.value)}
              />
            </label>
            </div>
            <div className="checkout-fields__triple">
            <label htmlFor="checkout-district">
              Bairro
              <input
                id="checkout-district"
                required
                value={form.district}
                onChange={(e) => setField('district', e.target.value)}
                placeholder="Digite seu bairro"
              />
            </label>
            <label htmlFor="checkout-city">
              Cidade
              <input
                id="checkout-city"
                required
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
                autoComplete="address-level2"
                placeholder="Digite sua cidade"
              />
            </label>
            <label htmlFor="checkout-state">
              Estado
              <select
                id="checkout-state"
                required
                value={form.state}
                onChange={(e) => setField('state', e.target.value)}
              >
                {UF_LIST.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </label>
            </div>
            <label className="checkout-span-2" htmlFor="checkout-notes">
              Observação
              <textarea
                id="checkout-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
                placeholder="Opcional — ponto de referência, horário, etc."
              />
            </label>
          </div>
          </section>
        </div>

        <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">Resumo</h2>
          <ul className="checkout-summary__items">
            {lines.map((item) => (
              <li key={item.lineId || item.id}>
                <div className="checkout-summary__product">
                  <div className="checkout-summary__thumb">
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt=""
                      fill
                      sizes="72px"
                    />
                  </div>
                  <div className="checkout-summary__product-copy">
                  <strong>{item.name}</strong>
                  <span>
                    {[item.selectedSize && `Tam. ${item.selectedSize}`, item.selectedColor]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </span>
                  <span>
                    Quantidade: {item.qty}
                  </span>
                  </div>
                </div>
                <strong className="checkout-summary__item-price">
                  {formatCurrency(Number(item.price) * item.qty)}
                </strong>
              </li>
            ))}
          </ul>
          <div className="checkout-summary__breakdown">
            <div>
              <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'itens'})</span>
              <strong>{formatCurrency(cartSubtotal)}</strong>
            </div>
            <div>
              <span>Frete</span>
              <strong className="checkout-summary__shipping">A calcular</strong>
            </div>
          </div>
          <p className="checkout-summary__shipping-note">
            <InfoIcon />
            <span>O frete será calculado após informar o CEP de entrega.</span>
          </p>
          <div className="checkout-summary__total">
            <span>
              <strong>Total do pedido</strong>
              <small>O valor final é recalculado no servidor no momento do pedido.</small>
            </span>
            <strong>{formatCurrency(cartSubtotal)}</strong>
          </div>
          {error ? <p className="checkout-error" role="alert">{error}</p> : null}
          <button
            type="submit"
            className="checkout-button checkout-button--gold checkout-button--submit"
            disabled={pending || missingVariant}
            aria-busy={pending}
          >
            {pending ? <><Spinner /> Finalizando...</> : <><LockIcon /> Finalizar pedido</>}
          </button>
          <Link href="/" className="checkout-button checkout-button--light">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </form>
  )
}
