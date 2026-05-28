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
  elapsed: '3s',
}

export const features = [
  {
    icon: 'pdf-excel',
    title: 'Conferir PDF x Excel',
    description: 'Cruze relatórios em formatos distintos e identifique diferenças linha a linha.',
    benefit: 'Compare formatos diferentes sem retrabalho',
    featured: true,
  },
  {
    icon: 'missing-notes',
    title: 'Encontrar notas faltantes',
    description: 'Detecte documentos presentes em um arquivo e ausentes no outro.',
    benefit: 'Elimine buscas manuais em planilhas',
  },
  {
    icon: 'divergent-values',
    title: 'Validar valores divergentes',
    description: 'Compare totais, impostos e lançamentos com alertas visuais precisos.',
    benefit: 'Valores destacados para auditoria rápida',
  },
  {
    icon: 'ofx',
    title: 'Converter extrato em OFX',
    description: 'Transforme extratos PDF ou CSV em OFX padronizado para conciliação.',
    benefit: 'Arquivo pronto para importação bancária',
  },
  {
    icon: 'ncm',
    title: 'Validar NCM e descrição',
    description: 'Valide códigos NCM, descrições e inconsistências cadastrais.',
    benefit: 'Reduza riscos fiscais no cadastro',
  },
  {
    icon: 'report-excel',
    title: 'Gerar relatório final',
    description: 'Exporte divergências, status e resumo executivo para conferência.',
    benefit: 'Excel pronto para o time contábil',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Envie os arquivos',
    description: 'PDFs, planilhas, XMLs ou relatórios — em lote ou individualmente.',
  },
  {
    number: '02',
    title: 'Escolha a conferência',
    description: 'Selecione o cenário fiscal, contábil, financeiro ou personalizado.',
  },
  {
    number: '03',
    title: 'Detecte divergências',
    description: 'A IA identifica diferenças, faltantes e inconsistências em segundos.',
  },
  {
    number: '04',
    title: 'Baixe o relatório',
    description: 'Receba um Excel detalhado pronto para auditoria e decisão.',
  },
]

export const useCases = [
  {
    title: 'Prefeitura x ERP',
    tag: 'Fiscal',
    problem: 'Notas da prefeitura não batem com o ERP',
    description: 'Compare NFS-e importadas da prefeitura com lançamentos do sistema.',
    outcome: 'Relatório com notas faltantes e valores divergentes',
  },
  {
    title: 'Balancete x financeiro',
    tag: 'Contábil',
    problem: 'Saldos contábeis divergem do financeiro',
    description: 'Cruze balancete com movimentações do módulo financeiro.',
    outcome: 'Visão clara de diferenças por conta',
  },
  {
    title: 'Extrato PDF x OFX',
    tag: 'Financeiro',
    problem: 'Extrato bancário em formatos incompatíveis',
    description: 'Converta e compare extratos em PDF, CSV ou OFX.',
    outcome: 'Arquivo padronizado pronto para conciliar',
  },
  {
    title: 'NCM x descrição',
    tag: 'Fiscal',
    problem: 'Cadastro fiscal com inconsistências',
    description: 'Valide códigos NCM e descrições entre bases de produtos.',
    outcome: 'Lista de itens com cadastro divergente',
  },
  {
    title: 'Folha x relatório interno',
    tag: 'RH',
    problem: 'Provisões de folha não conferem com o gerencial',
    description: 'Compare folha de pagamento com relatórios internos.',
    outcome: 'Diferenças mapeadas por centro de custo',
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

export const analysisInsights = [
  { label: '2 divergências de valor', tone: 'warn' },
  { label: '2 documentos faltantes', tone: 'danger' },
  { label: 'R$ 6.280,00 em diferenças identificadas', tone: 'info' },
  { label: 'Análise concluída em 3s', tone: 'ok' },
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
