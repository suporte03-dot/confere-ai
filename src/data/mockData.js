export const topBenefits = [
  'Frete grátis acima de R$499',
  'Até 12x sem juros',
  'Primeira compra com 10% OFF',
]

export const navCategories = [
  { label: 'Masculino', href: '#produtos', filter: 'Masculino' },
  { label: 'Feminino', href: '#produtos', filter: 'Feminino' },
  { label: 'Infantil', href: '#produtos', filter: 'Infantil' },
  { label: 'Calçados', href: '#produtos', filter: 'Calçados' },
  { label: 'Acessórios', href: '#produtos', filter: 'Acessórios' },
  { label: 'Outlet', href: '#produtos', filter: 'Outlet' },
]

export const categoryCards = [
  { id: 'camisetas', title: 'Camisetas', gradient: 'linear-gradient(135deg, #556B2F 0%, #1F4D2B 100%)' },
  { id: 'camisas', title: 'Camisas', gradient: 'linear-gradient(135deg, #7A4A28 0%, #C8923E 100%)' },
  { id: 'polos', title: 'Polos', gradient: 'linear-gradient(135deg, #1F4D2B 0%, #556B2F 100%)' },
  { id: 'jaquetas', title: 'Jaquetas', gradient: 'linear-gradient(135deg, #1E1E1E 0%, #556B2F 100%)' },
  { id: 'jeans', title: 'Calça Jeans', gradient: 'linear-gradient(135deg, #334155 0%, #64748B 100%)' },
  { id: 'bermudas', title: 'Bermudas', gradient: 'linear-gradient(135deg, #C8923E 0%, #F5EFE3 100%)' },
  { id: 'botas', title: 'Botas', gradient: 'linear-gradient(135deg, #7A4A28 0%, #1E1E1E 100%)' },
  { id: 'bones', title: 'Bonés', gradient: 'linear-gradient(135deg, #556B2F 0%, #C8923E 100%)' },
  { id: 'acessorios', title: 'Acessórios', gradient: 'linear-gradient(135deg, #F5EFE3 0%, #C8923E 100%)' },
]

export const products = [
  {
    id: 'tb-001',
    name: 'Camisa Terra Worker Xadrez',
    category: 'Masculino',
    segment: 'Camisas',
    price: 249.9,
    badge: 'Mais vendido',
    colors: ['#7A4A28', '#1F4D2B', '#556B2F'],
    gradient: 'linear-gradient(160deg, #7A4A28 0%, #C8923E 45%, #1F4D2B 100%)',
  },
  {
    id: 'tb-002',
    name: 'Camiseta Essencial TerraBrasil',
    category: 'Masculino',
    segment: 'Camisetas',
    price: 179.9,
    badge: 'Novo',
    colors: ['#1F4D2B', '#FAF7F0', '#1E1E1E'],
    gradient: 'linear-gradient(160deg, #1F4D2B 0%, #556B2F 60%, #FAF7F0 100%)',
  },
  {
    id: 'tb-003',
    name: 'Jaqueta Campo Premium',
    category: 'Masculino',
    segment: 'Jaquetas',
    price: 499.9,
    badge: 'Novo',
    colors: ['#556B2F', '#1E1E1E'],
    gradient: 'linear-gradient(160deg, #1E1E1E 0%, #556B2F 50%, #7A4A28 100%)',
  },
  {
    id: 'tb-004',
    name: 'Calça Jeans Reta Horizonte',
    category: 'Feminino',
    segment: 'Calça Jeans',
    price: 299.9,
    badge: null,
    colors: ['#334155', '#64748B'],
    gradient: 'linear-gradient(160deg, #475569 0%, #94A3B8 50%, #334155 100%)',
  },
  {
    id: 'tb-005',
    name: 'Bota Couro Estrada',
    category: 'Calçados',
    segment: 'Botas',
    price: 399.9,
    badge: 'Mais vendido',
    colors: ['#7A4A28', '#1E1E1E'],
    gradient: 'linear-gradient(160deg, #7A4A28 0%, #1E1E1E 100%)',
  },
  {
    id: 'tb-006',
    name: 'Polo Piquet Verde Oliva',
    category: 'Masculino',
    segment: 'Polos',
    price: 219.9,
    badge: null,
    colors: ['#556B2F', '#FAF7F0'],
    gradient: 'linear-gradient(160deg, #556B2F 0%, #1F4D2B 100%)',
  },
  {
    id: 'tb-007',
    name: 'Bermuda Sarja Casual',
    category: 'Masculino',
    segment: 'Bermudas',
    price: 189.9,
    badge: null,
    colors: ['#C8923E', '#7A4A28'],
    gradient: 'linear-gradient(160deg, #C8923E 0%, #F5EFE3 100%)',
  },
  {
    id: 'tb-008',
    name: 'Boné TerraBrasil Bordado',
    category: 'Acessórios',
    segment: 'Bonés',
    price: 129.9,
    badge: 'Outlet',
    colors: ['#1F4D2B', '#C8923E'],
    gradient: 'linear-gradient(160deg, #1F4D2B 0%, #C8923E 100%)',
  },
]

export const storeBenefits = [
  { title: 'Frete grátis acima de R$499', desc: 'Entrega premium para todo o Brasil em compras qualificadas.' },
  { title: 'Até 12x sem juros', desc: 'Parcele com tranquilidade nos cartões participantes.' },
  { title: 'Troca descomplicada', desc: 'Processo simples e transparente em até 30 dias.' },
  { title: 'Atendimento dedicado', desc: 'Suporte antes e depois da compra, do seu jeito.' },
  { title: 'Compra segura', desc: 'Ambiente protegido e pagamento confiável.' },
  { title: 'Produtos selecionados', desc: 'Curadoria TerraBrasil com foco em qualidade e estilo.' },
]

export const filterOptions = ['Todos', 'Masculino', 'Feminino', 'Infantil', 'Calçados', 'Acessórios', 'Outlet']

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

export function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatInstallments(price, times = 10) {
  const installment = price / times
  return `ou ${times}x de ${formatPrice(installment)} sem juros`
}
