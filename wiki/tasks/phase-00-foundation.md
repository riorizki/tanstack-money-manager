# Phase 0 — Foundation & Infrastructure

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Nothing (starting point)

---

## Goal

Establish the shared module skeleton, configure Shadcn/ui to output into `src/shared/`, set up the typed environment, migrate existing utilities to `shared/lib/`, and build the authenticated app shell layout. Every subsequent phase will follow the patterns established here.

---

## Tasks

### Project Scaffolding
- [ ] Update `components.json` aliases: `"ui": "#/shared/components/ui"`, `"lib": "#/shared/lib"`, `"hooks": "#/shared/hooks"`, `"utils": "#/shared/lib/utils"`
- [ ] Create `src/shared/` directory tree (all folders listed in Key Files below)
- [ ] Move `src/db.ts` → `src/shared/lib/prisma.ts`; update all imports
- [ ] Move `src/lib/utils.ts` (`cn()`) → `src/shared/lib/utils.ts`; update all imports
- [ ] Remove the placeholder `Todo` model from `prisma/schema.prisma`; run `pnpm db:migrate` then `pnpm db:generate`

### Environment
- [ ] Update `src/env.ts` to include: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `VITE_APP_TITLE`, `VITE_APP_URL`

### Shadcn/ui Base Components
Install via `pnpm dlx shadcn@latest add <name>`:
- [ ] `button`
- [ ] `input`
- [ ] `card`
- [ ] `form`
- [ ] `badge`
- [ ] `dialog`
- [ ] `dropdown-menu`
- [ ] `select`
- [ ] `table`
- [ ] `sheet`
- [ ] `skeleton`
- [ ] `separator`
- [ ] `avatar`
- [ ] `tooltip`

### Shared Types & Schema
- [ ] Create `src/shared/types/common.ts` — `Money`, `ID`, `Pagination`, `DateRange`, `SortOrder`
- [ ] Create `src/shared/schema/pagination.schema.ts` — Zod schema for cursor pagination input
- [ ] Create `src/shared/schema/date-range.schema.ts` — Zod schema for date range filter

### Shared Utilities
- [ ] Create `src/shared/utils/currency.ts` — `formatCurrency(amount, currency)`, `parseCurrency(str)`
- [ ] Create `src/shared/utils/date.ts` — `formatDate`, `formatRelativeDate`, `startOfMonth`, `endOfMonth`

### Shared Constants
- [ ] Create `src/shared/constants/enums.ts` — `AccountType`, `TransactionType`, `BudgetPeriod`, `GoalStatus`, `RecurringFrequency`
- [ ] Create `src/shared/constants/currencies.ts` — supported currency list (IDR, USD, SGD, EUR, etc.)

### Shared Hooks
- [ ] Create `src/shared/hooks/use-debounce.ts`
- [ ] Create `src/shared/hooks/use-local-storage.ts`

### Query Key Factory
- [ ] Create `src/shared/query/keys.ts` — typed key factory: `queryKeys.accounts.all()`, `queryKeys.transactions.list(filters)`, etc.

### Shared Layout Components
- [ ] Create `src/shared/components/layout/PageHeader.tsx` — title + optional actions slot
- [ ] Create `src/shared/components/layout/PageWrapper.tsx` — consistent page padding wrapper
- [ ] Create `src/shared/components/layout/EmptyState.tsx` — icon + title + description + optional CTA
- [ ] Create `src/shared/components/layout/ErrorState.tsx` — error display with retry button

### App Shell (Authenticated Layout)
- [ ] Create `src/shared/components/nav/NavItem.tsx` — sidebar nav item with icon, label, active state
- [ ] Create `src/shared/components/nav/AppSidebar.tsx` — left-rail sidebar with nav item config array (extensible)
- [ ] Create `src/routes/app.tsx` — authenticated layout route: sidebar + main content area + `beforeLoad` stub (full auth check added in Phase 1)
- [ ] Create `src/routes/app/index.tsx` — redirect to `/app/dashboard`

### Error Boundary
- [ ] Add global `ErrorBoundary` component to `src/routes/__root.tsx`

### Tests
- [ ] Configure Vitest with `src/test/setup.ts`
- [ ] Write unit tests for `formatCurrency` and `formatDate` utilities

---

## Key Files to Create

```
src/shared/
  lib/
    prisma.ts          (moved from src/db.ts)
    utils.ts           (moved from src/lib/utils.ts)
    logger.ts
  types/
    common.ts
    index.ts
  schema/
    pagination.schema.ts
    date-range.schema.ts
  utils/
    currency.ts
    date.ts
  constants/
    enums.ts
    currencies.ts
  components/
    ui/                (shadcn components land here)
    layout/
      PageHeader.tsx
      PageWrapper.tsx
      EmptyState.tsx
      ErrorState.tsx
    nav/
      AppSidebar.tsx
      NavItem.tsx
  hooks/
    use-debounce.ts
    use-local-storage.ts
  query/
    keys.ts
  index.ts             (barrel export)

src/routes/
  app.tsx
  app/
    index.tsx          (redirect to /app/dashboard)

src/test/
  setup.ts
```

**Modified files:**
- `prisma/schema.prisma` — remove Todo model
- `src/env.ts` — add JWT_SECRET, JWT_EXPIRES_IN, VITE_APP_TITLE, VITE_APP_URL
- `components.json` — update aliases
- `src/routes/__root.tsx` — add error boundary

---

## Verification

- [ ] `pnpm dev` starts without errors
- [ ] `pnpm db:generate` succeeds with clean schema (no Todo)
- [ ] Navigate to `/` — renders app shell with sidebar
- [ ] Navigate to `/app` — redirects to `/app/dashboard` (404 is fine, redirect works)
- [ ] Shadcn components are generated in `src/shared/components/ui/`
- [ ] `pnpm test` passes for currency and date utility tests
- [ ] `cn()` still works in existing files after import path change
