import assert from 'node:assert/strict'
import test from 'node:test'
import { getSmtpStatus } from './config.js'

const SMTP_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM_EMAIL',
  'SMTP_FROM_NAME',
]

test('SMTP status never exposes the password and reports configuration', () => {
  const previous = Object.fromEntries(SMTP_KEYS.map((key) => [key, process.env[key]]))
  try {
    for (const key of SMTP_KEYS) delete process.env[key]
    const missing = getSmtpStatus()
    assert.equal(missing.configured, false)
    assert.ok(missing.missing.includes('SMTP_PASS'))
    assert.equal(Object.hasOwn(missing, 'pass'), false)

    Object.assign(process.env, {
      SMTP_HOST: 'smtp.example.test',
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      SMTP_USER: 'store@example.test',
      SMTP_PASS: 'secret-value',
      SMTP_FROM_EMAIL: 'store@example.test',
      SMTP_FROM_NAME: 'Terra & Estilo',
    })
    const configured = getSmtpStatus()
    assert.equal(configured.configured, true)
    assert.equal(configured.fromEmail, 'store@example.test')
    assert.equal(Object.hasOwn(configured, 'pass'), false)
  } finally {
    for (const key of SMTP_KEYS) {
      if (previous[key] === undefined) delete process.env[key]
      else process.env[key] = previous[key]
    }
  }
})
