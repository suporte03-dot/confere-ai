/* global process */

function env(name, fallback = '') {
  return String(process.env[name] || fallback).trim()
}

export function smtpConfig() {
  const host = env('SMTP_HOST')
  const user = env('SMTP_USER')
  const pass = env('SMTP_PASS')
  const fromEmail = env('SMTP_FROM_EMAIL', user)
  const port = Number.parseInt(env('SMTP_PORT', '587'), 10) || 587
  const secure = env('SMTP_SECURE').toLowerCase() === 'true' || port === 465

  return {
    host,
    port,
    secure,
    user,
    pass,
    fromEmail,
    fromName: env('SMTP_FROM_NAME', 'Terra & Estilo'),
  }
}

export function getSmtpStatus() {
  const config = smtpConfig()
  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL'].filter((key) => {
    if (key === 'SMTP_FROM_EMAIL') return !config.fromEmail
    return !env(key)
  })

  return {
    configured: missing.length === 0,
    host: config.host || '—',
    port: config.port,
    secure: config.secure,
    fromEmail: config.fromEmail || '—',
    fromName: config.fromName,
    missing,
  }
}
