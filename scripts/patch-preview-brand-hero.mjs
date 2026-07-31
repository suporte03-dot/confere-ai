import fs from 'fs'

const path = 'src/preview.css'
let css = fs.readFileSync(path, 'utf8')

const desktopReplacement = `.desktop-preview {
  width: 100%;
  --header-logo-size: clamp(44px, 3.8vw, 54px);
  --brand-hero-logo-size: clamp(220px, 18vw, 310px);
}

.desktop-preview .brand-hero {
  min-height: 640px;
  height: min(72vh, 720px);
  grid-template-columns: 52% 48%;
  width: 100%;
  max-width: none;
  overflow: hidden;
  background: #1a1510;
}

.desktop-preview .brand-hero__models-image {
  object-fit: cover;
  object-position: 48% 24%;
  filter: brightness(1.14) contrast(1.03) saturate(0.98);
  transform: scale(1.02);
  -webkit-mask-image: none;
  mask-image: none;
}

.desktop-preview .brand-hero__logo {
  left: 52%;
  top: 50%;
  z-index: 5;
  transform: translate(-42%, -50%);
  width: var(--brand-hero-logo-size);
  height: var(--brand-hero-logo-size);
}

.desktop-preview .brand-hero__content {
  padding-left: clamp(140px, 14vw, 190px);
}

.desktop-preview .brand-hero__copy {
  max-width: 520px;
  align-items: flex-start;
  text-align: left;
}

.desktop-preview .header-brand__logo-img {
  width: 100%;
  height: 100%;
}

.desktop-preview .brand-hero__logo img {
  width: 100%;
  height: 100%;
}


`

const desktopRe = /\.desktop-preview \{\r?\n  width: 100%;\r?\n  --header-logo-size:[\s\S]*?\.desktop-preview \.hero-logo \{\r?\n  width: 100%;\r?\n  height: 100%;\r?\n\}\r?\n\r?\n/

if (!desktopRe.test(css)) {
  console.error('desktop block not found')
  process.exit(1)
}
css = css.replace(desktopRe, desktopReplacement)

const mobileBlock = `/* ── Hero e seções ── */
.mobile-preview .brand-hero {
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
  border: none;
  overflow: hidden;
  min-height: 0;
  height: auto;
  --brand-hero-logo-size: clamp(150px, 48vw, 200px);
}

.mobile-preview .brand-hero__models {
  order: 1;
  width: 100%;
  height: min(48vh, 420px);
  min-height: 300px;
  overflow: hidden;
}

.mobile-preview .brand-hero__models-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 48% 18%;
  filter: brightness(1.14) contrast(1.03) saturate(0.98);
  transform: scale(1.02);
  -webkit-mask-image: none;
  mask-image: none;
}

.mobile-preview .brand-hero__logo {
  order: 2;
  position: relative;
  left: auto;
  top: auto;
  z-index: 5;
  width: var(--brand-hero-logo-size);
  height: var(--brand-hero-logo-size);
  margin: -95px auto 8px;
  transform: none;
}

.mobile-preview .brand-hero__content {
  order: 3;
  width: 100%;
  min-height: 0;
  height: auto;
  padding: 12px 16px 32px;
}

.mobile-preview .brand-hero__copy {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  align-items: center;
  text-align: center;
}

.mobile-preview .brand-hero__title {
  text-align: center;
  font-size: clamp(1.7rem, 7.5vw, 2.1rem);
  line-height: 1.12;
  max-width: 100%;
  margin: 0 auto 14px;
  color: #1a1510;
}

.mobile-preview .brand-hero__support {
  text-align: center;
  font-size: 0.875rem;
  font-family: var(--font-sans);
  color: #5c564c;
  max-width: 100%;
}

.mobile-preview .brand-hero__rule {
  margin-left: auto;
  margin-right: auto;
}

.mobile-preview .brand-hero__actions {
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.mobile-preview .brand-hero__btn {
  width: 100%;
}

`

const mobileRe1 = /\/\* ── Hero e seções ── \*\/\r?\n\.mobile-preview \.hero-section \{[\s\S]*?\.mobile-preview \.hero-btn \{\r?\n  width: 100%;\r?\n\}\r?\n/
if (!mobileRe1.test(css)) {
  console.error('mobile block 1 not found')
  process.exit(1)
}
css = css.replace(mobileRe1, mobileBlock)

const mobileBlock2 = `/* ── Hero e seções (mobile preview) ── */
.mobile-preview .brand-hero {
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
  border: none;
  overflow: hidden;
  min-height: 0;
  height: auto;
  --brand-hero-logo-size: clamp(150px, 48vw, 200px);
}

.mobile-preview .brand-hero__models {
  order: 1;
  width: 100%;
  height: min(48vh, 420px);
  min-height: 300px;
  overflow: hidden;
}

.mobile-preview .brand-hero__models-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 48% 18%;
  filter: brightness(1.14) contrast(1.03) saturate(0.98);
  transform: scale(1.02);
  -webkit-mask-image: none;
  mask-image: none;
}

.mobile-preview .brand-hero__logo {
  order: 2;
  position: relative;
  left: auto;
  top: auto;
  z-index: 5;
  margin: -95px auto 8px;
  transform: none;
}

.mobile-preview .brand-hero__content {
  order: 3;
  width: 100%;
  min-height: 0;
  height: auto;
}

.mobile-preview .brand-hero__copy {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  align-items: center;
  text-align: center;
}

.mobile-preview .brand-hero__title {
  font-size: clamp(1.7rem, 7.5vw, 2.1rem);
  line-height: 1.12;
  max-width: 100%;
  margin: 0 auto 14px;
  text-align: center;
  color: #1a1510;
}

.mobile-preview .brand-hero__support {
  font-size: 0.875rem;
  line-height: 1.65;
  font-family: var(--font-sans);
  color: #5c564c;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.mobile-preview .brand-hero__rule {
  margin-left: auto;
  margin-right: auto;
}

.mobile-preview .brand-hero__actions {
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 16px;
}

.mobile-preview .brand-hero__btn {
  width: 100%;
  max-width: 100%;
}
`

const mobileRe2 = /\/\* ── Hero e seções \(mobile preview\) ── \*\/\r?\n\.mobile-preview \.hero-section \{[\s\S]*?\.mobile-preview \.hero-btn \{\r?\n  width: 100%;\r?\n  max-width: 100%;\r?\n\}/
if (!mobileRe2.test(css)) {
  console.error('mobile block 2 not found')
  process.exit(1)
}
css = css.replace(mobileRe2, mobileBlock2)

// leftover class renames for logos in preview
css = css.replaceAll('.mobile-preview .hero-logo', '.mobile-preview .brand-hero__logo img')

fs.writeFileSync(path, css)
console.log('preview.css updated')
console.log('hero-section leftovers', (css.match(/\.hero-section/g) || []).length)
console.log('brand-hero count', (css.match(/brand-hero/g) || []).length)
