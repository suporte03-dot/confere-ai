-- Serialize SMTP delivery claims without changing order or payment state.
-- A short-lived lock prevents concurrent requests from sending one event twice.

create table if not exists public.order_email_delivery_locks (
  event_id uuid primary key references public.order_email_events (id) on delete cascade,
  claimed_at timestamptz not null default now()
);

alter table public.order_email_delivery_locks enable row level security;

drop policy if exists order_email_delivery_locks_admin_all on public.order_email_delivery_locks;
create policy order_email_delivery_locks_admin_all
  on public.order_email_delivery_locks
  for all
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

create or replace function public.claim_order_email_event_serialized(
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
  v_result jsonb;
  v_event_id uuid;
  v_claimed_id uuid;
begin
  v_result := public.claim_order_email_event(
    p_order_id,
    p_event_type,
    p_recipient,
    p_force
  );

  if coalesce(v_result->>'ok', 'false') <> 'true' then
    return v_result;
  end if;

  v_event_id := (v_result->'event'->>'id')::uuid;
  if v_result->'event'->>'status' = 'sent' then
    return v_result;
  end if;

  delete from public.order_email_delivery_locks
  where claimed_at < now() - interval '15 minutes';

  insert into public.order_email_delivery_locks (event_id)
  values (v_event_id)
  on conflict (event_id) do nothing
  returning event_id into v_claimed_id;

  if v_claimed_id is null then
    return jsonb_build_object(
      'ok', true,
      'event', jsonb_build_object(
        'id', v_event_id,
        'status', 'sent',
        'recipient', v_result->'event'->>'recipient'
      )
    );
  end if;

  return v_result;
end;
$$;

revoke all on function public.claim_order_email_event_serialized(uuid, text, text, boolean) from public;
grant execute on function public.claim_order_email_event_serialized(uuid, text, text, boolean) to anon, authenticated;

create or replace function public.complete_order_email_event_serialized(
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
  v_result jsonb;
begin
  v_result := public.complete_order_email_event(p_event_id, p_status, p_error_code);
  delete from public.order_email_delivery_locks where event_id = p_event_id;
  return v_result;
end;
$$;

revoke all on function public.complete_order_email_event_serialized(uuid, text, text) from public;
grant execute on function public.complete_order_email_event_serialized(uuid, text, text) to anon, authenticated;
