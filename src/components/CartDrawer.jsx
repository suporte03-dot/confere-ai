import { formatCurrency, getProductImage } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartSubtotal,
    removeFromCart,
    updateQty,
    showToast,
  } = useShop()

  if (!cartOpen) return null

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
                <li key={item.id} className="cart-item">
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
                    <span>{formatCurrency(item.price)}</span>
                    <div className="cart-item__qty">
                      <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Diminuir">−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Aumentar">+</button>
                    </div>
                  </div>
                  <button type="button" className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Remover">
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
              <button type="button" className="btn btn--primary btn--block" onClick={() => showToast('Checkout simulado — em breve!')}>
                Finalizar compra
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => setCartOpen(false)}>
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
