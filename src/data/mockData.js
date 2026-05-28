export const mockUploadedFiles = [
  { id: 1, name: 'notas_prefeitura.pdf', type: 'PDF', size: '2,4 MB', status: 'Pronto' },
  { id: 2, name: 'relatorio_erp.xlsx', type: 'Excel', size: '890 KB', status: 'Pronto' },
  { id: 3, name: 'nfse_janeiro.xml', type: 'XML', size: '156 KB', status: 'Analisando' },
  { id: 4, name: 'divergencias_detectadas.csv', type: 'CSV', size: '42 KB', status: 'Divergente' },
]

export const analysisSummary = {
  progress: 87,
  ok: 2,
  divergent: 2,
  missing: 2,
}

export const features = [
  {
    icon: 'pdf-excel',
    title: 'Comparar PDF x Excel',
    description: 'Cruze relatórios em formatos distintos e identifique diferenças linha a linha com precisão.',
    featured: true,
  },
  {
    icon: 'missing-notes',
    title: 'Encontrar notas faltantes',
    description: 'Detecte documentos presentes em um arquivo e ausentes no outro, sem busca manual.',
  },
  {
    icon: 'divergent-values',
    title: 'Conferir valores divergentes',
    description: 'Compare totais, impostos e lançamentos com alertas visuais e valores destacados.',
  },
  {
    icon: 'ofx',
    title: 'Converter extrato em OFX',
    description: 'Transforme extratos PDF ou CSV em OFX padronizado para conciliação bancária.',
  },
  {
    icon: 'ncm',
    title: 'Analisar NCM e descrição',
    description: 'Valide códigos NCM, descrições de produtos e inconsistências cadastrais.',
  },
  {
    icon: 'report-excel',
    title: 'Gerar relatório final em Excel',
    description: 'Exporte divergências, status e resumo executivo prontos para auditoria.',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Upload dos arquivos',
    description: 'Envie PDFs, planilhas, XMLs ou relatórios em poucos cliques.',
  },
  {
    number: '02',
    title: 'Escolha da conferência',
    description: 'Selecione o cenário fiscal, contábil, financeiro ou personalizado.',
  },
  {
    number: '03',
    title: 'Detecção automática',
    description: 'A IA identifica diferenças, faltantes e inconsistências em segundos.',
  },
  {
    number: '04',
    title: 'Relatório final',
    description: 'Baixe um Excel detalhado pronto para conferência e tomada de decisão.',
  },
]

export const useCases = [
  {
    title: 'Prefeitura x ERP',
    description: 'Compare NFS-e importadas da prefeitura com lançamentos do seu sistema.',
    tag: 'Fiscal',
    benefit: 'Encontre notas faltantes',
  },
  {
    title: 'Balancete x financeiro',
    description: 'Cruze saldos contábeis com movimentações do módulo financeiro.',
    tag: 'Contábil',
    benefit: 'Compare saldos automaticamente',
  },
  {
    title: 'Extrato PDF x OFX',
    description: 'Converta e compare extratos bancários em diferentes formatos.',
    tag: 'Financeiro',
    benefit: 'Gere arquivo pronto para importar',
  },
  {
    title: 'NCM x descrição',
    description: 'Valide códigos fiscais e descrições de produtos entre cadastros.',
    tag: 'Fiscal',
    benefit: 'Detecte inconsistências cadastrais',
  },
  {
    title: 'Folha x relatório interno',
    description: 'Confira provisões de folha com relatórios gerenciais internos.',
    tag: 'RH',
    benefit: 'Reduza retrabalho mensal',
  },
]

export const divergences = [
  {
    id: 1,
    documento: 'NFS-e',
    numero: '0004521',
    valorA: 'R$ 12.450,00',
    valorB: 'R$ 12.450,00',
    diferenca: 'R$ 0,00',
    status: 'OK',
    rawDiff: 0,
  },
  {
    id: 2,
    documento: 'NFS-e',
    numero: '0004522',
    valorA: 'R$ 8.320,00',
    valorB: 'R$ 8.150,00',
    diferenca: 'R$ 170,00',
    status: 'Divergente',
    rawDiff: 170,
  },
  {
    id: 3,
    documento: 'NFS-e',
    numero: '0004523',
    valorA: 'R$ 3.890,00',
    valorB: '—',
    diferenca: 'R$ 3.890,00',
    status: 'Faltante',
    rawDiff: 3890,
  },
  {
    id: 4,
    documento: 'NFS-e',
    numero: '0004524',
    valorA: 'R$ 15.200,00',
    valorB: 'R$ 15.200,00',
    diferenca: 'R$ 0,00',
    status: 'OK',
    rawDiff: 0,
  },
  {
    id: 5,
    documento: 'NFS-e',
    numero: '0004525',
    valorA: '—',
    valorB: 'R$ 2.100,00',
    diferenca: 'R$ 2.100,00',
    status: 'Faltante',
    rawDiff: 2100,
  },
  {
    id: 6,
    documento: 'NFS-e',
    numero: '0004526',
    valorA: 'R$ 6.780,00',
    valorB: 'R$ 6.900,00',
    diferenca: 'R$ 120,00',
    status: 'Divergente',
    rawDiff: 120,
  },
]

export const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Exemplos', href: '#exemplos' },
  { label: 'Resultado', href: '#resultado' },
]

export const footerLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Exemplos', href: '#exemplos' },
  { label: 'Resultado', href: '#resultado' },
]

export const statusFilterOptions = ['Todos', 'OK', 'Divergente', 'Faltante']
