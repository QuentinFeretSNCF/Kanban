-- Le Studio — Kanban : migration 009
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Ajoute un rôle "viewer" (lecture seule) pour partager l'outil à des
-- chefs de projet / coordinateurs sans qu'ils puissent modifier quoi que
-- ce soit. Ils se connectent avec le même système de code par e-mail que
-- l'équipe design ; seule leur capacité d'écriture change, contrôlée
-- côté base de données (pas seulement côté interface).
--
-- ⚠️ IMPORTANT — à faire juste après avoir exécuté cette migration :
-- tous les comptes (existants ET nouveaux) sont "viewer" par défaut, y
-- compris ceux de l'équipe design actuelle. Il faut donc immédiatement
-- repasser l'équipe en "editor" avec une requête comme :
--
--   update profiles set role = 'editor'
--   where email in ('camille@le-studio.fr', 'lea@le-studio.fr', ...);
--
-- Tant que ce n'est pas fait, plus personne ne peut créer ou modifier de
-- tâche dans l'outil.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'viewer' check (role in ('editor', 'viewer')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "users read own profile" on profiles;
create policy "users read own profile" on profiles for select using (auth.uid() = id);
-- Pas de policy insert/update/delete pour les clients : seul le trigger
-- ci-dessous (exécuté avec les droits du propriétaire de la fonction) et
-- les requêtes manuelles depuis le SQL Editor peuvent écrire ici.

-- Crée automatiquement une ligne "profiles" (rôle viewer par défaut) pour
-- chaque nouveau compte créé via le code par e-mail.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Rattrapage pour les comptes déjà créés avant cette migration.
insert into profiles (id, email, role)
select id, email, 'viewer' from auth.users
on conflict (id) do nothing;

create or replace function public.is_editor()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'editor'
  );
$$ language sql stable;

-- Les policies de lecture ("select") restent ouvertes à tout utilisateur
-- authentifié (editor ou viewer) : la lecture seule doit voir la même
-- donnée que l'équipe. Seules les policies d'écriture changent.

drop policy if exists "authenticated insert designers" on designers;
create policy "authenticated insert designers" on designers for insert with check (is_editor());
drop policy if exists "authenticated update designers" on designers;
create policy "authenticated update designers" on designers for update using (is_editor());
drop policy if exists "authenticated delete designers" on designers;
create policy "authenticated delete designers" on designers for delete using (is_editor());

drop policy if exists "authenticated insert projects" on projects;
create policy "authenticated insert projects" on projects for insert with check (is_editor());
drop policy if exists "authenticated update projects" on projects;
create policy "authenticated update projects" on projects for update using (is_editor());
drop policy if exists "authenticated delete projects" on projects;
create policy "authenticated delete projects" on projects for delete using (is_editor());

drop policy if exists "authenticated insert tasks" on tasks;
create policy "authenticated insert tasks" on tasks for insert with check (is_editor());
drop policy if exists "authenticated update tasks" on tasks;
create policy "authenticated update tasks" on tasks for update using (is_editor());
drop policy if exists "authenticated delete tasks" on tasks;
create policy "authenticated delete tasks" on tasks for delete using (is_editor());

drop policy if exists "authenticated insert task_designers" on task_designers;
create policy "authenticated insert task_designers" on task_designers for insert with check (is_editor());
drop policy if exists "authenticated update task_designers" on task_designers;
create policy "authenticated update task_designers" on task_designers for update using (is_editor());
drop policy if exists "authenticated delete task_designers" on task_designers;
create policy "authenticated delete task_designers" on task_designers for delete using (is_editor());

drop policy if exists "authenticated insert subtasks" on subtasks;
create policy "authenticated insert subtasks" on subtasks for insert with check (is_editor());
drop policy if exists "authenticated update subtasks" on subtasks;
create policy "authenticated update subtasks" on subtasks for update using (is_editor());
drop policy if exists "authenticated delete subtasks" on subtasks;
create policy "authenticated delete subtasks" on subtasks for delete using (is_editor());

drop policy if exists "authenticated insert meetings" on meetings;
create policy "authenticated insert meetings" on meetings for insert with check (is_editor());
drop policy if exists "authenticated update meetings" on meetings;
create policy "authenticated update meetings" on meetings for update using (is_editor());
drop policy if exists "authenticated delete meetings" on meetings;
create policy "authenticated delete meetings" on meetings for delete using (is_editor());

drop policy if exists "authenticated insert conges" on conges;
create policy "authenticated insert conges" on conges for insert with check (is_editor());
drop policy if exists "authenticated update conges" on conges;
create policy "authenticated update conges" on conges for update using (is_editor());
drop policy if exists "authenticated delete conges" on conges;
create policy "authenticated delete conges" on conges for delete using (is_editor());
