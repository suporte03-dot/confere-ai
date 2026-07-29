import { useCallback, useEffect, useRef, useState } from 'react'
import { heroContent, footerHome, BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'
import { assetUrl } from '../../utils/assetUrl'

const AUTOPLAY_MS = 5500
const HERO_ASSET_V = '20260729b'

const HERO_SLIDES = [
  {
    id: 'campanha',
    src: `/images/hero/slide-1.jpg?v=${HERO_ASSET_V}`,
    alt: heroContent.imageAlt,
    objectPosition: '46% 38%',
  },
  {
    id: 'sacola-marmore',
    src: '/images/hero/slide-2.jpg',
    alt: 'Sacola Terra & Estilo em mármore branco com detalhes dourados e monograma T&E.',
    objectPosition: '50% 42%',
  },
  {
    id: 'sacola-lateral',
    src: '/images/hero/slide-3.jpg',
    alt: 'Sacola Terra & Estilo com painel lateral preto, monograma dourado e Nossa Senhora Aparecida.',
    objectPosition: '50% 40%',
  },
  {
    id: 'institucional',
    src: `/images/hero/slide-5.jpg?v=${HERO_ASSET_V}`,
    alt: 'Arte institucional Terra & Estilo: casal agro chic e logo circular dourado.',
    objectPosition: '42% 36%',
  },
]

function HeroSection() {
  const whatsappHref = footerHome.atendimento.whatsappHref
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const sectionRef = useRef(null)

  const goTo = useCallback((next) => {
    setIndex(((next % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduceMotion || paused || HERO_SLIDES.length < 2) return undefined
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, reduceMotion])

  const active = HERO_SLIDES[index]

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="hero-section"
      aria-labelledby="hero-title"
      aria-roledescription="carrossel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!sectionRef.current?.contains(event.relatedTarget)) {
          setPaused(false)
        }
      }}
    >
      <div className="hero-section__atmosphere" aria-hidden="true" />
      <div className="hero-section__particles" aria-hidden="true" />

      <div className="hero-section__inner">
        <div className="hero-section__media">
          <div className="hero-section__thumbs" role="tablist" aria-label="Miniaturas do hero">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                className={`hero-section__thumb${i === index ? ' is-active' : ''}`}
                aria-label={`Ir para slide ${i + 1}`}
                aria-selected={i === index}
                onClick={() => goTo(i)}
              >
                <img
                  src={assetUrl(slide.src)}
                  alt=""
                  width={72}
                  height={96}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>

          <div className="hero-section__stage">
            <button
              type="button"
              className="hero-section__arrow hero-section__arrow--prev"
              onClick={goPrev}
              aria-label="Slide anterior"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                <path
                  d="M14.5 5.5 8 12l6.5 6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="hero-section__frame" aria-live="polite">
              {HERO_SLIDES.map((slide, i) => (
                <img
                  key={slide.id}
                  src={assetUrl(slide.src)}
                  alt={i === index ? slide.alt : ''}
                  className={`hero-section__image hero-section__image--${slide.id}${i === index ? ' is-active' : ''}`}
                  style={{ objectPosition: slide.objectPosition }}
                  width={i === 0 ? 1200 : 800}
                  height={i === 0 ? 1500 : 1100}
                  decoding={i === 0 ? 'sync' : 'async'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  aria-hidden={i !== index}
                />
              ))}
            </div>

            <button
              type="button"
              className="hero-section__arrow hero-section__arrow--next"
              onClick={goNext}
              aria-label="Próximo slide"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                <path
                  d="M9.5 5.5 16 12l-6.5 6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="hero-section__copy">
          <div className="hero-brand-board">
            <div className="hero-brand-board__ring">
              <img
                src={BRAND_LOGO_CIRCULAR_SRC}
                alt={heroContent.boardAlt}
                className="hero-brand-board__logo-img"
                width={512}
                height={512}
                decoding="async"
              />
            </div>
          </div>

          <h1 id="hero-title" className="hero-section__title">
            {heroContent.titleBefore}
            <em className="hero-section__title-script">{heroContent.titleHighlight}</em>
            {heroContent.titleAfter}
          </h1>

          <p className="hero-section__support">{heroContent.support}</p>

          <div className="hero-section__actions">
            <a href="#produtos" className="btn btn--primary hero-section__cta-primary">
              {heroContent.primaryCta}
              <span aria-hidden="true"> →</span>
            </a>
            <a
              href={whatsappHref}
              className="btn btn--outline hero-section__cta-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroContent.secondaryCta}
              <svg
                className="hero-section__wa-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 2.2A9.8 9.8 0 0 0 2.9 16.3L2 22l5.9-.9A9.8 9.8 0 1 0 12 2.2zm5.7 14c-.2.7-1.3 1.2-1.8 1.3-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-3.9-4.7-4.1-.2-.2-1.3-1.7-1.3-3.2s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.5.1.6-.1l.8-1.1c.1-.2.3-.2.5-.1l1.9.9c.2.1.4.2.4.3.1.4-.1 1.2-.3 1.8z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <span className="visually-hidden">{active.alt}</span>
    </section>
  )
}

export default HeroSection
