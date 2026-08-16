/**
 * Normalize Vite string / Next StaticImageData (and module namespaces)
 * to a usable URL string. Never returns a non-string.
 */
export const staticAssetSrc = (asset) => {
  if (!asset) return ''
  if (typeof asset === 'string') return asset

  if (typeof asset === 'object') {
    if (typeof asset.src === 'string') return asset.src
    if (typeof asset.default === 'string') return asset.default
    if (asset.src && typeof asset.src === 'object') return staticAssetSrc(asset.src)
    if (asset.default && typeof asset.default === 'object') {
      return staticAssetSrc(asset.default)
    }
  }

  return ''
}

/** CSS `url("...")` from a static import / StaticImageData / path string. */
export const staticAssetCssUrl = (asset) => {
  const src = staticAssetSrc(asset)
  return src ? `url("${src}")` : 'none'
}
