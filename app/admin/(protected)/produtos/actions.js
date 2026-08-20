'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../../../src/lib/supabase/server'
import { friendlyError, parseMoneyInput } from '../../../../src/lib/admin/format'
import {
  assertAdminAccess,
  isSlugAvailable,
} from '../../../../src/lib/admin/products'
import { slugify } from '../../../../src/lib/admin/slugify'
import {
  IMAGE_BUCKET,
  isSafeProductImagePath,
} from '../../../../src/lib/admin/product-image-upload'
import { isAuditTestRecord } from '../../../../src/lib/admin/test-records'

function fail(message) {
  return { ok: false, error: message }
}

function ok(data = {}) {
  return { ok: true, ...data }
}

function revalidateProducts(productId) {
  revalidatePath('/admin/produtos')
  revalidatePath('/admin/estoque')
  revalidatePath('/admin')
  if (productId) revalidatePath(`/admin/produtos/${productId}`)
}

function sanitizeVariants(variants) {
  if (!Array.isArray(variants)) return []
  const cleaned = []
  for (const v of variants) {
    const size = String(v.size || '').trim()
    const color = String(v.color || '').trim()
    const sku = v.sku ? String(v.sku).trim() : null
    const stockRaw = v.stock
    const stockParsed =
      stockRaw === '' || stockRaw == null
        ? 0
        : Number.parseInt(String(stockRaw), 10)
    if (!Number.isFinite(stockParsed) || stockParsed < 0) {
      throw new Error('Informe um estoque válido (número inteiro ≥ 0) em cada variante.')
    }
    const row = {
      id: v.id || null,
      size,
      color,
      stock: stockParsed,
      sku,
      _key: v._key || null,
    }
    if (row.size || row.color || row.stock > 0 || row.sku) {
      cleaned.push(row)
    }
  }
  return cleaned
}

function buildProductPayload(input) {
  const name = String(input.name || '').trim()
  const slug = slugify(input.slug || name)
  const description = String(input.description || '').trim() || null
  const price = parseMoneyInput(input.price)
  const compareAt =
    input.compareAtPrice === '' || input.compareAtPrice == null
      ? null
      : parseMoneyInput(input.compareAtPrice)
  const categoryId = input.categoryId || null
  const collectionId = input.collectionId || null
  const sku = input.sku ? String(input.sku).trim() : null
  const active = Boolean(input.active)
  const featured = Boolean(input.featured)

  return {
    name,
    slug,
    description,
    price,
    compare_at_price: compareAt,
    category_id: categoryId,
    collection_id: collectionId,
    sku,
    active,
    featured,
  }
}

function validateProductPayload(payload) {
  if (!payload.name) return 'Informe o nome do produto.'
  if (!payload.slug) return 'Informe um slug válido.'
  if (payload.price == null || payload.price < 0) {
    return 'Informe um preço válido.'
  }
  if (payload.compare_at_price != null && payload.compare_at_price < 0) {
    return 'O preço anterior/promocional é inválido.'
  }
  if (
    payload.compare_at_price != null &&
    payload.price != null &&
    payload.compare_at_price < payload.price
  ) {
    return 'O preço anterior deve ser maior ou igual ao preço de venda.'
  }
  return null
}

async function syncVariants(supabase, productId, variants) {
  const cleaned = sanitizeVariants(variants)
  const { data: existing, error: existingError } = await supabase
    .from('product_variants')
    .select('id')
    .eq('product_id', productId)

  if (existingError) throw existingError

  const existingIds = new Set((existing || []).map((row) => row.id))
  const keepIds = new Set(cleaned.filter((v) => v.id).map((v) => v.id))
  const toDelete = [...existingIds].filter((id) => !keepIds.has(id))

  if (toDelete.length) {
    const { error } = await supabase.from('product_variants').delete().in('id', toDelete)
    if (error) throw error
  }

  for (const variant of cleaned) {
    const row = {
      product_id: productId,
      size: variant.size || null,
      color: variant.color || null,
      stock: variant.stock,
      sku: variant.sku,
    }

    if (variant.id && existingIds.has(variant.id)) {
      const { error } = await supabase
        .from('product_variants')
        .update(row)
        .eq('id', variant.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('product_variants').insert(row)
      if (error) throw error
    }
  }
}

export async function toggleProductActive(productId, nextActive) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .update({ active: Boolean(nextActive) })
      .eq('id', productId)
      .select('id')
      .maybeSingle()

    if (error) return fail(friendlyError(error, 'Não foi possível atualizar o status.'))
    if (!data) return fail('Produto não encontrado.')

    revalidateProducts(productId)
    return ok({
      message: nextActive
        ? 'Produto ativado com sucesso.'
        : 'Produto desativado com sucesso.',
    })
  } catch (error) {
    return fail(friendlyError(error))
  }
}

export async function checkProductSlug(slug, excludeId = null) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return fail('Sessão inválida.')

  try {
    const normalized = slugify(slug)
    if (!normalized) return ok({ available: false, slug: '' })
    const available = await isSlugAvailable(normalized, excludeId)
    return ok({ available, slug: normalized })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível validar o slug.'))
  }
}

export async function saveProduct(input) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    const payload = buildProductPayload(input || {})
    const validationError = validateProductPayload(payload)
    if (validationError) return fail(validationError)

    const available = await isSlugAvailable(payload.slug, input.id || null)
    if (!available) {
      return fail('Este slug já está em uso. Escolha outro.')
    }

    const supabase = await createClient()
    let productId = input.id || null

    if (productId) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', productId)
      if (error) return fail(friendlyError(error, 'Não foi possível salvar o produto.'))
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select('id')
        .single()
      if (error) return fail(friendlyError(error, 'Não foi possível criar o produto.'))
      productId = data.id
    }

    await syncVariants(supabase, productId, input.variants || [])

    revalidateProducts(productId)
    return ok({
      id: productId,
      message: 'Produto salvo com sucesso.',
    })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível salvar o produto.'))
  }
}

export async function attachProductImage({
  productId,
  storagePath,
  altText = null,
  isCover = false,
} = {}) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    if (!productId) return fail('Salve o produto antes de enviar imagens.')
    if (!isSafeProductImagePath(productId, storagePath)) {
      return fail('Caminho de imagem inválido.')
    }

    const supabase = await createClient()

    const { data: existing, error: existingError } = await supabase
      .from('product_images')
      .select('id, position, is_cover')
      .eq('product_id', productId)
      .order('position', { ascending: true })

    if (existingError) {
      return fail(friendlyError(existingError, 'Não foi possível ler as imagens.'))
    }

    const nextPosition =
      existing?.length > 0
        ? Math.max(...existing.map((row) => Number(row.position) || 0)) + 1
        : 0
    const shouldBeCover = Boolean(isCover) || !existing?.some((row) => row.is_cover)

    if (shouldBeCover && existing?.length) {
      const { error: clearError } = await supabase
        .from('product_images')
        .update({ is_cover: false })
        .eq('product_id', productId)
      if (clearError) {
        return fail(friendlyError(clearError, 'Não foi possível definir a capa.'))
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        storage_path: storagePath,
        position: nextPosition,
        is_cover: shouldBeCover,
        alt_text: String(altText || '').trim() || null,
      })
      .select('id, storage_path, position, is_cover, alt_text')
      .single()

    if (insertError) {
      return fail(friendlyError(insertError, 'Não foi possível salvar a imagem.'))
    }

    revalidateProducts(productId)
    return ok({
      image: inserted,
      message: 'Imagem enviada.',
    })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível enviar a imagem.'))
  }
}

export async function replaceProductImage({ imageId, storagePath } = {}) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    if (!imageId) return fail('Imagem não encontrada.')

    const supabase = await createClient()
    const { data: current, error: currentError } = await supabase
      .from('product_images')
      .select('id, product_id, storage_path')
      .eq('id', imageId)
      .maybeSingle()

    if (currentError || !current) {
      return fail('Imagem não encontrada.')
    }

    if (!isSafeProductImagePath(current.product_id, storagePath)) {
      return fail('Caminho de imagem inválido.')
    }

    const { data: updated, error: updateError } = await supabase
      .from('product_images')
      .update({ storage_path: storagePath })
      .eq('id', imageId)
      .select('id, storage_path, position, is_cover, alt_text')
      .single()

    if (updateError) {
      return fail(friendlyError(updateError, 'Não foi possível atualizar a imagem.'))
    }

    if (current.storage_path && current.storage_path !== storagePath) {
      await supabase.storage.from(IMAGE_BUCKET).remove([current.storage_path])
    }

    revalidateProducts(current.product_id)
    return ok({ image: updated, message: 'Imagem enviada.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível substituir a imagem.'))
  }
}

export async function setProductCoverImage(productId, imageId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    const supabase = await createClient()

    const { data: target, error: targetError } = await supabase
      .from('product_images')
      .select('id')
      .eq('id', imageId)
      .eq('product_id', productId)
      .maybeSingle()

    if (targetError || !target) {
      return fail('Imagem não encontrada.')
    }

    const { error: clearError } = await supabase
      .from('product_images')
      .update({ is_cover: false })
      .eq('product_id', productId)
    if (clearError) {
      return fail(friendlyError(clearError, 'Não foi possível alterar a capa.'))
    }

    const { data: updated, error } = await supabase
      .from('product_images')
      .update({ is_cover: true })
      .eq('id', imageId)
      .eq('product_id', productId)
      .select('id')
      .maybeSingle()

    if (error) return fail(friendlyError(error, 'Não foi possível definir a capa.'))
    if (!updated) return fail('Imagem não encontrada.')

    revalidateProducts(productId)
    return ok({ message: 'Imagem atualizada.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível definir a capa.'))
  }
}

export async function reorderProductImages(productId, orderedIds) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    if (!Array.isArray(orderedIds) || !orderedIds.length) {
      return fail('Ordem de imagens inválida.')
    }

    const supabase = await createClient()
    const { data: existing, error: existingError } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', productId)

    if (existingError) {
      return fail(friendlyError(existingError, 'Não foi possível reordenar as imagens.'))
    }

    const existingIds = (existing || []).map((row) => row.id)
    const uniqueOrdered = new Set(orderedIds)
    if (
      existingIds.length !== orderedIds.length ||
      uniqueOrdered.size !== orderedIds.length ||
      orderedIds.some((id) => !existingIds.includes(id))
    ) {
      return fail('Ordem de imagens inválida.')
    }

    for (let index = 0; index < orderedIds.length; index += 1) {
      const { error } = await supabase
        .from('product_images')
        .update({ position: index })
        .eq('id', orderedIds[index])
        .eq('product_id', productId)
      if (error) {
        return fail(friendlyError(error, 'Não foi possível reordenar as imagens.'))
      }
    }

    revalidateProducts(productId)
    return ok({ message: 'Imagem atualizada.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível reordenar as imagens.'))
  }
}

export async function deleteProductImage(imageId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    const supabase = await createClient()
    const { data: current, error: currentError } = await supabase
      .from('product_images')
      .select('id, product_id, storage_path, is_cover, position')
      .eq('id', imageId)
      .maybeSingle()

    if (currentError || !current) return fail('Imagem não encontrada.')

    if (current.storage_path) {
      const { error: storageError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .remove([current.storage_path])
      if (
        storageError &&
        !/not found|not exist|No such file/i.test(storageError.message || '')
      ) {
        return fail(friendlyError(storageError, 'Não foi possível excluir a imagem.'))
      }
    }

    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId)

    if (deleteError) {
      return fail(friendlyError(deleteError, 'Não foi possível excluir a imagem.'))
    }

    if (current.is_cover) {
      const { data: remaining } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', current.product_id)
        .order('position', { ascending: true })
        .limit(1)

      if (remaining?.[0]?.id) {
        await supabase
          .from('product_images')
          .update({ is_cover: true })
          .eq('id', remaining[0].id)
      }
    }

    revalidateProducts(current.product_id)
    return ok({ message: 'Imagem atualizada.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível excluir a imagem.'))
  }
}

export async function deleteProduct(productId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return fail(
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    )
  }

  try {
    if (!productId) return fail('Produto não encontrado.')
    const supabase = await createClient()
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, slug')
      .eq('id', productId)
      .maybeSingle()

    if (productError || !product) return fail('Produto não encontrado.')
    if (!isAuditTestRecord(product)) {
      return fail(
        'Exclusão permitida apenas para registros de teste cujo nome começa com [TESTE AUDIT].',
      )
    }

    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('storage_path')
      .eq('product_id', productId)

    if (imagesError) {
      return fail(friendlyError(imagesError, 'Não foi possível excluir o produto.'))
    }

    const paths = (images || []).map((row) => row.storage_path).filter(Boolean)
    if (paths.length) {
      await supabase.storage.from(IMAGE_BUCKET).remove(paths)
    }

    const { error: deleteImagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId)
    if (deleteImagesError) {
      return fail(friendlyError(deleteImagesError, 'Não foi possível excluir o produto.'))
    }

    const { error: deleteVariantsError } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId)
    if (deleteVariantsError) {
      return fail(friendlyError(deleteVariantsError, 'Não foi possível excluir o produto.'))
    }

    const { error: deleteError } = await supabase.from('products').delete().eq('id', productId)
    if (deleteError) {
      return fail(friendlyError(deleteError, 'Não foi possível excluir o produto.'))
    }

    revalidateProducts(productId)
    return ok({ message: 'Produto de teste excluído.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível excluir o produto.'))
  }
}
