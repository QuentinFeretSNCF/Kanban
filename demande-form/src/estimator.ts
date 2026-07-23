export type ScopeKey = "quickwin" | "recherche" | "fonctionnalite" | "produit" | "recette";
export type NatureKey = "existant" | "nouveau";
export type ComplexiteKey = "simple" | "moderee" | "elevee" | "tres_elevee";
export type TypologieKey = "agent" | "voyageurs" | "utilisateurs";
export type EnvironnementKey = "web" | "android" | "ios" | "autre";
export type EcranKey = "desktop" | "tablette" | "mobile";
export type PartiesKey = "1-2" | "3-5" | "6+";
export type AttenduKey = "maquette" | "maquettes" | "livrable" | "restitution" | "video";
export type DsCoverageKey = "je_ne_sais_pas" | "couverture_complete" | "nouveaux_composants";

export const SCOPES: Record<ScopeKey, { label: string; desc: string; days: number }> = {
  quickwin: { label: "Correction rapide (quick-win)", desc: "Ajustement ciblé, sans reconception", days: 1 },
  recherche: { label: "Recherche utilisateur", desc: "Entretiens, tests, synthèse", days: 5 },
  fonctionnalite: { label: "Fonctionnalité", desc: "Ajout ou refonte d'une fonctionnalité", days: 3 },
  produit: { label: "Produit complet", desc: "Conception de bout en bout", days: 15 },
  recette: { label: "Recette UI", desc: "Vérifie la conformité du livré aux maquettes", days: 0.5 },
};

export const PAGES_DAYS_PER_PAGE = 0.5;

export const PAGE_TIERS = [
  { min: 0, max: 5, label: "1 à 5 pages", mult: 1.0 },
  { min: 6, max: 10, label: "6 à 10 pages", mult: 1.1 },
  { min: 11, max: 20, label: "11 à 20 pages", mult: 1.2 },
  { min: 21, max: Infinity, label: "21 pages ou +", mult: 1.35 },
];

export const NATURE: Record<NatureKey, number> = { existant: 1.0, nouveau: 1.15 };
export const NATURE_LABEL: Record<NatureKey, string> = { existant: "Produit existant", nouveau: "Nouveau produit" };

export const COMPLEXITE: Record<ComplexiteKey, { label: string; mult: number; desc: string }> = {
  simple: { label: "Simple", mult: 1.0, desc: "Domaine métier limité, peu de règles, prise en main rapide" },
  moderee: { label: "Modérée", mult: 1.15, desc: "Quelques règles de gestion, clarifications ponctuelles nécessaires" },
  elevee: { label: "Élevée", mult: 1.35, desc: "Beaucoup de règles de gestion, domaine métier dense" },
  tres_elevee: { label: "Très élevée", mult: 1.6, desc: "Règles imbriquées, expertise métier indispensable, fort risque d'erreur" },
};

export const AUDIT_EXISTANT_DAYS = 2;

export const TYPOLOGIE: Record<TypologieKey, { label: string; delta: number; desc: string }> = {
  agent: { label: "Agent", delta: 0.0, desc: "Personnel interne formé à l'outil (agent de gare, back-office, exploitation)" },
  voyageurs: { label: "Voyageurs", delta: 0.15, desc: "Grand public en mobilité, non formé — exigences fortes d'accessibilité et de simplicité" },
  utilisateurs: { label: "Utilisateurs", delta: 0.05, desc: "Autres profils : partenaires, prestataires, utilisateurs hors contexte agent/voyageur" },
};

export const DROITS_ACCES = { deltaCoef: 0.2, deltaDays: 2 };

export const ENVIRONNEMENT: Record<EnvironnementKey, { label: string; delta: number }> = {
  web: { label: "Web", delta: 0.0 },
  android: { label: "Android", delta: 0.1 },
  ios: { label: "iOS", delta: 0.1 },
  autre: { label: "Autre", delta: 0.15 },
};

export const ECRANS: Record<EcranKey, { label: string; delta: number }> = {
  desktop: { label: "Desktop", delta: 0.0 },
  tablette: { label: "Tablette", delta: 0.08 },
  mobile: { label: "Mobile", delta: 0.08 },
};

export const MATURITE = {
  brief: { label: "Un brief a été préparé", sub: "Sinon : une session de cadrage est nécessaire", deltaIfNon: 1 },
  cas: { label: "Tous les cas nominaux, particuliers et critiques identifiés", sub: "Sinon : identification des cas à prévoir", deltaIfNon: 1 },
  idees: { label: "Des premières idées de conception ont été dessinées", sub: "Si oui : une partie de l'idéation est déjà faite", deltaIfOui: -2 },
};

export const PARTIES: Record<PartiesKey, number> = { "1-2": 1.0, "3-5": 1.15, "6+": 1.3 };
export const PARTIES_LABEL: Record<PartiesKey, string> = { "1-2": "1-2 parties prenantes", "3-5": "3-5 parties prenantes", "6+": "6+ parties prenantes" };

export const ATTENDUS: Record<AttenduKey, { label: string; days: number }> = {
  maquette: { label: "Maquette", days: 0 },
  maquettes: { label: "Maquettes", days: 2 },
  livrable: { label: "Livrable", days: 2 },
  restitution: { label: "Restitution", days: 1 },
  video: { label: "Vidéo", days: 3 },
};

export const RGAA_DAYS = 3;

export const DS_COVERAGE: Record<DsCoverageKey, { label: string; mult: number; days: number; desc: string }> = {
  je_ne_sais_pas: { label: "Je ne sais pas", mult: 1.0, days: 0, desc: "Couverture du DS incertaine — aucun ajustement appliqué par prudence" },
  couverture_complete: { label: "Couverture complète du DS", mult: 0.25, days: 0, desc: "Tous les composants nécessaires existent déjà dans le DS" },
  nouveaux_composants: { label: "Nouveaux composants à créer", mult: 1.0, days: 1, desc: "Le DS ne couvre pas tout — des composants sont à concevoir et documenter" },
};

export const JOURS_PAR_MOIS = 21;

export interface EstimatorState {
  scopes: Set<ScopeKey>;
  pages: number;
  nature: NatureKey;
  complexite: ComplexiteKey;
  typologie: Set<TypologieKey>;
  droitsAcces: boolean;
  environnement: Set<EnvironnementKey>;
  ecrans: Set<EcranKey>;
  maturite: { brief: boolean; cas: boolean; idees: boolean };
  parties: PartiesKey;
  attendus: Set<AttenduKey>;
  rgaa: boolean;
  dsUsed: boolean;
  dsCoverage: DsCoverageKey;
}

export function createEstimatorState(): EstimatorState {
  return {
    scopes: new Set(),
    pages: 0,
    nature: "existant",
    complexite: "simple",
    typologie: new Set(),
    droitsAcces: false,
    environnement: new Set(),
    ecrans: new Set(),
    maturite: { brief: false, cas: false, idees: false },
    parties: "1-2",
    attendus: new Set(),
    rgaa: false,
    dsUsed: false,
    dsCoverage: "je_ne_sais_pas",
  };
}

export function pagesVisible(state: EstimatorState): boolean {
  return state.scopes.has("fonctionnalite") || state.scopes.has("produit") || state.scopes.has("recette");
}

export function getPageTier(pages: number) {
  return PAGE_TIERS.find((t) => pages >= t.min && pages <= t.max) || PAGE_TIERS[0];
}

export interface EstimateResult {
  total: number;
  weeks: number;
  totalMonths: number;
  breakdown: { label: string; value: string }[];
}

export function estimate(state: EstimatorState): EstimateResult | null {
  if (state.scopes.size === 0) return null;

  const pagesOn = pagesVisible(state);
  const tier = getPageTier(state.pages);

  let base = 0;
  const breakdown: { label: string; value: string }[] = [];

  state.scopes.forEach((key) => {
    const s = SCOPES[key];
    base += s.days;
    breakdown.push({ label: s.label, value: `${s.days} j` });
  });

  const pagesDays = pagesOn ? state.pages * PAGES_DAYS_PER_PAGE : 0;
  if (pagesOn && state.pages > 0) {
    base += pagesDays;
    breakdown.push({ label: `${state.pages} pages à concevoir`, value: `${pagesDays} j` });
  }
  breakdown.push({ label: "Sous-total périmètre", value: `${base} j` });

  const natureMult = NATURE[state.nature];
  const complexiteMult = COMPLEXITE[state.complexite].mult;

  const typoSel = [...state.typologie];
  const typoDelta = typoSel.reduce((acc, k) => acc + TYPOLOGIE[k].delta, 0) + (state.droitsAcces ? DROITS_ACCES.deltaCoef : 0);
  const typoMult = 1 + typoDelta;

  const envSel = [...state.environnement];
  const envDelta = envSel.reduce((acc, k) => acc + ENVIRONNEMENT[k].delta, 0);
  const envMult = 1 + envDelta;

  const ecranSel = [...state.ecrans];
  const ecranDelta = ecranSel.reduce((acc, k) => acc + ECRANS[k].delta, 0);
  const ecranMult = 1 + ecranDelta;

  const partMult = PARTIES[state.parties];
  const dsMult = state.dsUsed ? DS_COVERAGE[state.dsCoverage].mult : 1.0;
  const dsDays = state.dsUsed ? DS_COVERAGE[state.dsCoverage].days : 0;
  const pageMult = pagesOn && state.pages > 0 ? tier.mult : 1.0;

  const totalMult = natureMult * complexiteMult * typoMult * envMult * ecranMult * partMult * dsMult * pageMult;

  let fixedAdd = 0;
  const fixedLines: { label: string; value: string }[] = [];
  if (state.nature === "existant") { fixedAdd += AUDIT_EXISTANT_DAYS; fixedLines.push({ label: "Audit de l'existant", value: `+${AUDIT_EXISTANT_DAYS} j` }); }
  if (state.rgaa) { fixedAdd += RGAA_DAYS; fixedLines.push({ label: "RGAA 4.1", value: `+${RGAA_DAYS} j` }); }
  if (dsDays > 0) { fixedAdd += dsDays; fixedLines.push({ label: "Nouveaux composants DS à créer", value: `+${dsDays} j` }); }
  if (state.droitsAcces) { fixedAdd += DROITS_ACCES.deltaDays; fixedLines.push({ label: "Gestion des profils / droits d'accès", value: `+${DROITS_ACCES.deltaDays} j` }); }

  const attendusSel = [...state.attendus];
  const attendusDays = attendusSel.reduce((acc, k) => acc + ATTENDUS[k].days, 0);
  if (attendusSel.length) fixedAdd += attendusDays;

  let maturityDelta = 0;
  const maturityLines: { label: string; value: string }[] = [];
  if (!state.maturite.brief) { maturityDelta += MATURITE.brief.deltaIfNon; maturityLines.push({ label: "Session de cadrage (brief absent)", value: `+${MATURITE.brief.deltaIfNon} j` }); }
  if (!state.maturite.cas) { maturityDelta += MATURITE.cas.deltaIfNon; maturityLines.push({ label: "Identification des cas d'usage", value: `+${MATURITE.cas.deltaIfNon} j` }); }
  if (state.maturite.idees) { maturityDelta += MATURITE.idees.deltaIfOui; maturityLines.push({ label: "Idéation déjà amorcée", value: `${MATURITE.idees.deltaIfOui} j` }); }
  fixedAdd += maturityDelta;

  let total = base * totalMult + fixedAdd;
  total = Math.max(0.5, Math.round(total * 2) / 2);
  const weeks = Math.round((total / 5) * 10) / 10;
  const totalMonths = total / JOURS_PAR_MOIS;

  breakdown.push({ label: NATURE_LABEL[state.nature], value: `×${natureMult.toFixed(2)}` });
  breakdown.push({ label: `Complexité du projet (${COMPLEXITE[state.complexite].label})`, value: `×${complexiteMult.toFixed(2)}` });
  if (typoSel.length || state.droitsAcces) {
    const parts = typoSel.map((k) => TYPOLOGIE[k].label);
    if (state.droitsAcces) parts.push("Gestion des droits d'accès");
    breakdown.push({ label: `Typologie (${parts.join(", ")})`, value: `×${typoMult.toFixed(2)}` });
  }
  if (envSel.length) breakdown.push({ label: `Environnement (${envSel.map((k) => ENVIRONNEMENT[k].label).join(", ")})`, value: `×${envMult.toFixed(2)}` });
  if (ecranSel.length) breakdown.push({ label: `Écrans (${ecranSel.map((k) => ECRANS[k].label).join(", ")})`, value: `×${ecranMult.toFixed(2)}` });
  if (pagesOn && state.pages > 0) breakdown.push({ label: `Palier pages (${tier.label})`, value: `×${pageMult}` });
  breakdown.push({ label: PARTIES_LABEL[state.parties], value: `×${partMult}` });
  if (state.dsUsed && dsMult !== 1.0) breakdown.push({ label: `Design system (${DS_COVERAGE[state.dsCoverage].label})`, value: `×${dsMult}` });
  maturityLines.forEach((l) => breakdown.push(l));
  if (attendusSel.length) breakdown.push({ label: `Attendus (${attendusSel.map((k) => ATTENDUS[k].label).join(", ")})`, value: `+${attendusDays} j` });
  fixedLines.forEach((l) => breakdown.push(l));

  return { total, weeks, totalMonths, breakdown };
}

export function buildEstimatorSummary(result: EstimateResult): string {
  const lines: string[] = [];
  lines.push("Estimation de la charge :");
  result.breakdown.forEach((l) => lines.push(`- ${l.label} : ${l.value}`));
  lines.push(`Total estimé : ${result.total} j (~${result.weeks} semaine${result.weeks > 1 ? "s" : ""})`);
  return lines.join("\n");
}
