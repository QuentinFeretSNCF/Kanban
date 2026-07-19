import { useState } from "react";
import { Plus } from "lucide-react";
import type { Designer, Project, Task } from "../types";
import { Avatar, PriorityDot } from "./atoms";

export default function ProjectsView({
  tasks, designers, projects, onAddProject, onRenameProject, onEdit,
}: {
  tasks: Task[];
  designers: Designer[];
  projects: Project[];
  onAddProject: (name: string) => Promise<string>;
  onRenameProject: (id: string, name: string) => void;
  onEdit: (task: Task) => void;
}) {
  const [newName, setNewName] = useState("");

  const addProject = async () => {
    const name = newName.trim();
    if (!name) return;
    await onAddProject(name);
    setNewName("");
  };

  return (
    <div>
      <div className="studio-calendar-intro">
        {projects.length} projets suivis par le studio — répartition des tâches actives par projet.
      </div>

      <div className="studio-toolbar">
        <div className="studio-search" style={{ maxWidth: 340 }}>
          <Plus size={14} color="var(--ink-soft)" />
          <input
            placeholder="Ajouter un nouveau projet…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addProject(); }}
          />
        </div>
        <button className="studio-btn-primary" onClick={addProject}><Plus size={14} /> Ajouter</button>
      </div>

      <div className="studio-projects-grid">
        {projects.map((p) => {
          const pTasks = tasks.filter((t) => t.projet_id === p.id);
          const active = pTasks.filter((t) => t.statut !== "livre");
          const charge = active.reduce((s, t) => s + (t.charge || 0), 0);
          const involved = [...new Set(active.map((t) => t.designer_id))]
            .map((id) => designers.find((d) => d.id === id))
            .filter((d): d is Designer => !!d);
          return (
            <div key={p.id} className="studio-project-card" style={{ borderTopColor: p.color }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <input
                  className="studio-inline-name"
                  defaultValue={p.name}
                  onBlur={(e) => { if (e.target.value.trim() && e.target.value !== p.name) onRenameProject(p.id, e.target.value.trim()); }}
                />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 11.5, color: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}>
                <span>{active.length} tâche{active.length > 1 ? "s" : ""} active{active.length > 1 ? "s" : ""}</span>
                <span>{charge}j en cours</span>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                {involved.length > 0 ? involved.map((d) => <Avatar key={d.id} designer={d} size={22} />) : (
                  <span style={{ fontSize: 11, color: "var(--ink-soft)", fontStyle: "italic" }}>Aucun designer assigné actuellement</span>
                )}
              </div>
              {active.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 12 }}>
                  {active.slice(0, 4).map((t) => (
                    <div key={t.id} onClick={() => onEdit(t)} className="studio-sprint-row" style={{ padding: "5px 8px" }}>
                      <PriorityDot id={t.priorite} />
                      <span style={{ flex: 1, fontSize: 11.5, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titre}</span>
                    </div>
                  ))}
                  {active.length > 4 && (
                    <div style={{ fontSize: 10.5, color: "var(--ink-soft)", textAlign: "center" }}>+ {active.length - 4} autre{active.length - 4 > 1 ? "s" : ""}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
