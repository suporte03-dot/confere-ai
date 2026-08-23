/**
 * Centralized admin help content for Terra & Estilo.
 * Add a new topic here, then wire HelpButton + optional route — no page-level copy.
 */

/** @typedef {{ question: string, answer: string }} HelpFaqItem */
/** @typedef {{
 *   id: string,
 *   title: string,
 *   menuLabel: string,
 *   href: string,
 *   icon: string,
 *   keywords: string[],
 *   description: string,
 *   actions: string[],
 *   steps: string[],
 *   faq: HelpFaqItem[],
 *   comingSoon?: boolean,
 * }} HelpTopic */

/** @type {Record<string, HelpTopic>} */
export const adminHelp = {
  overview: {
    id: 'overview',
    title: 'Visão Geral',
    menuLabel: 'Visão Geral',
    href: '/admin/ajuda/overview',
    icon: 'overview',
    keywords: [
      'dashboard',
      'painel',
      'indicadores',
      'kpis',
      'atalhos',
      'resumo',
      'visão geral',
    ],
    description:
      'Painel inicial do ADM. Aqui você acompanha o resumo da loja — produtos, estoque, pedidos e atalhos para as principais áreas.',
    actions: [
      'Ver indicadores de produtos publicados',
      'Ver peças que precisam de atenção no estoque',
      'Acompanhar pedidos e vendas confirmadas',
      'Usar atalhos para Produtos, Estoque e outras áreas',
      'Abrir alertas de estoque pelo sino no topo',
    ],
    steps: [
      'Entre no ADM e confira os cards da Visão Geral.',
      'Clique no atalho de um card (seta) para ir direto ao módulo.',
      'Se houver alerta de estoque, use o sino no canto superior direito.',
      'Use o menu lateral para navegar entre módulos.',
    ],
    faq: [
      {
        question: 'Os números não atualizaram?',
        answer:
          'Atualize a página. Os indicadores são carregados a cada acesso. Se o erro continuar, verifique sua conexão e tente novamente.',
      },
      {
        question: 'Onde vejo pedidos com pagamento pendente?',
        answer:
          'No card de pedidos da Visão Geral ou em Pedidos no menu lateral. Lá você filtra e abre cada pedido.',
      },
    ],
  },

  produtos: {
    id: 'produtos',
    title: 'Produtos',
    menuLabel: 'Produtos',
    href: '/admin/ajuda/produtos',
    icon: 'products',
    keywords: [
      'produto',
      'cadastro',
      'preço',
      'imagem',
      'publicar',
      'ativar',
      'variante',
      'sku',
      'descrição',
      'foto',
    ],
    description:
      'Nesta área você cadastra, edita e controla o catálogo da loja: preços, fotos, variantes, estoque por variação e publicação (ativo/inativo).',
    actions: [
      'Cadastrar novos produtos',
      'Editar produtos existentes',
      'Adicionar e organizar imagens',
      'Definir preço e preço comparativo',
      'Criar variantes (tamanho, cor) com estoque',
      'Ativar ou desativar produtos na loja',
      'Marcar destaques',
      'Excluir apenas registros de teste (quando permitido)',
    ],
    steps: [
      'Abra Produtos e clique em “Novo produto”.',
      'Preencha nome, slug, descrição, preço e categoria/coleção.',
      'Adicione fotos e defina a imagem de capa.',
      'Cadastre variantes com tamanho/cor e quantidade em estoque.',
      'Marque o produto como ativo para ele aparecer na loja.',
      'Salve e confira na listagem ou na vitrine pública.',
    ],
    faq: [
      {
        question: 'Por que o produto não aparece na loja?',
        answer:
          'Só produtos ativos entram na vitrine. Confirme se está marcado como ativo e se a categoria também está ativa.',
      },
      {
        question: 'Como alterar o preço?',
        answer:
          'Abra o produto, ajuste o preço (e o preço comparativo, se houver) e salve. O valor na loja e no checkout usa o preço salvo no servidor.',
      },
      {
        question: 'Posso excluir qualquer produto?',
        answer:
          'A exclusão completa costuma ser restrita a registros de teste. Para o catálogo real, prefira desativar o produto.',
      },
    ],
  },

  categorias: {
    id: 'categorias',
    title: 'Categorias',
    menuLabel: 'Categorias',
    href: '/admin/ajuda/categorias',
    icon: 'categories',
    keywords: [
      'categoria',
      'slug',
      'feminino',
      'masculino',
      'acessórios',
      'ordem',
      'organização',
    ],
    description:
      'Categorias organizam o catálogo (ex.: Feminino, Masculino, Acessórios). Elas aparecem no menu da loja e filtram produtos na vitrine.',
    actions: [
      'Criar novas categorias',
      'Editar nome, slug e descrição',
      'Ativar ou desativar categorias',
      'Reordenar com as setas',
      'Vincular produtos a uma categoria no cadastro do produto',
    ],
    steps: [
      'Em Categorias, clique em “Nova categoria”.',
      'Informe o nome; o slug é gerado automaticamente (pode editar).',
      'Defina a ordem e se a categoria fica ativa.',
      'Salve e, nos produtos, selecione a categoria correta.',
      'Use as setas na listagem para reordenar a exibição.',
    ],
    faq: [
      {
        question: 'O slug pode ter acento?',
        answer:
          'Prefira slugs sem acento (ex.: acessorios). Assim as URLs da loja ficam mais estáveis.',
      },
      {
        question: 'Desativei uma categoria — e os produtos?',
        answer:
          'Produtos ligados a categoria inativa deixam de aparecer na loja pública. Reative a categoria ou mova o produto para outra categoria ativa.',
      },
    ],
  },

  colecoes: {
    id: 'colecoes',
    title: 'Coleções',
    menuLabel: 'Coleções',
    href: '/admin/ajuda/colecoes',
    icon: 'collections',
    keywords: [
      'coleção',
      'colecoes',
      'campanha',
      'destaque',
      'curadoria',
      'novidades',
    ],
    description:
      'Coleções agrupam produtos para campanhas e vitrines (ex.: Novidades, Seleção Terra & Estilo), além das categorias principais.',
    actions: [
      'Criar e editar coleções',
      'Marcar coleção como destaque',
      'Ativar ou desativar coleções',
      'Reordenar coleções',
      'Associar produtos a uma coleção no cadastro do produto',
    ],
    steps: [
      'Abra Coleções e clique em “Nova coleção”.',
      'Preencha nome, slug e descrição.',
      'Ative a coleção e, se quiser, marque como destaque.',
      'Nos produtos, escolha a coleção desejada e salve.',
      'Confira a página pública de coleções da loja.',
    ],
    faq: [
      {
        question: 'Qual a diferença entre categoria e coleção?',
        answer:
          'Categoria é a estrutura principal da loja (Feminino, Masculino…). Coleção é curadoria comercial ou sazonal que pode misturar categorias.',
      },
      {
        question: 'A coleção aparece vazia na loja',
        answer:
          'Associe produtos ativos à coleção e confirme que a coleção está ativa.',
      },
    ],
  },

  estoque: {
    id: 'estoque',
    title: 'Estoque',
    menuLabel: 'Estoque',
    href: '/admin/ajuda/estoque',
    icon: 'stock',
    keywords: [
      'estoque',
      'quantidade',
      'variação',
      'esgotado',
      'baixo',
      'crítico',
      'alerta',
      'reposição',
      'reserva',
    ],
    description:
      'Monitore quantidades por variação (tamanho/cor), alertas de estoque baixo/crítico/esgotado e a relação com pedidos e reservas.',
    actions: [
      'Ver peças esgotadas, críticas e com estoque baixo',
      'Ajustar quantidades nas variantes do produto',
      'Acompanhar alertas pelo sino do painel',
      'Entender impacto de pedidos no estoque disponível',
    ],
    steps: [
      'Abra Estoque para ver o resumo e a lista de alertas.',
      'Clique no produto para editar variantes e quantidades.',
      'Salve as alterações no cadastro do produto.',
      'Volte ao monitor ou use o sino para acompanhar o que ainda precisa de atenção.',
    ],
    faq: [
      {
        question: 'Estoque e pedido: como se relacionam?',
        answer:
          'Ao confirmar um pedido, o sistema reserva ou baixa unidades das variantes. Cancelamentos e regras atuais devolvem ou liberam conforme o fluxo já configurado — não altere isso manualmente fora do ADM.',
      },
      {
        question: 'Quando aparece alerta?',
        answer:
          'Quando a quantidade da variação atinge o limite de estoque baixo, crítico ou zero (esgotado), conforme as regras do monitor.',
      },
    ],
  },

  pedidos: {
    id: 'pedidos',
    title: 'Pedidos',
    menuLabel: 'Pedidos',
    href: '/admin/ajuda/pedidos',
    icon: 'orders',
    keywords: [
      'pedido',
      'pix',
      'pagamento',
      'status',
      'cliente',
      'confirmação',
      'envio',
      'entrega',
    ],
    description:
      'Lista e detalha os pedidos da loja: cliente, itens, valores, status e pagamento (incluindo confirmação manual do Pix, quando aplicável).',
    actions: [
      'Visualizar a lista de pedidos',
      'Abrir o detalhe de um pedido',
      'Conferir produtos, quantidades e totais',
      'Ver dados do cliente e status do pagamento',
      'Atualizar status do pedido conforme o fluxo da loja',
      'Confirmar manualmente pagamento Pix quando necessário',
    ],
    steps: [
      'Abra Pedidos no menu.',
      'Localize o pedido na lista (filtre por status, se disponível).',
      'Abra o detalhe para ver itens, valores e pagamento.',
      'Após confirmar o Pix no extrato bancário, use a ação de confirmação no ADM — sem alterar valores manualmente.',
      'Atualize o status (processando, enviado, entregue) conforme a operação.',
    ],
    faq: [
      {
        question: 'O total do pedido parece diferente do carrinho?',
        answer:
          'O valor cobrado é recalculado no servidor com os preços oficiais dos produtos. Isso evita manipulação no navegador.',
      },
      {
        question: 'Como confirmo um Pix?',
        answer:
          'Confira o pagamento na conta da loja e use a confirmação disponível no detalhe do pedido. Não compartilhe chave Pix ou dados sensíveis em tutoriais ou prints públicos.',
      },
    ],
  },

  clientes: {
    id: 'clientes',
    title: 'Clientes',
    menuLabel: 'Clientes',
    href: '/admin/ajuda/clientes',
    icon: 'account',
    keywords: ['cliente', 'comprador', 'histórico', 'contato'],
    comingSoon: true,
    description:
      'Área prevista para consulta de clientes e histórico relacionado à loja. O módulo dedicado ainda não está disponível no menu — os dados de comprador aparecem hoje no detalhe de cada pedido.',
    actions: [
      'Consultar dados do comprador no detalhe do pedido',
      '(Futuro) Listar clientes e histórico de compras',
    ],
    steps: [
      'Enquanto o módulo Clientes não estiver no menu, abra Pedidos.',
      'Entre no pedido desejado para ver nome, contato e endereço informados no checkout.',
      'Quando o módulo for publicado, esta ajuda será atualizada.',
    ],
    faq: [
      {
        question: 'Onde vejo o e-mail do cliente agora?',
        answer:
          'No detalhe do pedido correspondente. Não compartilhe dados pessoais fora do ADM.',
      },
    ],
  },

  configuracoes: {
    id: 'configuracoes',
    title: 'Configurações',
    menuLabel: 'Configurações',
    href: '/admin/ajuda/configuracoes',
    icon: 'settings',
    keywords: [
      'configurações',
      'pix',
      'chave',
      'pagamento',
      'recebedor',
      'cidade',
      'loja',
    ],
    description:
      'Ajustes gerais da loja no ADM. Inclui dados usados para gerar cobranças Pix (tipo de chave, chave, nome do recebedor, cidade e instruções). Não compartilhe chaves ou dados sensíveis fora do ambiente seguro.',
    actions: [
      'Revisar configurações da loja',
      'Informar tipo de chave Pix e chave',
      'Definir nome do recebedor e cidade',
      'Atualizar instruções exibidas no pagamento',
      'Salvar alterações com cuidado',
    ],
    steps: [
      'Abra Configurações no menu.',
      'Localize a seção de pagamento / Pix.',
      'Preencha tipo de chave, chave, nome do recebedor e cidade (conforme os campos do formulário).',
      'Revise as instruções ao cliente, se houver.',
      'Salve e teste um pedido de verificação apenas em ambiente controlado, se necessário.',
    ],
    faq: [
      {
        question: 'A documentação mostra minha chave Pix?',
        answer:
          'Não. Esta ajuda nunca exibe valores reais de chave, tokens ou variáveis de ambiente. Consulte apenas os campos no próprio formulário do ADM.',
      },
      {
        question: 'Alterei a chave — pedidos antigos mudam?',
        answer:
          'Pedidos já gerados mantêm o contexto da época. Novos checkouts usam a configuração salva no momento da compra.',
      },
    ],
  },

  'minha-conta': {
    id: 'minha-conta',
    title: 'Minha Conta',
    menuLabel: 'Minha Conta',
    href: '/admin/ajuda/minha-conta',
    icon: 'account',
    keywords: [
      'conta',
      'senha',
      'perfil',
      'e-mail',
      'acesso',
      'administrador',
      'segurança',
    ],
    description:
      'Dados da sua sessão administrativa: identificação, papel (administrador/proprietário) e alteração de senha, quando disponível.',
    actions: [
      'Ver e-mail e nome da conta logada',
      'Conferir o papel de acesso no ADM',
      'Alterar a senha com segurança',
      'Sair da conta pelo menu do usuário',
    ],
    steps: [
      'Abra Minha Conta no menu lateral.',
      'Confira os dados exibidos da sessão.',
      'Para trocar a senha, preencha o formulário de segurança e confirme.',
      'Use “Sair” no menu do usuário ao terminar o trabalho no ADM.',
    ],
    faq: [
      {
        question: 'Esqueci a senha',
        answer:
          'Na tela de login use “Esqueci minha senha” e siga o e-mail de recuperação. Não compartilhe códigos de redefinição.',
      },
      {
        question: 'Posso criar outros administradores aqui?',
        answer:
          'Minha Conta gerencia o seu acesso. Criação de usuários adicionais depende do fluxo definido pela equipe (não altere permissões fora do processo oficial).',
      },
    ],
  },

  faq: {
    id: 'faq',
    title: 'Perguntas Frequentes',
    menuLabel: 'Perguntas Frequentes',
    href: '/admin/ajuda/faq',
    icon: 'help',
    keywords: [
      'dúvida',
      'faq',
      'ajuda',
      'problema',
      'como',
      'pix',
      'publicar',
      'loja vazia',
    ],
    description:
      'Respostas rápidas às dúvidas mais comuns no uso do painel Terra & Estilo.',
    actions: [
      'Consultar dúvidas gerais do ADM',
      'Ir para a ajuda completa de cada módulo',
    ],
    steps: [
      'Leia as perguntas abaixo.',
      'Se precisar de detalhe, abra o módulo correspondente na central de ajuda.',
      'Use o botão “? Ajuda” em cada tela para orientação contextual.',
    ],
    faq: [
      {
        question: 'A loja está sem produtos na vitrine',
        answer:
          'Cadastre produtos, associe categoria ativa e marque-os como ativos. Produtos inativos ou de teste não aparecem na loja pública.',
      },
      {
        question: 'Onde configuro o Pix?',
        answer:
          'Em Configurações. Preencha os campos do formulário; esta documentação não lista valores reais de chave.',
      },
      {
        question: 'Como publico um produto?',
        answer:
          'Em Produtos, edite o item e ative-o. Salve e confira na categoria correspondente da loja.',
      },
      {
        question: 'Pedido pago no Pix não atualizou',
        answer:
          'Confirme o crédito na conta e use a confirmação manual no detalhe do pedido, se disponível. Em seguida atualize o status operacional.',
      },
      {
        question: 'Não acho um módulo no menu',
        answer:
          'Alguns itens (como Clientes) podem ainda não estar publicados. Use a central de Ajuda e os atalhos da Visão Geral.',
      },
    ],
  },
}

/** Order shown in the help hub hub grid / nav. */
export const ADMIN_HELP_ORDER = [
  'overview',
  'produtos',
  'categorias',
  'colecoes',
  'estoque',
  'pedidos',
  'clientes',
  'configuracoes',
  'minha-conta',
  'faq',
]

/**
 * @param {string} topicId
 * @returns {HelpTopic | null}
 */
export function getHelpTopic(topicId) {
  const key = String(topicId || '')
    .trim()
    .toLowerCase()
  return adminHelp[key] || null
}

/** @returns {HelpTopic[]} */
export function listHelpTopics() {
  return ADMIN_HELP_ORDER.map((id) => adminHelp[id]).filter(Boolean)
}

/**
 * Simple search across title, keywords and short text.
 * @param {string} query
 * @returns {HelpTopic[]}
 */
export function searchHelp(query) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (!q) return listHelpTopics()

  return listHelpTopics().filter((topic) => {
    const hay = [
      topic.title,
      topic.description,
      ...(topic.keywords || []),
      ...(topic.actions || []),
      ...(topic.steps || []),
      ...(topic.faq || []).flatMap((f) => [f.question, f.answer]),
    ]
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    return hay.includes(q)
  })
}

/** localStorage key for first-visit tip per topic */
export function helpSeenStorageKey(topicId) {
  return `terra-estilo-help-seen-${topicId}`
}
