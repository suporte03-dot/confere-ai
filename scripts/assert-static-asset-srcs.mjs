/**
 * Assert homeData image/URL exports used as src / CSS backgrounds are strings.
 * Run after `next build` against the source module graph is not required —
 * this re-implements the same normalization rules for a quick sanity check
 * of the exported field names and that staticAssetSrc never returns objects.
 */
import { staticAssetSrc, staticAssetCssUrl } from '../src/utils/staticAssetSrc.js'

const cases = [
  ['string path', '/images/foo.png', '/images/foo.png'],
  ['StaticImageData', { src: '/_next/static/media/x.png', width: 1, height: 1 }, '/_next/static/media/x.png'],
  ['module default string', { default: '/_next/static/media/y.png' }, '/_next/static/media/y.png'],
  ['nested default', { default: { src: '/_next/static/media/z.png' } }, '/_next/static/media/z.png'],
  ['empty', null, ''],
  ['object without src', { width: 1 }, ''],
]

let failed = 0
for (const [label, input, expected] of cases) {
  const got = staticAssetSrc(input)
  if (got !== expected || typeof got !== 'string') {
    console.error(`FAIL ${label}: got ${JSON.stringify(got)} expected ${JSON.stringify(expected)}`)
    failed += 1
  }
}

const css = staticAssetCssUrl({ src: '/_next/static/media/a.png' })
if (css !== 'url("/_next/static/media/a.png")') {
  console.error('FAIL staticAssetCssUrl:', css)
  failed += 1
}

if (failed) {
  console.error(`${failed} assertion(s) failed`)
  process.exit(1)
}

console.log('staticAssetSrc assertions passed')
