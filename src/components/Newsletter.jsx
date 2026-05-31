import { useState } from 'react'
import { newsletterBanner } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

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
        <div className="newsletter__visual">
          <VisualMedia
            src={newsletterBanner.image}
            alt=""
            label="Newsletter TerraEstilo"
            variant={newsletterBanner.variant}
            className="newsletter__media"
            imgClassName="newsletter__img"
          />
        </div>
        <div className="newsletter__content">
          <h2>{newsletterBanner.title}</h2>
          <p>{newsletterBanner.subtitle}</p>
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="E-mail para newsletter"
            />
            <button type="submit" className="btn btn--gold">{newsletterBanner.button}</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
