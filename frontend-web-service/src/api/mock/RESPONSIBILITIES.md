# Mock API Responsibilities

`src/api/mock` provides mock retrieval functions that mimic server/API behavior.

## Responsibilities

- Read from `src/api/db` and return runtime-ready data.
- Implement filtering, sorting, mapping, and aggregation.
- Provide stable call signatures that can later map to real API clients.

## Rules

- Keep UI rendering out of this layer.
- Keep React hook usage out of this layer.
- Prefer pure functions and explicit input/output types.
