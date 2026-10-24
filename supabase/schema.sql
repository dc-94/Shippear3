-- ============================================================================
-- Plata Clara — esquema de base de datos (Supabase / Postgres)
-- ============================================================================
--
-- Guarda SOLO estado del usuario: qué respondió en el cuestionario de nivel,
-- qué objetivos eligió y qué lecciones completó. El contenido educativo
-- (lecciones y preguntas) NO vive acá: está en content/*.json.
--
-- Cómo correrlo:
--   Supabase -> tu proyecto -> SQL Editor -> New query -> pegar TODO -> Run.
-- Es idempotente: se puede correr varias veces sin romper nada.
--
-- Seguridad (IMPORTANTE): cada tabla tiene RLS (Row Level Security) activado
-- con política "owner-only": cada persona ve y modifica únicamente SUS filas
-- (auth.uid() = user_id). Sin RLS, con la clave pública (anon) cualquiera
-- podría leer y escribir los datos de todos.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1) quiz_attempt — un registro cada vez que alguien completa el cuestionario
--    de nivel (inicial / intermedio / avanzado).
-- ----------------------------------------------------------------------------
create table if not exists public.quiz_attempt (
  id          uuid        primary key default gen_random_uuid(),
  -- user_id se completa solo con el usuario logueado (no hace falta mandarlo
  -- desde el frontend); la política RLS igual lo verifica.
  user_id     uuid        not null default auth.uid()
                          references auth.users (id) on delete cascade,
  score       integer     not null,
  level       text        not null
                          check (level in ('inicial', 'intermedio', 'avanzado')),
  -- respuestas crudas, ej: { "q1": "b", "q2": "a" }
  answers     jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- Índice para traer rápido los intentos de una persona.
create index if not exists quiz_attempt_user_idx
  on public.quiz_attempt (user_id);

-- Prende RLS: sin políticas, nadie puede leer/escribir (deniega por defecto).
alter table public.quiz_attempt enable row level security;

-- Política owner-only. 'using' controla qué filas se pueden ver/modificar/borrar;
-- 'with check' controla que las filas nuevas/editadas sean tuyas.
drop policy if exists "quiz_attempt owner" on public.quiz_attempt;
create policy "quiz_attempt owner"
  on public.quiz_attempt
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 2) goal — objetivos financieros que define el usuario.
-- ----------------------------------------------------------------------------
create table if not exists public.goal (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null default auth.uid()
                             references auth.users (id) on delete cascade,
  title          text        not null,            -- ej: "Fondo para 3 meses de gastos"
  target_amount  numeric(14,2),                   -- opcional: monto meta (en pesos)
  due_date       date,                            -- opcional: fecha objetivo
  status         text        not null default 'activo'
                             check (status in ('activo', 'cumplido', 'archivado')),
  created_at     timestamptz not null default now()
);

create index if not exists goal_user_idx
  on public.goal (user_id);

alter table public.goal enable row level security;

drop policy if exists "goal owner" on public.goal;
create policy "goal owner"
  on public.goal
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 3) lesson_progress — qué lecciones completó cada usuario.
--    (La página /mis-avances cuenta estas filas = lecciones completadas.)
-- ----------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null default auth.uid()
                            references auth.users (id) on delete cascade,
  lesson_id     text        not null,   -- ej: "inflacion-1" (de content/modules/*.json)
  module_id     text,                   -- ej: "inflacion" (opcional, para agrupar)
  completed_at  timestamptz not null default now(),

  -- Una persona completa una lección una sola vez (evita filas duplicadas).
  unique (user_id, lesson_id)
);

create index if not exists lesson_progress_user_idx
  on public.lesson_progress (user_id);

alter table public.lesson_progress enable row level security;

drop policy if exists "lesson_progress owner" on public.lesson_progress;
create policy "lesson_progress owner"
  on public.lesson_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
