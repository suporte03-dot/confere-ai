import { useState } from 'react'
import { newsletterHome } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'
import santaNova from '../../assets/santa-nova-hero.png'

function Newsletter() {
  const { showToast } = useShop()
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      showToast('Informe um e-mail válido.')
      return
    }
    showToast('Cadastro realizado com sucesso!')
    setEmail('')
  }

  return (
    <section id="newsletter" className="newsletter-home section">
      <div className="newsletter-home__ornament" aria-hidden="true">
        <span className="newsletter-home__ornament-line" />
        <img
          src={santaNova}
          alt=""
          className="newsletter-home__santa"
          decoding="async"
        />
        <span className="newsletter-home__ornament-line" />
      </div>
      <div className="container newsletter-home__inner">
        <div className="newsletter-home__content">
          <h2>{newsletterHome.title}</h2>
          <p>{newsletterHome.subtitle}</p>
          <form className="newsletter-home__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="E-mail para newsletter"
            />
            <button type="submit" className="btn btn--gold">{newsletterHome.button}</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
