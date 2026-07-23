import { useEffect } from "react";
import type {
  AttenduKey, ComplexiteKey, DsCoverageKey, EcranKey, EnvironnementKey,
  EstimatorState, NatureKey, PartiesKey, ScopeKey, TypologieKey,
} from "../estimator";
import {
  ATTENDUS, COMPLEXITE, DS_COVERAGE, ECRANS, ENVIRONNEMENT, MATURITE,
  PARTIES, SCOPES, TYPOLOGIE, estimate, getPageTier, pagesVisible,
} from "../estimator";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="est-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="est-slider" />
    </label>
  );
}

function TileGrid<K extends string, T extends { label: string; desc?: string }>({
  items, selected, onToggle, badge, cols = 2,
}: {
  items: Record<K, T>;
  selected: Set<K>;
  onToggle: (key: K) => void;
  badge: (item: T) => string;
  cols?: number;
}) {
  return (
    <div className="est-tile-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {(Object.entries(items) as [K, T][]).map(([key, item]) => (
        <div
          key={key}
          className={`est-tile ${selected.has(key) ? "active" : ""}`}
          onClick={() => onToggle(key)}
        >
          <div className="est-tile-name">
            <span>{item.label}</span>
            <span className="est-tile-badge">{badge(item)}</span>
          </div>
          {item.desc && <div className="est-tile-desc">{item.desc}</div>}
        </div>
      ))}
    </div>
  );
}

function PillGroup<K extends string>({
  options, value, onChange,
}: {
  options: { value: K; label: string }[];
  value: K;
  onChange: (v: K) => void;
}) {
  return (
    <div className="est-pill-group">
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          className={`est-pill ${value === opt.value ? "active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Estimator({
  state, setState, onEstimateChange,
}: {
  state: EstimatorState;
  setState: React.Dispatch<React.SetStateAction<EstimatorState>>;
  onEstimateChange: (days: number | null) => void;
}) {
  const toggleInSet = <K,>(key: keyof EstimatorState, value: K) => {
    setState((s) => {
      const set = new Set(s[key] as unknown as Set<K>);
      if (set.has(value)) set.delete(value); else set.add(value);
      return { ...s, [key]: set };
    });
  };

  const result = estimate(state);
  const showPages = pagesVisible(state);
  const tier = getPageTier(state.pages);

  useEffect(() => {
    onEstimateChange(result ? result.total : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.total]);

  return (
    <div className="est-panel">
      <div className="est-panel-head">
        <span>Estimation de la charge</span>
        <span className="est-panel-sub">Sert à calculer automatiquement la charge (en jours) de la demande.</span>
      </div>

      <div className="est-section">
        <div className="est-section-title">Périmètre de la demande</div>
        <div className="est-section-desc">Plusieurs périmètres peuvent être cumulés.</div>
        <TileGrid
          items={SCOPES}
          selected={state.scopes}
          onToggle={(k) => toggleInSet("scopes", k)}
          badge={(item) => `${item.days} j`}
          cols={2}
        />
      </div>

      {showPages && (
        <div className="est-section est-conditional">
          <div className="est-section-title">Nombre de pages concernées</div>
          <div className="est-pages-row">
            <div>
              <div className="est-pages-label">Écrans ou vues distinctes à designer</div>
            </div>
            <input
              type="number" min={0} step={1} value={state.pages}
              onChange={(e) => setState((s) => ({ ...s, pages: Math.max(0, parseInt(e.target.value) || 0) }))}
            />
          </div>
          {state.pages > 0 && <div className="est-hint">Palier : {tier.label} (×{tier.mult})</div>}
        </div>
      )}

      <div className="est-section">
        <div className="est-section-title">Nature du produit</div>
        <PillGroup<NatureKey>
          options={[{ value: "existant", label: "Produit existant" }, { value: "nouveau", label: "Nouveau produit" }]}
          value={state.nature}
          onChange={(v) => setState((s) => ({ ...s, nature: v }))}
        />
      </div>

      <div className="est-section">
        <div className="est-section-title">Complexité du projet</div>
        <div className="est-section-desc">Prise en main du domaine et volume de règles de gestion.</div>
        <PillGroup<ComplexiteKey>
          options={(Object.keys(COMPLEXITE) as ComplexiteKey[]).map((k) => ({ value: k, label: COMPLEXITE[k].label }))}
          value={state.complexite}
          onChange={(v) => setState((s) => ({ ...s, complexite: v }))}
        />
        <div className="est-hint">{COMPLEXITE[state.complexite].desc}</div>
      </div>

      <div className="est-section">
        <div className="est-section-title">Typologie d'utilisateurs</div>
        <div className="est-section-desc">Cumulable — cochez toutes les typologies concernées.</div>
        <TileGrid
          items={TYPOLOGIE}
          selected={state.typologie}
          onToggle={(k) => toggleInSet("typologie", k)}
          badge={(item) => `${item.delta >= 0 ? "+" : ""}${Math.round(item.delta * 100)}%`}
          cols={3}
        />
        <div className="est-toggle-row" style={{ marginTop: 10 }}>
          <div>
            <div className="est-toggle-label">Gestion des profils et droits d'accès</div>
            <div className="est-toggle-sub">Le produit distingue des rôles avec des permissions différentes</div>
          </div>
          <Toggle checked={state.droitsAcces} onChange={(v) => setState((s) => ({ ...s, droitsAcces: v }))} />
        </div>
      </div>

      <div className="est-section">
        <div className="est-section-title">Environnement de l'outil</div>
        <TileGrid
          items={ENVIRONNEMENT}
          selected={state.environnement}
          onToggle={(k) => toggleInSet("environnement", k)}
          badge={(item) => `${item.delta >= 0 ? "+" : ""}${Math.round(item.delta * 100)}%`}
          cols={2}
        />
      </div>

      <div className="est-section">
        <div className="est-section-title">Plateformes concernées (tailles d'écran)</div>
        <TileGrid
          items={ECRANS}
          selected={state.ecrans}
          onToggle={(k) => toggleInSet("ecrans", k)}
          badge={(item) => `${item.delta >= 0 ? "+" : ""}${Math.round(item.delta * 100)}%`}
          cols={3}
        />
      </div>

      <div className="est-section">
        <div className="est-section-title">Maturité sur la demande</div>
        <div className="est-toggle-stack">
          {(Object.keys(MATURITE) as (keyof typeof MATURITE)[]).map((key) => (
            <div className="est-toggle-row" key={key}>
              <div>
                <div className="est-toggle-label">{MATURITE[key].label}</div>
                <div className="est-toggle-sub">{MATURITE[key].sub}</div>
              </div>
              <Toggle
                checked={state.maturite[key]}
                onChange={(v) => setState((s) => ({ ...s, maturite: { ...s.maturite, [key]: v } }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="est-section">
        <div className="est-section-title">Nombre de parties prenantes</div>
        <PillGroup<PartiesKey>
          options={(Object.keys(PARTIES) as PartiesKey[]).map((k) => ({ value: k, label: k }))}
          value={state.parties}
          onChange={(v) => setState((s) => ({ ...s, parties: v }))}
        />
      </div>

      <div className="est-section">
        <div className="est-section-title">Attendus des rendus</div>
        <div className="est-section-desc">Cumulable — types de livrables attendus.</div>
        <TileGrid
          items={ATTENDUS}
          selected={state.attendus}
          onToggle={(k) => toggleInSet("attendus", k)}
          badge={(item) => (item.days === 0 ? "inclus" : `+${item.days} j`)}
          cols={3}
        />
      </div>

      <div className="est-section">
        <div className="est-toggle-row">
          <div>
            <div className="est-toggle-label">Respecter le RGAA 4.1</div>
            <div className="est-toggle-sub">Ajoute un audit et des ajustements d'accessibilité</div>
          </div>
          <Toggle checked={state.rgaa} onChange={(v) => setState((s) => ({ ...s, rgaa: v }))} />
        </div>
      </div>

      <div className="est-section">
        <div className="est-toggle-row">
          <div>
            <div className="est-toggle-label">Utiliser le Design System existant</div>
            <div className="est-toggle-sub">Réutiliser des composants déjà conçus accélère la production</div>
          </div>
          <Toggle checked={state.dsUsed} onChange={(v) => setState((s) => ({ ...s, dsUsed: v }))} />
        </div>
        {state.dsUsed && (
          <div className="est-conditional-inline">
            <div className="est-section-desc">Le DS couvre-t-il la totalité de la demande ?</div>
            <PillGroup<DsCoverageKey>
              options={(Object.keys(DS_COVERAGE) as DsCoverageKey[]).map((k) => ({ value: k, label: DS_COVERAGE[k].label }))}
              value={state.dsCoverage}
              onChange={(v) => setState((s) => ({ ...s, dsCoverage: v }))}
            />
            <div className="est-hint">{DS_COVERAGE[state.dsCoverage].desc}</div>
          </div>
        )}
      </div>

      <div className="est-result">
        {!result ? (
          <div className="est-warning">Sélectionne au moins un périmètre pour estimer la charge.</div>
        ) : (
          <>
            <div className="est-total">{result.total} j <span>≈ {result.weeks} semaine{result.weeks > 1 ? "s" : ""}</span></div>
            <details className="est-breakdown-details">
              <summary>Détail du calcul</summary>
              <ul className="est-breakdown">
                {result.breakdown.map((l, i) => (
                  <li key={i}><span>{l.label}</span><span>{l.value}</span></li>
                ))}
              </ul>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
