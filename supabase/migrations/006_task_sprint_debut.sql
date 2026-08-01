-- Le Studio — Kanban : migration 006
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Permet à une tâche de s'étaler sur plusieurs sprints : "sprint_debut"
-- (optionnel) marque le premier sprint travaillé, "sprint" (déjà existant,
-- dérivé de la date de livraison) reste le dernier. La charge est répartie
-- à parts égales entre tous les sprints de cet intervalle côté client
-- (voir src/capacity.ts).

alter table tasks add column if not exists sprint_debut date;
