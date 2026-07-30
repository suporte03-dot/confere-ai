import { assetUrl } from '../utils/assetUrl'

export const BRAND_LOGO_CIRCULAR_SRC = assetUrl('/images/brand/terra-e-estilo-logo.png')
export const BRAND_LOGO_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_LOGO_HEADER_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_HERO_BOARD_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_LOGO_WIDTH = 1024
export const BRAND_LOGO_HEIGHT = 1024

export const topBarMessages = [
  {
    id: 'frete',
    icon: 'truck',
    text: 'Frete grátis acima de R$ 299,00 para Sul e Sudeste',
  },
  {
    id: 'cupom',
    icon: 'tag',
    text: '10% OFF na primeira compra | Cupom: PRIMEIRA10',
  },
  {
    id: 'atendimento',
    icon: 'phone',
    text: 'Atendimento (54) 99939-8038',
    href: 'https://wa.me/5554999398038',
  },
]

export const headerBrandPillars = [
  'Raízes',
  'Identidade',
  'Sofisticação',
  'Sul do Brasil',
  'Autenticidade',
]

export const mainNavigation = [
  { label: 'Coleções', href: '#colecoes', hasChevron: true },
  { label: 'Feminino', href: '#produtos', filter: 'Feminino' },
  { label: 'Masculino', href: '#produtos', filter: 'Masculino' },
  { label: 'Calçados', href: '#produtos', filter: 'Calçados' },
  { label: 'Acessórios', href: '#produtos', filter: 'Acessórios' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Lojas', href: '#lojas' },
  { label: 'Contato', href: '#contato' },
]

export const heroBrandPillars = [
  'Raízes',
  'Identidade',
  'Sofisticação',
  'Sul do Brasil',
  'Autenticidade',
]

export const heroContent = {
  label: 'Terra & Estilo',
  titleLead: 'A essência e a elegância do ',
  titleAccent: 'agro brasileiro',
  title: 'A essência e a elegância do agro brasileiro',
  slogan: 'A marca do agro brasileiro',
  support:
    'Cada detalhe carrega a força do campo e o cuidado de quem vive essa história. Roupas que traduzem dedicação, autenticidade e orgulho de ser do agro. Terra & Estilo é o encontro entre tradição, qualidade e estilo que inspiram gerações.',
  supportParagraphs: [
    'Cada detalhe carrega a força do campo e o cuidado de quem vive essa história.',
    'Roupas que traduzem dedicação, autenticidade e orgulho de ser do agro.',
    'Terra & Estilo é o encontro entre tradição, qualidade e estilo que inspiram gerações.',
  ],
  primaryCta: 'Conheça a coleção',
  secondaryCta: 'Fale conosco',
  imageAlt:
    'Casal Terra & Estilo em camisas pretas e chapéus country — foto da campanha sem overlays de texto.',
  boardAlt:
    'Terra & Estilo — A marca do agro brasileiro. Logo circular oficial em ouro sobre preto.',
}

export const heroVisualCard = {
  title: 'Coleção Agro Chic',
  subtitle: 'Terra & Estilo',
  badges: ['12x sem juros', 'Frete grátis +R$499'],
}

export const categorias = [
  {
    nome: 'Calças Jeans Masculinas',
    url: 'https://txc.com.br/collections/calca-jeans-masculinas',
    imagem: assetUrl('/images/categorias/calca-jeans-masculinas.jpg'),
  },
  {
    nome: 'Camisas',
    url: 'https://txc.com.br/collections/camisas-ate-50',
    imagem: assetUrl('/images/categorias/camisas.jpg'),
  },
  {
    nome: 'Jaquetas Masculinas',
    url: 'https://txc.com.br/collections/jaquetas-masculinas',
    imagem: assetUrl('/images/categorias/jaquetas-masculinas.jpg'),
  },
  {
    nome: 'Camisetas Masculinas',
    url: 'https://txc.com.br/collections/camisetas-masculinas',
    imagem: assetUrl('/images/categorias/camisetas-masculinas.jpg'),
  },
  {
    nome: 'Polos',
    url: 'https://txc.com.br/collections/polos',
    imagem: assetUrl('/images/categorias/polos.jpg'),
  },
  {
    nome: 'Bonés',
    url: 'https://txc.com.br/collections/bones',
    imagem: assetUrl('/images/categorias/bones.jpg'),
  },
  {
    nome: 'Moletons Masculinos',
    url: 'https://txc.com.br/collections/moletons-masculino',
    imagem: assetUrl('/images/categorias/moletons-masculinos.jpg'),
  },
  {
    nome: 'Acessórios',
    url: 'https://txc.com.br/collections/acessorios',
    imagem: assetUrl('/images/categorias/acessorios.jpg'),
  },
]

/** @deprecated use categorias */
export const categoryShowcase = categorias

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
  title: 'Terra & Estilo',
  text:
    'Terra & Estilo nasce da união entre elegância, origem e autenticidade. A marca do agro brasileiro — moda que honra suas raízes e traduz o estilo do campo com sofisticação e propósito.',
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
  title: 'Receba novidades da Terra & Estilo',
  subtitle: 'Coleções, lançamentos e conteúdos especiais sobre moda com identidade.',
  button: 'Cadastrar',
}

export const footerHome = {
  description:
    'Terra & Estilo é a marca do agro brasileiro — elegância, autenticidade e identidade em cada peça.',
  institucional: [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Coleções', href: '#colecoes' },
    { label: 'Lojas', href: '#lojas' },
    { label: 'Contato', href: '#contato' },
    { label: 'Política de Troca', href: '#trocas' },
    { label: 'Privacidade', href: '#privacidade' },
  ],
  atendimento: {
    whatsapp: '(54) 99939-8038',
    whatsappHref: 'https://wa.me/5554999398038',
    instagram: '@Terra_Estilo',
    instagramHref: 'https://instagram.com/Terra_Estilo',
    email: 'contato@terraestilo.com.br',
    hours: 'Seg a Sex, 9h às 18h',
  },
  social: ['Instagram', 'WhatsApp'],
  payments: ['Visa', 'Mastercard', 'Pix', 'Boleto', 'Elo'],
}
