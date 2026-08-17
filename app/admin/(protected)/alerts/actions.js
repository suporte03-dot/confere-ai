'use server'

import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { fetchStockAlerts } from '../../../../src/lib/admin/stock-alerts'
import { buildStockAlertState } from '../../../../src/lib/admin/stock'

const EMPTY = buildStockAlertState([])

export async function getStockAlertsAction() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return { ok: false, error: 'Sessão inválida.', ...EMPTY }
  }

  try {
    const state = await fetchStockAlerts()
    return { ok: true, ...state }
  } catch {
    return { ok: false, error: 'Não foi possível carregar os alertas.', ...EMPTY }
  }
}
