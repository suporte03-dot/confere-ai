export async function uploadProductImageFile(productId, file, { imageId = '', altText = '' } = {}) {
  const form = new FormData()
  form.append('file', file)
  if (imageId) form.append('imageId', imageId)
  if (altText) form.append('altText', altText)

  const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}/images`, {
    method: imageId ? 'PUT' : 'POST',
    body: form,
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.ok) {
    return {
      ok: false,
      error: payload?.error || 'Não foi possível enviar a imagem.',
    }
  }

  return payload
}
