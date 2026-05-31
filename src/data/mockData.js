/**
 * Imagens TerraBrasil
 *
 * Coloque fotos próprias ou licenciadas em public/images/terrabrasil/
 * usando exatamente os nomes definidos em imageMap.
 * Enquanto os arquivos não existirem, o site exibe placeholders premium em CSS.
 */

export const imageMap = {
  hero: '/images/terrabrasil/hero-lifestyle.jpg',
  categorias: {
    masculino: '/images/terrabrasil/categoria-masculino.jpg',
    feminino: '/images/terrabrasil/categoria-feminino.jpg',
    calcados: '/images/terrabrasil/categoria-calcados.jpg',
    acessorios: '/images/terrabrasil/categoria-acessorios.jpg',
    outlet: '/images/terrabrasil/categoria-outlet.jpg',
  },
  colecoes: {
    'calca-jeans-masculina': '/images/terrabrasil/colecao-calca-jeans-masculina.jpg',
    'camisas-masculinas': '/images/terrabrasil/colecao-camisas-masculinas.jpg',
    'jaquetas-masculinas': '/images/terrabrasil/colecao-jaquetas-masculinas.jpg',
    'camisetas-masculinas': '/images/terrabrasil/colecao-camisetas-masculinas.jpg',
    polos: '/images/terrabrasil/colecao-polos.jpg',
    bones: '/images/terrabrasil/colecao-bones.jpg',
    'moletons-masculinos': '/images/terrabrasil/colecao-moletons-masculinos.jpg',
    acessorios: '/images/terrabrasil/colecao-acessorios-masculinos.jpg',
    feminino: '/images/terrabrasil/categoria-feminino.jpg',
    'camisas-femininas': '/images/terrabrasil/colecao-camisas-femininas.jpg',
    'camisetas-femininas': '/images/terrabrasil/colecao-camisetas-femininas.jpg',
    'jaquetas-femininas': '/images/terrabrasil/colecao-jaquetas-femininas.jpg',
    'calca-jeans-feminina': '/images/terrabrasil/colecao-calca-jeans-feminina.jpg',
    vestidos: '/images/terrabrasil/colecao-vestidos.jpg',
    'acessorios-femininos': '/images/terrabrasil/colecao-acessorios-femininos.jpg',
  },
  produtos: {
    camisaWorker: '/images/terrabrasil/camisa-worker-xadrez.jpg',
    camisetaEssencial: '/images/terrabrasil/camiseta-essencial.jpg',
    jaquetaCampo: '/images/terrabrasil/jaqueta-campo.jpg',
    jeansHorizonte: '/images/terrabrasil/calca-jeans-horizonte.jpg',
    botaEstrada: '/images/terrabrasil/bota-couro-estrada.jpg',
    poloOliva: '/images/terrabrasil/polo-verde-oliva.jpg',
    bermudaSarja: '/images/terrabrasil/bermuda-sarja.jpg',
    boneBordado: '/images/terrabrasil/bone-bordado.jpg',
    moletomSoft: '/images/terrabrasil/moletom-terra-soft.jpg',
    vestidoAurora: '/images/terrabrasil/vestido-linho-aurora.jpg',
    camisaSerena: '/images/terrabrasil/camisa-feminina-serena.jpg',
    camisetaFeminina: '/images/terrabrasil/camiseta-feminina-essencial.jpg',
    jaquetaFeminina: '/images/terrabrasil/jaqueta-feminina-aurora.jpg',
    jeansFeminina: '/images/terrabrasil/calca-jeans-feminina-horizonte.jpg',
    cintoTerra: '/images/terrabrasil/cinto-couro-terra.jpg',
    mochilaCampo: '/images/terrabrasil/mochila-lona-campo.jpg',
    bolsaCasual: '/images/terrabrasil/bolsa-terrabrasil-casual.jpg',
  },
  banner: '/images/terrabrasil/banner-colecao-horizonte.jpg',
  newsletter: '/images/terrabrasil/newsletter-lifestyle.jpg',
  fallback: '/images/terrabrasil/fallback-produto.jpg',
}

export const topBenefits = [
  'Frete grátis acima de R$499',
  'Até 12x sem juros',
  'Primeira compra com 10% OFF',
]

export const collections = [
  {
    id: 'masculino',
    title: 'Masculino',
    slug: '/collections/masculino',
    filter: 'Masculino',
    subcategories: [
      { id: 'calca-jeans-masculina', title: 'Calça Jeans Masculina', slug: '/collections/calca-jeans-masculina', variant: 'jeans' },
      { id: 'camisas-masculinas', title: 'Camisas Masculinas', slug: '/collections/camisas-masculinas', variant: 'camisas' },
      { id: 'jaquetas-masculinas', title: 'Jaquetas Masculinas', slug: '/collections/jaquetas-masculinas', variant: 'jaquetas' },
      { id: 'camisetas-masculinas', title: 'Camisetas Masculinas', slug: '/collections/camisetas-masculinas', variant: 'camisetas' },
      { id: 'polos', title: 'Polos', slug: '/collections/polos', variant: 'polos' },
      { id: 'bones', title: 'Bonés', slug: '/collections/bones', variant: 'boneBordado' },
      { id: 'moletons-masculinos', title: 'Moletons Masculinos', slug: '/collections/moletons-masculinos', variant: 'moletons' },
      { id: 'acessorios', title: 'Acessórios Masculinos', slug: '/collections/acessorios', variant: 'acessorios' },
    ],
  },
  {
    id: 'feminino',
    title: 'Feminino',
    slug: '/collections/feminino',
    filter: 'Feminino',
    subcategories: [
      { id: 'camisas-femininas', title: 'Camisas Femininas', slug: '/collections/camisas-femininas', variant: 'camisaSerena' },
      { id: 'camisetas-femininas', title: 'Camisetas Femininas', slug: '/collections/camisetas-femininas', variant: 'camisetas' },
      { id: 'jaquetas-femininas', title: 'Jaquetas Femininas', slug: '/collections/jaquetas-femininas', variant: 'jaquetaCampo' },
      { id: 'calca-jeans-feminina', title: 'Calça Jeans Feminina', slug: '/collections/calca-jeans-feminina', variant: 'jeans' },
      { id: 'vestidos', title: 'Vestidos', slug: '/collections/vestidos', variant: 'vestidoAurora' },
      { id: 'acessorios-femininos', title: 'Acessórios Femininos', slug: '/collections/acessorios-femininos', variant: 'acessorios' },
    ],
  },
]

export const mainNav = [
  { id: 'masculino', title: 'Masculino', slug: '/collections/masculino', filter: 'Masculino', hasDropdown: true },
  { id: 'feminino', title: 'Feminino', slug: '/collections/feminino', filter: 'Feminino', hasDropdown: true },
  { id: 'calcados', title: 'Calçados', slug: '/collections/calcados', filter: 'Calçados' },
  { id: 'acessorios', title: 'Acessórios', slug: '/collections/acessorios', filter: 'Acessórios' },
  { id: 'outlet', title: 'Outlet', slug: '/collections/outlet', filter: 'Outlet' },
]

export const filterOptions = [
  'Todos',
  'Masculino',
  'Feminino',
  'Calça Jeans',
  'Camisas',
  'Jaquetas',
  'Camisetas',
  'Polos',
  'Bonés',
  'Moletons',
  'Acessórios',
  'Outlet',
]

export const featuredCollections = [
  {
    id: 'calca-jeans-masculina',
    title: 'Calça Jeans Masculina',
    description: 'Modelagens confortáveis com caimento reto e visual casual premium.',
    filter: 'calca-jeans-masculina',
    image: imageMap.colecoes['calca-jeans-masculina'],
    variant: 'jeans',
  },
  {
    id: 'camisas-masculinas',
    title: 'Camisas Masculinas',
    description: 'Camisas worker, xadrez e casuais para compor looks do dia a dia.',
    filter: 'camisas-masculinas',
    image: imageMap.colecoes['camisas-masculinas'],
    variant: 'camisas',
  },
  {
    id: 'jaquetas-masculinas',
    title: 'Jaquetas Masculinas',
    description: 'Proteção e estilo para campo, cidade e momentos ao ar livre.',
    filter: 'jaquetas-masculinas',
    image: imageMap.colecoes['jaquetas-masculinas'],
    variant: 'jaquetas',
  },
  {
    id: 'camisetas-masculinas',
    title: 'Camisetas Masculinas',
    description: 'Básicas e essenciais com tecidos macios e cores da TerraBrasil.',
    filter: 'camisetas-masculinas',
    image: imageMap.colecoes['camisetas-masculinas'],
    variant: 'camisetas',
  },
  {
    id: 'polos',
    title: 'Polos',
    description: 'Polos piquet e casuais para um visual elegante sem perder conforto.',
    filter: 'polos',
    image: imageMap.colecoes.polos,
    variant: 'polos',
  },
  {
    id: 'bones',
    title: 'Bonés',
    description: 'Bonés bordados e modelos clássicos para completar o visual.',
    filter: 'bones',
    image: imageMap.colecoes.bones,
    variant: 'boneBordado',
  },
  {
    id: 'moletons-masculinos',
    title: 'Moletons Masculinos',
    description: 'Peças quentes e macias para dias mais frescos com estilo urbano.',
    filter: 'moletons-masculinos',
    image: imageMap.colecoes['moletons-masculinos'],
    variant: 'moletons',
  },
  {
    id: 'acessorios',
    title: 'Acessórios Masculinos',
    description: 'Cintos, mochilas e detalhes que elevam qualquer composição.',
    filter: 'acessorios',
    image: imageMap.colecoes.acessorios,
    variant: 'acessorios',
  },
  {
    id: 'feminino',
    title: 'Feminino',
    description: 'Camisas, vestidos, jeans e acessórios com elegância natural.',
    filter: 'Feminino',
    image: imageMap.colecoes.feminino,
    variant: 'feminino',
  },
]

export const femininoCollections = collections
  .find((c) => c.id === 'feminino')
  .subcategories.map((sub) => ({
    ...sub,
    description: getCollectionDescription(sub.id),
    image: imageMap.colecoes[sub.id],
    filter: sub.id,
  }))

function getCollectionDescription(id) {
  const descriptions = {
    'camisas-femininas': 'Camisas leves e versáteis para o dia a dia.',
    'camisetas-femininas': 'Camisetas básicas com caimento confortável.',
    'jaquetas-femininas': 'Jaquetas casuais com visual sofisticado.',
    'calca-jeans-feminina': 'Jeans com modelagem moderna e confortável.',
    vestidos: 'Vestidos casuais com tecidos naturais e leves.',
    'acessorios-femininos': 'Bolsas e acessórios que completam o look.',
  }
  return descriptions[id] || 'Explore a coleção TerraBrasil.'
}

export const heroData = {
  label: 'Nova coleção TerraBrasil',
  title: 'Estilo brasileiro para todos os momentos',
  subtitle:
    'Roupas, calçados e acessórios com qualidade, conforto e personalidade para o seu dia a dia.',
  primaryButton: 'Comprar agora',
  secondaryButton: 'Ver novidades',
  image: imageMap.hero,
  variant: 'hero',
  badges: ['Coleção Campo & Cidade', 'Peças exclusivas', 'Envio para todo Brasil'],
  floatingCards: ['12x sem juros', 'Frete grátis +R$499'],
}

export const products = [
  {
    id: 1,
    name: 'Camisa Terra Worker Xadrez',
    department: 'Masculino',
    collectionId: 'camisas-masculinas',
    subcategory: 'Camisas Masculinas',
    price: 249.9,
    oldPrice: 299.9,
    badge: 'Mais vendido',
    colors: ['Verde', 'Marrom', 'Azul'],
    imageKey: 'camisaWorker',
    image: imageMap.produtos.camisaWorker,
    variant: 'camisaWorker',
  },
  {
    id: 2,
    name: 'Camiseta Essencial TerraBrasil',
    department: 'Masculino',
    collectionId: 'camisetas-masculinas',
    subcategory: 'Camisetas Masculinas',
    price: 129.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Off-white', 'Verde', 'Preto'],
    imageKey: 'camisetaEssencial',
    image: imageMap.produtos.camisetaEssencial,
    variant: 'camisetaEssencial',
  },
  {
    id: 3,
    name: 'Jaqueta Campo Premium',
    department: 'Masculino',
    collectionId: 'jaquetas-masculinas',
    subcategory: 'Jaquetas Masculinas',
    price: 499.9,
    oldPrice: 599.9,
    badge: 'Premium',
    colors: ['Oliva', 'Marrom'],
    imageKey: 'jaquetaCampo',
    image: imageMap.produtos.jaquetaCampo,
    variant: 'jaquetaCampo',
  },
  {
    id: 4,
    name: 'Calça Jeans Reta Horizonte',
    department: 'Masculino',
    collectionId: 'calca-jeans-masculina',
    subcategory: 'Calça Jeans Masculina',
    price: 279.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Azul médio', 'Azul escuro'],
    imageKey: 'jeansHorizonte',
    image: imageMap.produtos.jeansHorizonte,
    variant: 'jeansHorizonte',
  },
  {
    id: 5,
    name: 'Bota Couro Estrada',
    department: 'Calçados',
    collectionId: 'calcados',
    subcategory: 'Botas',
    price: 549.9,
    oldPrice: 649.9,
    badge: 'Destaque',
    colors: ['Caramelo', 'Café'],
    imageKey: 'botaEstrada',
    image: imageMap.produtos.botaEstrada,
    variant: 'botaEstrada',
  },
  {
    id: 6,
    name: 'Polo Piquet Verde Oliva',
    department: 'Masculino',
    collectionId: 'polos',
    subcategory: 'Polos',
    price: 189.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Verde oliva', 'Branco', 'Marinho'],
    imageKey: 'poloOliva',
    image: imageMap.produtos.poloOliva,
    variant: 'poloOliva',
  },
  {
    id: 7,
    name: 'Bermuda Sarja Casual',
    department: 'Masculino',
    collectionId: 'calca-jeans-masculina',
    subcategory: 'Bermudas',
    price: 159.9,
    oldPrice: 199.9,
    badge: 'Outlet',
    colors: ['Areia', 'Oliva', 'Preto'],
    imageKey: 'bermudaSarja',
    image: imageMap.produtos.bermudaSarja,
    variant: 'bermudaSarja',
  },
  {
    id: 8,
    name: 'Boné TerraBrasil Bordado',
    department: 'Acessórios',
    collectionId: 'bones',
    subcategory: 'Bonés',
    price: 89.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Verde', 'Bege', 'Preto'],
    imageKey: 'boneBordado',
    image: imageMap.produtos.boneBordado,
    variant: 'boneBordado',
  },
  {
    id: 9,
    name: 'Moletom Terra Soft Masculino',
    department: 'Masculino',
    collectionId: 'moletons-masculinos',
    subcategory: 'Moletons Masculinos',
    price: 229.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Verde', 'Oliva', 'Preto'],
    imageKey: 'moletomSoft',
    image: imageMap.produtos.moletomSoft,
    variant: 'moletons',
  },
  {
    id: 10,
    name: 'Cinto Couro Terra',
    department: 'Acessórios',
    collectionId: 'acessorios',
    subcategory: 'Cintos',
    price: 119.9,
    oldPrice: null,
    badge: 'Essencial',
    colors: ['Caramelo', 'Café'],
    imageKey: 'cintoTerra',
    image: imageMap.produtos.cintoTerra,
    variant: 'cintoTerra',
  },
  {
    id: 11,
    name: 'Mochila Lona Campo',
    department: 'Acessórios',
    collectionId: 'acessorios',
    subcategory: 'Mochilas',
    price: 349.9,
    oldPrice: 399.9,
    badge: 'Premium',
    colors: ['Oliva', 'Bege'],
    imageKey: 'mochilaCampo',
    image: imageMap.produtos.mochilaCampo,
    variant: 'mochilaCampo',
  },
  {
    id: 12,
    name: 'Camisa Feminina Serena',
    department: 'Feminino',
    collectionId: 'camisas-femininas',
    subcategory: 'Camisas Femininas',
    price: 219.9,
    oldPrice: 259.9,
    badge: 'Mais vendido',
    colors: ['Branco', 'Azul claro', 'Verde'],
    imageKey: 'camisaSerena',
    image: imageMap.produtos.camisaSerena,
    variant: 'camisaSerena',
  },
  {
    id: 13,
    name: 'Camiseta Feminina Essencial',
    department: 'Feminino',
    collectionId: 'camisetas-femininas',
    subcategory: 'Camisetas Femininas',
    price: 119.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Off-white', 'Areia', 'Verde claro'],
    imageKey: 'camisetaFeminina',
    image: imageMap.produtos.camisetaFeminina,
    variant: 'camisetas',
  },
  {
    id: 14,
    name: 'Jaqueta Feminina Aurora',
    department: 'Feminino',
    collectionId: 'jaquetas-femininas',
    subcategory: 'Jaquetas Femininas',
    price: 459.9,
    oldPrice: 529.9,
    badge: 'Premium',
    colors: ['Oliva', 'Areia'],
    imageKey: 'jaquetaFeminina',
    image: imageMap.produtos.jaquetaFeminina,
    variant: 'jaquetaCampo',
  },
  {
    id: 15,
    name: 'Calça Jeans Feminina Horizonte',
    department: 'Feminino',
    collectionId: 'calca-jeans-feminina',
    subcategory: 'Calça Jeans Feminina',
    price: 269.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Azul médio', 'Azul escuro'],
    imageKey: 'jeansFeminina',
    image: imageMap.produtos.jeansFeminina,
    variant: 'jeansHorizonte',
  },
  {
    id: 16,
    name: 'Vestido Linho Aurora',
    department: 'Feminino',
    collectionId: 'vestidos',
    subcategory: 'Vestidos',
    price: 299.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Areia', 'Verde claro'],
    imageKey: 'vestidoAurora',
    image: imageMap.produtos.vestidoAurora,
    variant: 'vestidoAurora',
  },
  {
    id: 17,
    name: 'Bolsa TerraBrasil Casual',
    department: 'Feminino',
    collectionId: 'acessorios-femininos',
    subcategory: 'Bolsas',
    price: 279.9,
    oldPrice: 329.9,
    badge: 'Destaque',
    colors: ['Caramelo', 'Oliva'],
    imageKey: 'bolsaCasual',
    image: imageMap.produtos.bolsaCasual,
    variant: 'mochilaCampo',
  },
]

export const collectionBanner = {
  label: 'Coleção Horizonte',
  title: 'Moda lifestyle premium',
  subtitle:
    'Peças versáteis para acompanhar sua rotina com conforto, presença e personalidade.',
  image: imageMap.banner,
  variant: 'banner',
  cta: 'Conhecer coleção',
}

export const newsletterBanner = {
  title: 'Ganhe 10% OFF na primeira compra',
  subtitle:
    'Cadastre seu e-mail e receba novidades, ofertas e lançamentos TerraBrasil.',
  image: imageMap.newsletter,
  variant: 'newsletter',
  button: 'Garantir desconto',
}

export const storeBenefits = [
  {
    id: 'frete',
    title: 'Frete grátis acima de R$499',
    description: 'Receba seus produtos com economia em compras selecionadas.',
  },
  {
    id: 'parcelamento',
    title: 'Até 12x sem juros',
    description: 'Mais facilidade para comprar suas peças favoritas.',
  },
  {
    id: 'troca',
    title: 'Troca descomplicada',
    description: 'Processo simples para você comprar com tranquilidade.',
  },
  {
    id: 'seguro',
    title: 'Compra segura',
    description: 'Ambiente protegido para finalizar seus pedidos.',
  },
  {
    id: 'atendimento',
    title: 'Atendimento próximo',
    description: 'Suporte antes e depois da sua compra.',
  },
  {
    id: 'curadoria',
    title: 'Produtos selecionados',
    description: 'Peças escolhidas para unir estilo, conforto e qualidade.',
  },
]

export const footerLinks = {
  institucional: [
    { label: 'Sobre a TerraBrasil', href: '#sobre' },
    { label: 'Trocas e devoluções', href: '#trocas' },
    { label: 'Atendimento', href: '#atendimento' },
  ],
  masculino: collections[0].subcategories.map((sub) => ({
    label: sub.title,
    filter: sub.id,
  })),
  feminino: collections[1].subcategories.map((sub) => ({
    label: sub.title,
    filter: sub.id,
  })),
}

export const paymentMethods = ['Visa', 'Master', 'Pix', 'Boleto']

export const colorSwatches = {
  Verde: '#1F4D2B',
  Marrom: '#7A4A28',
  Azul: '#1e3a5f',
  'Off-white': '#FAF7F0',
  Preto: '#1E1E1E',
  Oliva: '#556B2F',
  'Azul médio': '#3b5998',
  'Azul escuro': '#1e293b',
  Caramelo: '#C8923E',
  Café: '#5c4033',
  'Verde oliva': '#556B2F',
  Branco: '#FAF7F0',
  Marinho: '#1e3a5f',
  Areia: '#F5EFE3',
  Bege: '#F5EFE3',
  'Verde claro': '#8fbc8f',
  'Azul claro': '#93c5fd',
}

export function matchesFilter(product, filterId) {
  if (filterId === 'Todos') return true
  if (filterId === 'Outlet') return product.badge === 'Outlet'
  if (filterId === 'Masculino') return product.department === 'Masculino'
  if (filterId === 'Feminino') return product.department === 'Feminino'
  if (filterId === 'Calçados') return product.department === 'Calçados'
  if (filterId === 'Calça Jeans') return product.collectionId.includes('calca-jeans')
  if (filterId === 'Camisas') return product.collectionId.includes('camisas')
  if (filterId === 'Jaquetas') return product.collectionId.includes('jaquetas')
  if (filterId === 'Camisetas') return product.collectionId.includes('camisetas')
  if (filterId === 'Polos') return product.collectionId === 'polos'
  if (filterId === 'Bonés') return product.collectionId === 'bones'
  if (filterId === 'Moletons') return product.collectionId === 'moletons-masculinos'
  if (filterId === 'Acessórios') {
    return product.department === 'Acessórios'
      || product.collectionId === 'acessorios'
      || product.collectionId === 'acessorios-femininos'
  }

  return product.collectionId === filterId
}

export function getSubcategoriesForNav(navId) {
  const collection = collections.find((c) => c.id === navId)
  return collection?.subcategories ?? []
}

export function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function getInstallment(price, installments = 10) {
  const installmentValue = price / installments

  return `${installments}x de ${formatCurrency(installmentValue)} sem juros`
}

export function getColorHex(name) {
  return colorSwatches[name] || '#C8923E'
}

export function getProductImage(product) {
  return product.image || imageMap.produtos[product.imageKey] || imageMap.fallback
}

export function scrollToProducts() {
  document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
