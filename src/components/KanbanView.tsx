import { Search } from "lucide-react";
import type { Designer, Filters, Project, StatusId, Task } from "../types";
import { PRIORITIES, STATUSES } from "../constants";
import { toISODate } from "../dateUtils";
import TaskCard from "./TaskCard";

export default function KanbanView({
  tasks, designers, projects, filters, setFilters, onEdit, onDrop, onDragStart,
}: {
  tasks: Task[];
  designers: Designer[];
  projects: Project[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  onEdit: (task: Task) => void;
  onDrop: (e: React.DragEvent, statusId: StatusId) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const todayISO = toISODate(new Date());
  const filtered = tasks.filter((t) => {
    if (filters.designerId !== "all" && !t.designer_ids.includes(filters.designerId)) return false;
    if (filters.projetId !== "all" && t.projet_id !== filters.projetId) return false;
    if (filters.priorite !== "all" && t.priorite !== filters.priorite) return false;
    if (filters.search && !`${t.titre} ${t.chef}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="studio-toolbar">
        <div className="studio-search">
          <Search size={14} color="var(--ink-soft)" />
          <input
            placeholder="Rechercher une tâche ou un chef de projet…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select className="studio-select-sm" value={filters.designerId} onChange={(e) => setFilters({ ...filters, designerId: e.target.value })}>
          <option value="all">Tous les designers</option>
          {designers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="studio-select-sm" value={filters.projetId} onChange={(e) => setFilters({ ...filters, projetId: e.target.value })}>
          <option value="all">Tous les projets</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="studio-select-sm" value={filters.priorite} onChange={(e) => setFilters({ ...filters, priorite: e.target.value })}>
          <option value="all">Toutes priorités</option>
          {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      <div className="studio-board">
        {STATUSES.map((status) => {
          const col = filtered
            .filter((t) => t.statut === status.id)
            .sort((a, b) => (a.date_livraison || "").localeCompare(b.date_livraison || ""));
          const chargeSum = col.reduce((s, t) => s + (t.charge || 0), 0);
          return (
            <div
              key={status.id}
              className="studio-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, status.id)}
            >
              <div className="studio-column-head">
                <span>{status.label}</span>
                <span className="studio-column-count">{col.length} · {chargeSum}j</span>
              </div>
              <div className="studio-column-body">
                {col.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    designers={designers}
                    project={projects.find((p) => p.id === t.projet_id)}
                    onEdit={onEdit}
                    onDragStart={onDragStart}
                    overdue={t.statut !== "livre" && !!t.date_livraison && t.date_livraison < todayISO}
                  />
                ))}
                {col.length === 0 && <div className="studio-empty-col">Aucune tâche</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
