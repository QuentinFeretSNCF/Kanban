# Le Studio — Kanban

Outil de gestion des demandes design pour une équipe de 6 designers : Kanban, vue Sprints (charge par designer), calendrier de livraison, suivi par projet. Les données sont partagées en temps réel entre tous les membres de l'équipe via Supabase (Postgres + Realtime + Auth).

## Mise en place

### 1. Créer le projet Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécute le contenu de [`supabase/schema.sql`](supabase/schema.sql). Cela crée les tables `designers`, `projects`, `tasks`, active la Row Level Security (accès réservé aux utilisateurs authentifiés), active le Realtime sur ces tables, et insère les designers/projets de départ.
3. Dans **Authentication → Providers**, laisse **Email** activé (connexion par lien magique, sans mot de passe). Optionnel : dans **Authentication → URL Configuration**, ajoute l'URL de déploiement de l'app aux *Redirect URLs*.
4. Récupère l'URL du projet et la clé `anon public` dans **Project Settings → API**.

### 2. Configurer l'app

```bash
cp .env.example .env
# renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

### 3. Déployer

Déploie ce dossier sur Vercel, Netlify ou équivalent (build command `npm run build`, output `dist`), en définissant les mêmes variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sur la plateforme d'hébergement.

## Fonctionnement

- **Authentification** : chaque membre de l'équipe se connecte avec son e-mail (lien magique envoyé par Supabase). Pas d'espace personnel : tout utilisateur authentifié voit et modifie le même espace de travail partagé.
- **Synchronisation en temps réel** : toute création, modification ou suppression (tâche, designer, projet) est répercutée instantanément chez tous les utilisateurs connectés via Supabase Realtime — plus besoin de rafraîchir la page.
- **Stockage** : les données vivent dans la base Postgres du projet Supabase, pas dans le navigateur.

## Stack

React + TypeScript + Vite, Supabase (Postgres, Auth, Realtime), Recharts pour le graphique de charge, lucide-react pour les icônes.
