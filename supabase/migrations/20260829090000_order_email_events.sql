-- Terra & Estilo — transactional order email events.
-- Additive only: orders, stock, Pix and existing status RPCs remain unchanged.

create table if not exists public.order_email_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  event_type text not null check (event_type in (
    'order_created',
    'payment_confirmed',
    'shipped',
    'delivered',
    'cancelled'
  )),
  recipient text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  sent_at timestamptz,
  failed_at timestamptz,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, event_type, recipient)
);

create index if not exists order_email_events_order_id_idx
  on public.order_email_events (order_id, created_at);

alter table public.order_email_events enable row level security;

drop policy if exists order_email_events_admin_all on public.order_email_events;
create policy order_email_events_admin_all
  on public.order_email_events
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Enqueue customer and store notifications in the same transaction as the order.
-- Any telemetry failure is swallowed so email infrastructure can never cancel an order.
create or replace function public.enqueue_order_email_events()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_commercial_email text;
begin
  begin
    insert into public.order_email_events (order_id, event_type, recipient)
    values (new.id, 'order_created', lower(trim(new.customer_email)))
    on conflict (order_id, event_type, recipient) do nothing;

    select lower(trim(commercial_email))
      into v_commercial_email
      from public.store_settings
      where id = 1;

    if v_commercial_email is not null and v_commercial_email <> '' then
      insert into public.order_email_events (order_id, event_type, recipient)
      values (new.id, 'order_created', v_commercial_email)
      on conflict (order_id, event_type, recipient) do nothing;
    end if;
  exception
    when others then
      null;
  end;
  return new;
end;
$$;

drop trigger if exists orders_enqueue_email_events on public.orders;
create trigger orders_enqueue_email_events
  after insert on public.orders
  for each row execute function public.enqueue_order_email_events();

revoke all on function public.enqueue_order_email_events() from public;

-- Claims one event for delivery. The recipient is derived/validated against the order
-- and store settings; arbitrary recipients cannot be injected by the browser.
create or replace function public.claim_order_email_event(
  p_order_id uuid,
  p_event_type text,
  p_recipient text,
  p_force boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.order_email_events%rowtype;
  v_customer_email text;
  v_store_email text;
  v_recipient text := lower(trim(coalesce(p_recipient, '')));
begin
  if p_event_type not in ('order_created', 'payment_confirmed', 'shipped', 'delivered', 'cancelled') then
    return jsonb_build_object('ok', false, 'error', 'Evento de e-mail inválido.');
  end if;

  select lower(trim(customer_email))
    into v_customer_email
    from public.orders
    where id = p_order_id;

  if v_customer_email is null then
    return jsonb_build_object('ok', false, 'error', 'Pedido não encontrado.');
  end if;

  select lower(trim(commercial_email))
    into v_store_email
    from public.store_settings
    where id = 1;

  if p_event_type = 'order_created' then
    if v_recipient <> v_customer_email and (v_store_email is null or v_recipient <> v_store_email) then
      return jsonb_build_object('ok', false, 'error', 'Destinatário não pertence ao pedido.');
    end if;
  elsif not public.is_admin_user() or v_recipient <> v_customer_email then
    return jsonb_build_object('ok', false, 'error', 'Acesso negado.');
  end if;

  insert into public.order_email_events (order_id, event_type, recipient, status, attempts)
  values (p_order_id, p_event_type, v_recipient, 'pending', 0)
  on conflict (order_id, event_type, recipient) do nothing;

  select *
    into v_event
    from public.order_email_events
    where order_id = p_order_id
      and event_type = p_event_type
      and recipient = v_recipient
    for update;

  if v_event.status = 'sent' and not p_force then
    return jsonb_build_object(
      'ok', true,
      'event', jsonb_build_object(
        'id', v_event.id,
        'status', v_event.status,
        'recipient', v_event.recipient
      )
    );
  end if;

  update public.order_email_events
  set status = 'pending',
      attempts = v_event.attempts + 1,
      error_code = null,
      failed_at = null,
      updated_at = now()
  where id = v_event.id;

  return jsonb_build_object(
    'ok', true,
    'event', jsonb_build_object(
      'id', v_event.id,
      'status', 'pending',
      'recipient', v_event.recipient
    )
  );
end;
$$;

revoke all on function public.claim_order_email_event(uuid, text, text, boolean) from public;
grant execute on function public.claim_order_email_event(uuid, text, text, boolean) to anon, authenticated;

create or replace function public.complete_order_email_event(
  p_event_id uuid,
  p_status text,
  p_error_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.order_email_events%rowtype;
begin
  if p_status not in ('sent', 'failed') then
    return jsonb_build_object('ok', false, 'error', 'Status de e-mail inválido.');
  end if;

  select *
    into v_event
    from public.order_email_events
    where id = p_event_id
    for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Evento de e-mail não encontrado.');
  end if;

  if v_event.event_type <> 'order_created' and not public.is_admin_user() then
    return jsonb_build_object('ok', false, 'error', 'Acesso negado.');
  end if;

  update public.order_email_events
  set status = p_status,
      sent_at = case when p_status = 'sent' then now() else sent_at end,
      failed_at = case when p_status = 'failed' then now() else failed_at end,
      error_code = case when p_status = 'failed' then nullif(left(p_error_code, 40), '') else null end,
      updated_at = now()
  where id = p_event_id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.complete_order_email_event(uuid, text, text) from public;
grant execute on function public.complete_order_email_event(uuid, text, text) to anon, authenticated;
