# Supabase — Terra & Estilo

Migrations versionadas em `migrations/`.

## Aplicar no projeto remoto

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
```

Ou cole o SQL no SQL Editor do Dashboard (na ordem dos arquivos).

## Local (opcional)

```bash
npx supabase start
npx supabase db reset
```

## Importante

- Não versionar `.env.local` nem service role.
- `place_guest_order` recalcula preços no servidor.
- Confirmação de pagamento é sempre manual via ADM.
