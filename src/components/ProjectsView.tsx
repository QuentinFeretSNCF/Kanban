import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Designer, Project, Task } from "../types";
import { STATUSES } from "../constants";
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

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [projects]
  );

  const byProject = useMemo(
    () => sortedProjects.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      count: tasks.filter((t) => t.projet_id === p.id).length,
    })),
    [sortedProjects, tasks]
  );

  const byStatus = useMemo(
    () => STATUSES.map((s) => ({
      id: s.id,
      label: s.label,
      count: tasks.filter((t) => t.statut === s.id).length,
    })),
    [tasks]
  );

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

      <div className="studio-panel" style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
          <div style={{ flex: "0 0 auto" }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.3 }}>
              Tâches au total
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: "var(--ink)", marginTop: 4 }}>
              {tasks.length}
            </div>
          </div>

          <div style={{ flex: "1 1 260px", minWidth: 260 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>
              Répartition par projet
            </div>
            <ResponsiveContainer width="100%" height={Math.max(120, byProject.length * 32)}>
              <BarChart data={byProject} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "var(--ink)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontFamily: "var(--font-body)", fontSize: 12, border: "1px solid var(--line)", borderRadius: 8 }}
                  formatter={(v: number) => [v, "Tâches"]}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {byProject.map((p) => <Cell key={p.id} fill={p.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 260px", minWidth: 260 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>
              Répartition par statut
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={byStatus} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11.5, fill: "var(--ink-soft)" }} axisLine={{ stroke: "var(--line)" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontFamily: "var(--font-body)", fontSize: 12, border: "1px solid var(--line)", borderRadius: 8 }}
                  formatter={(v: number) => [v, "Tâches"]}
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
        {sortedProjects.map((p) => {
          const pTasks = tasks.filter((t) => t.projet_id === p.id);
          const active = pTasks.filter((t) => t.statut !== "livre");
          const charge = active.reduce((s, t) => s + (t.charge || 0), 0);
          const involved = [...new Set(active.flatMap((t) => t.designer_ids))]
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
