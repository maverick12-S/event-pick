# Posts Feature Responsibilities

Scope: post create/list/detail/drafts/scheduled management.

## Structure

- `screens/`: page layout and interaction handling.
- `hooks/`: reusable state/data logic for post screens.
- `components/`: post-specific presentational UI pieces.
- `utils/`: pure helper functions (filter mapping, sorting, formatting).
- `types/` (optional): post feature local types/contracts.
- `styles/` (optional): feature-local style objects and design tokens.

## Rules

- Prefer `api/mock` access over direct `api/db` data usage in screens.
- Keep data transformations in hooks or mock API layer.
- Keep shared screen helpers in `utils/` instead of duplicating across screens.
- Keep repeated `sx` definitions in `styles/` when size grows.
- Keep style/UX behavior unchanged when refactoring responsibilities.
