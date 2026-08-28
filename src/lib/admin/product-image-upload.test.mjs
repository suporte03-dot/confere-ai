import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_BUCKET,
  MAX_IMAGE_BYTES,
  buildProductImagePath,
  isSafeProductImagePath,
  validateImageFile,
} from './product-image-upload.js'
import { optimizeProductImage } from './product-image-processing.js'

describe('product-image-upload', () => {
  it('usa o bucket e o limite esperados', () => {
    assert.equal(IMAGE_BUCKET, 'product-images')
    assert.equal(MAX_IMAGE_BYTES, 5 * 1024 * 1024)
    assert.deepEqual([...ALLOWED_IMAGE_TYPES].sort(), [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ])
  })

  it('rejeita MIME inválido, vazio e arquivo acima do limite', () => {
    assert.match(validateImageFile({ type: 'application/pdf', size: 10 }), /apenas arquivos/)
    assert.match(validateImageFile({ type: 'image/png', size: 0 }), /Selecione/)
    assert.match(
      validateImageFile({ type: 'image/png', size: MAX_IMAGE_BYTES + 1 }),
      /no máximo 5 MB/,
    )
  })

  it('aceita os formatos de imagem suportados', () => {
    for (const type of ALLOWED_IMAGE_TYPES) {
      assert.equal(validateImageFile({ type, size: 100 }), null)
    }
  })

  it('gera caminho exclusivo dentro do produto', () => {
    const path = buildProductImagePath('product-123', {
      name: 'Camisa com acentuação.PNG',
      type: 'image/png',
    })
    assert.match(path, /^products\/product-123\/\d+-[a-z0-9-]+-[a-z0-9-]+\.png$/)
    assert.equal(isSafeProductImagePath('product-123', path), true)
  })

  it('bloqueia traversal e caminhos de outros produtos', () => {
    assert.equal(
      isSafeProductImagePath('product-123', 'products/product-123/../other.webp'),
      false,
    )
    assert.equal(
      isSafeProductImagePath('product-123', 'products/product-456/image.webp'),
      false,
    )
    assert.equal(
      isSafeProductImagePath('product-123', '/products/product-123/image.webp'),
      false,
    )
  })

  it('valida o conteúdo real e converte imagem válida para WebP', async () => {
    const validPng = await import('node:fs/promises').then((fs) =>
      fs.readFile('public/favicon.png'),
    )
    const result = await optimizeProductImage({
      type: 'image/png',
      size: validPng.length,
      arrayBuffer: async () =>
        validPng.buffer.slice(
          validPng.byteOffset,
          validPng.byteOffset + validPng.byteLength,
        ),
    })
    assert.equal(result.ok, true)
    assert.ok(result.buffer.length > 0)
    const sharp = (await import('sharp')).default
    const metadata = await sharp(result.buffer).metadata()
    assert.equal(metadata.format, 'webp')
    assert.ok(metadata.width <= 2400)
    assert.ok(metadata.height <= 2400)
  })

  it('rejeita arquivo com MIME declarado válido mas conteúdo inválido', async () => {
    const invalid = Buffer.from('not-an-image')
    const result = await optimizeProductImage({
      type: 'image/png',
      size: invalid.length,
      arrayBuffer: async () =>
        invalid.buffer.slice(
          invalid.byteOffset,
          invalid.byteOffset + invalid.byteLength,
        ),
    })
    assert.equal(result.ok, false)
    assert.match(result.error, /inválido|corrompido/i)
  })

  it('rejeita payload acima do limite antes de decodificar', async () => {
    const result = await optimizeProductImage({
      type: 'image/jpeg',
      size: MAX_IMAGE_BYTES + 1,
      arrayBuffer: async () => Buffer.alloc(1).buffer,
    })
    assert.equal(result.ok, false)
    assert.match(result.error, /no máximo 5 MB/)
  })
})
