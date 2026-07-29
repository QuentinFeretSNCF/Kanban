import { supabase } from "./supabaseClient";

// Génère automatiquement la liste des sous-tâches d'une demande à partir de
// ses notes (edge function "generate-subtasks", voir supabase/functions/).
// Best-effort : une IA indisponible ou une réponse vide ne doit jamais faire
// échouer la création de la demande.
export async function generateSubtasks(taskId: string, titre: string, notes: string) {
  try {
    const { data, error } = await supabase.functions.invoke("generate-subtasks", { body: { titre, notes } });
    if (error) { console.error("[generate-subtasks] appel échoué :", error); return; }
    const subtasks: string[] = Array.isArray(data?.subtasks) ? data.subtasks : [];
    if (subtasks.length === 0) { console.warn("[generate-subtasks] aucune sous-tâche renvoyée", data); return; }
    const { error: insertError } = await supabase
      .from("subtasks")
      .insert(subtasks.map((s, position) => ({ task_id: taskId, titre: s, position })));
    if (insertError) console.error("[generate-subtasks] insertion des sous-tâches échouée :", insertError);
  } catch (err) {
    console.error("[generate-subtasks] exception :", err);
  }
}
