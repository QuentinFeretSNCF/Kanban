-- Le Studio — Kanban : migration 005
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Permet à l'edge function "generate-subtasks" appelée depuis le formulaire
-- public (demande-form) d'enregistrer les sous-tâches générées par l'IA
-- sur une tâche fraîchement créée en Backlog. Rien d'autre n'est ouvert :
-- pas de lecture, de modification ou de suppression des sous-tâches
-- existantes pour le rôle anon.

drop policy if exists "anon insert subtasks on backlog tasks" on subtasks;
create policy "anon insert subtasks on backlog tasks"
  on subtasks for insert
  to anon
  with check (
    exists (
      select 1 from tasks
      where tasks.id = subtasks.task_id
      and tasks.statut = 'backlog'
    )
  );
