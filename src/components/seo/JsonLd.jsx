/**
 * Renders Schema.org JSON-LD (server-safe).
 * @param {{ data: object | object[] | null | undefined }} props
 */
export default function JsonLd({ data }) {
  if (!data) return null
  const payload = Array.isArray(data) ? data.filter(Boolean) : data
  if (Array.isArray(payload) && !payload.length) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
