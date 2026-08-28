import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import { MAX_IMAGE_BYTES } from './product-image-upload.js'

export const MAX_INPUT_PIXELS = 25_000_000
export const MAX_OUTPUT_BYTES = 5 * 1024 * 1024

const ALLOWED_DECLARED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const ALLOWED_DETECTED_FORMATS = new Set(['jpeg', 'png', 'webp'])

/**
 * Validate the actual image header and normalize product media to WebP.
 * The original upload is limited before decoding to avoid oversized payloads.
 */
export async function optimizeProductImage(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || !file.size) {
    return { ok: false, error: 'Selecione uma imagem para enviar.' }
  }
  if (!ALLOWED_DECLARED_TYPES.has(file.type)) {
    return { ok: false, error: 'Envie apenas arquivos de imagem (JPG, PNG ou WEBP).' }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'A imagem deve ter no máximo 5 MB.' }
  }

  const input = Buffer.from(await file.arrayBuffer())
  try {
    const source = sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
    const metadata = await source.metadata()
    if (!ALLOWED_DETECTED_FORMATS.has(metadata.format)) {
      return { ok: false, error: 'O conteúdo do arquivo não é uma imagem suportada.' }
    }
    if (!metadata.width || !metadata.height) {
      return { ok: false, error: 'Não foi possível validar as dimensões da imagem.' }
    }

    const output = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 84, effort: 4 })
      .toBuffer()

    if (!output.length || output.length > MAX_OUTPUT_BYTES) {
      return { ok: false, error: 'Não foi possível otimizar esta imagem com segurança.' }
    }
    return { ok: true, buffer: output, width: metadata.width, height: metadata.height }
  } catch {
    return { ok: false, error: 'O arquivo de imagem é inválido ou está corrompido.' }
  }
}
