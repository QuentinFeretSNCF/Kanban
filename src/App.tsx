import { useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { CalendarDays, FolderKanban, GripVertical, LayoutGrid, LogOut, Plus, Users } from "lucide-react";
import { supabase } from "./supabaseClient";
import type { Designer, Filters, Project, StatusId, Task, TaskDraft } from "./types";
import { PROJECT_COLORS } from "./constants";
import Auth from "./components/Auth";
import TaskModal from "./components/TaskModal";
import KanbanView from "./components/KanbanView";
import SprintsView from "./components/SprintsView";
import CalendarView from "./components/CalendarView";
import TeamView from "./components/TeamView";
import ProjectsView from "./components/ProjectsView";

type ViewId = "kanban" | "sprints" | "calendrier" | "projets" | "equipe";

const TABS: { id: ViewId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "kanban", label: "Kanban", icon: LayoutGrid },
  { id: "sprints", label: "Sprints", icon: GripVertical },
  { id: "calendrier", label: "Calendrier", icon: CalendarDays },
  { id: "projets", label: "Projets", icon: FolderKanban },
  { id: "equipe", label: "Équipe", icon: Users },
];

function upsertById<T extends { id: string }>(list: T[], row: T): T[] {
  const idx = list.findIndex((x) => x.id === row.id);
  if (idx >= 0) { const copy = list.slice(); copy[idx] = row; return copy; }
  return [...list, row];
}
function removeById<T extends { id: string }>(list: T[], id: string): T[] {
  return list.filter((x) => x.id !== id);
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<ViewId>("kanban");
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({ designerId: "all", projetId: "all", priorite: "all", search: "" });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    (async () => {
      setDataLoading(true);
      const [{ data: d, error: dErr }, { data: p, error: pErr }, { data: t, error: tErr }] = await Promise.all([
        supabase.from("designers").select("*").order("created_at"),
        supabase.from("projects").select("*").order("created_at"),
        supabase.from("tasks").select("*").order("created_at"),
      ]);
      if (cancelled) return;
      if (dErr || pErr || tErr) setErrorMsg((dErr || pErr || tErr)?.message ?? "Erreur de chargement");
      setDesigners(d ?? []);
      setProjects(p ?? []);
      setTasks((t ?? []) as Task[]);
      setDataLoading(false);
    })();

    const channel = supabase
      .channel("le-studio-kanban")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        if (payload.eventType === "DELETE") setTasks((cur) => removeById(cur, (payload.old as Task).id));
        else setTasks((cur) => upsertById(cur, payload.new as Task));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "designers" }, (payload) => {
        if (payload.eventType === "DELETE") setDesigners((cur) => removeById(cur, (payload.old as Designer).id));
        else setDesigners((cur) => upsertById(cur, payload.new as Designer));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, (payload) => {
        if (payload.eventType === "DELETE") setProjects((cur) => removeById(cur, (payload.old as Project).id));
        else setProjects((cur) => upsertById(cur, payload.new as Project));
      })
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [session]);

  const addProject = useCallback(async (name: string): Promise<string> => {
    const color = PROJECT_COLORS[projects.length % PROJECT_COLORS.length];
    const { data, error } = await supabase.from("projects").insert({ name, color }).select().single();
    if (error) { setErrorMsg(error.message); throw error; }
    setProjects((cur) => upsertById(cur, data as Project));
    return (data as Project).id;
  }, [projects.length]);

  const renameProject = useCallback(async (id: string, name: string) => {
    const { error } = await supabase.from("projects").update({ name }).eq("id", id);
    if (error) setErrorMsg(error.message);
    else setProjects((cur) => cur.map((p) => (p.id === id ? { ...p, name } : p)));
  }, []);

  const renameDesigner = useCallback(async (id: string, name: string) => {
    const { error } = await supabase.from("designers").update({ name }).eq("id", id);
    if (error) setErrorMsg(error.message);
    else setDesigners((cur) => cur.map((d) => (d.id === id ? { ...d, name } : d)));
  }, []);

  const saveTask = useCallback(async (draft: TaskDraft) => {
    if (draft.id) {
      const { id, ...rest } = draft;
      const { data, error } = await supabase.from("tasks").update(rest).eq("id", id).select().single();
      if (error) { setErrorMsg(error.message); return; }
      setTasks((cur) => upsertById(cur, data as Task));
    } else {
      const { id: _omit, ...rest } = draft;
      const { data, error } = await supabase.from("tasks").insert(rest).select().single();
      if (error) { setErrorMsg(error.message); return; }
      setTasks((cur) => upsertById(cur, data as Task));
    }
    setShowModal(false);
    setModalTask(null);
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) setErrorMsg(error.message);
    else setTasks((cur) => removeById(cur, id));
    setShowModal(false);
    setModalTask(null);
  }, []);

  const moveTask = useCallback(async (id: string, statut: StatusId) => {
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, statut } : t)));
    const { error } = await supabase.from("tasks").update({ statut }).eq("id", id);
    if (error) setErrorMsg(error.message);
  }, []);

  const openNew = () => { setModalTask(null); setShowModal(true); };
  const openEdit = (task: Task) => { setModalTask(task); setShowModal(true); };

  const onDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData("text/task-id", id);
  const onDrop = (e: React.DragEvent, statusId: StatusId) => {
    const id = e.dataTransfer.getData("text/task-id");
    if (id) moveTask(id, statusId);
  };

  if (authLoading) return <div className="studio-boot">Chargement…</div>;
  if (!session) return <Auth />;

  return (
    <div className="studio-root">
      <div className="studio-header">
        <div className="studio-brand">
          <div className="studio-mark"><span>LS</span></div>
          <div>
            <h1>Le Studio — Kanban</h1>
            <p>{designers.length} designers · sprints d'une semaine</p>
          </div>
        </div>

        <div className="studio-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`studio-tab ${view === tab.id ? "active" : ""}`}
              onClick={() => setView(tab.id)}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="studio-btn-primary" onClick={openNew}>
            <Plus size={15} /> Nouvelle demande
          </button>
          <button className="studio-icon-btn" title={`Déconnecter ${session.user.email ?? ""}`} onClick={() => supabase.auth.signOut()}>
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {dataLoading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--ink-soft)", fontSize: 13 }}>Chargement de l'espace de travail…</div>
      ) : (
        <>
          {view === "kanban" && (
            <KanbanView
              tasks={tasks} designers={designers} projects={projects} filters={filters} setFilters={setFilters}
              onEdit={openEdit} onDrop={onDrop} onDragStart={onDragStart}
            />
          )}
          {view === "sprints" && <SprintsView tasks={tasks} designers={designers} projects={projects} onEdit={openEdit} />}
          {view === "calendrier" && <CalendarView tasks={tasks} designers={designers} projects={projects} onEdit={openEdit} />}
          {view === "projets" && (
            <ProjectsView tasks={tasks} designers={designers} projects={projects} onAddProject={addProject} onRenameProject={renameProject} onEdit={openEdit} />
          )}
          {view === "equipe" && <TeamView tasks={tasks} designers={designers} onRenameDesigner={renameDesigner} />}
        </>
      )}

      {showModal && (
        <TaskModal
          initial={modalTask}
          designers={designers}
          projects={projects}
          onAddProject={addProject}
          onClose={() => { setShowModal(false); setModalTask(null); }}
          onSave={saveTask}
          onDelete={deleteTask}
        />
      )}

      {errorMsg && (
        <div className="studio-save-flag" onClick={() => setErrorMsg(null)} title="Cliquer pour masquer">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
