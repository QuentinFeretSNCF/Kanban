-- Le Studio — Kanban : migration 003
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Permet au formulaire public "demande-form" (déployé séparément, sans
-- authentification) de :
--   1. lire la liste des projets (pour le menu déroulant du formulaire),
--   2. créer une tâche dans la colonne Backlog uniquement.
--
-- Rien d'autre n'est ouvert à l'accès anonyme : pas de lecture des tâches
-- existantes, pas de modification, pas de suppression, pas d'accès aux
-- designers/réunions/sous-tâches. Les utilisateurs authentifiés de l'outil
-- Kanban conservent exactement les mêmes droits qu'avant (policies
-- "authenticated ..." déjà en place, inchangées).

drop policy if exists "anon read projects for public form" on projects;
create policy "anon read projects for public form"
  on projects for select
  using (auth.role() = 'anon');

drop policy if exists "anon insert backlog tasks from public form" on tasks;
create policy "anon insert backlog tasks from public form"
  on tasks for insert
  to anon
  with check (statut = 'backlog');
