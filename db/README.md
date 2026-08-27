# Database

CareerMentor stores data in Supabase (Postgres). Today it lives in a **shared
Supabase project**, so every table carries the `resume_builder_` prefix.

The app uses exactly one table: `resume_builder_resumes`
(see [migrations/0001_init.sql](migrations/0001_init.sql)). Each row is one
saved resume; the whole resume (sections, style, skills, photo) is the `data`
jsonb column, whose shape is `ResumeData` in [../lib/types.ts](../lib/types.ts).

## Migrating to a fresh Supabase project

1. Create the new project.
2. Run `migrations/0001_init.sql` in the SQL Editor (it is idempotent).
3. Enable **Authentication → Sign in / Providers → Anonymous sign-ins**
   (the app has no email/password login — guests get an anonymous session on
   first Save).
4. Point the app at the new project — locally in `.env.local` and on Vercel
   (all three environments):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Moving existing rows (optional): guest accounts are anonymous, so users
   cannot log into the new project and find their old resumes. Copying the
   `resume_builder_resumes` rows keeps public share links (`/r/<id>`) working,
   because those only need `is_public = true`, not the owner's session.

## Conventions

- Row Level Security is ON: owners get full CRUD on their own rows; anyone
  can `select` rows with `is_public = true` (that is what share links use).
- `updated_at` is written by the app on every update — no DB trigger.
- Schema changes: add a new numbered file in `migrations/` (never edit an
  applied one) and run it in the SQL Editor.
