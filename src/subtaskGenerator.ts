import { supabase } from "./supabaseClient";

// Génère automatiquement la liste des sous-tâches d'une tâche à partir de
// ses notes (edge function "generate-subtasks", voir supabase/functions/).
// Best-effort : une IA indisponible ou une réponse vide ne doit jamais faire
// échouer la création de la tâche.
export async function generateSubtasks(taskId: string, titre: string, notes: string) {
  try {
    const { data, error } = await supabase.functions.invoke("generate-subtasks", { body: { titre, notes } });
    if (error) return;
    const subtasks: string[] = Array.isArray(data?.subtasks) ? data.subtasks : [];
    if (subtasks.length === 0) return;
    await supabase.from("subtasks").insert(subtasks.map((s, position) => ({ task_id: taskId, titre: s, position })));
  } catch {
    // silencieux — la génération de sous-tâches ne doit jamais bloquer la création
  }
}
