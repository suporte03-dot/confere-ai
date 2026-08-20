-- Terra & Estilo — orders, store settings, stock reservations, RLS + RPCs
-- Additive migration. Does not drop existing catalog tables.

-- ---------------------------------------------------------------------------
-- Helpers: admin check (profiles.role)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'owner')
  );
$$;

revoke all on function public.is_admin_user() from public;
grant execute on function public.is_admin_user() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Store settings (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  pix_key_type text,
  pix_key text,
  pix_receiver_name text,
  pix_city text,
  pix_instructions text,
  payment_link_url text,
  whatsapp text,
  commercial_email text,
  reservation_minutes integer not null default 60
    check (reservation_minutes >= 15 and reservation_minutes <= 10080),
  low_stock_threshold integer not null default 5
    check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.store_settings enable row level security;

drop policy if exists store_settings_public_read on public.store_settings;
create policy store_settings_public_read
  on public.store_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists store_settings_admin_write on public.store_settings;
create policy store_settings_admin_write
  on public.store_settings
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  public_token uuid not null unique default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_cpf text,
  address_street text,
  address_number text,
  address_complement text,
  address_district text,
  address_city text,
  address_state text,
  address_cep text,
  notes text,
  order_status text not null default 'pending_payment'
    check (order_status in (
      'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'expired'
    )),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'cancelled', 'expired', 'refunded')),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  total numeric(12,2) not null check (total >= 0),
  reserved_until timestamptz,
  paid_at timestamptz,
  paid_by uuid references auth.users (id),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_order_status_idx on public.orders (order_status);
create index if not exists orders_payment_status_idx on public.orders (payment_status);
create index if not exists orders_customer_email_idx on public.orders (customer_email);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  variant_label text,
  sku text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  from_order_status text,
  to_order_status text,
  from_payment_status text,
  to_payment_status text,
  changed_by uuid references auth.users (id),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists order_status_history_order_id_idx
  on public.order_status_history (order_id, created_at desc);

create table if not exists public.stock_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id),
  quantity integer not null check (quantity > 0),
  reserved_until timestamptz not null,
  released_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists stock_reservations_variant_active_idx
  on public.stock_reservations (variant_id)
  where released_at is null and converted_at is null;

create index if not exists stock_reservations_order_id_idx
  on public.stock_reservations (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.stock_reservations enable row level security;

-- Guests: no direct table access. Use RPCs + public_token lookups.
drop policy if exists orders_admin_all on public.orders;
create policy orders_admin_all
  on public.orders
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists order_items_admin_all on public.order_items;
create policy order_items_admin_all
  on public.order_items
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists order_status_history_admin_all on public.order_status_history;
create policy order_status_history_admin_all
  on public.order_status_history
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists stock_reservations_admin_all on public.stock_reservations;
create policy stock_reservations_admin_all
  on public.stock_reservations
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- ---------------------------------------------------------------------------
-- Available stock (physical - active reservations)
-- ---------------------------------------------------------------------------
create or replace function public.variant_reserved_qty(p_variant_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(sr.quantity), 0)::integer
  from public.stock_reservations sr
  where sr.variant_id = p_variant_id
    and sr.released_at is null
    and sr.converted_at is null
    and sr.reserved_until > now();
$$;

create or replace function public.variant_available_stock(p_variant_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select greatest(
    coalesce((select pv.stock from public.product_variants pv where pv.id = p_variant_id), 0)
      - public.variant_reserved_qty(p_variant_id),
    0
  )::integer;
$$;

revoke all on function public.variant_reserved_qty(uuid) from public;
revoke all on function public.variant_available_stock(uuid) from public;
grant execute on function public.variant_reserved_qty(uuid) to anon, authenticated;
grant execute on function public.variant_available_stock(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Order number helper
-- ---------------------------------------------------------------------------
create or replace function public.generate_order_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate text;
  n integer;
begin
  for n in 1..20 loop
    candidate := 'TE-'
      || to_char(now() at time zone 'America/Sao_Paulo', 'YYYYMMDD')
      || '-'
      || lpad((floor(random() * 10000))::int::text, 4, '0');
    if not exists (select 1 from public.orders o where o.order_number = candidate) then
      return candidate;
    end if;
  end loop;
  return 'TE-' || replace(gen_random_uuid()::text, '-', '');
end;
$$;

-- ---------------------------------------------------------------------------
-- Place guest order (server recalculates prices; reserves stock)
-- payload:
-- {
--   customer: {...},
--   address: {...},
--   notes: "...",
--   items: [{ "variant_id": "...", "quantity": 1 }]
-- }
-- ---------------------------------------------------------------------------
create or replace function public.place_guest_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_variant_id uuid;
  v_qty integer;
  v_available integer;
  v_unit numeric(12,2);
  v_line numeric(12,2);
  v_subtotal numeric(12,2) := 0;
  v_order_id uuid;
  v_order_number text;
  v_public_token uuid;
  v_reserved_until timestamptz;
  v_minutes integer;
  v_name text;
  v_email text;
  v_phone text;
  v_items jsonb := '[]'::jsonb;
  v_label text;
  v_product_id uuid;
  v_product_name text;
  v_product_price numeric(12,2);
  v_product_active boolean;
  v_product_sku text;
  v_variant_size text;
  v_variant_color text;
  v_variant_sku text;
  v_variant_active boolean;
begin
  if payload is null or jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') = 0 then
    raise exception 'Carrinho vazio.';
  end if;

  v_name := nullif(trim(coalesce(payload #>> '{customer,name}', '')), '');
  v_email := nullif(lower(trim(coalesce(payload #>> '{customer,email}', ''))), '');
  v_phone := nullif(trim(coalesce(payload #>> '{customer,phone}', '')), '');

  if v_name is null or length(v_name) < 2 then
    raise exception 'Informe o nome completo.';
  end if;
  if v_email is null or position('@' in v_email) = 0 then
    raise exception 'Informe um e-mail válido.';
  end if;
  if v_phone is null or length(regexp_replace(v_phone, '\D', '', 'g')) < 10 then
    raise exception 'Informe um telefone válido.';
  end if;

  select reservation_minutes into v_minutes from public.store_settings where id = 1;
  v_minutes := coalesce(v_minutes, 60);
  v_reserved_until := now() + make_interval(mins => v_minutes);

  -- Lock variants in stable order to avoid deadlocks
  for v_item in
    select value
    from jsonb_array_elements(payload->'items') as t(value)
    order by (value->>'variant_id')
  loop
    begin
      v_variant_id := (v_item->>'variant_id')::uuid;
    exception when others then
      raise exception 'Variante inválida no carrinho.';
    end;

    v_qty := coalesce((v_item->>'quantity')::integer, 0);
    if v_qty < 1 or v_qty > 99 then
      raise exception 'Quantidade inválida.';
    end if;

    select
      p.id,
      p.name,
      p.price,
      p.active,
      p.sku,
      pv.size,
      pv.color,
      pv.sku,
      coalesce(pv.active, true)
    into
      v_product_id,
      v_product_name,
      v_product_price,
      v_product_active,
      v_product_sku,
      v_variant_size,
      v_variant_color,
      v_variant_sku,
      v_variant_active
    from public.product_variants pv
    join public.products p on p.id = pv.product_id
    where pv.id = v_variant_id
    for update of pv;

    if not found then
      raise exception 'Produto indisponível.';
    end if;

    if coalesce(v_product_active, false) is not true then
      raise exception 'O produto "%" não está publicado.', v_product_name;
    end if;

    if coalesce(v_variant_active, true) is not true then
      raise exception 'A variante selecionada não está disponível.';
    end if;

    v_available := public.variant_available_stock(v_variant_id);
    if v_available < v_qty then
      raise exception 'Estoque insuficiente para "%". Disponível: %.', v_product_name, v_available;
    end if;

    v_unit := coalesce(v_product_price, 0)::numeric(12,2);
    v_line := round(v_unit * v_qty, 2);
    v_subtotal := v_subtotal + v_line;
    v_label := nullif(trim(concat_ws(' · ', nullif(v_variant_size, ''), nullif(v_variant_color, ''))), '');

    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'variant_id', v_variant_id,
      'product_id', v_product_id,
      'product_name', v_product_name,
      'variant_label', v_label,
      'sku', coalesce(v_variant_sku, v_product_sku),
      'unit_price', v_unit,
      'quantity', v_qty,
      'line_total', v_line
    ));
  end loop;

  v_order_number := public.generate_order_number();
  v_public_token := gen_random_uuid();

  insert into public.orders (
    order_number,
    public_token,
    customer_name,
    customer_email,
    customer_phone,
    customer_cpf,
    address_street,
    address_number,
    address_complement,
    address_district,
    address_city,
    address_state,
    address_cep,
    notes,
    order_status,
    payment_status,
    subtotal,
    total,
    reserved_until
  ) values (
    v_order_number,
    v_public_token,
    v_name,
    v_email,
    v_phone,
    nullif(trim(coalesce(payload #>> '{customer,cpf}', '')), ''),
    nullif(trim(coalesce(payload #>> '{address,street}', '')), ''),
    nullif(trim(coalesce(payload #>> '{address,number}', '')), ''),
    nullif(trim(coalesce(payload #>> '{address,complement}', '')), ''),
    nullif(trim(coalesce(payload #>> '{address,district}', '')), ''),
    nullif(trim(coalesce(payload #>> '{address,city}', '')), ''),
    nullif(upper(trim(coalesce(payload #>> '{address,state}', ''))), ''),
    nullif(regexp_replace(coalesce(payload #>> '{address,cep}', ''), '\D', '', 'g'), ''),
    nullif(trim(coalesce(payload->>'notes', '')), ''),
    'pending_payment',
    'pending',
    v_subtotal,
    v_subtotal,
    v_reserved_until
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, variant_id, product_name, variant_label, sku, unit_price, quantity, line_total
  )
  select
    v_order_id,
    (item->>'product_id')::uuid,
    (item->>'variant_id')::uuid,
    item->>'product_name',
    item->>'variant_label',
    item->>'sku',
    (item->>'unit_price')::numeric,
    (item->>'quantity')::integer,
    (item->>'line_total')::numeric
  from jsonb_array_elements(v_items) as item;

  insert into public.stock_reservations (order_id, variant_id, quantity, reserved_until)
  select
    v_order_id,
    (item->>'variant_id')::uuid,
    (item->>'quantity')::integer,
    v_reserved_until
  from jsonb_array_elements(v_items) as item;

  insert into public.order_status_history (
    order_id, from_order_status, to_order_status, from_payment_status, to_payment_status, note
  ) values (
    v_order_id, null, 'pending_payment', null, 'pending', 'Pedido criado'
  );

  return jsonb_build_object(
    'ok', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'public_token', v_public_token,
    'total', v_subtotal,
    'reserved_until', v_reserved_until
  );
exception
  when others then
    return jsonb_build_object('ok', false, 'error', SQLERRM);
end;
$$;

revoke all on function public.place_guest_order(jsonb) from public;
grant execute on function public.place_guest_order(jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Public order lookup by token (limited fields)
-- ---------------------------------------------------------------------------
create or replace function public.get_order_by_public_token(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_items jsonb;
begin
  select * into v_order from public.orders where public_token = p_token;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Pedido não encontrado.');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'product_name', oi.product_name,
    'variant_label', oi.variant_label,
    'quantity', oi.quantity,
    'unit_price', oi.unit_price,
    'line_total', oi.line_total
  ) order by oi.created_at), '[]'::jsonb)
  into v_items
  from public.order_items oi
  where oi.order_id = v_order.id;

  return jsonb_build_object(
    'ok', true,
    'order', jsonb_build_object(
      'order_number', v_order.order_number,
      'order_status', v_order.order_status,
      'payment_status', v_order.payment_status,
      'total', v_order.total,
      'subtotal', v_order.subtotal,
      'customer_name', v_order.customer_name,
      'customer_email', v_order.customer_email,
      'reserved_until', v_order.reserved_until,
      'created_at', v_order.created_at,
      'items', v_items
    )
  );
end;
$$;

revoke all on function public.get_order_by_public_token(uuid) from public;
grant execute on function public.get_order_by_public_token(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Release expired reservations (lazy; also callable by admin)
-- ---------------------------------------------------------------------------
create or replace function public.release_expired_reservations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
begin
  for r in
    select o.id
    from public.orders o
    where o.order_status = 'pending_payment'
      and o.payment_status = 'pending'
      and o.reserved_until is not null
      and o.reserved_until < now()
  loop
    update public.stock_reservations
    set released_at = now()
    where order_id = r.id
      and released_at is null
      and converted_at is null;

    update public.orders
    set order_status = 'expired',
        payment_status = 'expired',
        updated_at = now()
    where id = r.id;

    insert into public.order_status_history (
      order_id, from_order_status, to_order_status, from_payment_status, to_payment_status, note
    ) values (
      r.id, 'pending_payment', 'expired', 'pending', 'expired', 'Reserva expirada'
    );

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

revoke all on function public.release_expired_reservations() from public;
grant execute on function public.release_expired_reservations() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Confirm payment (admin) — convert reservation to stock decrement
-- ---------------------------------------------------------------------------
create or replace function public.admin_confirm_order_payment(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  r record;
  v_stock integer;
begin
  if not public.is_admin_user() then
    return jsonb_build_object('ok', false, 'error', 'Acesso negado.');
  end if;

  perform public.release_expired_reservations();

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Pedido não encontrado.');
  end if;

  if v_order.payment_status = 'paid' then
    return jsonb_build_object('ok', false, 'error', 'Pagamento já confirmado.');
  end if;

  if v_order.order_status in ('cancelled', 'expired') then
    return jsonb_build_object('ok', false, 'error', 'Pedido cancelado ou expirado.');
  end if;

  if v_order.order_status <> 'pending_payment' or v_order.payment_status <> 'pending' then
    return jsonb_build_object('ok', false, 'error', 'Status do pedido não permite confirmar pagamento.');
  end if;

  if v_order.reserved_until is not null and v_order.reserved_until < now() then
    return jsonb_build_object('ok', false, 'error', 'A reserva deste pedido expirou.');
  end if;

  for r in
    select sr.*
    from public.stock_reservations sr
    where sr.order_id = p_order_id
      and sr.released_at is null
      and sr.converted_at is null
    order by sr.variant_id
    for update
  loop
    select stock into v_stock from public.product_variants where id = r.variant_id for update;
    if v_stock is null or v_stock < r.quantity then
      return jsonb_build_object('ok', false, 'error', 'Estoque insuficiente para confirmar o pagamento.');
    end if;

    update public.product_variants
    set stock = stock - r.quantity
    where id = r.variant_id;

    update public.stock_reservations
    set converted_at = now()
    where id = r.id;
  end loop;

  update public.orders
  set payment_status = 'paid',
      order_status = 'paid',
      paid_at = now(),
      paid_by = auth.uid(),
      updated_at = now()
  where id = p_order_id;

  insert into public.order_status_history (
    order_id, from_order_status, to_order_status, from_payment_status, to_payment_status, changed_by, note
  ) values (
    p_order_id, v_order.order_status, 'paid', v_order.payment_status, 'paid', auth.uid(), 'Pagamento confirmado'
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.admin_confirm_order_payment(uuid) from public;
grant execute on function public.admin_confirm_order_payment(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Transition order status (admin) after payment
-- ---------------------------------------------------------------------------
create or replace function public.admin_transition_order_status(p_order_id uuid, p_next text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_allowed boolean := false;
begin
  if not public.is_admin_user() then
    return jsonb_build_object('ok', false, 'error', 'Acesso negado.');
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Pedido não encontrado.');
  end if;

  if p_next = 'cancelled' then
    if v_order.order_status in ('delivered', 'cancelled', 'expired') then
      return jsonb_build_object('ok', false, 'error', 'Não é possível cancelar neste status.');
    end if;

    update public.stock_reservations
    set released_at = coalesce(released_at, now())
    where order_id = p_order_id
      and released_at is null
      and converted_at is null;

    -- If already paid (stock deducted), restock
    if v_order.payment_status = 'paid' then
      update public.product_variants pv
      set stock = pv.stock + oi.quantity
      from public.order_items oi
      where oi.order_id = p_order_id
        and oi.variant_id = pv.id;
    end if;

    update public.orders
    set order_status = 'cancelled',
        payment_status = case
          when payment_status = 'paid' then 'refunded'
          when payment_status = 'pending' then 'cancelled'
          else payment_status
        end,
        cancelled_at = now(),
        updated_at = now()
    where id = p_order_id;

    insert into public.order_status_history (
      order_id, from_order_status, to_order_status, from_payment_status, to_payment_status, changed_by, note
    )
    select p_order_id, v_order.order_status, 'cancelled', v_order.payment_status, o.payment_status, auth.uid(), 'Pedido cancelado'
    from public.orders o where o.id = p_order_id;

    return jsonb_build_object('ok', true);
  end if;

  if v_order.payment_status <> 'paid' and p_next in ('processing', 'shipped', 'delivered') then
    return jsonb_build_object('ok', false, 'error', 'Confirme o pagamento antes de avançar o pedido.');
  end if;

  v_allowed :=
    (v_order.order_status = 'paid' and p_next = 'processing')
    or (v_order.order_status = 'processing' and p_next = 'shipped')
    or (v_order.order_status = 'shipped' and p_next = 'delivered');

  if not v_allowed then
    return jsonb_build_object('ok', false, 'error', 'Transição de status inválida.');
  end if;

  update public.orders
  set order_status = p_next,
      updated_at = now()
  where id = p_order_id;

  insert into public.order_status_history (
    order_id, from_order_status, to_order_status, from_payment_status, to_payment_status, changed_by, note
  ) values (
    p_order_id, v_order.order_status, p_next, v_order.payment_status, v_order.payment_status, auth.uid(), 'Status atualizado'
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.admin_transition_order_status(uuid, text) from public;
grant execute on function public.admin_transition_order_status(uuid, text) to authenticated;
