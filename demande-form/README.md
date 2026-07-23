# Nouvelle demande — formulaire public

Formulaire public, sans connexion, à partager aux chefs de projet. Chaque
envoi crée directement une tâche dans la colonne **Backlog** du Kanban de
l'équipe design (`../` à la racine du repo).

C'est une application **indépendante** du Kanban : autre code, autre
déploiement, autre URL. Les deux se contentent de parler au même projet
Supabase.

## Pourquoi c'est sûr d'être public

Ce formulaire tourne sans authentification, mais l'accès à la base de
données reste strictement limité par des règles de sécurité (Row Level
Security) côté Supabase :

- il peut **lire** uniquement la liste des projets (pour le menu déroulant),
- il peut **créer** uniquement des tâches avec `statut = 'backlog'`,
- il ne peut ni lire, ni modifier, ni supprimer quoi que ce soit d'autre
  (tâches existantes, designers, réunions, sous-tâches…).

Ces règles sont définies dans
[`../supabase/migrations/003_public_backlog_form.sql`](../supabase/migrations/003_public_backlog_form.sql)
— à exécuter une fois dans le SQL Editor du projet Supabase (déjà inclus
dans `../supabase/schema.sql` pour une nouvelle installation).

## Mise en place

```bash
cp .env.example .env
# renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (les mêmes que le Kanban)
npm install
npm run dev
```

## Déployer comme projet Vercel séparé

1. Sur [vercel.com](https://vercel.com), "Add New Project" → sélectionne le
   même repo GitHub que le Kanban.
2. Dans **Root Directory**, choisis `demande-form` (au lieu de la racine).
3. Build command `npm run build`, output `dist` (détecté automatiquement).
4. Renseigne les variables d'environnement `VITE_SUPABASE_URL` et
   `VITE_SUPABASE_ANON_KEY`.
5. Déploie — tu obtiens une URL distincte de celle du Kanban
   (ex. `demande-le-studio.vercel.app`), à partager aux porteurs de projet.

## Champs du formulaire

Intitulé, nom du demandeur, projet concerné, type(s) de demande, date de
livraison souhaitée, notes. Statut fixé à `backlog`, priorité par défaut
`moyenne`, aucun designer assigné — l'équipe trie et complète la fiche
depuis l'outil Kanban.
