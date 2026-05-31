import { useState } from 'react'
import { useShop } from '../context/ShopContext'

function Newsletter() {
  const { showToast } = useShop()
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      showToast('Informe um e-mail válido.')
      return
    }
    showToast('Desconto garantido! Verifique sua caixa de entrada.')
    setEmail('')
  }

  return (
    <section id="newsletter" className="newsletter">
      <div className="container newsletter__inner">
        <div className="newsletter__content">
          <h2>Ganhe 10% OFF na primeira compra</h2>
          <p>
            Cadastre seu e-mail e receba novidades, ofertas e lançamentos TerraBrasil.
          </p>
        </div>
        <form className="newsletter__form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="E-mail para newsletter"
          />
          <button type="submit" className="btn btn--gold">Garantir desconto</button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter
