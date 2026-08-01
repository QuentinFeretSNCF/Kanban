-- Le Studio — Kanban : migration 005
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Permet au formulaire public (demande-form) d'enregistrer la checklist de
-- sous-tâches par défaut sur une tâche fraîchement créée en Backlog. Rien
-- d'autre n'est ouvert : pas de lecture, de modification ou de suppression
-- des sous-tâches existantes pour le rôle anon.

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
