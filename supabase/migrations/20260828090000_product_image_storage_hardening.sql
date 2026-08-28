-- Product image storage hardening.
-- Product images remain publicly readable; writes stay restricted to admin/owner.
-- AI intake is separate and private because it is temporary operational data.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'ai-intake',
  'ai-intake',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_images_storage_public_read on storage.objects;
create policy product_images_storage_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'product-images'
    and name like 'products/%'
  );

drop policy if exists product_images_storage_admin_insert on storage.objects;
create policy product_images_storage_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and name like 'products/%'
    and public.is_admin_user()
  );

drop policy if exists product_images_storage_admin_update on storage.objects;
create policy product_images_storage_admin_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and name like 'products/%'
    and public.is_admin_user()
  )
  with check (
    bucket_id = 'product-images'
    and name like 'products/%'
    and public.is_admin_user()
  );

drop policy if exists product_images_storage_admin_delete on storage.objects;
create policy product_images_storage_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and name like 'products/%'
    and public.is_admin_user()
  );

drop policy if exists ai_intake_storage_admin_select on storage.objects;
create policy ai_intake_storage_admin_select
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'ai-intake'
    and public.is_admin_user()
  );

drop policy if exists ai_intake_storage_admin_insert on storage.objects;
create policy ai_intake_storage_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'ai-intake'
    and public.is_admin_user()
  );

drop policy if exists ai_intake_storage_admin_delete on storage.objects;
create policy ai_intake_storage_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'ai-intake'
    and public.is_admin_user()
  );

do $$
begin
  alter table public.product_images
    add constraint product_images_position_nonnegative
    check (position >= 0);
exception
  when duplicate_object then null;
end
$$;

create unique index if not exists product_images_one_cover_per_product_idx
  on public.product_images (product_id)
  where is_cover = true;

