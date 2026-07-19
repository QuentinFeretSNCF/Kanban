import type { Designer, Project, PrioriteId } from "../types";
import { PRIORITIES } from "../constants";

export function Avatar({ designer, size = 28 }: { designer?: Designer | null; size?: number }) {
  if (!designer) return null;
  const initials = designer.name.slice(0, 2).toUpperCase();
  return (
    <div
      title={designer.name}
      className="studio-avatar"
      style={{ width: size, height: size, background: designer.color, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function ProjectTag({ project }: { project?: Project | null }) {
  if (!project) return null;
  return (
    <span
      className="studio-chip-project"
      style={{ color: project.color, background: `${project.color}1A`, borderColor: `${project.color}40` }}
    >
      <span className="studio-dot" style={{ background: project.color }} />
      {project.name}
    </span>
  );
}

export function PriorityDot({ id }: { id: PrioriteId }) {
  const p = PRIORITIES.find((x) => x.id === id) || PRIORITIES[1];
  return <span className="studio-dot" style={{ background: p.color }} />;
}
