import type { Meeting, Task } from "./types";
import { CAPACITY_PER_DESIGNER } from "./constants";

/** Une tâche assignée à plusieurs designers répartit sa charge à parts égales entre eux. */
export function taskShare(task: Task): number {
  const n = task.designer_ids.length || 1;
  return task.charge / n;
}

export function taskChargeForDesignerInSprint(tasks: Task[], designerId: string, sprint: string): number {
  return tasks
    .filter((t) => t.sprint === sprint && t.designer_ids.includes(designerId))
    .reduce((s, t) => s + taskShare(t), 0);
}

export function meetingChargeForDesignerInSprint(meetings: Meeting[], designerId: string, sprint: string): number {
  return meetings
    .filter((m) => m.designer_id === designerId && m.sprint === sprint)
    .reduce((s, m) => s + m.charge, 0);
}

/** Les réunions réduisent la capacité disponible du designer pour ce sprint. */
export function effectiveCapacity(meetingCharge: number): number {
  return Math.max(0, CAPACITY_PER_DESIGNER - meetingCharge);
}

export function subtaskProgress(task: Task): { done: number; total: number; pct: number } {
  const total = task.subtasks.length;
  const done = task.subtasks.filter((s) => s.fait).length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}
