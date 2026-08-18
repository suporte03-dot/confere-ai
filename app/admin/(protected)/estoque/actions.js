'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../../../src/lib/supabase/server'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { friendlyError } from '../../../../src/lib/admin/format'

export async function updateVariantStock(variantId, stockValue) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return {
      ok: false,
      error:
        gate.reason === 'unauthenticated'
          ? 'Faça login para continuar.'
          : 'Acesso negado. Seu perfil não tem permissão de administrador.',
    }
  }

  const id = String(variantId || '').trim()
  const stock = Number(stockValue)
  if (!id) {
    return { ok: false, error: 'Variante inválida.' }
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false, error: 'Informe um estoque válido, sem casas decimais.' }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('product_variants')
      .update({ stock })
      .eq('id', id)
      .select('id, stock')
      .maybeSingle()

    if (error) {
      return { ok: false, error: friendlyError(error) }
    }
    if (!data) {
      return { ok: false, error: 'Variante não encontrada.' }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/estoque')
    revalidatePath('/admin/produtos')
    return { ok: true, stock: data.stock, message: 'Estoque atualizado.' }
  } catch (error) {
    return { ok: false, error: friendlyError(error) }
  }
}
