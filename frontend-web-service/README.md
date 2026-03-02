**Project Overview**
- **Purpose:**: Frontend for EventPick — structured for scalable features and easy screen creation.
- **Design/Specs:**: Do not change visual design or behavior in feature implementations; keep styles and UX intact.

**Folder Structure (current, high-level)**
- **api**: アプリ共通の通信基盤（axios instance, interceptor, refresh token）。インフラ層、UIを含まない。
- **assets**: 画像・SVG・フォントなどの静的リソース。ロジックやコンポーネントは置かない。
- **components**: ドメイン非依存の共通UI（Button, Logo, Modal, Input）。業務ロジックを持たない。
- **contexts**: React Context 定義（AuthContext, ThemeContext）。ロジックは hooks に分離。
- **features**: 機能単位で完結するフォルダ（例: features/login）。内部に api, components, hooks, screens を持つ。
- **hooks**: アプリ全体で使う再利用フック（useAuth, useDebounce）。feature 依存禁止。
- **layouts**: 画面骨組み（BaseLayout, Header, Footer）。Screen に骨組みを書かない。
- **lib**: 汎用ユーティリティ（date formatter, storage helper）。ビジネスロジックを含めない。
- **routes**: ルーティング定義と ProtectedRoute。
- **screens**: feature に属さない単発ページ（404 等）。
- **types**: アプリ共通型定義。feature 固有型は feature 内に置く。
- **app**: App 組み立て層（App.tsx など）。
- **styles**: グローバル CSS（index.css, app.css）。
- **main.tsx**: エントリーポイント（Provider ラップ、グローバル CSS 読み込み）。

**依存の流れ（守ること）**
- main.tsx → app/ → layouts/ → routes/ → features/ → components/hooks/api/lib
- 一方向依存を維持し、feature から上位へ依存しない。

**How to add a new Login-like screen (step-by-step)**
- **1. Create feature folder:**: Create `features/yourFeature` with subfolders: `api`, `components`, `hooks`, `screens`.
- **2. API shim:**: Add `features/yourFeature/api/index.ts` for feature-specific calls or use global `api` for infra-level logic.
- **3. Component(s):**: Put UI bits in `features/yourFeature/components` as CSS Modules (`*.module.css`) and TSX components.
- **4. Screen:**: Add `features/yourFeature/screens/YourScreen.tsx` that exports the page layout only (no global header/footer).
- **5. Hook:**: Implement feature logic in `features/yourFeature/hooks/useYourFeature.ts` and keep async calls in `api`.
- **6. Route:**: Register route in `routes/index.tsx` as a lazy-loaded component and wrap with `Suspense` + `SuspenseLoading`.
- **7. Styles:**: Use a component-level CSS Module. Avoid touching global styles unless necessary.
- **8. Test locally:**: Run `npm run dev` and verify layout inside the app's BaseLayout (header/footer/background provided by layout).

**Code templates (minimal)**
- **Feature screen skeleton:**
  - **File:** features/yourFeature/screens/YourScreen.tsx
  - **Code:**
    import React from 'react';
    import styles from './YourScreen.module.css';
    import YourComponent from '../components/YourComponent';

    const YourScreen: React.FC = () => {
      return (
        <>
          <div className={styles.titleSection}>...</div>
          <div className={styles.card}><YourComponent /></div>
        </>
      );
    };
    export default YourScreen;

- **Add route (routes/index.tsx):**
  - Use lazy import and SuspenseFallback:
    {
      path: '/your',
      element: <Suspense fallback={<SuspenseLoading />}><YourScreen /></Suspense>
    }

**Best practices / Efficiency tips**
- **Small PRs:**: One screen or one feature per PR.
- **Reuse components:**: If a UI element could be shared, move it to `components/` instead of duplicating.
- **Keep styles local:**: Prefer CSS Modules; keep global CSS minimal.
- **Separation of concerns:**: Contexts = provider only; hooks = logic; components = UI.
- **Templates:**: Copy the `features/login` structure when creating similar features to reduce setup time.
- **Dev server checks:**: Use `npm run dev` and DevTools Network/Elements when debugging backgrounds or assets.

**On assets and background images**
- Prefer `public/` for images that must be reachable via absolute path at runtime.
- For imports that go through bundler, place images under `src/assets` and import them for guaranteed resolution.

**When to change files**
- **UI/design changes:**: Only after design approval — do not alter current styles while adding screens.
- **Refactor:**: Keep behavior consistent; split into smaller commits and document reasons.

**Contact / Next steps**
- If you want, I can:
  - Scaffold a new `features/new-login` feature following this template.
  - Create a file template generator (CLI script) to speed up adding screens.


---
Generated documentation replaces previous README content and follows the repository conventions specified.
