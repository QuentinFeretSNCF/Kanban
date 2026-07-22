import { AlertTriangle, GripVertical } from "lucide-react";
import type { Designer, Project, Task } from "../types";
import { PRIORITIES } from "../constants";
import { fmtShort } from "../dateUtils";
import { taskShare, subtaskProgress } from "../capacity";
import { AvatarStack, DifficultyBadge, ProgressBar, ProjectTag } from "./atoms";

export default function TaskCard({
  task,
  designers,
  project,
  onEdit,
  onDragStart,
  overdue,
}: {
  task: Task;
  designers: Designer[];
  project?: Project | null;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  overdue: boolean;
}) {
  const prio = PRIORITIES.find((p) => p.id === task.priorite) || PRIORITIES[1];
  const assigned = task.designer_ids.map((id) => designers.find((d) => d.id === id));
  const progress = subtaskProgress(task);
  const share = taskShare(task);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onEdit(task)}
      className="studio-card"
      style={{ "--card-priority-color": prio.color } as React.CSSProperties}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div className="studio-card-title">{task.titre}</div>
        <GripVertical size={14} color="var(--line)" style={{ flexShrink: 0, marginTop: 2 }} />
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 0 }}>{task.chef}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
        <ProjectTag project={project} />
        {task.types.map((t) => <span key={t} className="studio-chip">{t}</span>)}
        <DifficultyBadge id={task.difficulte} />
      </div>

      {progress.total > 0 && (
        <div style={{ marginTop: 8 }}>
          <ProgressBar pct={progress.pct} label={`${progress.done}/${progress.total}`} />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <AvatarStack designers={assigned} size={24} />
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
            {share === task.charge ? `${task.charge}j` : `${share}j / ${task.charge}j`}
          </span>
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 4, fontSize: 12,
            fontFamily: "var(--font-mono)", color: overdue ? "#D6462E" : "var(--text-secondary)",
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
