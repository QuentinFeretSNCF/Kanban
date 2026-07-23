-- Le Studio — Kanban : schéma Supabase (état complet, pour une nouvelle installation)
-- Si ton projet Supabase existe déjà (schéma déployé avant l'ajout des réunions,
-- sous-tâches, difficulté, types/designers multiples), utilise plutôt
-- supabase/migrations/002_meetings_subtasks_multiselect.sql pour mettre à jour
-- ta base existante sans perdre de données.

create extension if not exists pgcrypto;

create table if not exists designers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  chef text not null,
  types text[] not null default '{}',
  difficulte text,
  projet_id uuid references projects(id) on delete set null,
  charge numeric not null default 1,
  date_livraison date,
  sprint date,
  priorite text not null default 'moyenne',
  statut text not null default 'backlog',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Une tâche peut être assignée à plusieurs designers ; la charge (jours) de la
-- tâche est répartie à parts égales entre eux dans les calculs de capacité.
create table if not exists task_designers (
  task_id uuid not null references tasks(id) on delete cascade,
  designer_id uuid not null references designers(id) on delete cascade,
  primary key (task_id, designer_id)
);

-- Sous-tâches d'une tâche : cochées/non cochées, alimentent la barre de progression.
create table if not exists subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  titre text not null,
  fait boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Réunions d'un designer sur un sprint donné : réduisent sa capacité disponible
-- (5j/semaine de référence) dans les vues Sprints et Équipe.
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  designer_id uuid not null references designers(id) on delete cascade,
  sprint date not null,
  titre text not null default 'Réunion',
  charge numeric not null default 0.5,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at
  before update on tasks
  for each row execute function set_updated_at();

-- Row Level Security : tout utilisateur authentifié (l'équipe design) peut
-- lire et modifier ces tables. Pas de séparation par utilisateur — c'est un
-- espace de travail d'équipe partagé, pas des données privées.

alter table designers enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table task_designers enable row level security;
alter table subtasks enable row level security;
alter table meetings enable row level security;

create policy "authenticated read designers" on designers for select using (auth.role() = 'authenticated');
create policy "authenticated insert designers" on designers for insert with check (auth.role() = 'authenticated');
create policy "authenticated update designers" on designers for update using (auth.role() = 'authenticated');
create policy "authenticated delete designers" on designers for delete using (auth.role() = 'authenticated');

create policy "authenticated read projects" on projects for select using (auth.role() = 'authenticated');
create policy "authenticated insert projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "authenticated update projects" on projects for update using (auth.role() = 'authenticated');
create policy "authenticated delete projects" on projects for delete using (auth.role() = 'authenticated');

create policy "authenticated read tasks" on tasks for select using (auth.role() = 'authenticated');
create policy "authenticated insert tasks" on tasks for insert with check (auth.role() = 'authenticated');
create policy "authenticated update tasks" on tasks for update using (auth.role() = 'authenticated');
create policy "authenticated delete tasks" on tasks for delete using (auth.role() = 'authenticated');

-- Formulaire public "demande-form" (déployé séparément, sans authentification) :
-- lecture des projets pour le menu déroulant, et création de tâches limitée
-- à la colonne Backlog. Rien d'autre n'est accessible sans authentification.
create policy "anon read projects for public form" on projects for select using (auth.role() = 'anon');
create policy "anon insert backlog tasks from public form" on tasks for insert to anon with check (statut = 'backlog');

create policy "authenticated read task_designers" on task_designers for select using (auth.role() = 'authenticated');
create policy "authenticated insert task_designers" on task_designers for insert with check (auth.role() = 'authenticated');
create policy "authenticated update task_designers" on task_designers for update using (auth.role() = 'authenticated');
create policy "authenticated delete task_designers" on task_designers for delete using (auth.role() = 'authenticated');

create policy "authenticated read subtasks" on subtasks for select using (auth.role() = 'authenticated');
create policy "authenticated insert subtasks" on subtasks for insert with check (auth.role() = 'authenticated');
create policy "authenticated update subtasks" on subtasks for update using (auth.role() = 'authenticated');
create policy "authenticated delete subtasks" on subtasks for delete using (auth.role() = 'authenticated');

create policy "authenticated read meetings" on meetings for select using (auth.role() = 'authenticated');
create policy "authenticated insert meetings" on meetings for insert with check (auth.role() = 'authenticated');
create policy "authenticated update meetings" on meetings for update using (auth.role() = 'authenticated');
create policy "authenticated delete meetings" on meetings for delete using (auth.role() = 'authenticated');

-- Realtime : pousser les changements de ces tables à tous les clients connectés.
alter publication supabase_realtime add table designers, projects, tasks, task_designers, subtasks, meetings;

-- Données de départ (idempotent : ne s'insère qu'une fois, table par table).
insert into designers (name, color)
select * from (values
  ('Camille', '#2B4570'),
  ('Léa', '#3D6B5C'),
  ('Hugo', '#A85A2E'),
  ('Nora', '#6B4A82'),
  ('Antoine', '#1D7A73'),
  ('Sacha', '#8C3B4A')
) as v(name, color)
where not exists (select 1 from designers);

insert into projects (name, color)
select * from (values
  ('Espace Client', '#8B5E3C'),
  ('Application Mobile', '#4A7C6F'),
  ('Portail Fournisseurs', '#6B5B95'),
  ('Intranet RH', '#B8862B'),
  ('Plateforme Logistique', '#4F6D7A'),
  ('Outil Reporting', '#9C4F4F'),
  ('Configurateur Produit', '#557153'),
  ('Espace Partenaires', '#7A5C61'),
  ('Application Terrain', '#3E6990'),
  ('Portail Achats', '#A9762B'),
  ('Plateforme Formation', '#5C6B73'),
  ('Outil Support Client', '#8A4B6B')
) as v(name, color)
where not exists (select 1 from projects);
