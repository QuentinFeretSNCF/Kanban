# shadcn/ui Playground

Outil pour explorer les 54 composants de [shadcn/ui](https://ui.shadcn.com) (style `new-york`, Tailwind v4) et tester leurs props en direct, dans l'optique de construire le design system du Kanban.

## Démarrer

```bash
cd shadcn-playground
npm install
npm run dev
```

## Fonctionnement

- `src/components/ui/*` : composants shadcn/ui téléchargés depuis le dépôt officiel (adaptés pour ce projet, imports en `@/components/ui/...`).
- `src/playground/registry.tsx` : pour chaque composant, une définition `ComponentDemo` (props configurables, rendu, extrait de code).
- `src/playground/Playground.tsx` : panneau générique qui affiche les contrôles (select/switch/input), la prévisualisation live et le code correspondant, avec bouton copier.
- `src/App.tsx` : navigation latérale par catégorie + recherche, bascule thème clair/sombre.

Pour ajouter un composant ou enrichir ses props testables, ajoute une entrée dans `demos` (`registry.tsx`).
