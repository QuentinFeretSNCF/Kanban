import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Designer, Project, Task } from "../types";
import { CAPACITY_PER_DESIGNER } from "../constants";
import { addDays, getMonday, sprintLabel, toISODate } from "../dateUtils";
import { Avatar, PriorityDot } from "./atoms";

export default function SprintsView({
  tasks, designers, projects, onEdit,
}: {
  tasks: Task[];
  designers: Designer[];
  projects: Project[];
  onEdit: (task: Task) => void;
}) {
  const [offset, setOffset] = useState(0);
  const [projetFilter, setProjetFilter] = useState("all");
  const sprints = useMemo(() => {
    const base = getMonday(new Date());
    return [0, 1, 2].map((i) => toISODate(addDays(base, (i + offset) * 7)));
  }, [offset]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <select className="studio-select-sm" value={projetFilter} onChange={(e) => setProjetFilter(e.target.value)}>
          <option value="all">Tous les projets</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="studio-icon-btn" onClick={() => setOffset((o) => o - 1)}><ChevronLeft size={16} /></button>
          <button className="studio-icon-btn" onClick={() => setOffset((o) => o + 1)}><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="studio-sprint-grid">
        {sprints.map((mondayISO) => {
          const sprintTasks = tasks.filter((t) => t.sprint === mondayISO && (projetFilter === "all" || t.projet_id === projetFilter));
          const isCurrent = mondayISO === toISODate(getMonday(new Date()));
          return (
            <div key={mondayISO} className="studio-sprint-card">
              <div className="studio-sprint-head">
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {isCurrent ? "Sprint en cours" : "Sprint"}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>
                    {sprintLabel(mondayISO)}
                  </div>
                </div>
                {isCurrent && <span className="studio-badge-current">EN COURS</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {designers.map((d) => {
                  const dTasks = sprintTasks.filter((t) => t.designer_id === d.id);
                  const charge = dTasks.reduce((s, t) => s + (t.charge || 0), 0);
                  const pct = Math.min(100, (charge / CAPACITY_PER_DESIGNER) * 100);
                  const over = charge > CAPACITY_PER_DESIGNER;
                  return (
                    <div key={d.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Avatar designer={d} size={18} />
                          <span style={{ fontSize: 12, color: "var(--ink)" }}>{d.name}</span>
                        </div>
                        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: over ? "#D6462E" : "var(--ink-soft)", fontWeight: over ? 700 : 400 }}>
                          {charge}j / {CAPACITY_PER_DESIGNER}j
                        </span>
                      </div>
                      <div className="studio-bar-track">
                        <div className="studio-bar-fill" style={{ width: `${pct}%`, background: over ? "#D6462E" : d.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                {sprintTasks.length === 0 && <div className="studio-empty-col">Aucune tâche planifiée</div>}
                {sprintTasks.map((t) => {
                  const d = designers.find((x) => x.id === t.designer_id);
                  const p = projects.find((x) => x.id === t.projet_id);
                  return (
                    <div key={t.id} onClick={() => onEdit(t)} className="studio-sprint-row">
                      <PriorityDot id={t.priorite} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titre}</div>
                        {p && <div style={{ fontSize: 10, color: p.color, marginTop: 1 }}>{p.name}</div>}
                      </div>
                      <Avatar designer={d} size={18} />
                      {t.statut === "livre" && <CheckCircle2 size={13} color="#2E7D5B" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
