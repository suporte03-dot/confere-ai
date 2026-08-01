import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionDivider from '../components/home/SectionDivider'
import { footerHome } from '../data/homeData'
import { useShop } from '../context/ShopContext'
import { assetUrl } from '../utils/assetUrl'

const FAQ = [
  {
    q: 'Qual o prazo de entrega?',
    a: 'Enviamos para todo o Brasil. O prazo varia conforme a região — em média de 3 a 10 dias úteis após a confirmação do pagamento.',
  },
  {
    q: 'Como funciona a troca?',
    a: 'Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução de peças sem uso, com etiquetas e embalagem originais.',
  },
  {
    q: 'Posso parcelar?',
    a: 'Sim. Aceitamos cartões com parcelamento em até 12x sem juros, além de Pix e boleto.',
  },
]

const SUBJECTS = [
  'Dúvida sobre pedido',
  'Troca ou devolução',
  'Produto',
  'Parcerias',
  'Outro',
]

function ContactPage() {
  const { showToast } = useShop()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    assunto: SUBJECTS[0],
    mensagem: '',
  })

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      showToast('Preencha nome, e-mail e mensagem.')
      return
    }
    showToast('Mensagem enviada! Retornaremos em breve.')
    setForm({
      nome: '',
      email: '',
      whatsapp: '',
      assunto: SUBJECTS[0],
      mensagem: '',
    })
  }

  return (
    <main className="contact-page">
      <section className="catalog-banner catalog-banner--contact" aria-labelledby="contact-title">
        <img
          src={assetUrl('/images/categorias/bones.jpg')}
          alt=""
          className="catalog-banner__img"
          style={{ objectPosition: 'center 35%' }}
          decoding="async"
        />
        <div className="catalog-banner__shade" aria-hidden="true" />
        <div className="container catalog-banner__content">
          <p className="catalog-banner__eyebrow">Atendimento</p>
          <h1 id="contact-title" className="catalog-banner__title">
            Fale com a Terra &amp; Estilo
          </h1>
          <p className="catalog-banner__desc">
            Estamos próximos antes e depois da compra — tire dúvidas, acompanhe pedidos ou conheça nossas lojas.
          </p>
        </div>
      </section>

      <SectionDivider variant="light" showSaint />

      <div className="container contact-page__body">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contato</span>
        </nav>

        <div className="contact-layout">
          <aside className="contact-info">
            <h2>Atendimento</h2>
            <p>
              Nossa equipe responde com atenção humana e o mesmo cuidado que colocamos em cada peça.
            </p>
            <ul className="contact-info__list">
              <li>
                <span>WhatsApp</span>
                <a
                  href={footerHome.atendimento.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {footerHome.atendimento.whatsapp}
                </a>
              </li>
              <li>
                <span>E-mail</span>
                <a href={`mailto:${footerHome.atendimento.email}`}>
                  {footerHome.atendimento.email}
                </a>
              </li>
              <li>
                <span>Instagram</span>
                <a
                  href={footerHome.atendimento.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {footerHome.atendimento.instagram}
                </a>
              </li>
              <li>
                <span>Horário</span>
                <em>{footerHome.atendimento.hours}</em>
              </li>
              <li>
                <span>Endereço</span>
                <em>Serra Gaúcha — RS · Atendimento online para todo o Brasil</em>
              </li>
            </ul>

            <a
              className="btn btn--gold contact-info__wa"
              href={footerHome.atendimento.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conversar no WhatsApp
            </a>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h2>Envie uma mensagem</h2>
            <div className="contact-form__grid">
              <label>
                Nome
                <input
                  type="text"
                  name="nome"
                  autoComplete="name"
                  value={form.nome}
                  onChange={update('nome')}
                  required
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </label>
              <label>
                WhatsApp
                <input
                  type="tel"
                  name="whatsapp"
                  autoComplete="tel"
                  value={form.whatsapp}
                  onChange={update('whatsapp')}
                  placeholder="(00) 00000-0000"
                />
              </label>
              <label>
                Assunto
                <select name="assunto" value={form.assunto} onChange={update('assunto')}>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>
              <label className="contact-form__full">
                Mensagem
                <textarea
                  name="mensagem"
                  rows={5}
                  value={form.mensagem}
                  onChange={update('mensagem')}
                  required
                />
              </label>
            </div>
            <button type="submit" className="btn btn--gold">
              Enviar mensagem
            </button>
          </form>
        </div>

        <section className="contact-faq" aria-labelledby="contact-faq-title">
          <h2 id="contact-faq-title">Perguntas frequentes</h2>
          <div className="contact-faq__list">
            {FAQ.map((item) => (
              <details key={item.q} className="contact-faq__item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <SectionDivider variant="light" showSaint />
    </main>
  )
}

export default ContactPage
