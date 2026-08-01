import { supabase } from "./supabaseClient";

export const DEFAULT_SUBTASKS = [
  "Cadrer le besoin",
  "Tester le produit",
  "Faire un benchmark",
  "Idéation",
  "Prototype",
  "Design Review",
  "Mise au propre",
  "Restitution",
];

// Pré-remplit une tâche nouvellement créée avec la checklist par défaut.
export async function createDefaultSubtasks(taskId: string) {
  const { error } = await supabase
    .from("subtasks")
    .insert(DEFAULT_SUBTASKS.map((titre, position) => ({ task_id: taskId, titre, position })));
  if (error) console.error("[subtasks] création de la checklist par défaut échouée :", error);
}
