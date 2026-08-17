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

function fail(message) {
  return { ok: false, error: message }
}

function ok(data = {}) {
  return { ok: true, ...data }
}

function revalidateCategories(categoryId) {
  revalidatePath('/admin/categorias')
  revalidatePath('/admin')
  revalidatePath('/admin/produtos')
  revalidatePath('/admin/produtos/novo')
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

  return { name, slug, description, active, sort_order }
}

function validateCategoryPayload(payload) {
  if (!payload.name) return 'Informe o nome da categoria.'
  if (!payload.slug) return 'Informe um slug válido.'
  return null
}

export async function toggleCategoryActive(categoryId, nextActive) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('categories')
      .update({ active: Boolean(nextActive) })
      .eq('id', categoryId)

    if (error) return fail(friendlyError(error, 'Não foi possível atualizar o status.'))

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
    const payload = buildCategoryPayload(input || {})
    const validationError = validateCategoryPayload(payload)
    if (validationError) return fail(validationError)

    const available = await isCategorySlugAvailable(payload.slug, input.id || null)
    if (!available) {
      return fail('Este slug já está em uso. Escolha outro.')
    }

    const supabase = await createClient()
    let categoryId = input.id || null

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
    const index = categories.findIndex((row) => row.id === categoryId)
    if (index < 0) return fail('Categoria não encontrada.')

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= categories.length) {
      return ok({ message: 'Ordem já está no limite.' })
    }

    const reordered = [...categories]
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
