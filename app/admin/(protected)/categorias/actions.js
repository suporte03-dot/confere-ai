'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../../../src/lib/supabase/server'
import { friendlyError } from '../../../../src/lib/admin/format'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import {
  fetchCategoriesForAdmin,
  isCategorySlugAvailable,
} from '../../../../src/lib/admin/taxonomies'
import { slugify } from '../../../../src/lib/admin/slugify'
import { isAuditTestRecord } from '../../../../src/lib/admin/test-records'

function fail(message) {
  return { ok: false, error: message }
}

function ok(data = {}) {
  return { ok: true, ...data }
}

function revalidateCategories(categoryId) {
  revalidatePath('/admin/categorias', 'layout')
  revalidatePath('/admin/produtos', 'layout')
  revalidatePath('/admin')
  revalidatePath('/admin/produtos/novo')
  // Storefront menu + category pages (layout force-dynamic, but keep explicit)
  revalidatePath('/', 'layout')
  revalidatePath('/feminino')
  revalidatePath('/masculino')
  revalidatePath('/acessorios')
  revalidatePath('/calcados')
  revalidatePath('/categoria', 'layout')
  if (categoryId) revalidatePath(`/admin/categorias/${categoryId}`)
}

function gateFail(gate) {
  return fail(
    gate.reason === 'unauthenticated'
      ? 'Faça login para continuar.'
      : 'Acesso negado. Seu perfil não tem permissão de administrador.',
  )
}

function buildCategoryPayload(input) {
  const name = String(input.name || '').trim()
  const slug = slugify(input.slug || name)
  const description = String(input.description || '').trim() || null
  const active = Boolean(input.active)
  const sortOrderRaw = Number.parseInt(input.sortOrder, 10)
  const sort_order = Number.isFinite(sortOrderRaw) ? sortOrderRaw : 0
  const parentRaw = input.parentId
  const parent_id =
    parentRaw && String(parentRaw).trim() ? String(parentRaw).trim() : null

  return { name, slug, description, active, sort_order, parent_id }
}

function validateCategoryPayload(payload, categoryId = null) {
  if (!payload.name) return 'Informe o nome da categoria.'
  if (!payload.slug) return 'Informe um slug válido.'
  if (payload.parent_id && categoryId && payload.parent_id === categoryId) {
    return 'Uma categoria não pode ser pai de si mesma.'
  }
  return null
}

export async function toggleCategoryActive(categoryId, nextActive) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .update({ active: Boolean(nextActive) })
      .eq('id', categoryId)
      .select('id')
      .maybeSingle()

    if (error) return fail(friendlyError(error, 'Não foi possível atualizar o status.'))
    if (!data) return fail('Categoria não encontrada.')

    revalidateCategories(categoryId)
    return ok({
      message: nextActive
        ? 'Categoria ativada com sucesso.'
        : 'Categoria desativada com sucesso.',
    })
  } catch (error) {
    return fail(friendlyError(error))
  }
}

export async function checkCategorySlug(slug, excludeId = null) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return fail('Sessão inválida.')

  try {
    const normalized = slugify(slug)
    if (!normalized) return ok({ available: false, slug: '' })
    const available = await isCategorySlugAvailable(normalized, excludeId)
    return ok({ available, slug: normalized })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível validar o slug.'))
  }
}

export async function saveCategory(input) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    let categoryId = input.id || null
    const payload = buildCategoryPayload(input || {})
    const validationError = validateCategoryPayload(payload, categoryId)
    if (validationError) return fail(validationError)

    const available = await isCategorySlugAvailable(payload.slug, categoryId)
    if (!available) {
      return fail('Este slug já está em uso. Escolha outro.')
    }

    const supabase = await createClient()

    if (payload.parent_id) {
      const { data: parent, error: parentError } = await supabase
        .from('categories')
        .select('id, parent_id')
        .eq('id', payload.parent_id)
        .maybeSingle()

      if (parentError) {
        return fail(friendlyError(parentError, 'Não foi possível validar a categoria pai.'))
      }
      if (!parent) return fail('Categoria pai não encontrada.')
      if (parent.parent_id) {
        return fail('Use apenas dois níveis: categoria principal → subcategoria.')
      }
    }

    if (categoryId && payload.parent_id) {
      const { count, error: childError } = await supabase
        .from('categories')
        .select('id', { count: 'exact', head: true })
        .eq('parent_id', categoryId)

      if (childError) {
        return fail(friendlyError(childError, 'Não foi possível validar subcategorias.'))
      }
      if (count > 0) {
        return fail(
          'Esta categoria já possui subcategorias e não pode se tornar uma subcategoria.',
        )
      }
    }

    if (categoryId) {
      const { error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', categoryId)
      if (error) {
        return fail(friendlyError(error, 'Não foi possível salvar a categoria.'))
      }
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select('id')
        .single()
      if (error) {
        return fail(friendlyError(error, 'Não foi possível criar a categoria.'))
      }
      categoryId = data.id
    }

    revalidateCategories(categoryId)
    return ok({
      id: categoryId,
      message: 'Categoria salva com sucesso.',
    })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível salvar a categoria.'))
  }
}

export async function moveCategory(categoryId, direction) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    if (direction !== 'up' && direction !== 'down') {
      return fail('Direção de ordenação inválida.')
    }

    const categories = await fetchCategoriesForAdmin()
    const current = categories.find((row) => row.id === categoryId)
    if (!current) return fail('Categoria não encontrada.')

    const siblings = categories.filter(
      (row) => (row.parentId || null) === (current.parentId || null),
    )
    const index = siblings.findIndex((row) => row.id === categoryId)
    if (index < 0) return fail('Categoria não encontrada.')

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= siblings.length) {
      return ok({ message: 'Ordem já está no limite.' })
    }

    const reordered = [...siblings]
    const [item] = reordered.splice(index, 1)
    reordered.splice(swapIndex, 0, item)

    const supabase = await createClient()
    for (let i = 0; i < reordered.length; i += 1) {
      const row = reordered[i]
      if (row.sortOrder === i) continue
      const { error } = await supabase
        .from('categories')
        .update({ sort_order: i })
        .eq('id', row.id)
      if (error) {
        return fail(friendlyError(error, 'Não foi possível alterar a ordem.'))
      }
    }

    revalidateCategories(categoryId)
    return ok({ message: 'Ordem atualizada.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível alterar a ordem.'))
  }
}

export async function deleteCategory(categoryId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const supabase = await createClient()
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('id', categoryId)
      .maybeSingle()

    if (categoryError || !category) return fail('Categoria não encontrada.')
    if (!isAuditTestRecord(category)) {
      return fail(
        'Exclusão permitida apenas para registros de teste cujo nome começa com [TESTE AUDIT].',
      )
    }

    const { count: childCount, error: childCountError } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', categoryId)

    if (childCountError) {
      return fail(friendlyError(childCountError, 'Não foi possível excluir a categoria.'))
    }
    if (childCount > 0) {
      return fail('Não é possível excluir: ainda há subcategorias vinculadas.')
    }

    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId)

    if (countError) {
      return fail(friendlyError(countError, 'Não foi possível excluir a categoria.'))
    }
    if (count > 0) {
      return fail('Não é possível excluir: ainda há produtos vinculados a esta categoria.')
    }

    const { error } = await supabase.from('categories').delete().eq('id', categoryId)
    if (error) return fail(friendlyError(error, 'Não foi possível excluir a categoria.'))

    revalidateCategories(categoryId)
    return ok({ message: 'Categoria de teste excluída.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível excluir a categoria.'))
  }
}
