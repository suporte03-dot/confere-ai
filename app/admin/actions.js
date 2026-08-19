'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../src/lib/supabase/server'
import { isAdminRole } from '../../src/lib/supabase/roles'

function fail(message) {
  return { ok: false, error: message }
}

export async function signInAdmin(email, password) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email || '').trim(),
      password: String(password || ''),
    })

    if (error) {
      return fail('Não foi possível entrar. Verifique e-mail e senha.')
    }

    const user = data?.user
    if (!user) {
      return fail('Sessão inválida após o login.')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile || !isAdminRole(profile.role)) {
      await supabase.auth.signOut()
      return { ok: false, denied: true }
    }

    return { ok: true }
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : ''
    if (message.startsWith('Missing SUPABASE_')) {
      return fail(
        'Configuração de autenticação incompleta. Defina a chave anon/publishable real na Vercel.',
      )
    }
    return fail('Erro inesperado ao autenticar. Tente novamente.')
  }
}

export async function signOutAdmin() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
