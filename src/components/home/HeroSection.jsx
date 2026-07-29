import { useCallback, useEffect, useRef, useState } from 'react'
import { heroContent, footerHome } from '../../data/homeData'
import { assetUrl } from '../../utils/assetUrl'

const AUTOPLAY_MS = 5000

const HERO_SLIDES = [
  {
    id: 'campanha',
    src: '/images/hero/slide-1.jpg',
    alt: heroContent.imageAlt,
    objectPosition: '48% 32%',
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
    id: 'sacola-monograma',
    src: '/images/hero/slide-4.jpg',
    alt: 'Embalagem Terra & Estilo com padrão monograma T&E em ouro sobre preto.',
    objectPosition: '50% 38%',
  },
  {
    id: 'institucional',
    src: '/images/hero/slide-5.jpg',
    alt: 'Arte institucional Terra & Estilo: casal agro chic ao lado do logo circular dourado.',
    objectPosition: '42% 30%',
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
      <div className="hero-section__bg" aria-live="polite">
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.id}
            src={assetUrl(slide.src)}
            alt={i === index ? slide.alt : ''}
            className={`hero-section__image hero-section__image--${slide.id}${i === index ? ' is-active' : ''}`}
            style={{ objectPosition: slide.objectPosition }}
            width={i === 0 ? 1920 : 800}
            height={i === 0 ? 1383 : 1100}
            decoding={i === 0 ? 'sync' : 'async'}
            fetchPriority={i === 0 ? 'high' : 'low'}
            aria-hidden={i !== index}
          />
        ))}
        <div className="hero-section__media-overlay" aria-hidden="true" />
      </div>

      <div className="hero-section__inner">
        <div className="hero-section__panel">
          <div className="hero-section__particles" aria-hidden="true" />

          <div className="hero-section__copy">
            <h1 id="hero-title" className="hero-section__title">
              {heroContent.title}
            </h1>
            <p className="hero-section__support">{heroContent.support}</p>

            <div className="hero-section__actions">
              <a href="#produtos" className="btn btn--primary">
                {heroContent.primaryCta}
              </a>
              <a
                href={whatsappHref}
                className="btn btn--outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {heroContent.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-section__controls">
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

        <div className="hero-section__dots" role="tablist" aria-label="Slides do hero">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              className={`hero-section__dot${i === index ? ' is-active' : ''}`}
              aria-label={`Ir para slide ${i + 1}`}
              aria-selected={i === index}
              onClick={() => goTo(i)}
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
    </section>
  )
}

export default HeroSection
