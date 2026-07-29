import fs from 'fs'

const cssPath = 'src/home.css'
let css = fs.readFileSync(cssPath, 'utf8')

const needle = '.hero-section,\n.hero-section__inner,\n.hero-section__media,'
let start = css.indexOf(needle)
if (start < 0) {
  start = css.indexOf('.hero-section,\r\n.hero-section__inner,\r\n.hero-section__media,')
}
if (start < 0) {
  console.error('start not found')
  process.exit(1)
}

const endMarker = '.hero-section__particles {'
const end = css.indexOf(endMarker, start)
if (end < 0) {
  console.error('end not found')
  process.exit(1)
}

const replacement = [
  '.hero-section,',
  '.hero-section__inner,',
  '.hero-section__bg,',
  '.hero-section__panel,',
  '.hero-section__image {',
  '  box-sizing: border-box;',
  '}',
  '',
  '.hero-section {',
  '  position: relative;',
  '  width: 100%;',
  '  max-width: none;',
  '  margin: 0;',
  '  min-height: min(92vh, 860px);',
  '  height: auto;',
  '  overflow: hidden;',
  '  color: var(--white-soft);',
  '  background: #050505;',
  '}',
  '',
  '.hero-section__bg {',
  '  position: absolute;',
  '  inset: 0;',
  '  z-index: 0;',
  '  overflow: hidden;',
  '  background: #050505;',
  '}',
  '',
  '.hero-section__image {',
  '  position: absolute;',
  '  inset: 0;',
  '  z-index: 1;',
  '  display: block;',
  '  width: 100%;',
  '  height: 100%;',
  '  max-width: none;',
  '  max-height: none;',
  '  margin: 0;',
  '  object-fit: cover;',
  '  object-position: 42% 35%;',
  '  filter: brightness(1.04) contrast(1.04);',
  '}',
  '',
  '.hero-section__media-overlay {',
  '  position: absolute;',
  '  inset: 0;',
  '  z-index: 2;',
  '  background:',
  '    linear-gradient(',
  '      180deg,',
  '      rgba(5, 5, 5, 0.18) 0%,',
  '      transparent 28%,',
  '      transparent 48%,',
  '      rgba(5, 5, 5, 0.45) 68%,',
  '      rgba(5, 5, 5, 0.88) 100%',
  '    ),',
  '    linear-gradient(',
  '      90deg,',
  '      rgba(5, 5, 5, 0.22) 0%,',
  '      transparent 28%,',
  '      transparent 58%,',
  '      rgba(5, 5, 5, 0.35) 100%',
  '    );',
  '  pointer-events: none;',
  '  opacity: 1;',
  '}',
  '',
  '.hero-section__inner {',
  '  position: relative;',
  '  z-index: 3;',
  '  display: flex;',
  '  align-items: flex-end;',
  '  justify-content: center;',
  '  gap: 0;',
  '  min-height: min(92vh, 860px);',
  '  height: auto;',
  '  width: 100%;',
  '  max-width: none;',
  '  margin: 0;',
  '  padding: 0;',
  '}',
  '',
  '.hero-section__panel {',
  '  position: relative;',
  '  z-index: 2;',
  '  display: flex;',
  '  flex-direction: column;',
  '  align-items: center;',
  '  justify-content: flex-end;',
  '  gap: 0;',
  '  min-width: 0;',
  '  min-height: 0;',
  '  width: 100%;',
  '  height: auto;',
  '  padding: 56px clamp(20px, 4vw, 64px) 64px;',
  '  background: transparent;',
  '  overflow: visible;',
  '  animation: hero-fade-in 0.35s ease both;',
  '}',
  '',
  '.hero-section__copy {',
  '  position: relative;',
  '  z-index: 1;',
  '  display: flex;',
  '  flex-direction: column;',
  '  align-items: center;',
  '  justify-content: center;',
  '  text-align: center;',
  '  width: 100%;',
  '  max-width: 720px;',
  '  margin-inline: auto;',
  '}',
  '',
  '',
].join('\n')

css = css.slice(0, start) + replacement + css.slice(end)
fs.writeFileSync(cssPath, css)
console.log('css hero block replaced', start, '->', end)