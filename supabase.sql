-- 1) Crea una cuenta organizadora en Supabase > Authentication > Users.
-- 2) REEMPLAZA 'organizador@ejemplo.com' por el CORREO REAL de esa cuenta.
-- 3) Ejecuta todo este SQL en Supabase > SQL Editor.
-- Este script no borra los registros si la tabla ya existe.

create table if not exists public.confirmaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(btrim(nombre)) between 3 and 100),
  asistira boolean not null,
  llegada text not null check (llegada in ('puntual', 'tarde', 'no_aplica')),
  detalle_llegada text check (char_length(detalle_llegada) <= 500),
  mensaje text check (char_length(mensaje) <= 500),
  created_at timestamptz not null default now(),
  constraint llegada_coherente check (
    (asistira = false and llegada = 'no_aplica')
    or (asistira = true and llegada in ('puntual', 'tarde'))
  ),
  constraint detalle_tarde check (
    llegada <> 'tarde' or nullif(btrim(detalle_llegada), '') is not null
  )
);

alter table public.confirmaciones enable row level security;

-- El público solo puede ENVIAR datos; no puede ver, modificar ni borrar respuestas.
grant usage on schema public to anon, authenticated;
grant insert on public.confirmaciones to anon, authenticated;
grant select on public.confirmaciones to authenticated;
revoke update, delete on public.confirmaciones from anon, authenticated;

-- Elimina solo políticas anteriores con estos nombres para poder repetir el script.
drop policy if exists "Invitados pueden confirmar" on public.confirmaciones;
create policy "Invitados pueden confirmar"
on public.confirmaciones for insert to anon, authenticated
with check (true);

-- Sustituye el correo antes de ejecutar. SOLO esta cuenta podrá leer los registros.
drop policy if exists "Solo organizador puede leer" on public.confirmaciones;
create policy "Solo organizador puede leer"
on public.confirmaciones for select to authenticated
using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('organizador@ejemplo.com'));

-- OPCIONAL PARA REDUCIR SPAM: Activar Supabase > Integrations > CAPTCHA,
-- o añadir rate limiting con una función Edge. Un formulario público puede recibir spam.
