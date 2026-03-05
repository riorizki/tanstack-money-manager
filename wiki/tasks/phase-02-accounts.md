# Phase 2 — Accounts

**Status:** ✅ Completed (Implementation Ready)
**Complexity:** Low-Medium
**Depends on:** Phase 1

---

## Goal

Users can create and manage financial accounts (cash, bank, e-wallet, credit card, investment) with starting balances. This phase establishes the full feature module pattern (schema → repository → server → query → components → routes) that all subsequent features replicate.

Note: Prisma schema is organized with domain model files under `prisma/models/` (for example, `account.prisma`), with datasource/generator kept in `prisma/schema.prisma`. Server functions are split by action under `src/features/accounts/server/`.

---

## Prisma Model

```prisma
model Account {
  id              String      @id @default(cuid())
  userId          String
  name            String
  type            AccountType
  currency        String      @default("IDR")
  startingBalance Decimal     @default(0) @db.Decimal(18, 2)
  color           String?     // hex color for UI
  icon            String?     // icon name (lucide)
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions    Transaction[]  // added in Phase 3

  @@index([userId])
}

enum AccountType {
  CASH
  BANK
  EWALLET
  CREDIT_CARD
  INVESTMENT
  OTHER
}
```

---

## Tasks

### Schema & Migration
- [x] Add `Account` model and `AccountType` enum to `prisma/schema.prisma`
- [x] Run `pnpm db:migrate` then `pnpm db:generate`

### Feature: Schema & Types
- [x] Create `src/features/accounts/schema/account.schema.ts` — Zod schemas: `createAccountSchema`, `updateAccountSchema`, `accountFilterSchema`
- [x] Create `src/features/accounts/types/index.ts` — `Account`, `AccountWithBalance`, `AccountSummary`

### Feature: Repository
- [x] Create `src/features/accounts/repository/account.repository.ts`:
  - `findAllByUser(userId)` — all active accounts
  - `findById(id, userId)` — with ownership check
  - `create(data)` — returns created account
  - `update(id, userId, data)` — partial update
  - `softDelete(id, userId)` — sets `isActive = false`
  - `getTotalBalance(userId)` — sum of computed balances (joins Transaction in Phase 4; returns startingBalance for now)

### Feature: Server Functions
- [x] Create account server functions under `src/features/accounts/server/`:
  - `listAccounts` — GET server fn
  - `getAccount` — GET server fn by ID
  - `createAccount` — POST server fn
  - `updateAccount` — mutation server fn
  - `deleteAccount` — mutation server fn

### Feature: Query Hooks
- [x] Create `src/features/accounts/query/account.queries.ts`:
  - `useAccounts()` — list all accounts
  - `useAccount(id)` — single account
  - `useCreateAccount()` — mutation with cache invalidation
  - `useUpdateAccount()` — mutation with optimistic update
  - `useDeleteAccount()` — mutation with cache invalidation
- [x] Update `src/shared/query/keys.ts` with `accounts` key group

### Feature: UI Components
- [x] Create `src/features/accounts/components/AccountTypeIcon.tsx` — Lucide icon map per `AccountType`
- [x] Create `src/features/accounts/components/AccountCard.tsx` — type icon, name, balance display, color indicator, edit/delete dropdown
- [x] Create `src/features/accounts/components/AccountList.tsx` — grid of `AccountCard`s with loading skeleton
- [x] Create `src/features/accounts/components/AccountForm.tsx` — create/edit form: name, type select, currency select, starting balance, color picker, icon picker

### Routes
- [x] Create `src/routes/app/accounts/index.tsx` — accounts list page with "Add Account" button
- [x] Create `src/routes/app/accounts/new.tsx` — create account page
- [x] Create `src/routes/app/accounts/$accountId/edit.tsx` — edit account page

### Navigation
- [x] Add "Accounts" entry to `AppSidebar.tsx` nav config

---

## Key Files to Create

```
src/features/accounts/
  components/
    list/AccountCard.tsx
    list/AccountList.tsx
    form/AccountForm.tsx
    shared/AccountTypeIcon.tsx
  query/
    account.queries.ts
  repository/
    account.repository.ts
  schema/
    account.schema.ts
  server/
    list-accounts.ts
    get-account.ts
    create-account.ts
    update-account.ts
    delete-account.ts
    index.ts
  types/
    index.ts
  index.ts

src/routes/app/accounts/
  index.tsx
  new.tsx
  $accountId/
    edit.tsx
```

**Modified files:**
- `prisma/schema.prisma` — datasource + generator
- `prisma/models/account.prisma` — add `Account`, `AccountType`
- `src/shared/query/keys.ts` — add `accounts` key group
- `src/shared/components/nav/AppSidebar.tsx` — add Accounts nav item

---

## Verification

- [x] `pnpm dev` starts without errors after migration
- [x] Can create an account (cash, bank, e-wallet, credit card)
- [x] Account list shows all accounts with correct icons per type
- [x] Can edit account name, color, starting balance
- [x] Can soft-delete an account (disappears from list)
- [x] Attempting to access another user's account returns 403/404
- [x] Currency selection persists correctly (IDR default)

---

## Review Notes

- Implementation follows the requested module flow (schema → repository → server → query → components → routes).
- Some structure is intentionally more granular than the checklist examples:
  - Prisma model lives in `prisma/models/account.prisma` (not directly inside `prisma/schema.prisma`).
  - Server functions are split into multiple files under `src/features/accounts/server/` instead of a single `account.server.ts`.
