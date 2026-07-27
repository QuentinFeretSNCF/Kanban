-- Le Studio — Kanban : migration 004
-- À exécuter dans le SQL Editor de ton projet Supabase existant (safe à rejouer).
--
-- Ajoute les congés par designer / par sprint, au même titre que les
-- réunions déjà en place : réduisent la capacité disponible du designer
-- dans les vues Sprints et Équipe.

create table if not exists conges (
  id uuid primary key default gen_random_uuid(),
  designer_id uuid not null references designers(id) on delete cascade,
  sprint date not null,
  titre text not null default 'Congés',
  charge numeric not null default 0.5,
  created_at timestamptz not null default now()
);

alter table conges enable row level security;

drop policy if exists "authenticated read conges" on conges;
drop policy if exists "authenticated insert conges" on conges;
drop policy if exists "authenticated update conges" on conges;
drop policy if exists "authenticated delete conges" on conges;
create policy "authenticated read conges" on conges for select using (auth.role() = 'authenticated');
create policy "authenticated insert conges" on conges for insert with check (auth.role() = 'authenticated');
create policy "authenticated update conges" on conges for update using (auth.role() = 'authenticated');
create policy "authenticated delete conges" on conges for delete using (auth.role() = 'authenticated');

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'conges') then
    alter publication supabase_realtime add table conges;
  end if;
end $$;
