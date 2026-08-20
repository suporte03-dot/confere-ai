-- Harden public catalog reads (additive). Safe if policies already exist with same names.

-- Ensure RLS on core catalog tables
alter table if exists public.products enable row level security;
alter table if exists public.product_variants enable row level security;
alter table if exists public.product_images enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.collections enable row level security;
alter table if exists public.profiles enable row level security;

-- Public read: only active products
drop policy if exists products_public_read_active on public.products;
create policy products_public_read_active
  on public.products
  for select
  to anon, authenticated
  using (active = true);

drop policy if exists products_admin_all on public.products;
create policy products_admin_all
  on public.products
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Variants of active products (or admin)
drop policy if exists product_variants_public_read on public.product_variants;
create policy product_variants_public_read
  on public.product_variants
  for select
  to anon, authenticated
  using (
    coalesce(active, true) = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.active = true
    )
  );

drop policy if exists product_variants_admin_all on public.product_variants;
create policy product_variants_admin_all
  on public.product_variants
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists product_images_public_read on public.product_images;
create policy product_images_public_read
  on public.product_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.active = true
    )
  );

drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all
  on public.product_images
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
  on public.categories
  for select
  to anon, authenticated
  using (active = true);

drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all
  on public.categories
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists collections_public_read on public.collections;
create policy collections_public_read
  on public.collections
  for select
  to anon, authenticated
  using (active = true);

drop policy if exists collections_admin_all on public.collections;
create policy collections_admin_all
  on public.collections
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Profiles: user reads own; admin reads all; nobody self-elevates role via client
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin_user());

drop policy if exists profiles_update_own_safe on public.profiles;
create policy profiles_update_own_safe
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update
  on public.profiles
  for update
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Storage policies for product-images (public read, admin write)
-- Bucket should already exist; policies are additive.
drop policy if exists product_images_storage_public_read on storage.objects;
create policy product_images_storage_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists product_images_storage_admin_insert on storage.objects;
create policy product_images_storage_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin_user());

drop policy if exists product_images_storage_admin_update on storage.objects;
create policy product_images_storage_admin_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin_user())
  with check (bucket_id = 'product-images' and public.is_admin_user());

drop policy if exists product_images_storage_admin_delete on storage.objects;
create policy product_images_storage_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin_user());
