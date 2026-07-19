import { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="studio-auth-screen">
      <div className="studio-auth-card">
        <div className="studio-mark"><span>LS</span></div>
        <h1>Le Studio — Kanban</h1>
        <p>Connecte-toi avec ton e-mail d'équipe pour accéder à l'espace de travail partagé.</p>
        {sent ? (
          <div className="studio-auth-sent">
            <Mail size={18} />
            <span>Lien de connexion envoyé à <strong>{email}</strong>. Vérifie ta boîte mail.</span>
          </div>
        ) : (
          <form onSubmit={submit} className="studio-auth-form">
            <input
              type="email"
              required
              placeholder="prenom@le-studio.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="studio-btn-primary" disabled={loading}>
              {loading ? "Envoi…" : "Recevoir le lien de connexion"}
            </button>
            {error && <div className="studio-auth-error">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
