export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

export function formatCurrency(value) {
  const amount = Number(value)
  if (Number.isNaN(amount)) return '—'
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function getFileExtension(name) {
  return name.split('.').pop()?.toLowerCase() || ''
}

export function getFileTypeLabel(extension) {
  const map = {
    pdf: 'PDF',
    xlsx: 'Excel',
    xls: 'Excel',
    xml: 'XML',
    csv: 'CSV',
    txt: 'TXT',
    ofx: 'OFX',
  }
  return map[extension] || extension.toUpperCase() || 'FILE'
}

export const ACCEPTED_EXTENSIONS = ['pdf', 'xlsx', 'xls', 'xml', 'csv', 'txt', 'ofx']

export function isAcceptedFile(name) {
  return ACCEPTED_EXTENSIONS.includes(getFileExtension(name))
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsText(file)
  })
}

function getAllByLocalName(node, localName, acc = []) {
  if (!node) return acc
  if (node.nodeType === 1) {
    const tag = node.localName || node.tagName.split(':').pop()
    if (tag === localName) acc.push(node)
    for (const child of node.children || []) {
      getAllByLocalName(child, localName, acc)
    }
  }
  return acc
}

export function getTagValue(doc, tagNames) {
  for (const tagName of tagNames) {
    const nodes = getAllByLocalName(doc.documentElement, tagName)
    for (const node of nodes) {
      const text = node.textContent?.trim()
      if (text) return text
    }
  }
  return null
}

function getNestedText(doc, parentTag, childTag) {
  const parents = getAllByLocalName(doc.documentElement, parentTag)
  for (const parent of parents) {
    const children = getAllByLocalName(parent, childTag)
    for (const child of children) {
      const text = child.textContent?.trim()
      if (text) return text
    }
  }
  return null
}

function parseNumber(value) {
  if (!value) return 0
  const normalized = String(value).replace(/\./g, '').replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  return Number.isNaN(parsed) ? Number.parseFloat(value) : parsed
}

function formatDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value.length >= 10 ? value.slice(0, 10) : value
  }
  return date.toLocaleDateString('pt-BR')
}

function baseResult(fileName, tipo) {
  return {
    tipo,
    arquivo: fileName,
    numero: '—',
    emitente: '—',
    cnpjEmitente: '—',
    destinatario: '—',
    valor: '—',
    rawValor: 0,
    data: '—',
    status: 'Não suportado',
    observacao: '',
    filterKey: 'Erro',
    fileStatus: 'Concluído',
  }
}

export function parseXmlInvoice(xmlText, fileName) {
  const result = baseResult(fileName, 'XML')
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'application/xml')

  if (doc.querySelector('parsererror')) {
    result.status = 'Layout não identificado'
    result.observacao = 'XML inválido ou corrompido.'
    result.filterKey = 'Erro'
    return result
  }

  const hasNfe = Boolean(getTagValue(doc, ['nNF', 'infNFe']) || getNestedText(doc, 'emit', 'xNome'))
  const hasNfse = Boolean(
    getTagValue(doc, ['NumeroNfse', 'NumeroNota', 'ValorServicos', 'CodigoVerificacao']),
  )

  result.tipo = hasNfe ? 'NF-e' : hasNfse ? 'NFS-e' : 'XML'

  result.numero =
    getTagValue(doc, ['nNF', 'Numero', 'NumeroNfse', 'NumeroNota', 'nDFe']) || '—'
  result.emitente =
    getNestedText(doc, 'emit', 'xNome') ||
    getTagValue(doc, ['RazaoSocial', 'NomeFantasia']) ||
    '—'
  result.cnpjEmitente =
    getNestedText(doc, 'emit', 'CNPJ') ||
    getNestedText(doc, 'dest', 'CNPJ') ||
    getTagValue(doc, ['CNPJ', 'Cnpj', 'CpfCnpj']) ||
    '—'
  result.destinatario =
    getNestedText(doc, 'dest', 'xNome') ||
    getTagValue(doc, ['NomeTomador', 'RazaoSocialTomador']) ||
    '—'

  const valorRaw = getTagValue(doc, [
    'vNF',
    'ValorServicos',
    'ValorLiquidoNfse',
    'ValorTotal',
    'ValorNota',
  ])
  result.rawValor = parseNumber(valorRaw)
  result.valor = valorRaw ? formatCurrency(result.rawValor) : '—'

  const dataRaw = getTagValue(doc, ['dhEmi', 'dEmi', 'DataEmissao', 'DataEmissaoNFSe'])
  result.data = formatDate(dataRaw) || '—'

  const infNFe = getAllByLocalName(doc.documentElement, 'infNFe')[0]
  const chave = infNFe?.getAttribute('Id')?.replace(/^NFe/, '') || getTagValue(doc, ['chNFe'])

  const missingCore = [result.numero, result.emitente, result.valor].some((v) => v === '—')

  if (!hasNfe && !hasNfse && missingCore) {
    result.status = 'Layout não identificado'
    result.observacao = 'Não foi possível identificar campos fiscais neste XML.'
    result.filterKey = 'Erro'
  } else if (missingCore) {
    result.status = 'Dados incompletos'
    result.observacao = 'XML parcialmente lido. Verifique número, valor ou emitente.'
    result.filterKey = 'Incompleto'
  } else {
    result.status = 'Lido com sucesso'
    result.observacao = chave
      ? `Chave/localizador identificado: ${chave.slice(0, 12)}...`
      : 'Dados extraídos do XML com sucesso.'
    result.filterKey = 'OK'
  }

  return result
}

function parseTextFile(content, fileName, extension) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim())
  return {
    ...baseResult(fileName, extension.toUpperCase()),
    numero: `${lines.length} linhas`,
    valor: '—',
    rawValor: 0,
    data: '—',
    status: 'Lido como texto',
    observacao: 'Análise detalhada será configurada conforme layout do arquivo.',
    filterKey: 'Texto',
    fileStatus: 'Concluído',
  }
}

function parsePdfFile(fileName) {
  return {
    ...baseResult(fileName, 'PDF'),
    status: 'Não suportado',
    observacao:
      'PDF recebido, mas a leitura automática de PDF exige integração com biblioteca de leitura ou backend. Envie XML para análise completa nesta versão.',
    filterKey: 'Erro',
    fileStatus: 'Concluído',
  }
}

function parseExcelFile(fileName) {
  return {
    ...baseResult(fileName, 'Excel'),
    status: 'Não suportado',
    observacao:
      'Arquivo Excel recebido. Para leitura detalhada, instalar biblioteca XLSX ou processar no backend.',
    filterKey: 'Erro',
    fileStatus: 'Concluído',
  }
}

function parseOfxFile(content, fileName) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim())
  return {
    ...baseResult(fileName, 'OFX'),
    numero: `${lines.length} linhas`,
    status: 'Lido como texto',
    observacao: 'OFX lido como texto. Análise bancária detalhada será configurada na próxima versão.',
    filterKey: 'Texto',
    fileStatus: 'Concluído',
  }
}

export async function analyzeFile(file) {
  const extension = getFileExtension(file.name)

  try {
    switch (extension) {
      case 'xml': {
        const xmlText = await readFileAsText(file)
        return parseXmlInvoice(xmlText, file.name)
      }
      case 'csv':
      case 'txt': {
        const text = await readFileAsText(file)
        return parseTextFile(text, file.name, extension)
      }
      case 'ofx': {
        const text = await readFileAsText(file)
        return parseOfxFile(text, file.name)
      }
      case 'pdf':
        return parsePdfFile(file.name)
      case 'xlsx':
      case 'xls':
        return parseExcelFile(file.name)
      default:
        return {
          ...baseResult(file.name, getFileTypeLabel(extension)),
          observacao: 'Formato não suportado nesta versão.',
          filterKey: 'Erro',
        }
    }
  } catch {
    return {
      ...baseResult(file.name, getFileTypeLabel(extension)),
      status: 'Layout não identificado',
      observacao: 'Erro ao processar o arquivo.',
      filterKey: 'Erro',
    }
  }
}

export async function analyzeFiles(files, onProgress) {
  const results = []
  const processable = files.filter((entry) => entry.status !== 'Não suportado')
  const skipped = files.filter((entry) => entry.status === 'Não suportado')

  for (const entry of skipped) {
    const result = {
      id: entry.id,
      ...baseResult(entry.name, getFileTypeLabel(entry.extension)),
      observacao: 'Formato não suportado nesta versão.',
      filterKey: 'Erro',
    }
    results.push(result)
    onProgress?.(Math.round((results.length / files.length) * 100), entry.id, result)
  }

  for (let index = 0; index < processable.length; index += 1) {
    const entry = processable[index]
    const result = await analyzeFile(entry.file)
    results.push({ id: entry.id, ...result })
    onProgress?.(Math.round((results.length / files.length) * 100), entry.id, result)
  }

  return results
}

export function computeAnalysisStats(files, results) {
  const sent = files.length
  const processed = results.filter((item) => item.fileStatus === 'Concluído').length
  const xmlRead = results.filter(
    (item) => ['NF-e', 'NFS-e'].includes(item.tipo) && item.status === 'Lido com sucesso',
  ).length
  const errors = results.filter((item) =>
    ['Layout não identificado', 'Não suportado', 'Dados incompletos'].includes(item.status),
  ).length
  const totalValue = results.reduce((sum, item) => sum + (item.rawValor || 0), 0)

  return {
    sent,
    processed,
    xmlRead,
    errors,
    totalValue: formatCurrency(totalValue),
    ok: results.filter((item) => item.filterKey === 'OK').length,
    incomplete: results.filter((item) => item.filterKey === 'Incompleto').length,
    text: results.filter((item) => item.filterKey === 'Texto').length,
  }
}

export function computeAnalysisInsights(stats, results) {
  const insights = [
    { label: `${stats.sent} arquivo(s) enviado(s)`, tone: 'info' },
    { label: `${stats.processed} arquivo(s) processado(s)`, tone: 'ok' },
    { label: `${stats.xmlRead} XML(s) lidos com sucesso`, tone: stats.xmlRead > 0 ? 'ok' : 'warn' },
    { label: `${stats.errors} arquivo(s) com pendência ou erro`, tone: stats.errors > 0 ? 'danger' : 'ok' },
    { label: `${stats.totalValue} em valores identificados`, tone: 'info' },
  ]

  const xmlIncomplete = results.find((item) => item.status === 'Dados incompletos')
  if (xmlIncomplete) {
    insights.push({
      label: `Dados incompletos em ${xmlIncomplete.arquivo}`,
      tone: 'warn',
    })
  }

  return insights
}

export function createUploadedFileEntry(file, index = 0) {
  const extension = getFileExtension(file.name)
  const accepted = isAcceptedFile(file.name)
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${index}`,
    file,
    name: file.name,
    sizeLabel: formatFileSize(file.size),
    rawSize: file.size,
    extension,
    type: getFileTypeLabel(extension),
    status: accepted ? 'Aguardando análise' : 'Não suportado',
    uploadedAt: new Date().toISOString(),
  }
}

export function mergeUploadedFiles(existing, incoming) {
  const merged = new Map()
  existing.forEach((item) => merged.set(`${item.name}-${item.rawSize}`, item))
  incoming.forEach((item) => {
    const key = `${item.name}-${item.rawSize}`
    if (!merged.has(key)) merged.set(key, item)
  })
  return Array.from(merged.values())
}

export const analysisFilterOptions = [
  'Todos',
  'OK',
  'Incompleto',
  'Texto',
  'Erro',
]

export const demoFilterOptions = ['Todos', 'OK', 'Divergente', 'Faltante']
