import type { DifficulteId, PrioriteId, StatusId } from "./types";

export const STATUSES: { id: StatusId; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "cadrage", label: "Cadrage" },
  { id: "encours", label: "En cours" },
  { id: "revision", label: "Révision" },
  { id: "livre", label: "Livré" },
];

export const TYPES = [
  "Cadrage UX",
  "Nouveau produit",
  "Amélioration produit",
  "Nouvelle fonctionnalité",
  "Recherche utilisateur",
  "Autre",
];

export const PRIORITIES: { id: PrioriteId; label: string; color: string }[] = [
  { id: "haute", label: "Haute", color: "#D6462E" },
  { id: "moyenne", label: "Moyenne", color: "#C98A2B" },
  { id: "basse", label: "Basse", color: "#6E8378" },
];

export const DIFFICULTIES: { id: DifficulteId; label: string }[] = [
  { id: "XS", label: "XS" },
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
  { id: "XXL", label: "XXL" },
  { id: "XXXL", label: "XXXL" },
];

export const DESIGNER_COLORS = ["#2B4570", "#3D6B5C", "#A85A2E", "#6B4A82", "#1D7A73", "#8C3B4A"];
export const PROJECT_COLORS = [
  "#8B5E3C", "#4A7C6F", "#6B5B95", "#B8862B", "#4F6D7A", "#9C4F4F",
  "#557153", "#7A5C61", "#3E6990", "#A9762B", "#5C6B73", "#8A4B6B",
];

export const CAPACITY_PER_DESIGNER = 5;
