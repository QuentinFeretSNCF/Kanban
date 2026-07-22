import { useState } from "react";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import type { Designer, DifficulteId, PrioriteId, Project, StatusId, Task, TaskDraft } from "../types";
import { DIFFICULTIES, PRIORITIES, STATUSES, TYPES } from "../constants";
import { sprintKeyFor, toISODate } from "../dateUtils";
import { subtaskProgress } from "../capacity";
import MultiSelect from "./MultiSelect";
import { ProgressBar } from "./atoms";

export default function TaskModal({
  initial,
  designers,
  projects,
  onAddProject,
  onClose,
  onSave,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onReorderSubtasks,
}: {
  initial: Task | null;
  designers: Designer[];
  projects: Project[];
  onAddProject: (name: string) => Promise<string>;
  onClose: () => void;
  onSave: (draft: TaskDraft) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (taskId: string, titre: string) => void;
  onToggleSubtask: (id: string, fait: boolean) => void;
  onDeleteSubtask: (id: string) => void;
  onReorderSubtasks: (orderedIds: string[]) => void;
}) {
  const blank: TaskDraft = {
    titre: "", chef: "", types: [], designer_ids: [], difficulte: null,
    projet_id: projects[0]?.id ?? null, charge: 1, date_livraison: toISODate(new Date()),
    sprint: null, priorite: "moyenne", statut: "backlog", notes: "",
  };
  const [form, setForm] = useState<TaskDraft>(() => {
    if (!initial) return blank;
    const { subtasks: _subtasks, ...draft } = initial;
    return draft;
  });
  const [addingProject, setAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [saving, setSaving] = useState(false);
  const [draggedSubtaskId, setDraggedSubtaskId] = useState<string | null>(null);

  const set = <K extends keyof TaskDraft>(k: K, v: TaskDraft[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleIn = (k: "types" | "designer_ids", id: string) => {
    setForm((f) => ({ ...f, [k]: f[k].includes(id) ? f[k].filter((x) => x !== id) : [...f[k], id] }));
  };

  const confirmNewProject = async () => {
    const name = newProjectName.trim();
    if (!name) { setAddingProject(false); return; }
    const id = await onAddProject(name);
    set("projet_id", id);
    setNewProjectName("");
    setAddingProject(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.chef.trim()) return;
    setSaving(true);
    const sprint = sprintKeyFor(form.date_livraison);
    await onSave({ ...form, sprint, id: initial?.id });
    setSaving(false);
  };

  const addSubtask = () => {
    const titre = newSubtask.trim();
    if (!titre || !initial) return;
    onAddSubtask(initial.id, titre);
    setNewSubtask("");
  };

  const dropSubtask = (targetId: string) => {
    if (!initial || !draggedSubtaskId || draggedSubtaskId === targetId) { setDraggedSubtaskId(null); return; }
    const ordered = initial.subtasks.slice().sort((a, b) => a.position - b.position).map((s) => s.id);
    const fromIndex = ordered.indexOf(draggedSubtaskId);
    const toIndex = ordered.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1) { setDraggedSubtaskId(null); return; }
    ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, draggedSubtaskId);
    onReorderSubtasks(ordered);
    setDraggedSubtaskId(null);
  };

  const progress = initial ? subtaskProgress(initial) : null;

  return (
    <div className="studio-modal-overlay" onClick={onClose}>
      <div className="studio-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            {initial ? "Modifier la demande" : "Nouvelle demande"}
          </h2>
          <button type="button" onClick={onClose} className="studio-icon-btn"><X size={18} /></button>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label className="studio-field">
            <span>Intitulé de la tâche</span>
            <input required value={form.titre} onChange={(e) => set("titre", e.target.value)} placeholder="Ex : Cadrage UX — espace client" />
          </label>

          <label className="studio-field">
            <span>Chef de projet</span>
            <input required value={form.chef} onChange={(e) => set("chef", e.target.value)} placeholder="Nom du chef de projet" />
          </label>

          <label className="studio-field">
            <span>Type(s) de demande</span>
            <MultiSelect
              options={TYPES.map((t) => ({ id: t, label: t }))}
              selected={form.types}
              onToggle={(id) => toggleIn("types", id)}
            />
          </label>

          <label className="studio-field">
            <span>Designer(s) assigné(s)</span>
            <MultiSelect
              options={designers.map((d) => ({ id: d.id, label: d.name, color: d.color }))}
              selected={form.designer_ids}
              onToggle={(id) => toggleIn("designer_ids", id)}
            />
          </label>

          <label className="studio-field">
            <span>Projet</span>
            {!addingProject ? (
              <div style={{ display: "flex", gap: 8 }}>
                <select style={{ flex: 1 }} value={form.projet_id ?? ""} onChange={(e) => set("projet_id", e.target.value || null)}>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button type="button" onClick={() => setAddingProject(true)} className="studio-icon-btn" title="Ajouter un projet">
                  <Plus size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  autoFocus
                  placeholder="Nom du nouveau projet"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmNewProject(); } if (e.key === "Escape") setAddingProject(false); }}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={confirmNewProject} className="studio-btn-primary" style={{ padding: "8px 12px" }}>OK</button>
                <button type="button" onClick={() => { setAddingProject(false); setNewProjectName(""); }} className="studio-icon-btn"><X size={15} /></button>
              </div>
            )}
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <label className="studio-field">
              <span>Charge (jours)</span>
              <input type="number" min={0.5} step={0.5} value={form.charge} onChange={(e) => set("charge", parseFloat(e.target.value) || 0)} />
            </label>
            <label className="studio-field">
              <span>Date de livraison</span>
              <input type="date" required value={form.date_livraison ?? ""} onChange={(e) => set("date_livraison", e.target.value)} />
            </label>
            <label className="studio-field">
              <span>Priorité</span>
              <select value={form.priorite} onChange={(e) => set("priorite", e.target.value as PrioriteId)}>
                {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="studio-field">
              <span>Statut</span>
              <select value={form.statut} onChange={(e) => set("statut", e.target.value as StatusId)}>
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <label className="studio-field">
              <span>Difficulté</span>
              <div className="studio-multiselect">
                {DIFFICULTIES.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    className={`studio-multiselect-chip ${form.difficulte === d.id ? "active" : ""}`}
                    onClick={() => set("difficulte", form.difficulte === d.id ? null : d.id as DifficulteId)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <label className="studio-field">
            <span>Notes (optionnel)</span>
            <textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Contexte, lien vers le brief..." />
          </label>

          <div className="studio-field">
            <span>Sous-tâches{progress && progress.total > 0 ? ` (${progress.done}/${progress.total})` : ""}</span>
            {!initial ? (
              <div className="studio-empty-col" style={{ padding: "8px 0" }}>Enregistre la tâche pour ajouter des sous-tâches.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {progress && progress.total > 0 && <ProgressBar pct={progress.pct} label={`${progress.pct}%`} />}
                {initial.subtasks.slice().sort((a, b) => a.position - b.position).map((s) => (
                  <div
                    key={s.id}
                    draggable
                    onDragStart={() => setDraggedSubtaskId(s.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dropSubtask(s.id)}
                    onDragEnd={() => setDraggedSubtaskId(null)}
                    style={{ display: "flex", alignItems: "center", gap: 8, opacity: draggedSubtaskId === s.id ? 0.5 : 1 }}
                  >
                    <GripVertical size={14} color="var(--line)" style={{ cursor: "grab", flexShrink: 0 }} />
                    <input type="checkbox" checked={s.fait} onChange={(e) => onToggleSubtask(s.id, e.target.checked)} />
                    <span style={{ flex: 1, fontSize: 13, textDecoration: s.fait ? "line-through" : "none", color: s.fait ? "var(--ink-soft)" : "var(--ink)" }}>
                      {s.titre}
                    </span>
                    <button type="button" className="studio-icon-btn" style={{ width: 24, height: 24 }} onClick={() => onDeleteSubtask(s.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="Nouvelle sous-tâche…"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="studio-icon-btn" onClick={addSubtask}><Plus size={15} /></button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {initial ? (
              <button type="button" onClick={() => onDelete(initial.id)} className="studio-btn-ghost-danger">
                <Trash2 size={14} /> Supprimer
              </button>
            ) : <span />}
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={onClose} className="studio-btn-ghost">Annuler</button>
              <button type="submit" className="studio-btn-primary" disabled={saving}>
                {saving ? "Enregistrement…" : initial ? "Enregistrer" : "Créer la demande"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
