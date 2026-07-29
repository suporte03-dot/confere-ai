import fs from 'fs'

let css = fs.readFileSync('src/home.css', 'utf8')
const nl = css.includes('\r\n') ? '\r\n' : '\n'

function replaceOnce(src, from, to, label) {
  const fromN = from.split('\n').join(nl)
  const toN = to.split('\n').join(nl)
  if (!src.includes(fromN)) {
    console.warn('MISS', label)
    return src
  }
  console.log('OK', label)
  return src.replace(fromN, toN)
}

css = replaceOnce(
  css,
  `  .hero-section__inner {
    grid-template-columns: 1fr;
    gap: 0;
    min-height: 0;
    max-height: none;
    padding: 0;
  }

  .hero-section__media {
    min-height: clamp(420px, 50vh, 520px);
    height: clamp(420px, 50vh, 520px);
    width: 100%;
  }

  .hero-section__image {
    object-position: 50% 22%;
  }

  .hero-section__media-overlay {
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 55%,
      rgba(14, 14, 13, 0.35) 78%,
      rgba(14, 14, 13, 0.78) 100%
    );
  }

  .hero-section__panel {
    align-items: center;
    text-align: center;
    min-height: 0;
    padding: 40px clamp(20px, 4vw, 40px) 48px;
  }`,
  `  .hero-section {
    min-height: min(88vh, 760px);
  }

  .hero-section__inner {
    min-height: min(88vh, 760px);
    max-height: none;
    padding: 0;
  }

  .hero-section__image {
    object-position: 38% 30%;
  }

  .hero-section__media-overlay {
    background: linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.2) 0%,
      transparent 30%,
      transparent 42%,
      rgba(5, 5, 5, 0.55) 70%,
      rgba(5, 5, 5, 0.92) 100%
    );
  }

  .hero-section__panel {
    align-items: center;
    text-align: center;
    min-height: 0;
    padding: 40px clamp(20px, 4vw, 40px) 48px;
  }`,
  '1024 hero'
)

css = replaceOnce(
  css,
  `  .hero-section__media {
    min-height: clamp(400px, 48vh, 480px);
    height: clamp(400px, 48vh, 480px);
  }

  .hero-section__image {
    object-position: 50% 20%;
  }

  .hero-section__panel {
    padding: 32px 18px 36px;
  }`,
  `  .hero-section,
  .hero-section__inner {
    min-height: min(86vh, 700px);
  }

  .hero-section__image {
    object-position: 35% 28%;
  }

  .hero-section__panel {
    padding: 32px 18px 36px;
  }`,
  '768 hero'
)

css = replaceOnce(
  css,
  `  .hero-section__media {
    min-height: clamp(380px, 50vh, 460px);
    height: clamp(380px, 50vh, 460px);
  }

  .hero-section__image {
    object-position: 50% 18%;
  }

  .hero-section__panel {
    padding: 28px 14px 36px;
  }`,
  `  .hero-section,
  .hero-section__inner {
    min-height: min(84vh, 680px);
  }

  .hero-section__image {
    object-position: 32% 26%;
  }

  .hero-section__panel {
    padding: 28px 14px 36px;
  }`,
  '600 hero'
)

fs.writeFileSync('src/home.css', css)
console.log('home.css patched')