import { assetUrl } from '../utils/assetUrl'
import coupleHeroAsset from '../assets/hero-terra-estilo-novo.png'
import brandLogoCircular from '../assets/logo-terra-estilo.png'

export const BRAND_LOGO_CIRCULAR_SRC = brandLogoCircular
export const BRAND_LOGO_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_LOGO_HEADER_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_HERO_BOARD_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_LOGO_WIDTH = 1024
export const BRAND_LOGO_HEIGHT = 1024
export const BRAND_MARBLE_SRC = assetUrl('/images/brand/marble-texture.svg')
/** Cast photo cropped from terra-estilo-novo-hero mockup (left panel only). */
export const COUPLE_HERO_SRC = coupleHeroAsset
export const COUPLE_HERO_WIDTH = 504
export const COUPLE_HERO_HEIGHT = 623

export const headerBrandPillars = [
  'Raízes',
  'Identidade',
  'Sofisticação',
  'Sul do Brasil',
  'Autenticidade',
]

export const mainNavigation = [
  { label: 'Feminino', to: '/feminino' },
  { label: 'Masculino', to: '/masculino' },
  { label: 'Acessórios', to: '/acessorios' },
  { label: 'Coleções', to: '/colecoes', hasDropdown: true, hasChevron: true },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
]

/** Mega menu Coleções — rotas existentes do catálogo / âncoras da home */
export const collectionsMegaMenu = [
  { label: 'Raízes do Sul', to: '/colecoes/raizes-do-sul' },
  { label: 'Clássicos Terra & Estilo', to: '/colecoes/classicos-terra-estilo' },
  { label: 'Novidades', to: '/#novidades' },
  { label: 'Mais vendidos', to: '/#mais-vendidos' },
  { label: 'Ver todas', to: '/colecoes', isAll: true },
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
  titleLead: 'A essência e a elegância do',
  titleLines: ['A essência e a', 'elegância do'],
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
    imagem: assetUrl('/images/categorias/bones.jpg'),
  },
]

/** @deprecated use categorias */
export const categoryShowcase = categorias

/** Full category catalog (kept for data integrity). */
export const categoryCardsAll = [
  {
    id: 'cat-feminino',
    title: 'Feminino',
    subtitle: 'Silhuetas leves e elegância contemporânea',
    filter: 'Feminino',
    to: '/feminino',
    image: assetUrl('/images/categorias/camisas.jpg'),
    objectPosition: 'center 28%',
  },
  {
    id: 'cat-masculino',
    title: 'Masculino',
    subtitle: 'Cortes firmes para campo e cidade',
    filter: 'Masculino',
    to: '/masculino',
    image: assetUrl('/images/categorias/jaquetas-masculinas.jpg'),
    objectPosition: 'center 22%',
  },
  {
    id: 'cat-acessorios',
    title: 'Acessórios',
    subtitle: 'Detalhes que fecham o look',
    filter: 'Acessórios',
    to: '/acessorios',
    image: assetUrl('/images/categorias/bones.jpg'),
    objectPosition: 'center 28%',
  },
]

/** Homepage showcase — Feminino, Masculino, Acessórios */
export const categoryCards = categoryCardsAll

export const featuredCollection = {
  eyebrow: 'Campanha em destaque',
  title: 'Coleção Raízes do Sul',
  description:
    'Uma seleção premium de peças com tons naturais, cortes atemporais e acabamento refinado, inspirada na elegância e autenticidade do Sul do Brasil.',
  primaryCta: 'Comprar coleção',
  image: assetUrl('/images/hero/slide-2.jpg'),
  imageAlt:
    'Detalhes de camisas e bordados da Coleção Raízes do Sul — campanha Terra & Estilo.',
  marble: BRAND_MARBLE_SRC,
  logo: BRAND_LOGO_CIRCULAR_SRC,
  variant: 'banner',
  primaryHref: '/colecoes/raizes-do-sul',
}

export const benefitsBar = [
  { id: 'seguro', title: 'Compra segura', description: 'Ambiente protegido para finalizar seus pedidos.', icon: 'shield' },
  { id: 'troca', title: 'Troca facilitada', description: 'Processo simples e transparente para sua tranquilidade.', icon: 'swap' },
  { id: 'frete', title: 'Entrega para todo o Brasil', description: 'Receba suas peças com agilidade e rastreamento.', icon: 'truck' },
  { id: 'atendimento', title: 'Atendimento humanizado', description: 'Suporte próximo antes e depois da compra.', icon: 'heart' },
  { id: 'parcelamento', title: 'Até 12x sem juros', description: 'Mais facilidade para levar suas favoritas.', icon: 'card' },
]

export const instagramHome = {
  eyebrow: 'No feed',
  title: 'Terra & Estilo no Instagram',
  handle: '@Terra_Estilo',
  href: 'https://instagram.com/Terra_Estilo',
  images: [
    { src: assetUrl('/images/categorias/camisas.jpg'), alt: 'Look camisas' },
    { src: assetUrl('/images/categorias/jaquetas-masculinas.jpg'), alt: 'Look jaquetas' },
    { src: assetUrl('/images/categorias/polos.jpg'), alt: 'Look polos' },
    { src: assetUrl('/images/categorias/moletons-masculinos.jpg'), alt: 'Look moletons' },
    { src: assetUrl('/images/categorias/bones.jpg'), alt: 'Look acessórios' },
    { src: assetUrl('/images/hero/slide-4.jpg'), alt: 'Look editorial' },
  ],
}

export const bestsellersTabs = ['Todos', 'Feminino', 'Masculino', 'Acessórios']

export const bestsellersSection = {
  eyebrow: 'Coleção em evidência',
  title: 'Mais vendidos',
  description:
    'Cortes atemporais, acabamento refinado e a elegância do agro brasileiro — uma vitrine de peças para vestir com presença.',
  searchTitle: 'Resultados da busca',
  tabsLabel: 'Filtrar seleção',
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
    name: 'Boné Raízes Bordado',
    department: 'Acessórios',
    collectionId: 'bones',
    subcategory: 'Bonés',
    price: 89.9,
    oldPrice: null,
    badge: 'Destaque',
    colors: ['Verde', 'Bege', 'Preto'],
    imageKey: 'boneBordado',
    variant: 'boneBordado',
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
    icon: 'raizes',
  },
  {
    title: 'Identidade',
    description: 'Uma linguagem visual própria, reconhecível e fiel ao propósito da marca.',
    icon: 'identidade',
  },
  {
    title: 'Sofisticação',
    description: 'Elegância natural traduzida em cortes, materiais e acabamentos refinados.',
    icon: 'sofisticacao',
  },
  {
    title: 'Sul do Brasil',
    description: 'Inspiração regional com olhar contemporâneo e respeito às origens.',
    icon: 'sul',
  },
  {
    title: 'Autenticidade',
    description: 'Moda com verdade, personalidade e conexão com quem veste.',
    icon: 'autenticidade',
  },
]

export const aboutBrand = {
  eyebrow: 'Nossa essência',
  title: 'Terra & Estilo',
  text:
    'Terra & Estilo nasce da união entre elegância, origem e autenticidade. A marca do agro brasileiro — moda que honra suas raízes e traduz o estilo do campo com sofisticação e propósito.',
  cta: 'Conheça nossa história',
}

export const newsletterHome = {
  title: 'Receba novidades da Terra & Estilo',
  subtitle: 'Coleções, lançamentos e conteúdos especiais sobre moda com identidade.',
  button: 'Cadastrar',
}

export const footerHome = {
  description:
    'Terra & Estilo é a marca do agro brasileiro — elegância, autenticidade e identidade em cada peça.',
  institucional: [
    { label: 'Sobre', to: '/sobre' },
    { label: 'Coleções', to: '/colecoes' },
    { label: 'Lojas', to: '/lojas' },
    { label: 'Contato', to: '/contato' },
    { label: 'Política de Troca', to: '/contato' },
    { label: 'Privacidade', to: '/contato' },
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
