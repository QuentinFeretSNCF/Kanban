import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import type { Designer, Task } from "../types";
import { CAPACITY_PER_DESIGNER } from "../constants";
import { getMonday, sprintLabel, toISODate } from "../dateUtils";
import { Avatar } from "./atoms";

export default function TeamView({
  tasks, designers, onRenameDesigner,
}: {
  tasks: Task[];
  designers: Designer[];
  onRenameDesigner: (id: string, name: string) => void;
}) {
  const currentSprint = toISODate(getMonday(new Date()));
  const data = designers.map((d) => {
    const active = tasks.filter((t) => t.designer_id === d.id && t.sprint === currentSprint);
    const charge = active.reduce((s, t) => s + (t.charge || 0), 0);
    const total = tasks.filter((t) => t.designer_id === d.id && t.statut !== "livre").length;
    return { name: d.name, charge, total, color: d.color, id: d.id };
  });

  return (
    <div>
      <div className="studio-calendar-intro">
        Charge planifiée par designer pour le sprint en cours ({sprintLabel(currentSprint)}) — capacité de référence : {CAPACITY_PER_DESIGNER}j / semaine.
      </div>
      <div className="studio-panel" style={{ marginBottom: 22 }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--ink-soft)" }} axisLine={{ stroke: "var(--line)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontFamily: "var(--font-body)", fontSize: 12, border: "1px solid var(--line)", borderRadius: 8 }}
              formatter={(v: number) => [`${v} j`, "Charge"]}
            />
            <Bar dataKey="charge" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.id} fill={d.charge > CAPACITY_PER_DESIGNER ? "#D6462E" : d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="studio-team-grid">
        {designers.map((d) => {
          const stats = data.find((x) => x.id === d.id)!;
          return (
            <div key={d.id} className="studio-team-card">
              <Avatar designer={d} size={40} />
              <div style={{ flex: 1 }}>
                <input
                  className="studio-inline-name"
                  defaultValue={d.name}
                  onBlur={(e) => { if (e.target.value.trim() && e.target.value !== d.name) onRenameDesigner(d.id, e.target.value.trim()); }}
                />
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>
                  {stats.total} tâche{stats.total > 1 ? "s" : ""} active{stats.total > 1 ? "s" : ""} · {stats.charge}j ce sprint
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
