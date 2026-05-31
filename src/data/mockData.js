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
    infantil: '/images/terrabrasil/categoria-infantil.jpg',
    calcados: '/images/terrabrasil/categoria-calcados.jpg',
    acessorios: '/images/terrabrasil/categoria-acessorios.jpg',
    outlet: '/images/terrabrasil/categoria-outlet.jpg',
  },
  quickCategories: {
    camisetas: '/images/terrabrasil/categoria-camisetas.jpg',
    camisas: '/images/terrabrasil/categoria-camisas.jpg',
    polos: '/images/terrabrasil/categoria-polos.jpg',
    jaquetas: '/images/terrabrasil/categoria-jaquetas.jpg',
    jeans: '/images/terrabrasil/categoria-jeans.jpg',
    botas: '/images/terrabrasil/categoria-botas.jpg',
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
    vestidoAurora: '/images/terrabrasil/vestido-linho-aurora.jpg',
    camisaSerena: '/images/terrabrasil/camisa-feminina-serena.jpg',
    cintoTerra: '/images/terrabrasil/cinto-couro-terra.jpg',
    mochilaCampo: '/images/terrabrasil/mochila-lona-campo.jpg',
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

export const navCategories = [
  'Masculino',
  'Feminino',
  'Infantil',
  'Calçados',
  'Acessórios',
  'Outlet',
]

export const filterOptions = ['Todos', ...navCategories]

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

export const categoryHighlights = [
  {
    id: 'masculino',
    title: 'Masculino',
    description: 'Camisas, polos, camisetas e peças casuais para todos os dias.',
    image: imageMap.categorias.masculino,
    variant: 'masculino',
    filter: 'Masculino',
  },
  {
    id: 'feminino',
    title: 'Feminino',
    description: 'Peças leves, elegantes e versáteis para diferentes ocasiões.',
    image: imageMap.categorias.feminino,
    variant: 'feminino',
    filter: 'Feminino',
  },
  {
    id: 'infantil',
    title: 'Infantil',
    description: 'Conforto e estilo para os pequenos aproveitarem cada momento.',
    image: imageMap.categorias.infantil,
    variant: 'infantil',
    filter: 'Infantil',
  },
  {
    id: 'calcados',
    title: 'Calçados',
    description: 'Botas, tênis e calçados para acompanhar sua rotina.',
    image: imageMap.categorias.calcados,
    variant: 'calcados',
    filter: 'Calçados',
  },
  {
    id: 'acessorios',
    title: 'Acessórios',
    description: 'Bonés, cintos, bolsas e detalhes que completam o visual.',
    image: imageMap.categorias.acessorios,
    variant: 'acessorios',
    filter: 'Acessórios',
  },
  {
    id: 'outlet',
    title: 'Outlet',
    description: 'Produtos selecionados com condições especiais.',
    image: imageMap.categorias.outlet,
    variant: 'outlet',
    filter: 'Outlet',
  },
]

export const quickCategories = [
  {
    id: 'camisetas',
    title: 'Camisetas',
    image: imageMap.quickCategories.camisetas,
    variant: 'camisetas',
  },
  {
    id: 'camisas',
    title: 'Camisas',
    image: imageMap.quickCategories.camisas,
    variant: 'camisas',
  },
  {
    id: 'polos',
    title: 'Polos',
    image: imageMap.quickCategories.polos,
    variant: 'polos',
  },
  {
    id: 'jaquetas',
    title: 'Jaquetas',
    image: imageMap.quickCategories.jaquetas,
    variant: 'jaquetas',
  },
  {
    id: 'jeans',
    title: 'Calça Jeans',
    image: imageMap.quickCategories.jeans,
    variant: 'jeans',
  },
  {
    id: 'botas',
    title: 'Botas',
    image: imageMap.quickCategories.botas,
    variant: 'botas',
  },
]

export const products = [
  {
    id: 1,
    name: 'Camisa Terra Worker Xadrez',
    category: 'Masculino',
    subcategory: 'Camisas',
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
    category: 'Masculino',
    subcategory: 'Camisetas',
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
    category: 'Masculino',
    subcategory: 'Jaquetas',
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
    category: 'Masculino',
    subcategory: 'Calça Jeans',
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
    category: 'Calçados',
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
    category: 'Masculino',
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
    category: 'Masculino',
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
    category: 'Acessórios',
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
    name: 'Vestido Linho Aurora',
    category: 'Feminino',
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
    id: 10,
    name: 'Camisa Feminina Serena',
    category: 'Feminino',
    subcategory: 'Camisas',
    price: 219.9,
    oldPrice: 259.9,
    badge: 'Mais vendido',
    colors: ['Branco', 'Azul claro', 'Verde'],
    imageKey: 'camisaSerena',
    image: imageMap.produtos.camisaSerena,
    variant: 'camisaSerena',
  },
  {
    id: 11,
    name: 'Cinto Couro Terra',
    category: 'Acessórios',
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
    id: 12,
    name: 'Mochila Lona Campo',
    category: 'Acessórios',
    subcategory: 'Bolsas',
    price: 349.9,
    oldPrice: 399.9,
    badge: 'Premium',
    colors: ['Oliva', 'Bege'],
    imageKey: 'mochilaCampo',
    image: imageMap.produtos.mochilaCampo,
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
  categorias: [
    { label: 'Masculino', href: '#produtos' },
    { label: 'Feminino', href: '#produtos' },
    { label: 'Calçados', href: '#produtos' },
    { label: 'Acessórios', href: '#produtos' },
  ],
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
