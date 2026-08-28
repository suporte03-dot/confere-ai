import { assertAdminAccess, fetchActiveTaxonomies } from '../../../../../src/lib/admin/products'
import { Buffer } from 'node:buffer'
import { getOpenAiApiKey, isAiConfigured } from '../../../../../src/lib/admin/ai-config'
import {
  buildSuggestSystemPrompt,
  parseAiSuggestionText,
} from '../../../../../src/lib/admin/ai-product-suggest'
import { createClient } from '../../../../../src/lib/supabase/server'
import {
  AI_IMAGE_BUCKET,
  MAX_IMAGE_BYTES,
  isSafeAiIntakePath,
} from '../../../../../src/lib/admin/product-image-upload'

export const runtime = 'nodejs'
export const maxDuration = 60

function json(status, body) {
  return Response.json(body, { status })
}

async function objectToDataUrl(blob) {
  const buffer = Buffer.from(await blob.arrayBuffer())
  const mime = blob.type || 'image/jpeg'
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

  let payload
  try {
    payload = await request.json()
  } catch {
    return json(400, { ok: false, error: 'Não foi possível ler a imagem enviada.' })
  }

  const storagePath = String(payload?.storagePath || '').trim()
  const userId = gate.access?.user?.id
  if (!isSafeAiIntakePath(userId, storagePath)) {
    return json(400, { ok: false, error: 'Caminho de imagem inválido.' })
  }

  const supabase = await createClient()
  const { data: file, error: downloadError } = await supabase.storage
    .from(AI_IMAGE_BUCKET)
    .download(storagePath)

  if (downloadError || !file) {
    await supabase.storage.from(AI_IMAGE_BUCKET).remove([storagePath])
    return json(400, { ok: false, error: 'Não foi possível ler a imagem enviada.' })
  }
  if (file.size > MAX_IMAGE_BYTES) {
    await supabase.storage.from(AI_IMAGE_BUCKET).remove([storagePath])
    return json(400, { ok: false, error: 'A imagem deve ter no máximo 5 MB.' })
  }

  const categories = await fetchActiveTaxonomies()
    .then((taxonomies) => taxonomies.categories || [])
    .catch(() => [])

  const apiKey = getOpenAiApiKey()
  const dataUrl = await objectToDataUrl(file)

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

    const aiPayload = await response.json()
    const text = aiPayload?.choices?.[0]?.message?.content
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
  } finally {
    await supabase.storage.from(AI_IMAGE_BUCKET).remove([storagePath])
  }
}
