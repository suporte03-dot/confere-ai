-- Seed de teste (somente ambiente local / staging). NÃO rodar em produção com dados reais.
-- Prefixo TESTE - para identificação e limpeza segura.

insert into public.categories (name, slug, description, active, sort_order)
select 'TESTE - Categoria', 'teste-categoria', 'Categoria de teste', true, 999
where not exists (select 1 from public.categories where slug = 'teste-categoria');

insert into public.collections (name, slug, description, active, featured, sort_order)
select 'TESTE - Coleção', 'teste-colecao', 'Coleção de teste', true, false, 999
where not exists (select 1 from public.collections where slug = 'teste-colecao');

insert into public.products (
  name, slug, description, price, active, featured, category_id, collection_id
)
select
  'TESTE - Produto Camiseta',
  'teste-produto-camiseta',
  'Produto de teste para fluxo de pedido',
  99.90,
  false,
  false,
  (select id from public.categories where slug = 'teste-categoria' limit 1),
  (select id from public.collections where slug = 'teste-colecao' limit 1)
where not exists (select 1 from public.products where slug = 'teste-produto-camiseta');

insert into public.product_variants (product_id, size, color, stock, sku, active)
select p.id, 'M', 'Preto', 5, 'TESTE-CAM-M', true
from public.products p
where p.slug = 'teste-produto-camiseta'
  and not exists (
    select 1 from public.product_variants pv
    where pv.product_id = p.id and pv.size = 'M' and coalesce(pv.color, '') = 'Preto'
  );

update public.store_settings
set
  pix_key_type = coalesce(nullif(pix_key_type, ''), 'email'),
  pix_key = coalesce(nullif(pix_key, ''), 'teste@terraeestilo.local'),
  pix_receiver_name = coalesce(nullif(pix_receiver_name, ''), 'Terra e Estilo'),
  pix_city = coalesce(nullif(pix_city, ''), 'Sao Paulo'),
  pix_instructions = coalesce(
    nullif(pix_instructions, ''),
    'Pagamento de teste — confirme manualmente no ADM.'
  ),
  reservation_minutes = coalesce(reservation_minutes, 60),
  low_stock_threshold = coalesce(low_stock_threshold, 5),
  updated_at = now()
where id = 1;
