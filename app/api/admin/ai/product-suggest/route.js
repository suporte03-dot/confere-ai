import { assertAdminAccess, fetchActiveTaxonomies } from '../../../../../src/lib/admin/products'
import { getOpenAiApiKey, isAiConfigured } from '../../../../../src/lib/admin/ai-config'
import {
  buildSuggestSystemPrompt,
  parseAiSuggestionText,
} from '../../../../../src/lib/admin/ai-product-suggest'

export const runtime = 'nodejs'
export const maxDuration = 60

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
])
const MAX_BYTES = 4 * 1024 * 1024

function json(status, body) {
  return Response.json(body, { status })
}

async function fileToDataUrl(file) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const mime = file.type || 'image/jpeg'
  return `data:${mime};base64,${buffer.toString('base64')}`
}

export async function POST(request) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return json(gate.reason === 'unauthenticated' ? 401 : 403, {
      ok: false,
      error:
        gate.reason === 'unauthenticated'
          ? 'Faça login para continuar.'
          : 'Acesso negado.',
    })
  }

  if (!isAiConfigured()) {
    return json(503, {
      ok: false,
      error: 'IA ainda não configurada neste ambiente.',
      code: 'ai_unconfigured',
    })
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return json(400, { ok: false, error: 'Não foi possível ler a imagem enviada.' })
  }

  const file = formData.get('file')
  if (!file || typeof file !== 'object' || !file.size) {
    return json(400, { ok: false, error: 'Selecione uma foto da peça.' })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return json(400, { ok: false, error: 'Envie uma imagem JPG, PNG ou WEBP.' })
  }
  if (file.size > MAX_BYTES) {
    return json(400, { ok: false, error: 'A imagem é muito grande. Use até 4 MB.' })
  }

  let categories = []
  try {
    const taxonomies = await fetchActiveTaxonomies()
    categories = taxonomies.categories || []
  } catch {
    categories = []
  }

  const apiKey = getOpenAiApiKey()
  const dataUrl = await fileToDataUrl(file)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSuggestSystemPrompt(categories) },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta peça e devolva o JSON de cadastro.',
              },
              { type: 'image_url', image_url: { url: dataUrl, detail: 'low' } },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      return json(502, {
        ok: false,
        error: 'Não conseguimos analisar esta foto.',
        code: 'ai_failed',
      })
    }

    const payload = await response.json()
    const text = payload?.choices?.[0]?.message?.content
    const suggestion = parseAiSuggestionText(text, categories)
    if (!suggestion || (!suggestion.name && !suggestion.description && !suggestion.primaryColor)) {
      return json(502, {
        ok: false,
        error: 'Não conseguimos analisar esta foto.',
        code: 'ai_invalid',
      })
    }

    return json(200, { ok: true, suggestion })
  } catch {
    return json(502, {
      ok: false,
      error: 'Não conseguimos analisar esta foto.',
      code: 'ai_failed',
    })
  }
}
