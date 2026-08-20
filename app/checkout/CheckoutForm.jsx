'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '../../src/data/mockData'
import { useShop } from '../../src/context/ShopContext'
import { createCheckoutOrder } from './actions'

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

export default function CheckoutForm() {
  const router = useRouter()
  const { cart, cartSubtotal, products, clearCart, showToast } = useShop()
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
    setError('')

    if (!cart.length) {
      setError('Seu carrinho está vazio.')
      return
    }
    if (missingVariant) {
      setError('Alguns itens estão sem tamanho selecionado. Volte ao carrinho e ajuste.')
      return
    }

    startTransition(async () => {
      const result = await createCheckoutOrder({
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
      <div className="checkout-empty">
        <p>Seu carrinho está vazio.</p>
        <Link href="/" className="btn btn--primary">
          Continuar comprando
        </Link>
      </div>
    )
  }

  return (
    <form className="checkout-form" onSubmit={onSubmit} noValidate>
      <div className="checkout-grid">
        <section className="checkout-panel">
          <h2>Seus dados</h2>
          <div className="checkout-fields">
            <label>
              Nome completo
              <input
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                autoComplete="name"
              />
            </label>
            <label>
              E-mail
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                autoComplete="email"
              />
            </label>
            <label>
              Telefone / WhatsApp
              <input
                required
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                autoComplete="tel"
                placeholder="(00) 00000-0000"
              />
            </label>
            <label>
              CPF <span className="checkout-optional">(opcional)</span>
              <input
                value={form.cpf}
                onChange={(e) => setField('cpf', e.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>

          <h2>Endereço de entrega</h2>
          <div className="checkout-fields checkout-fields--address">
            <label>
              CEP
              <input
                required
                value={form.cep}
                onChange={(e) => setField('cep', e.target.value)}
                autoComplete="postal-code"
              />
            </label>
            <label className="checkout-span-2">
              Rua / Avenida
              <input
                required
                value={form.street}
                onChange={(e) => setField('street', e.target.value)}
                autoComplete="street-address"
              />
            </label>
            <label>
              Número
              <input
                required
                value={form.number}
                onChange={(e) => setField('number', e.target.value)}
              />
            </label>
            <label>
              Complemento
              <input
                value={form.complement}
                onChange={(e) => setField('complement', e.target.value)}
              />
            </label>
            <label>
              Bairro
              <input
                required
                value={form.district}
                onChange={(e) => setField('district', e.target.value)}
              />
            </label>
            <label>
              Cidade
              <input
                required
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
                autoComplete="address-level2"
              />
            </label>
            <label>
              Estado
              <select
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
            <label className="checkout-span-2">
              Observação
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
                placeholder="Opcional — ponto de referência, horário, etc."
              />
            </label>
          </div>
        </section>

        <aside className="checkout-summary">
          <h2>Resumo</h2>
          <ul>
            {lines.map((item) => (
              <li key={item.lineId || item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {[item.selectedSize && `Tam. ${item.selectedSize}`, item.selectedColor]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </span>
                  <span>
                    {item.qty} × {formatCurrency(item.price)}
                  </span>
                </div>
                <strong>{formatCurrency(item.price * item.qty)}</strong>
              </li>
            ))}
          </ul>
          <div className="checkout-summary__total">
            <span>Total estimado</span>
            <strong>{formatCurrency(cartSubtotal)}</strong>
          </div>
          <p className="checkout-summary__note">
            O valor final é recalculado no servidor no momento do pedido.
          </p>
          {error ? <p className="checkout-error" role="alert">{error}</p> : null}
          {missingVariant ? (
            <p className="checkout-error" role="alert">
              Há itens sem tamanho. Volte ao carrinho e selecione o tamanho.
            </p>
          ) : null}
          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={pending || missingVariant}
          >
            {pending ? 'Criando pedido…' : 'Finalizar pedido'}
          </button>
          <Link href="/" className="btn btn--ghost btn--block">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </form>
  )
}
