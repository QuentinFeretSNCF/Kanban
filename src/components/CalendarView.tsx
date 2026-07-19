import { useMemo } from "react";
import type { Designer, Project, Task } from "../types";
import { STATUSES, PRIORITIES } from "../constants";
import { Avatar, ProjectTag } from "./atoms";

export default function CalendarView({
  tasks, designers, projects, onEdit,
}: {
  tasks: Task[];
  designers: Designer[];
  projects: Project[];
  onEdit: (task: Task) => void;
}) {
  const grouped = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => (a.date_livraison || "").localeCompare(b.date_livraison || ""));
    const map = new Map<string, Task[]>();
    sorted.forEach((t) => {
      if (!t.date_livraison) return;
      const monthKey = t.date_livraison.slice(0, 7);
      if (!map.has(monthKey)) map.set(monthKey, []);
      map.get(monthKey)!.push(t);
    });
    return Array.from(map.entries());
  }, [tasks]);

  return (
    <div>
      <div className="studio-calendar-intro">
        Calendrier de livraison partagé — vue à transmettre aux chefs de projet.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {grouped.map(([monthKey, items]) => (
          <div key={monthKey}>
            <div className="studio-month-label">
              {new Date(monthKey + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </div>
            <div className="studio-calendar-list">
              {items.map((t) => {
                const d = designers.find((x) => x.id === t.designer_id);
                const p = projects.find((x) => x.id === t.projet_id);
                const prio = PRIORITIES.find((x) => x.id === t.priorite)!;
                const date = new Date(t.date_livraison + "T00:00:00");
                return (
                  <div key={t.id} className="studio-calendar-row" onClick={() => onEdit(t)}>
                    <div className="studio-calendar-date">
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>
                        {date.getDate()}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--ink-soft)", textTransform: "uppercase" }}>
                        {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                      </div>
                    </div>
                    <div style={{ width: 3, alignSelf: "stretch", background: prio.color, borderRadius: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>{t.titre}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>
                        {t.chef} · {t.type}
                      </div>
                      <div style={{ marginTop: 6 }}><ProjectTag project={p} /></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="studio-chip">{STATUSES.find((s) => s.id === t.statut)?.label}</span>
                      <Avatar designer={d} size={24} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {grouped.length === 0 && <div className="studio-empty-col">Aucune livraison planifiée</div>}
      </div>
    </div>
  );
}
