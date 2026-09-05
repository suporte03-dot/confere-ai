-- Idempotent seed: principal categories + subcategories for Terra & Estilo nav.
-- Safe to re-run: only inserts missing slugs. Does not delete or rename existing rows.

-- Principais
insert into public.categories (name, slug, description, active, sort_order, parent_id)
select 'Feminino', 'feminino', 'Moda feminina Terra & Estilo', true, 0, null
where not exists (select 1 from public.categories where slug = 'feminino');

insert into public.categories (name, slug, description, active, sort_order, parent_id)
select 'Masculino', 'masculino', 'Moda masculina Terra & Estilo', true, 1, null
where not exists (select 1 from public.categories where slug = 'masculino');

insert into public.categories (name, slug, description, active, sort_order, parent_id)
select 'Acessórios', 'acessorios', 'Acessórios Terra & Estilo', true, 2, null
where not exists (select 1 from public.categories where slug = 'acessorios');

-- Feminino filhos
insert into public.categories (name, slug, active, sort_order, parent_id)
select v.name, v.slug, true, v.sort_order, p.id
from public.categories p
cross join (
  values
    ('Camisetas', 'feminino-camisetas', 0),
    ('Camisas', 'feminino-camisas', 1),
    ('Polos', 'feminino-polos', 2),
    ('Blusa manga longa', 'feminino-blusa-manga-longa', 3),
    ('Coletes', 'feminino-coletes', 4),
    ('Jaquetas', 'feminino-jaquetas', 5),
    ('Moletons', 'feminino-moletons', 6),
    ('Calça jeans', 'feminino-calca-jeans', 7)
) as v(name, slug, sort_order)
where p.slug = 'feminino'
  and p.parent_id is null
  and not exists (select 1 from public.categories c where c.slug = v.slug);

-- Masculino filhos
insert into public.categories (name, slug, active, sort_order, parent_id)
select v.name, v.slug, true, v.sort_order, p.id
from public.categories p
cross join (
  values
    ('Camisetas', 'masculino-camisetas', 0),
    ('Polo', 'masculino-polo', 1),
    ('Camisas', 'masculino-camisas', 2),
    ('Moletons', 'masculino-moletons', 3),
    ('Jaquetas', 'masculino-jaquetas', 4),
    ('Calça jeans', 'masculino-calca-jeans', 5)
) as v(name, slug, sort_order)
where p.slug = 'masculino'
  and p.parent_id is null
  and not exists (select 1 from public.categories c where c.slug = v.slug);

-- Acessórios filhos
insert into public.categories (name, slug, active, sort_order, parent_id)
select v.name, v.slug, true, v.sort_order, p.id
from public.categories p
cross join (
  values
    ('Boné', 'acessorios-bone', 0),
    ('Cintos masculinos', 'acessorios-cintos-masculinos', 1),
    ('Cintos femininos', 'acessorios-cintos-femininos', 2)
) as v(name, slug, sort_order)
where p.slug = 'acessorios'
  and p.parent_id is null
  and not exists (select 1 from public.categories c where c.slug = v.slug);
