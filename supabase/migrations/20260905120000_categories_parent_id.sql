-- Additive hierarchy for admin categories (principal → subcategoria).
-- Safe for existing rows: parent_id defaults to NULL (categoria raiz).

alter table if exists public.categories
  add column if not exists parent_id uuid null references public.categories (id) on delete set null;

create index if not exists categories_parent_id_idx
  on public.categories (parent_id);

comment on column public.categories.parent_id is
  'Optional parent category for 2-level hierarchy (principal → subcategoria).';
