import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { TYPES } from "./constants";
import { sprintKeyFor, toISODate } from "./dateUtils";
import { buildEstimatorSummary, createEstimatorState, estimate, type EstimatorState } from "./estimator";
import Estimator from "./components/Estimator";

interface Project {
  id: string;
  name: string;
  color: string;
}

type Status = "loading" | "ready" | "submitting" | "success" | "error";

export default function App() {
  const [status, setStatus] = useState<Status>("loading");
  const [projects, setProjects] = useState<Project[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [titre, setTitre] = useState("");
  const [chef, setChef] = useState("");
  const [projetId, setProjetId] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [dateLivraison, setDateLivraison] = useState(toISODate(new Date()));
  const [notes, setNotes] = useState("");
  const [estimatorState, setEstimatorState] = useState<EstimatorState>(createEstimatorState);
  const [estimatedCharge, setEstimatedCharge] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("projects").select("id,name,color").order("name");
      if (error) { setErrorMsg(error.message); setStatus("error"); return; }
      setProjects((data ?? []) as Project[]);
      if (data && data.length > 0) setProjetId((data[0] as Project).id);
      setStatus("ready");
    })();
  }, []);

  const toggleType = (t: string) => {
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };

  const resetForm = () => {
    setTitre(""); setChef(""); setTypes([]); setDateLivraison(toISODate(new Date())); setNotes("");
    setEstimatorState(createEstimatorState()); setEstimatedCharge(null);
    if (projects.length > 0) setProjetId(projects[0].id);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const estimateResult = estimate(estimatorState);
    if (!titre.trim() || !chef.trim() || !projetId || estimatedCharge == null || !estimateResult) return;
    setStatus("submitting");
    setErrorMsg(null);
    const finalNotes = [notes.trim(), buildEstimatorSummary(estimateResult)].filter(Boolean).join("\n\n");
    const { error } = await supabase.from("tasks").insert({
      titre: titre.trim(),
      chef: chef.trim(),
      types,
      projet_id: projetId,
      charge: estimatedCharge,
      date_livraison: dateLivraison || null,
      sprint: sprintKeyFor(dateLivraison),
      priorite: "moyenne",
      statut: "backlog",
      difficulte: null,
      notes: finalNotes,
    });
    if (error) { setErrorMsg(error.message); setStatus("error"); return; }
    resetForm();
    setStatus("success");
  };

  if (status === "loading") {
    return <div className="form-shell"><div className="form-boot">Chargement…</div></div>;
  }

  return (
    <div className="form-shell">
      <div className="form-card">
        <div className="form-mark"><span>LS</span></div>
        <h1>Nouvelle demande</h1>
        <p className="form-intro">
          Décris ta demande — elle arrivera directement dans le backlog de l'équipe design du Studio,
          avec une charge estimée automatiquement à partir de tes réponses. Aucune connexion n'est nécessaire.
        </p>

        {status === "success" && (
          <div className="form-success">
            Demande envoyée. L'équipe design la retrouvera dans son backlog et reviendra vers toi pour la planifier.
            <button type="button" className="form-btn-ghost" onClick={() => setStatus("ready")}>Envoyer une autre demande</button>
          </div>
        )}

        {status !== "success" && (
          <form onSubmit={submit} className="form-fields">
            <label className="form-field">
              <span>Intitulé de la demande</span>
              <input required value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex : Refonte du parcours de connexion" />
            </label>

            <label className="form-field">
              <span>Ton nom</span>
              <input required value={chef} onChange={(e) => setChef(e.target.value)} placeholder="Prénom Nom" />
            </label>

            <label className="form-field">
              <span>Projet concerné</span>
              <select required value={projetId} onChange={(e) => setProjetId(e.target.value)}>
                {projects.length === 0 && <option value="">Aucun projet disponible</option>}
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>

            <label className="form-field">
              <span>Type(s) de demande</span>
              <div className="form-chips">
                {TYPES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`form-chip ${types.includes(t) ? "active" : ""}`}
                    onClick={() => toggleType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </label>

            <label className="form-field">
              <span>Date de livraison souhaitée</span>
              <input type="date" required value={dateLivraison} onChange={(e) => setDateLivraison(e.target.value)} />
            </label>

            <label className="form-field">
              <span>Notes / contexte (optionnel)</span>
              <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contexte, contraintes, lien vers un brief…" />
            </label>

            <Estimator state={estimatorState} setState={setEstimatorState} onEstimateChange={setEstimatedCharge} />

            {status === "error" && errorMsg && <div className="form-error">{errorMsg}</div>}

            <button type="submit" className="form-btn-primary" disabled={status === "submitting" || projects.length === 0 || estimatedCharge == null}>
              {status === "submitting" ? "Envoi…" : "Envoyer la demande"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
