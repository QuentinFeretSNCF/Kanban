import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Designer, PrioriteId, Project, StatusId, Task, TaskDraft } from "../types";
import { PRIORITIES, STATUSES, TYPES } from "../constants";
import { sprintKeyFor, toISODate } from "../dateUtils";

export default function TaskModal({
  initial,
  designers,
  projects,
  onAddProject,
  onClose,
  onSave,
  onDelete,
}: {
  initial: Task | null;
  designers: Designer[];
  projects: Project[];
  onAddProject: (name: string) => Promise<string>;
  onClose: () => void;
  onSave: (draft: TaskDraft) => void;
  onDelete: (id: string) => void;
}) {
  const blank: TaskDraft = {
    titre: "", chef: "", type: TYPES[0], designer_id: designers[0]?.id ?? null,
    projet_id: projects[0]?.id ?? null, charge: 1, date_livraison: toISODate(new Date()),
    sprint: null, priorite: "moyenne", statut: "backlog", notes: "",
  };
  const [form, setForm] = useState<TaskDraft>(initial ?? blank);
  const [addingProject, setAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof TaskDraft>(k: K, v: TaskDraft[K]) => setForm((f) => ({ ...f, [k]: v }));

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="studio-field">
              <span>Type de demande</span>
              <select value={form.type} onChange={(e) => set("type", e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="studio-field">
              <span>Designer assigné</span>
              <select value={form.designer_id ?? ""} onChange={(e) => set("designer_id", e.target.value || null)}>
                {designers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </label>
          </div>

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

          <label className="studio-field">
            <span>Statut</span>
            <select value={form.statut} onChange={(e) => set("statut", e.target.value as StatusId)}>
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>

          <label className="studio-field">
            <span>Notes (optionnel)</span>
            <textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Contexte, lien vers le brief..." />
          </label>

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
