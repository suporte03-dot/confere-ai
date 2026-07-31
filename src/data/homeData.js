import { assetUrl } from '../utils/assetUrl'
import coupleHeroAsset from '../assets/personagens-terra-estilo.webp'
import brandLogoCircular from '../assets/logo-terra-estilo.png'

export const BRAND_LOGO_CIRCULAR_SRC = brandLogoCircular
export const BRAND_LOGO_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_LOGO_HEADER_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_HERO_BOARD_SRC = BRAND_LOGO_CIRCULAR_SRC
export const BRAND_LOGO_WIDTH = 1024
export const BRAND_LOGO_HEIGHT = 1024
export const BRAND_MARBLE_SRC = assetUrl('/images/brand/marble-texture.svg')
/** Swap-ready cast photo — sourced from hero-terra-estilo-cast.png → personagens-terra-estilo.webp. */
export const COUPLE_HERO_SRC = coupleHeroAsset

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
  { label: 'Novidades', href: '#novidades' },
  { label: 'Coleções', href: '#colecoes', hasChevron: true },
  { label: 'Feminino', href: '#mais-vendidos', filter: 'Feminino' },
  { label: 'Masculino', href: '#mais-vendidos', filter: 'Masculino' },
  { label: 'Calçados', href: '#mais-vendidos', filter: 'Calçados' },
  { label: 'Acessórios', href: '#mais-vendidos', filter: 'Acessórios' },
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

/** Editorial category banners — Feminino, Masculino, Calçados, Acessórios */
export const categoryCards = [
  {
    id: 'cat-feminino',
    title: 'Feminino',
    subtitle: 'Silhuetas leves e elegância contemporânea',
    filter: 'Feminino',
    image: assetUrl('/images/categorias/camisas.jpg'),
    objectPosition: 'center 28%',
  },
  {
    id: 'cat-masculino',
    title: 'Masculino',
    subtitle: 'Cortes firmes para campo e cidade',
    filter: 'Masculino',
    image: assetUrl('/images/categorias/jaquetas-masculinas.jpg'),
    objectPosition: 'center 22%',
  },
  {
    id: 'cat-calcados',
    title: 'Calçados',
    subtitle: 'Botas, coturnos e tênis com presença',
    filter: 'Calçados',
    image: assetUrl('/images/categorias/calca-jeans-masculinas.jpg'),
    objectPosition: 'center 70%',
  },
  {
    id: 'cat-acessorios',
    title: 'Acessórios',
    subtitle: 'Detalhes que fecham o look',
    filter: 'Acessórios',
    image: assetUrl('/images/categorias/acessorios.jpg'),
    objectPosition: 'center 40%',
  },
]

export const featuredCollection = {
  eyebrow: 'Campanha em destaque',
  title: 'Coleção Raízes do Sul',
  description:
    'Uma seleção premium de peças com tons naturais, cortes atemporais e acabamento refinado, inspirada na elegância e autenticidade do Sul do Brasil.',
  primaryCta: 'Comprar coleção',
  secondaryCta: 'Ver lookbook',
  image: COUPLE_HERO_SRC,
  imageAlt:
    'Detalhes de camisas e bordados da Coleção Raízes do Sul — campanha Terra & Estilo.',
  marble: BRAND_MARBLE_SRC,
  logo: BRAND_LOGO_CIRCULAR_SRC,
  variant: 'banner',
  primaryHref: '#mais-vendidos',
  secondaryHref: '#lookbook',
}

export const lookbookHome = {
  eyebrow: 'Vista o estilo',
  title: 'Lookbook',
  description:
    'Composições que traduzem a identidade Terra & Estilo — do campo à cidade, com presença e sofisticação.',
  primaryImage: assetUrl('/images/hero/slide-1.jpg'),
  collage: [
    { src: assetUrl('/images/categorias/camisas.jpg'), alt: 'Camisas Terra & Estilo', productId: 12 },
    { src: assetUrl('/images/categorias/jaquetas-masculinas.jpg'), alt: 'Jaquetas Terra & Estilo', productId: 5 },
    { src: assetUrl('/images/categorias/acessorios.jpg'), alt: 'Acessórios Terra & Estilo', productId: 16 },
    { src: assetUrl('/images/categorias/polos.jpg'), alt: 'Polos Terra & Estilo', productId: 4 },
  ],
  hotspots: [
    { id: 'hs-1', productId: 12, label: 'Camisa Serena', x: 32, y: 48 },
    { id: 'hs-2', productId: 5, label: 'Jaqueta Estância', x: 68, y: 38 },
  ],
}

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
    { src: assetUrl('/images/categorias/acessorios.jpg'), alt: 'Detalhe bolsa' },
  ],
}

export const bestsellersTabs = ['Todos', 'Feminino', 'Masculino', 'Acessórios']

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

export const benefitsBar = [
  { id: 'seguro', title: 'Compra segura', description: 'Ambiente protegido para finalizar seus pedidos.', icon: 'shield' },
  { id: 'troca', title: 'Troca facilitada', description: 'Processo simples e transparente para sua tranquilidade.', icon: 'swap' },
  { id: 'frete', title: 'Entrega para todo o Brasil', description: 'Receba suas peças com agilidade e rastreamento.', icon: 'truck' },
  { id: 'atendimento', title: 'Atendimento humanizado', description: 'Suporte próximo antes e depois da compra.', icon: 'heart' },
  { id: 'parcelamento', title: 'Até 12x sem juros', description: 'Mais facilidade para levar suas favoritas.', icon: 'card' },
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
