/**
 * Build a 2-level category tree for admin listing / product selects.
 * Categories without parent are roots; children nest under matching parent_id.
 */

export function buildCategoryTree(categories = []) {
  const list = Array.isArray(categories) ? categories : []
  const byId = new Map(list.map((item) => [item.id, { ...item, children: [] }]))
  const roots = []

  for (const item of byId.values()) {
    const parentId = item.parentId || null
    if (parentId && byId.has(parentId) && parentId !== item.id) {
      byId.get(parentId).children.push(item)
    } else {
      roots.push(item)
    }
  }

  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      const order = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)
      if (order !== 0) return order
      return String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR')
    })
    for (const node of nodes) sortNodes(node.children || [])
  }

  sortNodes(roots)
  return roots
}

/** Flat ordered rows for list UI: root then indented children. */
export function flattenCategoryTree(categories = []) {
  const tree = buildCategoryTree(categories)
  const rows = []

  for (const root of tree) {
    rows.push({ ...root, depth: 0, isChild: false })
    for (const child of root.children || []) {
      rows.push({
        ...child,
        depth: 1,
        isChild: true,
        parentName: root.name,
      })
    }
  }

  return rows
}

/**
 * Options for product category select:
 * - Roots without children are selectable
 * - Children are selectable under an optgroup named after the parent
 * - Roots that have children are NOT selectable as product category
 */
export function buildCategorySelectGroups(categories = []) {
  const tree = buildCategoryTree(categories)
  const groups = []
  const orphans = []

  for (const root of tree) {
    const children = root.children || []
    if (!children.length) {
      orphans.push({
        id: root.id,
        name: root.name,
        slug: root.slug,
        parentId: null,
      })
      continue
    }

    groups.push({
      id: root.id,
      label: root.name,
      options: children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        parentId: root.id,
        label: child.name,
      })),
    })
  }

  if (orphans.length) {
    groups.push({
      id: '__raiz__',
      label: 'Categorias',
      options: orphans.map((item) => ({
        ...item,
        label: item.name,
      })),
    })
  }

  return groups
}

export function collectSelectableCategoryIds(groups = []) {
  const ids = new Set()
  for (const group of groups) {
    for (const option of group.options || []) {
      ids.add(option.id)
    }
  }
  return ids
}
