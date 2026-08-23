/**
 * Records created during admin audits. Destructive actions stay limited to these.
 */
export function isAuditTestRecord({ name = '', slug = '' } = {}) {
  const n = String(name || '').trim()
  const s = String(slug || '').trim().toLowerCase()
  return /^\[TESTE(\s+AUDIT)?\]/i.test(n) || s.startsWith('teste-audit-')
}
