export const BRAND_LOGO_SRC = '/images/brand/logo-terraestilo-completa.png'

export const topBarMessages = [
  'Frete grátis acima de R$ 499',
  'Até 12x sem juros',
  'Moda com identidade do Sul do Brasil',
]

export const mainNavigation = [
  { label: 'Coleções', href: '#colecoes' },
  { label: 'Feminino', href: '#produtos', filter: 'Feminino' },
  { label: 'Masculino', href: '#produtos', filter: 'Masculino' },
  { label: 'Calçados', href: '#produtos', filter: 'Calçados' },
  { label: 'Acessórios', href: '#produtos', filter: 'Acessórios' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Lojas', href: '#lojas' },
  { label: 'Contato', href: '#contato' },
]

export const heroContent = {
  badge: 'Nova coleção TerraEstilo',
  title: 'Moda que veste origens',
  subtitle:
    'Peças criadas para traduzir raízes, elegância e autenticidade em cada detalhe.',
  primaryCta: 'Ver coleção',
  secondaryCta: 'Conheça a marca',
}

export const heroVisualCard = {
  title: 'Coleção Raízes do Sul',
  subtitle: 'TerraEstilo',
  badges: ['12x sem juros', 'Frete grátis +R$499'],
}

export const categoryShowcase = [
  {
    id: 'feminino',
    title: 'Feminino',
    description: 'Peças elegantes para todos os momentos.',
    filter: 'Feminino',
    variant: 'vestidoAurora',
  },
  {
    id: 'masculino',
    title: 'Masculino',
    description: 'Estilo, conforto e presença.',
    filter: 'Masculino',
    variant: 'camisaWorker',
  },
  {
    id: 'calcados',
    title: 'Calçados',
    description: 'Design e autenticidade no caminhar.',
    filter: 'Calçados',
    variant: 'botaEstrada',
  },
  {
    id: 'acessorios',
    title: 'Acessórios',
    description: 'Detalhes que completam sua identidade.',
    filter: 'Acessórios',
    variant: 'bolsaCasual',
  },
]

export const featuredCollection = {
  title: 'Coleção Raízes do Sul',
  description:
    'Uma seleção de peças com tons naturais, cortes atemporais e acabamento refinado, inspirada na elegância e autenticidade do Sul do Brasil.',
  primaryCta: 'Comprar agora',
  secondaryCta: 'Ver lookbook',
  variant: 'banner',
}

export const homeFeaturedProducts = [
  {
    id: 101,
    name: 'Camisa Linho Aurora',
    department: 'Feminino',
    collectionId: 'camisas-femininas',
    subcategory: 'Camisas',
    price: 279.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Creme', 'Oliva'],
    imageKey: 'camisaSerena',
    variant: 'camisaSerena',
    stock: 24,
  },
  {
    id: 102,
    name: 'Vestido Serra Verde',
    department: 'Feminino',
    collectionId: 'vestidos',
    subcategory: 'Vestidos',
    price: 349.9,
    oldPrice: 399.9,
    badge: 'Destaque',
    colors: ['Verde', 'Areia'],
    imageKey: 'vestidoAurora',
    variant: 'vestidoAurora',
    stock: 18,
  },
  {
    id: 103,
    name: 'Jaqueta Campo Oliva',
    department: 'Masculino',
    collectionId: 'jaquetas-masculinas',
    subcategory: 'Jaquetas',
    price: 429.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Oliva', 'Marrom'],
    imageKey: 'jaquetaCampo',
    variant: 'jaquetaCampo',
    stock: 20,
  },
  {
    id: 104,
    name: 'Bolsa Raízes',
    department: 'Acessórios',
    collectionId: 'bolsas-acessorios',
    subcategory: 'Bolsas',
    price: 259.9,
    oldPrice: null,
    badge: 'Destaque',
    colors: ['Caramelo', 'Verde'],
    imageKey: 'bolsaCasual',
    variant: 'bolsaCasual',
    stock: 15,
  },
  {
    id: 105,
    name: 'Calça Alfaiataria Sul',
    department: 'Masculino',
    collectionId: 'calca-jeans-masculina',
    subcategory: 'Calças',
    price: 319.9,
    oldPrice: null,
    badge: null,
    colors: ['Areia', 'Verde'],
    imageKey: 'jeansHorizonte',
    variant: 'jeansHorizonte',
    stock: 30,
  },
  {
    id: 106,
    name: 'Blusa Essência Natural',
    department: 'Feminino',
    collectionId: 'camisetas-femininas',
    subcategory: 'Blusas',
    price: 189.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Off-white', 'Oliva'],
    imageKey: 'camisetaFeminina',
    variant: 'camisetaFeminina',
    stock: 36,
  },
  {
    id: 107,
    name: 'Bota Caminho da Serra',
    department: 'Calçados',
    collectionId: 'botas',
    subcategory: 'Botas',
    price: 489.9,
    oldPrice: null,
    badge: 'Destaque',
    colors: ['Marrom', 'Preto'],
    imageKey: 'botaEstrada',
    variant: 'botaEstrada',
    stock: 14,
  },
  {
    id: 108,
    name: 'Lenço Brisa do Sul',
    department: 'Acessórios',
    collectionId: 'acessorios-masculinos',
    subcategory: 'Lenços',
    price: 149.9,
    oldPrice: null,
    badge: 'Novo',
    colors: ['Oliva', 'Areia'],
    imageKey: 'cintoTerra',
    variant: 'cintoTerra',
    stock: 22,
  },
]

export const brandValuesHome = [
  {
    title: 'Raízes',
    description: 'Uma moda inspirada na origem, na terra e na autenticidade regional.',
  },
  {
    title: 'Identidade',
    description: 'Uma linguagem visual própria, reconhecível e fiel ao propósito da marca.',
  },
  {
    title: 'Sofisticação',
    description: 'Elegância natural traduzida em cortes, materiais e acabamentos refinados.',
  },
  {
    title: 'Sul do Brasil',
    description: 'Inspiração regional com olhar contemporâneo e respeito às origens.',
  },
  {
    title: 'Autenticidade',
    description: 'Moda com verdade, personalidade e conexão com quem veste.',
  },
]

export const aboutBrand = {
  title: 'TerraEstilo',
  text:
    'TerraEstilo nasce da união entre elegância, origem e autenticidade. Uma moda que honra suas raízes e traduz o estilo do Sul do Brasil com sofisticação e propósito.',
  cta: 'Conheça nossa história',
}

export const benefitsBar = [
  { id: 'seguro', title: 'Compra segura', description: 'Ambiente protegido para finalizar seus pedidos.' },
  { id: 'troca', title: 'Troca facilitada', description: 'Processo simples e transparente para sua tranquilidade.' },
  { id: 'frete', title: 'Entrega para todo o Brasil', description: 'Receba suas peças com agilidade e rastreamento.' },
  { id: 'atendimento', title: 'Atendimento humanizado', description: 'Suporte próximo antes e depois da compra.' },
  { id: 'parcelamento', title: 'Até 12x sem juros', description: 'Mais facilidade para levar suas favoritas.' },
]

export const newsletterHome = {
  title: 'Receba novidades da TerraEstilo',
  subtitle: 'Coleções, lançamentos e conteúdos especiais sobre moda com identidade.',
  button: 'Cadastrar',
}

export const footerHome = {
  description:
    'TerraEstilo é moda premium com raízes no Sul do Brasil — elegância natural, autenticidade e identidade em cada peça.',
  institucional: [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Coleções', href: '#colecoes' },
    { label: 'Lojas', href: '#lojas' },
    { label: 'Contato', href: '#contato' },
    { label: 'Política de Troca', href: '#trocas' },
    { label: 'Privacidade', href: '#privacidade' },
  ],
  atendimento: {
    whatsapp: '+55 (51) 99999-0000',
    email: 'contato@terraestilo.com.br',
    hours: 'Seg a Sex, 9h às 18h',
  },
  social: ['Instagram', 'Facebook', 'Pinterest'],
  payments: ['Visa', 'Mastercard', 'Pix', 'Boleto', 'Elo'],
}
