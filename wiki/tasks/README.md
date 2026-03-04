# Money Manager — Development Phases

## Overview

13 phases from foundation to AI features. Phases 0–5 deliver the **MVP**. Each phase file contains a full task checklist, Prisma models, key files to create, and a verification guide.

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Pending |
| 🔄 | In Progress |
| ✅ | Done |

---

## Phase Summary

| # | Phase | File | Complexity | MVP? | Status |
|---|-------|------|-----------|------|--------|
| 0 | Foundation & Infrastructure | [phase-00-foundation.md](./phase-00-foundation.md) | Medium | Pre-MVP | ⬜ |
| 1 | Authentication | [phase-01-auth.md](./phase-01-auth.md) | Medium | Pre-MVP | ⬜ |
| 2 | Accounts | [phase-02-accounts.md](./phase-02-accounts.md) | Low-Med | MVP | ⬜ |
| 3 | Categories & Transactions | [phase-03-transactions.md](./phase-03-transactions.md) | High | MVP | ⬜ |
| 4 | Transfers & Dashboard | [phase-04-dashboard.md](./phase-04-dashboard.md) | Medium | MVP | ⬜ |
| 5 | Budgets & Goals | [phase-05-budgets-goals.md](./phase-05-budgets-goals.md) | Medium | **MVP ✓** | ⬜ |
| 6 | Recurring Transactions | [phase-06-recurring.md](./phase-06-recurring.md) | Medium | Post-MVP | ⬜ |
| 7 | Reports & Analytics | [phase-07-reports.md](./phase-07-reports.md) | Med-High | Post-MVP | ⬜ |
| 8 | Receipt Attachments | [phase-08-receipts.md](./phase-08-receipts.md) | Medium | Post-MVP | ⬜ |
| 9 | Savings (Advanced) | [phase-09-savings-advanced.md](./phase-09-savings-advanced.md) | Medium | Post-MVP | ⬜ |
| 10 | Debt & Credit Cards | [phase-10-debt-credit.md](./phase-10-debt-credit.md) | Medium | Post-MVP | ⬜ |
| 11 | QoL & Security | [phase-11-qol.md](./phase-11-qol.md) | High | Post-MVP | ⬜ |
| 12 | AI Features | [phase-12-ai.md](./phase-12-ai.md) | High | Post-MVP | ⬜ |

---

## Architecture Principles

**Data flow in every feature module:**
```
repository/ → server/ (createServerFn) → query/ (useQuery/useMutation) → components/
```

**Folder structure:**
```
src/
  shared/          # used by 2+ features (lib, utils, types, schema, constants, hooks, query)
  features/
    <name>/        # components/, hooks/, types/, schema/, server/, repository/, query/, utils/
```

**Key rules:**
- Features import from `shared/`, **never** cross-feature imports
- `shared/` must **not** import from `features/`
- Transfers: `TRANSFER_OUT` + `TRANSFER_IN` pair linked by `transferId` (prevents double-counting)
- Balance: `startingBalance + INCOME - EXPENSE + TRANSFER_IN - TRANSFER_OUT`
- Auth routes: unauthenticated layout (`_auth.tsx`) vs authenticated shell (`app.tsx` with `beforeLoad` guard)

---

## Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TanStack Start |
| Routing | TanStack Router (file-based, SSR) |
| Data fetching | TanStack Query |
| UI | Shadcn/ui + Tailwind v4 |
| Forms | React Hook Form + Zod |
| Database | MySQL via Prisma ORM |
| Auth | Custom JWT sessions |
| Charts | Recharts |
| Package manager | pnpm |
