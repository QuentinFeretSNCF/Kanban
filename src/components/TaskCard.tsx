import { AlertTriangle, GripVertical } from "lucide-react";
import type { Designer, Project, Task } from "../types";
import { PRIORITIES } from "../constants";
import { fmtShort } from "../dateUtils";
import { Avatar, ProjectTag } from "./atoms";

export default function TaskCard({
  task,
  designer,
  project,
  onEdit,
  onDragStart,
  overdue,
}: {
  task: Task;
  designer?: Designer | null;
  project?: Project | null;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  overdue: boolean;
}) {
  const prio = PRIORITIES.find((p) => p.id === task.priorite) || PRIORITIES[1];
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onEdit(task)}
      className="studio-card"
      style={{ borderLeftColor: prio.color }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div className="studio-card-title">{task.titre}</div>
        <GripVertical size={14} color="var(--line)" style={{ flexShrink: 0, marginTop: 2 }} />
      </div>
      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 4 }}>{task.chef}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        <ProjectTag project={project} />
        <span className="studio-chip">{task.type}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Avatar designer={designer} size={22} />
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>{task.charge}j</span>
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 4, fontSize: 11,
            fontFamily: "var(--font-mono)", color: overdue ? "#D6462E" : "var(--ink-soft)",
            fontWeight: overdue ? 700 : 400,
          }}
        >
          {overdue && <AlertTriangle size={11} />}
          {fmtShort(task.date_livraison)}
        </div>
      </div>
    </div>
  );
}
