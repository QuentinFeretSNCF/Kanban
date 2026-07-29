// Le Studio — Kanban : edge function "generate-subtasks"
//
// Appelée par le Kanban interne et par le formulaire public (demande-form)
// juste après la création d'une tâche. Elle prend le titre + les notes de
// la demande, demande à Claude d'en extraire une liste de sous-tâches
// actionnables, et renvoie un tableau de chaînes de caractères.
//
// Déploiement :
//   supabase functions deploy generate-subtasks
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// En cas d'erreur (clé absente, API indisponible, réponse malformée), la
// fonction répond toujours 200 avec { subtasks: [] } : la création de la
// tâche ne doit jamais échouer à cause de la génération IA.

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const MODEL = "claude-haiku-4-5-20251001";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractSubtasks(raw: string): string[] {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      .map((x) => x.trim())
      .slice(0, 8);
  } catch {
    return [];
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { titre, notes } = await req.json();
    const text = (notes ?? "").toString().trim();
    if (!ANTHROPIC_API_KEY || !text) {
      return new Response(JSON.stringify({ subtasks: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Voici une demande envoyée à une équipe design.

Titre : ${titre || "(sans titre)"}
Notes : """${text}"""

Extrais une liste de sous-tâches concrètes et actionnables à partir de ces notes, pour un board Kanban. Réponds uniquement avec un tableau JSON de chaînes de caractères (8 maximum), en français, sans aucun texte autour. Si rien d'actionnable ne peut être extrait, réponds avec [].`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ subtasks: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const raw = (data.content ?? []).map((b: { text?: string }) => b.text ?? "").join("");
    const subtasks = extractSubtasks(raw);

    return new Response(JSON.stringify({ subtasks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ subtasks: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
