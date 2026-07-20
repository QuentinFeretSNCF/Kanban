import { useEffect, useState, useCallback, useMemo } from "react";
import type { Session } from "@supabase/supabase-js";
import { CalendarDays, FolderKanban, GripVertical, LayoutGrid, LogOut, Plus, Users } from "lucide-react";
import { supabase } from "./supabaseClient";
import type { Designer, Filters, Meeting, Project, StatusId, Subtask, Task, TaskDraft, TaskRow } from "./types";
import { PROJECT_COLORS } from "./constants";
import { applyTheme, getInitialTheme, type Theme } from "./theme";
import Auth from "./components/Auth";
import ThemeToggle from "./components/ThemeToggle";
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

interface TaskDesignerLink { task_id: string; designer_id: string; }

function upsertById<T extends { id: string }>(list: T[], row: T): T[] {
  const idx = list.findIndex((x) => x.id === row.id);
  if (idx >= 0) { const copy = list.slice(); copy[idx] = row; return copy; }
  return [...list, row];
}
function removeById<T extends { id: string }>(list: T[], id: string): T[] {
  return list.filter((x) => x.id !== id);
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => { applyTheme(theme); }, [theme]);

  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [taskRows, setTaskRows] = useState<TaskRow[]>([]);
  const [taskDesignerLinks, setTaskDesignerLinks] = useState<TaskDesignerLink[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<ViewId>("kanban");
  const [modalTaskId, setModalTaskId] = useState<string | null>(null);
  const [creatingTask, setCreatingTask] = useState(false);
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
      const [
        { data: d, error: dErr },
        { data: p, error: pErr },
        { data: t, error: tErr },
        { data: td, error: tdErr },
        { data: st, error: stErr },
        { data: mt, error: mtErr },
      ] = await Promise.all([
        supabase.from("designers").select("*").order("created_at"),
        supabase.from("projects").select("*").order("created_at"),
        supabase.from("tasks").select("*").order("created_at"),
        supabase.from("task_designers").select("*"),
        supabase.from("subtasks").select("*").order("position"),
        supabase.from("meetings").select("*"),
      ]);
      if (cancelled) return;
      const err = dErr || pErr || tErr || tdErr || stErr || mtErr;
      if (err) setErrorMsg(err.message);
      setDesigners(d ?? []);
      setProjects(p ?? []);
      setTaskRows((t ?? []) as TaskRow[]);
      setTaskDesignerLinks((td ?? []) as TaskDesignerLink[]);
      setSubtasks((st ?? []) as Subtask[]);
      setMeetings((mt ?? []) as Meeting[]);
      setDataLoading(false);
    })();

    const channel = supabase
      .channel("le-studio-kanban")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        if (payload.eventType === "DELETE") setTaskRows((cur) => removeById(cur, (payload.old as TaskRow).id));
        else setTaskRows((cur) => upsertById(cur, payload.new as TaskRow));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "designers" }, (payload) => {
        if (payload.eventType === "DELETE") setDesigners((cur) => removeById(cur, (payload.old as Designer).id));
        else setDesigners((cur) => upsertById(cur, payload.new as Designer));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, (payload) => {
        if (payload.eventType === "DELETE") setProjects((cur) => removeById(cur, (payload.old as Project).id));
        else setProjects((cur) => upsertById(cur, payload.new as Project));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "task_designers" }, (payload) => {
        if (payload.eventType === "DELETE") {
          const old = payload.old as TaskDesignerLink;
          setTaskDesignerLinks((cur) => cur.filter((l) => !(l.task_id === old.task_id && l.designer_id === old.designer_id)));
        } else {
          const row = payload.new as TaskDesignerLink;
          setTaskDesignerLinks((cur) => (cur.some((l) => l.task_id === row.task_id && l.designer_id === row.designer_id) ? cur : [...cur, row]));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "subtasks" }, (payload) => {
        if (payload.eventType === "DELETE") setSubtasks((cur) => removeById(cur, (payload.old as Subtask).id));
        else setSubtasks((cur) => upsertById(cur, payload.new as Subtask));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "meetings" }, (payload) => {
        if (payload.eventType === "DELETE") setMeetings((cur) => removeById(cur, (payload.old as Meeting).id));
        else setMeetings((cur) => upsertById(cur, payload.new as Meeting));
      })
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [session]);

  const tasks: Task[] = useMemo(() => {
    return taskRows.map((row) => ({
      ...row,
      designer_ids: taskDesignerLinks.filter((l) => l.task_id === row.id).map((l) => l.designer_id),
      subtasks: subtasks.filter((s) => s.task_id === row.id),
    }));
  }, [taskRows, taskDesignerLinks, subtasks]);

  const modalTask = modalTaskId ? tasks.find((t) => t.id === modalTaskId) ?? null : null;
  const showModal = creatingTask || modalTaskId !== null;

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

  const syncTaskDesigners = useCallback(async (taskId: string, designerIds: string[]) => {
    const { error: delErr } = await supabase.from("task_designers").delete().eq("task_id", taskId);
    if (delErr) { setErrorMsg(delErr.message); return; }
    setTaskDesignerLinks((cur) => cur.filter((l) => l.task_id !== taskId));
    if (designerIds.length === 0) return;
    const rows = designerIds.map((designer_id) => ({ task_id: taskId, designer_id }));
    const { data, error } = await supabase.from("task_designers").insert(rows).select();
    if (error) { setErrorMsg(error.message); return; }
    setTaskDesignerLinks((cur) => [...cur, ...((data ?? []) as TaskDesignerLink[])]);
  }, []);

  const saveTask = useCallback(async (draft: TaskDraft) => {
    const { id, designer_ids } = draft;
    const rest: Omit<TaskRow, "id"> = {
      titre: draft.titre,
      chef: draft.chef,
      types: draft.types,
      difficulte: draft.difficulte,
      projet_id: draft.projet_id,
      charge: draft.charge,
      date_livraison: draft.date_livraison,
      sprint: draft.sprint,
      priorite: draft.priorite,
      statut: draft.statut,
      notes: draft.notes,
    };
    if (id) {
      const { data, error } = await supabase.from("tasks").update(rest).eq("id", id).select().single();
      if (error) { setErrorMsg(error.message); return; }
      setTaskRows((cur) => upsertById(cur, data as TaskRow));
      await syncTaskDesigners(id, designer_ids);
    } else {
      const { data, error } = await supabase.from("tasks").insert(rest).select().single();
      if (error) { setErrorMsg(error.message); return; }
      const newTask = data as TaskRow;
      setTaskRows((cur) => upsertById(cur, newTask));
      await syncTaskDesigners(newTask.id, designer_ids);
    }
    setCreatingTask(false);
    setModalTaskId(null);
  }, [syncTaskDesigners]);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) setErrorMsg(error.message);
    else {
      setTaskRows((cur) => removeById(cur, id));
      setTaskDesignerLinks((cur) => cur.filter((l) => l.task_id !== id));
      setSubtasks((cur) => cur.filter((s) => s.task_id !== id));
    }
    setCreatingTask(false);
    setModalTaskId(null);
  }, []);

  const moveTask = useCallback(async (id: string, statut: StatusId) => {
    setTaskRows((cur) => cur.map((t) => (t.id === id ? { ...t, statut } : t)));
    const { error } = await supabase.from("tasks").update({ statut }).eq("id", id);
    if (error) setErrorMsg(error.message);
  }, []);

  const addSubtask = useCallback(async (taskId: string, titre: string) => {
    const position = subtasks.filter((s) => s.task_id === taskId).length;
    const { data, error } = await supabase.from("subtasks").insert({ task_id: taskId, titre, position }).select().single();
    if (error) { setErrorMsg(error.message); return; }
    setSubtasks((cur) => upsertById(cur, data as Subtask));
  }, [subtasks]);

  const toggleSubtask = useCallback(async (id: string, fait: boolean) => {
    setSubtasks((cur) => cur.map((s) => (s.id === id ? { ...s, fait } : s)));
    const { error } = await supabase.from("subtasks").update({ fait }).eq("id", id);
    if (error) setErrorMsg(error.message);
  }, []);

  const deleteSubtask = useCallback(async (id: string) => {
    const { error } = await supabase.from("subtasks").delete().eq("id", id);
    if (error) setErrorMsg(error.message);
    else setSubtasks((cur) => removeById(cur, id));
  }, []);

  const setMeetingCharge = useCallback(async (designerId: string, sprint: string, charge: number) => {
    const existing = meetings.find((m) => m.designer_id === designerId && m.sprint === sprint);
    if (charge <= 0) {
      if (existing) {
        const { error } = await supabase.from("meetings").delete().eq("id", existing.id);
        if (error) setErrorMsg(error.message);
        else setMeetings((cur) => removeById(cur, existing.id));
      }
      return;
    }
    if (existing) {
      const { error } = await supabase.from("meetings").update({ charge }).eq("id", existing.id);
      if (error) setErrorMsg(error.message);
      else setMeetings((cur) => cur.map((m) => (m.id === existing.id ? { ...m, charge } : m)));
    } else {
      const { data, error } = await supabase.from("meetings")
        .insert({ designer_id: designerId, sprint, charge, titre: "Réunions" })
        .select().single();
      if (error) { setErrorMsg(error.message); return; }
      setMeetings((cur) => upsertById(cur, data as Meeting));
    }
  }, [meetings]);

  const openNew = () => { setModalTaskId(null); setCreatingTask(true); };
  const openEdit = (task: Task) => { setCreatingTask(false); setModalTaskId(task.id); };
  const closeModal = () => { setCreatingTask(false); setModalTaskId(null); };

  const onDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData("text/task-id", id);
  const onDrop = (e: React.DragEvent, statusId: StatusId) => {
    const id = e.dataTransfer.getData("text/task-id");
    if (id) moveTask(id, statusId);
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  if (authLoading) return <div className="studio-boot">Chargement…</div>;
  if (!session) return <Auth theme={theme} onToggleTheme={toggleTheme} />;

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
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
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
          {view === "sprints" && (
            <SprintsView tasks={tasks} designers={designers} projects={projects} meetings={meetings} onEdit={openEdit} onSetMeetingCharge={setMeetingCharge} />
          )}
          {view === "calendrier" && <CalendarView tasks={tasks} designers={designers} projects={projects} onEdit={openEdit} />}
          {view === "projets" && (
            <ProjectsView tasks={tasks} designers={designers} projects={projects} onAddProject={addProject} onRenameProject={renameProject} onEdit={openEdit} />
          )}
          {view === "equipe" && <TeamView tasks={tasks} designers={designers} meetings={meetings} onRenameDesigner={renameDesigner} />}
        </>
      )}

      {showModal && (
        <TaskModal
          initial={modalTask}
          designers={designers}
          projects={projects}
          onAddProject={addProject}
          onClose={closeModal}
          onSave={saveTask}
          onDelete={deleteTask}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
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
