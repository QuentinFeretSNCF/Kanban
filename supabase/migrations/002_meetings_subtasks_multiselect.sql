-- Le Studio — Kanban : migration 002
-- À exécuter dans le SQL Editor de ton projet Supabase existant (safe à rejouer).
-- Ajoute : réunions par sprint, sous-tâches, difficulté, type et designer en
-- liste à choix multiple.

-- 1. Difficulté (XS…XXXL) et types multiples (remplace l'ancienne colonne "type" unique)
alter table tasks add column if not exists difficulte text;
alter table tasks add column if not exists types text[] not null default '{}';

do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'tasks' and column_name = 'type') then
    update tasks set types = array[type] where types = '{}' and type is not null and type <> '';
    alter table tasks drop column type;
  end if;
end $$;

-- 2. Designers multiples par tâche (remplace l'ancienne colonne "designer_id" unique)
create table if not exists task_designers (
  task_id uuid not null references tasks(id) on delete cascade,
  designer_id uuid not null references designers(id) on delete cascade,
  primary key (task_id, designer_id)
);

do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'tasks' and column_name = 'designer_id') then
    insert into task_designers (task_id, designer_id)
    select id, designer_id from tasks where designer_id is not null
    on conflict do nothing;
    alter table tasks drop column designer_id;
  end if;
end $$;

-- 3. Sous-tâches (checklist + barre de progression)
create table if not exists subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  titre text not null,
  fait boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Réunions par designer / par sprint (réduisent la capacité disponible)
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  designer_id uuid not null references designers(id) on delete cascade,
  sprint date not null,
  titre text not null default 'Réunion',
  charge numeric not null default 0.5,
  created_at timestamptz not null default now()
);

-- RLS (idempotent : on supprime puis recrée chaque politique)
alter table task_designers enable row level security;
alter table subtasks enable row level security;
alter table meetings enable row level security;

drop policy if exists "authenticated read task_designers" on task_designers;
drop policy if exists "authenticated insert task_designers" on task_designers;
drop policy if exists "authenticated update task_designers" on task_designers;
drop policy if exists "authenticated delete task_designers" on task_designers;
create policy "authenticated read task_designers" on task_designers for select using (auth.role() = 'authenticated');
create policy "authenticated insert task_designers" on task_designers for insert with check (auth.role() = 'authenticated');
create policy "authenticated update task_designers" on task_designers for update using (auth.role() = 'authenticated');
create policy "authenticated delete task_designers" on task_designers for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated read subtasks" on subtasks;
drop policy if exists "authenticated insert subtasks" on subtasks;
drop policy if exists "authenticated update subtasks" on subtasks;
drop policy if exists "authenticated delete subtasks" on subtasks;
create policy "authenticated read subtasks" on subtasks for select using (auth.role() = 'authenticated');
create policy "authenticated insert subtasks" on subtasks for insert with check (auth.role() = 'authenticated');
create policy "authenticated update subtasks" on subtasks for update using (auth.role() = 'authenticated');
create policy "authenticated delete subtasks" on subtasks for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated read meetings" on meetings;
drop policy if exists "authenticated insert meetings" on meetings;
drop policy if exists "authenticated update meetings" on meetings;
drop policy if exists "authenticated delete meetings" on meetings;
create policy "authenticated read meetings" on meetings for select using (auth.role() = 'authenticated');
create policy "authenticated insert meetings" on meetings for insert with check (auth.role() = 'authenticated');
create policy "authenticated update meetings" on meetings for update using (auth.role() = 'authenticated');
create policy "authenticated delete meetings" on meetings for delete using (auth.role() = 'authenticated');

-- Realtime (idempotent : on n'ajoute que si pas déjà membre de la publication)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'task_designers') then
    alter publication supabase_realtime add table task_designers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'subtasks') then
    alter publication supabase_realtime add table subtasks;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'meetings') then
    alter publication supabase_realtime add table meetings;
  end if;
end $$;
