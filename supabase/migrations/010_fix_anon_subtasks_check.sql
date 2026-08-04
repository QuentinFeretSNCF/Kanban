-- Le Studio — Kanban : migration 010
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Corrige la policy "anon insert subtasks on backlog tasks" (migration 005) :
-- son "exists (select 1 from tasks where ...)" est évalué avec les droits du
-- rôle appelant (anon), qui n'a aucune policy SELECT sur "tasks" — la
-- sous-requête ne voyait donc jamais aucune ligne et la policy échouait
-- silencieusement à chaque fois (la checklist par défaut du formulaire
-- public ne s'enregistrait jamais).
--
-- Plutôt que d'ouvrir une lecture publique complète de "tasks" (ce qui
-- exposerait tous les tickets en Backlog, notes comprises, à n'importe qui
-- sur internet), on passe par une fonction SECURITY DEFINER : elle ne
-- renvoie qu'un booléen ("ce ticket est-il en Backlog ?"), sans exposer la
-- moindre donnée du ticket.

create or replace function public.is_backlog_task(check_task_id uuid)
returns boolean as $$
  select exists (
    select 1 from tasks where id = check_task_id and statut = 'backlog'
  );
$$ language sql security definer stable set search_path = public;

drop policy if exists "anon insert subtasks on backlog tasks" on subtasks;
create policy "anon insert subtasks on backlog tasks" on subtasks
  for insert to anon
  with check (is_backlog_task(task_id));
