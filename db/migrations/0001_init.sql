-- CareerMentor — database schema (Supabase / Postgres)
--
-- Purpose: recreate the app's database on a fresh Supabase project (migration
-- away from the current shared project). Idempotent — safe to run twice.
--
-- Current home: shared Supabase project, tables prefixed `resume_builder_`.
-- The prefix is kept here so the app code (lib/data/resumesRepo.ts) works
-- unchanged; on a dedicated project you may drop the prefix IF you also
-- update the table name in resumesRepo.ts.
--
-- Requires: Supabase (auth.users exists; anon/authenticated roles exist).
-- Apply via: Supabase Dashboard > SQL Editor, or psql against the project.

-- ---------------------------------------------------------------------------
-- resumes: the only table the app reads/writes today.
-- One row per saved resume; all resume content lives in the `data` jsonb
-- (shape = ResumeData in lib/types.ts).
-- ---------------------------------------------------------------------------
create table if not exists public.resume_builder_resumes (
	id            uuid primary key default gen_random_uuid(),
	user_id       uuid not null references auth.users (id) on delete cascade,
	title         text not null default 'Untitled Resume',
	template_slug text not null default 'the-professional',
	data          jsonb not null default '{}'::jsonb,
	ats_score     integer,
	is_public     boolean not null default false,
	public_slug   text,
	created_at    timestamptz not null default now(),
	updated_at    timestamptz not null default now()
);

create index if not exists resume_builder_resumes_user_id_idx
	on public.resume_builder_resumes (user_id);

-- Public share lookups (/r/[id]) select by id (the PK) and rely on the
-- is_public RLS policy below; no extra index needed.

-- Note: updated_at is set by the APP on every update (lib/data/resumesRepo.ts
-- updateResume) — there is intentionally no DB trigger for it.

alter table public.resume_builder_resumes enable row level security;

-- Owners get full CRUD on their own rows.
drop policy if exists "resumes owner select" on public.resume_builder_resumes;
create policy "resumes owner select" on public.resume_builder_resumes
	for select using (auth.uid() = user_id);

drop policy if exists "resumes owner insert" on public.resume_builder_resumes;
create policy "resumes owner insert" on public.resume_builder_resumes
	for insert with check (auth.uid() = user_id);

drop policy if exists "resumes owner update" on public.resume_builder_resumes;
create policy "resumes owner update" on public.resume_builder_resumes
	for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "resumes owner delete" on public.resume_builder_resumes;
create policy "resumes owner delete" on public.resume_builder_resumes
	for delete using (auth.uid() = user_id);

-- Anyone (including visitors with no session) can read a resume its owner
-- shared — this is what makes /r/<id> share links work.
drop policy if exists "resumes public read" on public.resume_builder_resumes;
create policy "resumes public read" on public.resume_builder_resumes
	for select using (is_public = true);

-- ---------------------------------------------------------------------------
-- Auth note (no SQL): the app uses Supabase ANONYMOUS sign-in
-- (auth.signInAnonymously via lib/data/authRepo.ts ensureSession). On a new
-- project, enable it under Authentication > Providers > Anonymous sign-ins,
-- or Save/Share will fail. No email templates or OAuth setup is needed.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- App env (Vercel + .env.local) to repoint after migrating:
--   NEXT_PUBLIC_SUPABASE_URL      = https://<new-project-ref>.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY = <new anon key>
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Not migrated on purpose: the current shared project also has
-- `resume_builder_analyses` and `resume_builder_profiles`, created early in
-- the project's life. The app never reads or writes them (analysis is
-- computed client-side; there is no profile page data) — nothing to carry
-- over. If a future feature needs them, add a new migration file.
-- ---------------------------------------------------------------------------
