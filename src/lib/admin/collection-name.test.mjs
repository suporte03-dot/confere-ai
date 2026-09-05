import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildCollectionNameOptions,
  collectionNamesMatch,
  findCollectionByNormalizedName,
  matchesCollectionQuery,
  normalizeCollectionName,
} from './collection-name.js'

describe('normalizeCollectionName', () => {
  it('ignores case, accents and extra spaces', () => {
    assert.equal(normalizeCollectionName('  Verão  '), 'verao')
    assert.equal(normalizeCollectionName('VERÃO'), 'verao')
    assert.equal(normalizeCollectionName('Seleção Terra & Estilo'), 'selecao terra & estilo')
  })
})

describe('collectionNamesMatch', () => {
  it('treats accent/case variants as the same name', () => {
    assert.equal(collectionNamesMatch('Verão', 'verao'), true)
    assert.equal(collectionNamesMatch('Natal 2026', 'natal  2026'), true)
    assert.equal(collectionNamesMatch('Verão', 'Inverno'), false)
  })
})

describe('findCollectionByNormalizedName', () => {
  const rows = [
    { id: '1', name: 'Novidades' },
    { id: '2', name: 'Verão' },
  ]

  it('finds duplicates ignoring accents', () => {
    assert.equal(findCollectionByNormalizedName(rows, 'VERAO')?.id, '2')
  })

  it('respects excludeId', () => {
    assert.equal(
      findCollectionByNormalizedName(rows, 'Verão', { excludeId: '2' }),
      null,
    )
  })
})

describe('buildCollectionNameOptions', () => {
  const existing = [
    { id: '1', name: 'Novidades' },
    { id: '2', name: 'Terra & Estilo' },
  ]

  it('filters by query and hides suggestions already in DB', () => {
    const result = buildCollectionNameOptions({
      existingCollections: [...existing, { id: '3', name: 'Verão' }],
      query: 'ver',
    })
    assert.deepEqual(
      result.existing.map((item) => item.name),
      ['Verão'],
    )
    assert.ok(result.suggestions.every((item) => item.name !== 'Verão'))
    assert.ok(result.suggestions.some((item) => item.name === 'Alto Verão'))
  })

  it('offers create when name is free', () => {
    const result = buildCollectionNameOptions({
      existingCollections: existing,
      query: 'Natal 2026',
    })
    assert.equal(result.createLabel, 'Natal 2026')
    assert.equal(result.duplicate, null)
  })

  it('does not offer create when name already exists', () => {
    const result = buildCollectionNameOptions({
      existingCollections: existing,
      query: 'novidades',
    })
    assert.equal(result.createLabel, null)
    assert.equal(result.duplicate?.id, '1')
  })

  it('does not offer create for the current collection name while editing', () => {
    const result = buildCollectionNameOptions({
      existingCollections: existing,
      query: 'Novidades',
      excludeId: '1',
    })
    assert.equal(result.createLabel, null)
    assert.equal(result.duplicate, null)
  })

  it('matchesCollectionQuery is case-insensitive', () => {
    assert.equal(matchesCollectionQuery('Alto Verão', 'VER'), true)
    assert.equal(matchesCollectionQuery('Outono', 'ver'), false)
  })
})
