export type StatusId = "backlog" | "cadrage" | "encours" | "revision" | "livre";
export type PrioriteId = "haute" | "moyenne" | "basse";
export type DifficulteId = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";

export interface Designer {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface TaskRow {
  id: string;
  titre: string;
  chef: string;
  types: string[];
  difficulte: DifficulteId | null;
  projet_id: string | null;
  charge: number;
  date_livraison: string | null;
  sprint: string | null;
  priorite: PrioriteId;
  statut: StatusId;
  notes: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  titre: string;
  fait: boolean;
  position: number;
}

export interface Meeting {
  id: string;
  designer_id: string;
  sprint: string;
  titre: string;
  charge: number;
}

/** Une TaskRow enrichie côté client avec ses designers assignés et ses sous-tâches. */
export interface Task extends TaskRow {
  designer_ids: string[];
  subtasks: Subtask[];
}

export type TaskDraft = Omit<TaskRow, "id"> & { id?: string; designer_ids: string[] };

export interface Filters {
  designerId: string;
  projetId: string;
  priorite: string;
  search: string;
}
