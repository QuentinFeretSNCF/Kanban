import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error(
    "VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies (voir .env.example)."
  );
}

// Ce formulaire n'authentifie personne : il utilise la clé anon avec les
// policies RLS "anon" dédiées (lecture des projets, création de tâches
// limitée au statut "backlog"). Voir supabase/migrations/003_public_backlog_form.sql
// dans le repo principal.
export const supabase = createClient(url, anonKey);
