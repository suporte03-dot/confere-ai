import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { assertAdminAccess } from '../../../../../../src/lib/admin/products'
import { createClient } from '../../../../../../src/lib/supabase/server'
import { friendlyError } from '../../../../../../src/lib/admin/format'
import {
  IMAGE_BUCKET,
  isSafeProductImagePath,
} from '../../../../../../src/lib/admin/product-image-upload'
import { optimizeProductImage } from '../../../../../../src/lib/admin/product-image-processing'

export const runtime = 'nodejs'
export const maxDuration = 30

const IMAGE_SELECT = 'id, storage_path, position, is_cover, alt_text'

function json(status, body) {
  return Response.json(body, { status })
}

function failForGate(gate) {
  return json(gate.reason === 'unauthenticated' ? 401 : 403, {
    ok: false,
    error:
      gate.reason === 'unauthenticated'
        ? 'Faça login para continuar.'
        : 'Acesso negado. Seu perfil não tem permissão de administrador.',
  })
}

function isValidProductId(value) {
  return /^[0-9a-f-]{36}$/i.test(String(value || ''))
}

function revalidateProduct(productId) {
  revalidatePath('/admin/produtos')
  revalidatePath(`/admin/produtos/${productId}`)
  revalidatePath(`/produto/${productId}`)
  revalidatePath('/')
  revalidatePath('/busca')
  revalidatePath('/feminino')
  revalidatePath('/masculino')
  revalidatePath('/calcados')
  revalidatePath('/acessorios')
  revalidatePath('/colecoes')
}

async function removeIfUnreferenced(supabase, storagePath) {
  if (!storagePath) return null
  const { count, error } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .eq('storage_path', storagePath)
  if (error) throw error
  if ((count || 0) > 0) return null
  const { error: removeError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .remove([storagePath])
  return removeError || null
}

async function getProduct(supabase, productId) {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .maybeSingle()
  if (error) throw error
  return data
}

async function optimizeAndUpload(supabase, productId, file) {
  const optimized = await optimizeProductImage(file)
  if (!optimized.ok) return optimized

  const storagePath = `products/${productId}/${randomUUID()}.webp`
  if (!isSafeProductImagePath(productId, storagePath)) {
    return { ok: false, error: 'Caminho de imagem inválido.' }
  }

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(storagePath, optimized.buffer, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) {
    return { ok: false, error: friendlyError(error, 'Não foi possível armazenar a imagem.') }
  }
  return { ok: true, storagePath, width: optimized.width, height: optimized.height }
}

async function insertProductImage(supabase, productId, storagePath, altText) {
  const { data: existing, error: existingError } = await supabase
    .from('product_images')
    .select('id, position, is_cover')
    .eq('product_id', productId)
    .order('position', { ascending: true })
  if (existingError) throw existingError

  const rows = existing || []
  const position = rows.length
    ? Math.max(...rows.map((row) => Number(row.position) || 0)) + 1
    : 0
  const shouldBeCover = !rows.some((row) => row.is_cover)

  const { data: inserted, error: insertError } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      storage_path: storagePath,
      position,
      is_cover: false,
      alt_text: String(altText || '').trim() || null,
    })
    .select(IMAGE_SELECT)
    .single()
  if (insertError) throw insertError

  if (shouldBeCover) {
    const currentCover = rows.find((row) => row.is_cover)
    const { error: clearError } = await supabase
      .from('product_images')
      .update({ is_cover: false })
      .eq('product_id', productId)
    if (clearError) throw clearError

    const { data: covered, error: coverError } = await supabase
      .from('product_images')
      .update({ is_cover: true })
      .eq('id', inserted.id)
      .select(IMAGE_SELECT)
      .single()
    if (coverError) {
      if (currentCover) {
        await supabase
          .from('product_images')
          .update({ is_cover: true })
          .eq('id', currentCover.id)
      }
      throw coverError
    }
    return covered
  }

  return inserted
}

export async function POST(request, { params }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return failForGate(gate)

  const { id: productId } = await params
  if (!isValidProductId(productId)) {
    return json(400, { ok: false, error: 'Produto não encontrado.' })
  }

  let uploadedPath = ''
  try {
    const form = await request.formData()
    const file = form.get('file')
    const supabase = await createClient()
    if (!(await getProduct(supabase, productId))) {
      return json(404, { ok: false, error: 'Produto não encontrado.' })
    }

    const uploaded = await optimizeAndUpload(supabase, productId, file)
    if (!uploaded.ok) return json(400, uploaded)
    uploadedPath = uploaded.storagePath

    const image = await insertProductImage(
      supabase,
      productId,
      uploaded.storagePath,
      form.get('altText'),
    )
    revalidateProduct(productId)
    return json(200, { ok: true, image, optimized: true })
  } catch (error) {
    if (uploadedPath) {
      try {
        const supabase = await createClient()
        await removeIfUnreferenced(supabase, uploadedPath)
      } catch (cleanupError) {
        console.error('[product-image] failed to clean uploaded object', cleanupError)
      }
    }
    console.error('[product-image] upload failed', error)
    return json(500, { ok: false, error: 'Não foi possível enviar a imagem.' })
  }
}

export async function PUT(request, { params }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return failForGate(gate)

  const { id: productId } = await params
  if (!isValidProductId(productId)) {
    return json(400, { ok: false, error: 'Produto não encontrado.' })
  }

  let uploadedPath = ''
  try {
    const form = await request.formData()
    const imageId = String(form.get('imageId') || '')
    const file = form.get('file')
    const supabase = await createClient()
    const { data: current, error: currentError } = await supabase
      .from('product_images')
      .select(IMAGE_SELECT)
      .eq('id', imageId)
      .eq('product_id', productId)
      .maybeSingle()
    if (currentError) throw currentError
    if (!current) return json(404, { ok: false, error: 'Imagem não encontrada.' })

    const uploaded = await optimizeAndUpload(supabase, productId, file)
    if (!uploaded.ok) return json(400, uploaded)
    uploadedPath = uploaded.storagePath

    const { data: updated, error: updateError } = await supabase
      .from('product_images')
      .update({ storage_path: uploaded.storagePath })
      .eq('id', imageId)
      .eq('product_id', productId)
      .select(IMAGE_SELECT)
      .single()
    if (updateError) throw updateError

    if (current.storage_path && current.storage_path !== uploaded.storagePath) {
      const removeError = await removeIfUnreferenced(supabase, current.storage_path)
      if (removeError) {
        console.error('[product-image] failed to remove replaced object', removeError)
      }
    }
    revalidateProduct(productId)
    return json(200, { ok: true, image: updated, optimized: true })
  } catch (error) {
    if (uploadedPath) {
      try {
        const supabase = await createClient()
        await removeIfUnreferenced(supabase, uploadedPath)
      } catch (cleanupError) {
        console.error('[product-image] failed to clean replacement object', cleanupError)
      }
    }
    console.error('[product-image] replacement failed', error)
    return json(500, { ok: false, error: 'Não foi possível substituir a imagem.' })
  }
}
