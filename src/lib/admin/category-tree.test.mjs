import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildCategorySelectGroups,
  buildCategoryTree,
  flattenCategoryTree,
} from './category-tree.js'

test('monta árvore de 2 níveis e ordena por sortOrder/nome', () => {
  const tree = buildCategoryTree([
    { id: 'm', name: 'Masculino', parentId: null, sortOrder: 1 },
    { id: 'f', name: 'Feminino', parentId: null, sortOrder: 0 },
    { id: 'cam', name: 'Camisetas', parentId: 'm', sortOrder: 1 },
    { id: 'cal', name: 'Calças', parentId: 'm', sortOrder: 0 },
  ])

  assert.equal(tree[0].name, 'Feminino')
  assert.equal(tree[1].name, 'Masculino')
  assert.deepEqual(
    tree[1].children.map((c) => c.name),
    ['Calças', 'Camisetas'],
  )
})

test('flatten preserva hierarquia visual', () => {
  const flat = flattenCategoryTree([
    { id: 'm', name: 'Masculino', parentId: null, sortOrder: 0 },
    { id: 'cam', name: 'Camisetas', parentId: 'm', sortOrder: 0 },
  ])
  assert.equal(flat[0].isChild, false)
  assert.equal(flat[1].isChild, true)
  assert.equal(flat[1].parentName, 'Masculino')
})

test('select de produto agrupa subcategorias e expõe raiz sem filhos', () => {
  const groups = buildCategorySelectGroups([
    { id: 'm', name: 'Masculino', parentId: null, sortOrder: 0 },
    { id: 'cam', name: 'Camisetas', parentId: 'm', sortOrder: 0 },
    { id: 'out', name: 'Outlet', parentId: null, sortOrder: 1 },
  ])

  assert.equal(groups[0].label, 'Masculino')
  assert.equal(groups[0].options[0].name, 'Camisetas')
  assert.equal(groups[1].label, 'Categorias')
  assert.equal(groups[1].options[0].name, 'Outlet')
})
