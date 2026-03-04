# Phase 0 — Foundation & Infrastructure

**Status:** ✅ Complete
**Complexity:** Medium
**Depends on:** Nothing (starting point)

---

## Goal

Establish the shared module skeleton, configure Shadcn/ui to output into `src/shared/`, set up the typed environment, migrate existing utilities to `shared/lib/`, and build the authenticated app shell layout. Every subsequent phase will follow the patterns established here.

---

## Tasks

### Project Scaffolding
- [~] ~~Update `components.json` aliases~~ — kept default paths; Shadcn stays in `src/components/ui/` (see note below)
- [x] Create `src/shared/` directory tree (all folders listed in Key Files below)
- [x] Move `src/db.ts` → `src/shared/lib/prisma.ts`; update all imports
- [~] ~~Move `src/lib/utils.ts` (`cn()`) → `src/shared/lib/utils.ts`~~ — kept in place for Shadcn compatibility
- [x] Remove the placeholder `Todo` model from `prisma/schema.prisma`; run `pnpm db:generate`

> **Note:** `components.json` aliases were kept at their defaults so Shadcn installs cleanly into `src/components/ui/`. All other shared code lives in `src/shared/`.

### Environment
- [x] Update `src/env.ts` to include: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `VITE_APP_TITLE`, `VITE_APP_URL`

### Shadcn/ui Base Components
Install via `pnpm dlx shadcn@latest add <name>`:
- [x] `button`
- [x] `input`
- [x] `card`
- [x] `form`
- [x] `badge`
- [x] `dialog`
- [x] `dropdown-menu`
- [x] `select`
- [x] `table`
- [x] `sheet`
- [x] `skeleton`
- [x] `separator`
- [x] `avatar`
- [x] `tooltip`

### Shared Types & Schema
- [x] Create `src/shared/types/common.ts` — `Money`, `ID`, `Pagination`, `DateRange`, `SortOrder`
- [x] Create `src/shared/schema/pagination.schema.ts` — Zod schema for cursor pagination input
- [x] Create `src/shared/schema/date-range.schema.ts` — Zod schema for date range filter

### Shared Utilities
- [x] Create `src/shared/utils/currency.ts` — `formatCurrency(amount, currency)`, `parseCurrency(str)`
- [x] Create `src/shared/utils/date.ts` — `formatDate`, `formatRelativeDate`, `startOfMonth`, `endOfMonth`

### Shared Constants
- [x] Create `src/shared/constants/enums.ts` — `AccountType`, `TransactionType`, `BudgetPeriod`, `GoalStatus`, `RecurringFrequency`
- [x] Create `src/shared/constants/currencies.ts` — supported currency list (IDR, USD, SGD, EUR, etc.)

### Shared Hooks
- [x] Create `src/shared/hooks/use-debounce.ts`
- [x] Create `src/shared/hooks/use-local-storage.ts`

### Query Key Factory
- [x] Create `src/shared/query/keys.ts` — typed key factory: `queryKeys.accounts.all()`, `queryKeys.transactions.list(filters)`, etc.

### Shared Layout Components
- [x] Create `src/shared/components/layout/PageHeader.tsx` — title + optional actions slot
- [x] Create `src/shared/components/layout/PageWrapper.tsx` — consistent page padding wrapper
- [x] Create `src/shared/components/layout/EmptyState.tsx` — icon + title + description + optional CTA
- [x] Create `src/shared/components/layout/ErrorState.tsx` — error display with retry button

### App Shell (Authenticated Layout)
- [x] Create `src/shared/components/nav/NavItem.tsx` — sidebar nav item with icon, label, active state
- [x] Create `src/shared/components/nav/AppSidebar.tsx` — left-rail sidebar with nav item config array (extensible)
- [x] Create `src/routes/app.tsx` — authenticated layout route: sidebar + main content area + `beforeLoad` stub (full auth check added in Phase 1)
- [x] Create `src/routes/app/index.tsx` — redirect to `/app/dashboard`

### Error Boundary
- [x] Add global `ErrorBoundary` component to `src/routes/__root.tsx`

### Tests
- [x] Configure Vitest with `src/test/setup.ts`
- [x] Write unit tests for `formatCurrency` and `formatDate` utilities

---

## Key Files Created

```
src/shared/
  lib/
    prisma.ts          ✅ (moved from src/db.ts)
    logger.ts          ✅
  types/
    common.ts          ✅
    index.ts           ✅
  schema/
    pagination.schema.ts  ✅
    date-range.schema.ts  ✅
  utils/
    currency.ts        ✅
    date.ts            ✅
  constants/
    enums.ts           ✅
    currencies.ts      ✅
  components/
    layout/
      PageHeader.tsx   ✅
      PageWrapper.tsx  ✅
      EmptyState.tsx   ✅
      ErrorState.tsx   ✅
    nav/
      AppSidebar.tsx   ✅
      NavItem.tsx      ✅
  hooks/
    use-debounce.ts    ✅
    use-local-storage.ts ✅
  query/
    keys.ts            ✅
  index.ts             ✅ (barrel export)

src/components/ui/     ✅ (Shadcn — default path)

src/routes/
  app.tsx              ✅
  app/
    index.tsx          ✅

src/test/
  setup.ts             ✅

vitest.config.ts       ✅
prisma.config.ts       ✅ (already existed, Prisma 7 datasource config)
```

**Modified files:**
- `prisma/schema.prisma` ✅ — Todo model removed
- `src/env.ts` ✅ — DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, VITE_APP_TITLE, VITE_APP_URL added
- `src/styles.css` ✅ — Swiss Brutalist tokens (radius: 0, pure black/white, no gradients)
- `src/routes/__root.tsx` ✅ — ErrorBoundary added

---

## Verification

- [x] `pnpm dev` starts without errors (HTTP 200)
- [x] `pnpm db:generate` succeeds with clean schema (no Todo)
- [ ] Navigate to `/` — renders app shell with sidebar
- [x] Navigate to `/app` — redirects to `/app/dashboard`
- [ ] Shadcn components are generated in `src/shared/components/ui/` — **N/A**: kept in `src/components/ui/` by design
- [x] `pnpm test` passes — 15 tests passing (currency + date utilities)
- [x] `cn()` still works in existing files (path unchanged at `src/lib/utils.ts`)
