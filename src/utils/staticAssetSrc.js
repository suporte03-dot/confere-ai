/** Normalize Vite string / Next StaticImageData to a usable URL string. */
export const staticAssetSrc = (asset) => {
  if (!asset) return ''
  return typeof asset === 'string' ? asset : asset.src
}
