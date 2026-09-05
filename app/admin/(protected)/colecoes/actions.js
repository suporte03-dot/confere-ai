'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../../../src/lib/supabase/server'
import { friendlyError } from '../../../../src/lib/admin/format'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import {
  fetchCollectionsForAdmin,
  isCollectionSlugAvailable,
} from '../../../../src/lib/admin/taxonomies'
import { findCollectionByNormalizedName } from '../../../../src/lib/admin/collection-name'
import { slugify } from '../../../../src/lib/admin/slugify'
import { isAuditTestRecord } from '../../../../src/lib/admin/test-records'

function fail(message) {
  return { ok: false, error: message }
}

function ok(data = {}) {
  return { ok: true, ...data }
}

function revalidateCollections(collectionId) {
  // layout: invalida listagens e formulários de produto aninhados
  revalidatePath('/admin/colecoes', 'layout')
  revalidatePath('/admin/produtos', 'layout')
  revalidatePath('/admin')
  revalidatePath('/admin/produtos/novo')
  if (collectionId) revalidatePath(`/admin/colecoes/${collectionId}`)
}

function gateFail(gate) {
  return fail(
    gate.reason === 'unauthenticated'
      ? 'Faça login para continuar.'
      : 'Acesso negado. Seu perfil não tem permissão de administrador.',
  )
}

function buildCollectionPayload(input) {
  const name = String(input.name || '').trim()
  const slug = slugify(input.slug || name)
  const description = String(input.description || '').trim() || null
  const active = Boolean(input.active)
  const featured = Boolean(input.featured)
  const sortOrderRaw = Number.parseInt(input.sortOrder, 10)
  const sort_order = Number.isFinite(sortOrderRaw) ? sortOrderRaw : 0

  return { name, slug, description, active, featured, sort_order }
}

function validateCollectionPayload(payload) {
  if (!payload.name) return 'Informe o nome da coleção.'
  if (!payload.slug) return 'Informe um slug válido.'
  return null
}

export async function toggleCollectionActive(collectionId, nextActive) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('collections')
      .update({ active: Boolean(nextActive) })
      .eq('id', collectionId)
      .select('id')
      .maybeSingle()

    if (error) return fail(friendlyError(error, 'Não foi possível atualizar o status.'))
    if (!data) return fail('Coleção não encontrada.')

    revalidateCollections(collectionId)
    return ok({
      message: nextActive
        ? 'Coleção ativada com sucesso.'
        : 'Coleção desativada com sucesso.',
    })
  } catch (error) {
    return fail(friendlyError(error))
  }
}

export async function toggleCollectionFeatured(collectionId, nextFeatured) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('collections')
      .update({ featured: Boolean(nextFeatured) })
      .eq('id', collectionId)
      .select('id')
      .maybeSingle()

    if (error) {
      return fail(friendlyError(error, 'Não foi possível atualizar o destaque.'))
    }
    if (!data) return fail('Coleção não encontrada.')

    revalidateCollections(collectionId)
    return ok({
      message: nextFeatured
        ? 'Coleção marcada como destaque.'
        : 'Destaque removido da coleção.',
    })
  } catch (error) {
    return fail(friendlyError(error))
  }
}

export async function checkCollectionSlug(slug, excludeId = null) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return fail('Sessão inválida.')

  try {
    const normalized = slugify(slug)
    if (!normalized) return ok({ available: false, slug: '' })
    const available = await isCollectionSlugAvailable(normalized, excludeId)
    return ok({ available, slug: normalized })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível validar o slug.'))
  }
}

export async function saveCollection(input) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const payload = buildCollectionPayload(input || {})
    const validationError = validateCollectionPayload(payload)
    if (validationError) return fail(validationError)

    const collections = await fetchCollectionsForAdmin()
    const nameConflict = findCollectionByNormalizedName(collections, payload.name, {
      excludeId: input.id || null,
    })
    if (nameConflict) {
      return fail('Esta coleção já existe.')
    }

    const available = await isCollectionSlugAvailable(payload.slug, input.id || null)
    if (!available) {
      return fail('Este slug já está em uso. Escolha outro.')
    }

    const supabase = await createClient()
    let collectionId = input.id || null

    if (collectionId) {
      const { error } = await supabase
        .from('collections')
        .update(payload)
        .eq('id', collectionId)
      if (error) {
        return fail(friendlyError(error, 'Não foi possível salvar a coleção.'))
      }
    } else {
      const { data, error } = await supabase
        .from('collections')
        .insert(payload)
        .select('id')
        .single()
      if (error) {
        return fail(friendlyError(error, 'Não foi possível criar a coleção.'))
      }
      collectionId = data.id
    }

    revalidateCollections(collectionId)
    return ok({
      id: collectionId,
      message: 'Coleção salva com sucesso.',
    })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível salvar a coleção.'))
  }
}

export async function moveCollection(collectionId, direction) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    if (direction !== 'up' && direction !== 'down') {
      return fail('Direção de ordenação inválida.')
    }

    const collections = await fetchCollectionsForAdmin()
    const index = collections.findIndex((row) => row.id === collectionId)
    if (index < 0) return fail('Coleção não encontrada.')

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= collections.length) {
      return ok({ message: 'Ordem já está no limite.' })
    }

    const reordered = [...collections]
    const [item] = reordered.splice(index, 1)
    reordered.splice(swapIndex, 0, item)

    const supabase = await createClient()
    for (let i = 0; i < reordered.length; i += 1) {
      const row = reordered[i]
      if (row.sortOrder === i) continue
      const { error } = await supabase
        .from('collections')
        .update({ sort_order: i })
        .eq('id', row.id)
      if (error) {
        return fail(friendlyError(error, 'Não foi possível alterar a ordem.'))
      }
    }

    revalidateCollections(collectionId)
    return ok({ message: 'Ordem atualizada.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível alterar a ordem.'))
  }
}

export async function deleteCollection(collectionId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const supabase = await createClient()
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id, name, slug')
      .eq('id', collectionId)
      .maybeSingle()

    if (collectionError || !collection) return fail('Coleção não encontrada.')
    if (!isAuditTestRecord(collection)) {
      return fail(
        'Exclusão permitida apenas para registros de teste cujo nome começa com [TESTE AUDIT].',
      )
    }

    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('collection_id', collectionId)

    if (countError) {
      return fail(friendlyError(countError, 'Não foi possível excluir a coleção.'))
    }
    if (count > 0) {
      return fail('Não é possível excluir: ainda há produtos vinculados a esta coleção.')
    }

    const { error } = await supabase.from('collections').delete().eq('id', collectionId)
    if (error) return fail(friendlyError(error, 'Não foi possível excluir a coleção.'))

    revalidateCollections(collectionId)
    return ok({ message: 'Coleção de teste excluída.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível excluir a coleção.'))
  }
}
