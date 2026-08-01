import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  formatCurrency,
  getProductImage,
  getProductSizes,
} from '../data/mockData'

const TABS = [
  { id: 'sobre', label: 'Sobre o produto' },
  { id: 'provador', label: 'Provador Virtual' },
  { id: 'medidas', label: 'Tabela de Medidas' },
]

const CLOTHING_CHART = [
  { size: 'P', bust: '86–90', waist: '68–72', hip: '92–96' },
  { size: 'M', bust: '91–95', waist: '73–77', hip: '97–101' },
  { size: 'G', bust: '96–100', waist: '78–82', hip: '102–106' },
  { size: 'GG', bust: '101–106', waist: '83–88', hip: '107–112' },
]

const SHOE_CHART = [
  { size: '37', cm: '23,5' },
  { size: '38', cm: '24,0' },
  { size: '39', cm: '24,5' },
  { size: '40', cm: '25,5' },
  { size: '41', cm: '26,0' },
  { size: '42', cm: '26,5' },
]

const KIDS_CHART = [
  { size: '2', height: '86–92', age: '1–2 anos' },
  { size: '4', height: '98–104', age: '3–4 anos' },
  { size: '6', height: '110–116', age: '5–6 anos' },
  { size: '8', height: '122–128', age: '7–8 anos' },
  { size: '10', height: '134–140', age: '9–10 anos' },
]

function getFocusableElements(container) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

function chartKindFor(product) {
  const dept = product?.department || ''
  const category = product?.category || ''
  if (dept === 'Calçados' || category === 'calcados') return 'shoes'
  if (dept === 'Infantil' || category === 'infantil') return 'kids'
  if (dept === 'Acessórios' || category === 'acessorios') return 'accessories'
  return 'clothing'
}

function buildAboutDetails(product, sizes) {
  const colors = (product.colors || []).join(', ')
  const details = [
    { label: 'Categoria', value: [product.department, product.subcategory].filter(Boolean).join(' · ') },
    colors ? { label: 'Cores', value: colors } : null,
    sizes.length ? { label: 'Tamanhos', value: sizes.join(' · ') } : null,
    product.price != null ? { label: 'Preço', value: formatCurrency(product.price) } : null,
  ].filter(Boolean)

  const description =
    product.description ||
    `${product.name} da coleção Terra & Estilo — peça com acabamento premium, inspirada nas raízes e no estilo contemporâneo do Sul.`

  return { details, description }
}

function ProductInfoModal({ product, open, initialTab = 'sobre', onClose }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const previousFocusRef = useRef(null)
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (open) setActiveTab(initialTab)
  }, [open, initialTab])

  useEffect(() => {
    if (!open) return undefined

    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(dialogRef.current)
      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open || !product) return null

  const sizes = getProductSizes(product)
  const image = getProductImage(product)
  const { details, description } = buildAboutDetails(product, sizes)
  const chartKind = chartKindFor(product)

  return createPortal(
    <div className="product-info-modal" role="presentation">
      <button
        type="button"
        className="product-info-modal__backdrop"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="product-info-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="product-info-modal__close"
          aria-label="Fechar"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>

        <header className="product-info-modal__header">
          <div className="product-info-modal__thumb" aria-hidden="true">
            <img src={image} alt="" />
          </div>
          <div className="product-info-modal__intro">
            <p className="product-info-modal__eyebrow">Terra & Estilo</p>
            <h2 id={titleId} className="product-info-modal__title">
              {product.name}
            </h2>
            <span className="product-info-modal__ornament" aria-hidden="true" />
          </div>
        </header>

        <div className="product-info-modal__tabs" role="tablist" aria-label="Informações do produto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`product-info-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`product-info-panel-${tab.id}`}
              className={`product-info-modal__tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-info-modal__body">
          {activeTab === 'sobre' && (
            <div
              id="product-info-panel-sobre"
              role="tabpanel"
              aria-labelledby="product-info-tab-sobre"
              className="product-info-modal__panel"
            >
              <p className="product-info-modal__lead">{description}</p>
              <dl className="product-info-modal__meta">
                {details.map((item) => (
                  <div key={item.label} className="product-info-modal__meta-row">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="product-info-modal__note">
                Cuidados: lavar com água fria, evitar alvejante e secar à sombra para preservar o
                acabamento Terra & Estilo.
              </p>
            </div>
          )}

          {activeTab === 'provador' && (
            <div
              id="product-info-panel-provador"
              role="tabpanel"
              aria-labelledby="product-info-tab-provador"
              className="product-info-modal__panel product-info-modal__panel--provador"
            >
              <p className="product-info-modal__badge">Em breve</p>
              <h3 className="product-info-modal__subtitle">Provador Virtual</h3>
              <p className="product-info-modal__lead">
                Estamos preparando uma experiência elegante para visualizar o caimento das peças
                Terra & Estilo. Em breve, você poderá experimentar virtualmente com mais precisão.
              </p>
              <p className="product-info-modal__note">
                Enquanto isso, consulte a tabela de medidas para escolher o tamanho ideal com
                confiança.
              </p>
              <button
                type="button"
                className="product-info-modal__action"
                onClick={() => setActiveTab('medidas')}
              >
                Ver tabela de medidas
              </button>
            </div>
          )}

          {activeTab === 'medidas' && (
            <div
              id="product-info-panel-medidas"
              role="tabpanel"
              aria-labelledby="product-info-tab-medidas"
              className="product-info-modal__panel"
            >
              <p className="product-info-modal__lead">
                Guia genérico Terra & Estilo (medidas em cm). Use como referência — o caimento pode
                variar conforme o modelo.
              </p>

              {chartKind === 'clothing' && (
                <div className="product-info-modal__table-wrap">
                  <table className="product-info-modal__table">
                    <thead>
                      <tr>
                        <th scope="col">Tam.</th>
                        <th scope="col">Busto</th>
                        <th scope="col">Cintura</th>
                        <th scope="col">Quadril</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CLOTHING_CHART.map((row) => (
                        <tr key={row.size}>
                          <th scope="row">{row.size}</th>
                          <td>{row.bust}</td>
                          <td>{row.waist}</td>
                          <td>{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chartKind === 'shoes' && (
                <div className="product-info-modal__table-wrap">
                  <table className="product-info-modal__table">
                    <thead>
                      <tr>
                        <th scope="col">Tam.</th>
                        <th scope="col">Comprimento do pé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SHOE_CHART.map((row) => (
                        <tr key={row.size}>
                          <th scope="row">{row.size}</th>
                          <td>{row.cm} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chartKind === 'kids' && (
                <div className="product-info-modal__table-wrap">
                  <table className="product-info-modal__table">
                    <thead>
                      <tr>
                        <th scope="col">Tam.</th>
                        <th scope="col">Altura</th>
                        <th scope="col">Idade aprox.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {KIDS_CHART.map((row) => (
                        <tr key={row.size}>
                          <th scope="row">{row.size}</th>
                          <td>{row.height} cm</td>
                          <td>{row.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chartKind === 'accessories' && (
                <div className="product-info-modal__accessories">
                  <p>
                    Acessórios Terra & Estilo costumam ter tamanho único ou grades reduzidas
                    {sizes.length ? ` (${sizes.join(', ')})` : ''}. Em caso de dúvida, escolha o
                    tamanho intermediário ou fale com nosso atendimento.
                  </p>
                </div>
              )}

              {sizes.length > 0 && chartKind !== 'accessories' && (
                <p className="product-info-modal__note">
                  Disponíveis nesta peça: {sizes.join(' · ')}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ProductInfoModal
