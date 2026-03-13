# Accounts Feature Responsibilities

## screens/
- Route-level composition and interaction wiring for account list pages.
- Avoid embedding data-source details here.

## hooks/
- React Query hooks for account list retrieval and caching.

## components/
- Reusable presentational UI pieces shared by accounts screens.
- Keep business logic and navigation outside these components.

## constants/
- Feature-level static values and UI copy used by multiple accounts files.
- Includes plan metadata and default form values for issue flow.

## styles/
- Shared layout constants and large style objects used by account screens.

## types/
- Accounts feature local types (form state, UI metadata types).
- Use these instead of re-declaring the same shape in screen files.

## Data Source Contract
- Raw mock data lives in `src/api/db/accounts.screen.ts`.
- Filtering/sorting logic lives in `src/api/mock/accountsMockApi.ts`.
- Screens should consume data through hooks, not import DB data directly.
