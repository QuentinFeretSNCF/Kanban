-- Le Studio — Kanban : migration 007
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Ajoute les epics : une tâche peut être marquée "is_epic" (elle sert de
-- conteneur) et n'importe quelle autre tâche peut lui être rattachée via
-- "epic_id". Un seul niveau de hiérarchie — un epic ne peut pas être
-- rattaché à un autre epic (contrôlé côté application, pas en base).

alter table tasks add column if not exists is_epic boolean not null default false;
alter table tasks add column if not exists epic_id uuid references tasks(id) on delete set null;
