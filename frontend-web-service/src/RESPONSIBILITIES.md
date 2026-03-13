# Source Responsibilities

This file defines the high-level responsibility boundaries in `src/`.

## Directory Rules

- `api/`: network and data access layer only. No UI rendering.
- `assets/`: static files only (images, fonts, icons).
- `components/`: domain-agnostic reusable UI components.
- `contexts/`: shared app state container definitions.
- `features/`: feature modules (`components`, `hooks`, `screens`, optional feature `api`).
- `layouts/`: page skeleton and shared shell layout.
- `lib/`: generic utility helpers.
- `routes/`: route definitions and guards.
- `styles/`: global styling and themes.
- `types/`: shared type definitions.

## Data Flow Rule

Use this direction and do not bypass layers:

`screen -> hook -> api/mock or api client -> api/db (mock source)`

Screens should not include data construction/aggregation logic that can live in `hooks` or `api/mock`.
