export const ADMIN_LOGO_SRC = '/images/logo-terra-estilo.png'
export const ADMIN_COVER_SRC = '/images/hero/couple-hero.jpg'

const FEMININE_FIRST_NAMES = new Set([
  'ana',
  'alice',
  'amanda',
  'beatriz',
  'bruna',
  'camila',
  'carla',
  'carol',
  'carolina',
  'claudia',
  'cristina',
  'daniela',
  'fernanda',
  'gabriela',
  'helena',
  'isabela',
  'isabella',
  'jessica',
  'juliana',
  'larissa',
  'laura',
  'leticia',
  'lucia',
  'luciana',
  'maria',
  'mariana',
  'marta',
  'paula',
  'patricia',
  'raquel',
  'renata',
  'sandra',
  'sofia',
  'sophia',
  'vanessa',
])

function normalizePersonToken(value) {
  return String(value || '')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function isFeminineDisplayName(name, extra = {}) {
  const gender = String(extra.gender || extra.sexo || extra.pronoun || '')
    .trim()
    .toLowerCase()
  if (['f', 'female', 'feminino', 'mulher', 'she', 'ela'].includes(gender)) {
    return true
  }
  if (['m', 'male', 'masculino', 'homem', 'he', 'ele'].includes(gender)) {
    return false
  }
  const first = normalizePersonToken(name)
  if (!first) return false
  if (FEMININE_FIRST_NAMES.has(first)) return true
  return first.endsWith('a') && !['luca', 'joshua'].includes(first)
}

export function roleLabel(role, name, extra = {}) {
  const feminine = isFeminineDisplayName(name, extra)
  if (role === 'owner') return feminine ? 'Proprietária' : 'Proprietário'
  if (role === 'admin') return feminine ? 'Administradora' : 'Administrador'
  return 'Acesso restrito'
}

export function initialsFromName(name, email) {
  const source = String(name || email || 'TE').trim()
  const parts = source.includes('@')
    ? [source.split('@')[0]]
    : source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export function displayNameFromUser(user, profile) {
  const metaName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name
  const profileName = profile?.full_name || profile?.name || profile?.display_name
  const fromEmail = user?.email ? String(user.email).split('@')[0] : ''
  return String(profileName || metaName || fromEmail || 'Administrador').trim()
}

export function buildAdminUser(user, profile) {
  const name = displayNameFromUser(user, profile)
  const email = user?.email || ''
  const role = profile?.role || ''
  const extra = {
    gender:
      profile?.gender ||
      user?.user_metadata?.gender ||
      user?.user_metadata?.sexo,
  }
  return {
    name,
    email,
    role,
    roleLabel: roleLabel(role, name, extra),
    initials: initialsFromName(name, email),
  }
}

export function passwordStrength(value) {
  const password = String(value || '')
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  if (score <= 1) return { score, label: 'Fraca' }
  if (score === 2) return { score, label: 'Média' }
  return { score, label: 'Forte' }
}
