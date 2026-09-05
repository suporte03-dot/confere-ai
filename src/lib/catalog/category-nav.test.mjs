import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildPublicCategoryNav,
  getProductsForCategoryScope,
  publicCategoryHref,
} from './category-nav.js'

test('nav pública monta principais e filhos ativos', () => {
  const nav = buildPublicCategoryNav([
    { id: 'f', name: 'Feminino', slug: 'feminino', parentId: null, active: true, sortOrder: 0 },
    { id: 'cam', name: 'Camisetas', slug: 'feminino-camisetas', parentId: 'f', active: true, sortOrder: 0 },
    { id: 'off', name: 'Inativa', slug: 'x', parentId: 'f', active: false, sortOrder: 1 },
  ])
  assert.equal(nav.length, 1)
  assert.equal(nav[0].children.length, 1)
  assert.equal(nav[0].children[0].name, 'Camisetas')
  assert.equal(nav[0].children[0].href, '/feminino?sub=feminino-camisetas')
})

test('href usa rota conhecida ou /categoria', () => {
  assert.equal(publicCategoryHref('feminino'), '/feminino')
  assert.equal(publicCategoryHref('outlet'), '/categoria/outlet')
})

test('escopo de produtos inclui filhos e filtra sub', () => {
  const categories = [
    { id: 'f', name: 'Feminino', slug: 'feminino', parentId: null, active: true, sortOrder: 0 },
    { id: 'cam', name: 'Camisetas', slug: 'camisetas', parentId: 'f', active: true, sortOrder: 0 },
    { id: 'cal', name: 'Calças', slug: 'calcas', parentId: 'f', active: true, sortOrder: 1 },
  ]
  const catalog = [
    { id: 1, categoryId: 'cam', categorySlug: 'camisetas' },
    { id: 2, categoryId: 'cal', categorySlug: 'calcas' },
    { id: 3, categoryId: 'f', category: 'feminino' },
  ]
  const all = getProductsForCategoryScope('feminino', catalog, categories, '')
  assert.equal(all.length, 3)
  const onlyCam = getProductsForCategoryScope('feminino', catalog, categories, 'camisetas')
  assert.deepEqual(onlyCam.map((p) => p.id), [1])
})
