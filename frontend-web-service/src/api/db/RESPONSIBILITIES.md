# Mock DB Responsibilities

`src/api/db` is treated as a mock database source.

## Responsibilities

- Define raw datasets and source-level types.
- Avoid view-specific filtering/aggregation logic.
- Keep deterministic data generation utilities near source definitions.

## Rules

- Do not import React/UI modules here.
- Do not implement screen-specific business composition here.
- Screen-facing transformation belongs in `src/api/mock`.
