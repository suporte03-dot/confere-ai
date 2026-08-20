import assert from 'node:assert/strict'
import {
  isUsableSupabaseKey,
  isUsableSupabaseUrl,
} from './env.js'

assert.equal(isUsableSupabaseUrl('https://abcd1234.supabase.co'), true)
assert.equal(isUsableSupabaseUrl('"https://abcd1234.supabase.co"'), true)
assert.equal(isUsableSupabaseUrl('https://example.com'), false)
assert.equal(isUsableSupabaseUrl('sua url real'), false)

assert.equal(isUsableSupabaseKey('sb_publishable_...'), false)
assert.equal(isUsableSupabaseKey('sb_publishable_................'), false)
assert.equal(
  isUsableSupabaseKey('sb_publishable_' + 'x'.repeat(40)),
  true,
)
assert.equal(isUsableSupabaseKey('sb_publishable_' + 'x'.repeat(20)), false)
assert.equal(isUsableSupabaseKey('eyJ' + 'a'.repeat(100)), true)
assert.equal(isUsableSupabaseKey('sua chave real aqui'), false)
assert.equal(isUsableSupabaseKey('short'), false)

console.log('supabase env validation ok')
