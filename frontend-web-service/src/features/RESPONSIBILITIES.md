# Features Responsibilities

This file defines folder and responsibility boundaries under `src/features`.

## Standard Feature Layout

- `screens/`: page composition, route-level event handling, and UI wiring.
- `components/`: feature-local presentational components.
- `hooks/`: reusable feature state/data orchestration.
- `api/` (optional): feature-local service wrappers when needed.
- `styles/` (optional): large `sx` objects and design tokens.
- `types/` (optional): feature-local types and contracts.
- `utils/` (optional): pure helper functions with no UI concerns.

## Rules

- Keep heavy filtering/sorting/calculation out of `screens/`.
- Prefer moving reusable UI controls into `components/`.
- Prefer moving reusable pure logic into `utils/`.
- Keep screen files focused on layout and user interactions.
- Avoid cross-feature imports unless the code is truly shared.

## Current Refactor Notes

- Posts feature now centralizes sort UI in `components/PostSortSelect.tsx`.
- Posts search filter helpers are in `utils/postSearchFilters.ts`.
- Posts list sorting helpers are in `utils/postSort.ts`.
