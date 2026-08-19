import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseAiSuggestionText } from './ai-product-suggest.js'

const categories = [
  { id: 'cat-m', name: 'Masculino', slug: 'masculino' },
  { id: 'cat-f', name: 'Feminino', slug: 'feminino' },
]

test('normaliza JSON da IA e mapeia categoria existente', () => {
  const suggestion = parseAiSuggestionText(
    JSON.stringify({
      name: 'Camisa Country Premium',
      categoryId: 'cat-m',
      primaryColor: 'Preto',
      description: 'Camisa masculina...',
      slug: 'Camisa Country Premium',
      detectedSize: null,
      price: 199,
      stock: 10,
    }),
    categories,
  )
  assert.equal(suggestion.name, 'Camisa Country Premium')
  assert.equal(suggestion.categoryId, 'cat-m')
  assert.equal(suggestion.slug, 'camisa-country-premium')
  assert.equal(suggestion.detectedSize, null)
  assert.equal(suggestion.price, undefined)
})

test('tamanho só entra com etiqueta confiável', () => {
  const weak = parseAiSuggestionText(
    JSON.stringify({ detectedSize: 'M', confidence: { detectedSize: 0.2 } }),
    categories,
  )
  assert.equal(weak.detectedSize, null)

  const strong = parseAiSuggestionText(
    JSON.stringify({ detectedSize: 'M', confidence: { detectedSize: 0.95 } }),
    categories,
  )
  assert.equal(strong.detectedSize, 'M')
})

test('categoria inventada vira null', () => {
  const suggestion = parseAiSuggestionText(
    JSON.stringify({ categoryName: 'Infantil Premium XYZ' }),
    categories,
  )
  assert.equal(suggestion.categoryId, null)
})
