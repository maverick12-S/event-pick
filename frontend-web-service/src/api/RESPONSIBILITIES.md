# API Layer Responsibilities

The `src/api` directory is the application data access layer.

## Subdirectories

- `db/`: mock DB source definitions (seed-like raw data).
- `mock/`: mock fetch/composition layer that reads from `db/` and returns screen-ready shapes.

## Files

- `client.ts`, `http.ts`, `services.ts`, `openapiClient.ts`: runtime API client concerns.
- `endpoints.ts`, `queryKeys.ts`: endpoint/query constants.
- `tokenService.ts`: auth token storage/refresh helpers.

## Rules

- Keep UI imports out of `api/`.
- Keep React component logic out of `api/`.
- Keep DB-like raw data in `db/` and transformation/filtering in `mock/`.
