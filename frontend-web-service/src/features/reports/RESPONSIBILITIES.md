# Reports Feature Responsibilities

Scope: report list/detail screens and related data composition.

## Structure

- `screens/`: page composition and user interaction wiring.
- `hooks/`: screen-use computation and data retrieval orchestration.
- `components/`: local, feature-specific presentational components.
- `styles/`: feature-local design tokens and `sx` style objects.

## Rules

- Move heavy calculations out of `screens/` into `hooks/` or `api/mock`.
- Keep reusable report UI blocks in `components/`.
- Keep large style objects in `styles/` and import into screens/components.
- Consume report data through hooks/mock APIs, not raw db definitions in screen code.
