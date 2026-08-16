const ADMIN_ROLES = new Set(['admin', 'owner'])

export function isAdminRole(role) {
  return ADMIN_ROLES.has(role)
}
