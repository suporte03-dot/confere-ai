export function isAiConfigured() {
  return Boolean(String(process.env.OPENAI_API_KEY || '').trim())
}

export function getOpenAiApiKey() {
  return String(process.env.OPENAI_API_KEY || '').trim() || null
}
