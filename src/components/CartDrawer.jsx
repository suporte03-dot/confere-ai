'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCurrency, getProductImage } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

function CartDrawer() {
  const router = useRouter()
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartSubtotal,
    removeFromCart,
    updateQty,
    clearCart,
  } = useShop()

  if (!cartOpen) return null

  function goCheckout() {
    setCartOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} aria-hidden="true" />
      <aside className="cart-drawer" aria-label="Carrinho de compras">
        <div className="cart-drawer__head">
          <h2>Seu carrinho</h2>
          <button type="button" className="cart-drawer__close" onClick={() => setCartOpen(false)} aria-label="Fechar">
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="cart-drawer__empty">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {cart.map((item) => (
                <li key={item.lineId || `${item.id}-${item.selectedSize || 'default'}`} className="cart-item">
                  <div className="cart-item__thumb">
                    <VisualMedia
                      src={getProductImage(item)}
                      alt={item.name}
                      label={item.subcategory}
                      variant={item.variant || 'product'}
                      compact
                      className="cart-item__media"
                      imgClassName="cart-item__img"
                    />
                  </div>
                  <div className="cart-item__info">
                    <strong>{item.name}</strong>
                    {(item.selectedSize || item.selectedColor) && (
                      <span className="cart-item__size">
                        {[item.selectedSize && `Tam. ${item.selectedSize}`, item.selectedColor]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    )}
                    <span>{formatCurrency(item.price)}</span>
                    <div className="cart-item__qty">
                      <button type="button" onClick={() => updateQty(item.lineId || item.id, item.qty - 1)} aria-label="Diminuir">−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.lineId || item.id, item.qty + 1)} aria-label="Aumentar">+</button>
                    </div>
                  </div>
                  <button type="button" className="cart-item__remove" onClick={() => removeFromCart(item.lineId || item.id)} aria-label="Remover">
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <strong>{formatCurrency(cartSubtotal)}</strong>
              </div>
              <button type="button" className="btn btn--primary btn--block" onClick={goCheckout}>
                Finalizar compra
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => {
                  clearCart()
                }}
              >
                Limpar carrinho
              </button>
              <Link
                href="/"
                className="btn btn--ghost btn--block"
                onClick={() => setCartOpen(false)}
              >
                Continuar comprando
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
