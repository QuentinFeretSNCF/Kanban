-- Le Studio — Kanban : migration 008
-- À exécuter dans le SQL Editor de ton projet Supabase (safe à rejouer).
--
-- Ajoute une priorité aux projets (page Projets, regroupement par
-- glisser-déposer). Déplacer un projet vers une nouvelle priorité met à
-- jour la priorité de tous ses tickets existants (voir App.tsx).

alter table projects add column if not exists priorite text not null default 'moyenne';
