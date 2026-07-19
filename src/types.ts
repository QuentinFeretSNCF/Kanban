export type StatusId = "backlog" | "cadrage" | "encours" | "revision" | "livre";
export type PrioriteId = "haute" | "moyenne" | "basse";

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

export interface Task {
  id: string;
  titre: string;
  chef: string;
  type: string;
  designer_id: string | null;
  projet_id: string | null;
  charge: number;
  date_livraison: string | null;
  sprint: string | null;
  priorite: PrioriteId;
  statut: StatusId;
  notes: string;
}

export type TaskDraft = Omit<Task, "id"> & { id?: string };

export interface Filters {
  designerId: string;
  projetId: string;
  priorite: string;
  search: string;
}
