export const mockUploadedFiles = [
  { id: 1, name: 'notas_prefeitura.pdf', type: 'PDF', size: '2,4 MB', status: 'Pronto' },
  { id: 2, name: 'relatorio_erp.xlsx', type: 'Excel', size: '890 KB', status: 'Pronto' },
  { id: 3, name: 'nfse_janeiro.xml', type: 'XML', size: '156 KB', status: 'Analisando' },
]

export const features = [
  {
    icon: '📄',
    title: 'Comparar PDF x Excel',
    description: 'Cruze relatórios em formatos diferentes e identifique diferenças linha a linha.',
  },
  {
    icon: '🔍',
    title: 'Encontrar notas faltantes',
    description: 'Detecte documentos presentes em um arquivo e ausentes no outro automaticamente.',
  },
  {
    icon: '💰',
    title: 'Conferir valores divergentes',
    description: 'Compare valores, totais e impostos com precisão decimal e alertas visuais.',
  },
  {
    icon: '🏦',
    title: 'Converter extrato em OFX',
    description: 'Transforme extratos PDF ou CSV em OFX padronizado para conciliação bancária.',
  },
  {
    icon: '📦',
    title: 'Analisar NCM e descrição',
    description: 'Valide códigos NCM, descrições de produtos e inconsistências cadastrais.',
  },
  {
    icon: '📊',
    title: 'Gerar relatório final em Excel',
    description: 'Exporte um relatório completo com divergências, status e resumo executivo.',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Envie os arquivos',
    description: 'Arraste PDFs, planilhas, XMLs ou relatórios para a plataforma.',
  },
  {
    number: '02',
    title: 'Escolha o tipo de conferência',
    description: 'Selecione o cenário: fiscal, contábil, financeiro ou personalizado.',
  },
  {
    number: '03',
    title: 'O sistema identifica divergências',
    description: 'Nossa IA analisa e classifica diferenças, faltantes e inconsistências.',
  },
  {
    number: '04',
    title: 'Baixe o relatório final',
    description: 'Receba um Excel detalhado pronto para auditoria e conferência.',
  },
]

export const useCases = [
  {
    title: 'Prefeitura x ERP',
    description: 'Compare NFS-e importadas da prefeitura com lançamentos do seu sistema.',
    tag: 'Fiscal',
  },
  {
    title: 'Balancete x financeiro',
    description: 'Cruze saldos contábeis com movimentações do módulo financeiro.',
    tag: 'Contábil',
  },
  {
    title: 'Extrato PDF x OFX',
    description: 'Converta e compare extratos bancários em diferentes formatos.',
    tag: 'Financeiro',
  },
  {
    title: 'NCM x descrição',
    description: 'Valide códigos fiscais e descrições de produtos entre cadastros.',
    tag: 'Fiscal',
  },
  {
    title: 'Folha x relatório interno',
    description: 'Conferir provisões de folha com relatórios gerenciais internos.',
    tag: 'RH',
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
  },
  {
    id: 2,
    documento: 'NFS-e',
    numero: '0004522',
    valorA: 'R$ 8.320,00',
    valorB: 'R$ 8.150,00',
    diferenca: 'R$ 170,00',
    status: 'Divergente',
  },
  {
    id: 3,
    documento: 'NFS-e',
    numero: '0004523',
    valorA: 'R$ 3.890,00',
    valorB: '—',
    diferenca: 'R$ 3.890,00',
    status: 'Faltante',
  },
  {
    id: 4,
    documento: 'NFS-e',
    numero: '0004524',
    valorA: 'R$ 15.200,00',
    valorB: 'R$ 15.200,00',
    diferenca: 'R$ 0,00',
    status: 'OK',
  },
  {
    id: 5,
    documento: 'NFS-e',
    numero: '0004525',
    valorA: '—',
    valorB: 'R$ 2.100,00',
    diferenca: 'R$ 2.100,00',
    status: 'Faltante',
  },
  {
    id: 6,
    documento: 'NFS-e',
    numero: '0004526',
    valorA: 'R$ 6.780,00',
    valorB: 'R$ 6.900,00',
    diferenca: 'R$ 120,00',
    status: 'Divergente',
  },
]

export const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Exemplos', href: '#exemplos' },
  { label: 'Resultado', href: '#resultado' },
]
