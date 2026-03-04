# Phase 2 — Accounts

**Status:** ⬜ Pending
**Complexity:** Low-Medium
**Depends on:** Phase 1

---

## Goal

Users can create and manage financial accounts (cash, bank, e-wallet, credit card, investment) with starting balances. This phase establishes the full feature module pattern (schema → repository → server → query → components → routes) that all subsequent features replicate.

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
- [ ] Add `Account` model and `AccountType` enum to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

### Feature: Schema & Types
- [ ] Create `src/features/accounts/schema/account.schema.ts` — Zod schemas: `createAccountSchema`, `updateAccountSchema`, `accountFilterSchema`
- [ ] Create `src/features/accounts/types/index.ts` — `Account`, `AccountWithBalance`, `AccountSummary`

### Feature: Repository
- [ ] Create `src/features/accounts/repository/account.repository.ts`:
  - `findAllByUser(userId)` — all active accounts
  - `findById(id, userId)` — with ownership check
  - `create(data)` — returns created account
  - `update(id, userId, data)` — partial update
  - `softDelete(id, userId)` — sets `isActive = false`
  - `getTotalBalance(userId)` — sum of computed balances (joins Transaction in Phase 4; returns startingBalance for now)

### Feature: Server Functions
- [ ] Create `src/features/accounts/server/account.server.ts`:
  - `listAccounts` — GET server fn
  - `getAccount` — GET server fn by ID
  - `createAccount` — POST server fn
  - `updateAccount` — PATCH server fn
  - `deleteAccount` — DELETE server fn

### Feature: Query Hooks
- [ ] Create `src/features/accounts/query/account.queries.ts`:
  - `useAccounts()` — list all accounts
  - `useAccount(id)` — single account
  - `useCreateAccount()` — mutation with cache invalidation
  - `useUpdateAccount()` — mutation with optimistic update
  - `useDeleteAccount()` — mutation with cache invalidation
- [ ] Update `src/shared/query/keys.ts` with `accounts` key group

### Feature: UI Components
- [ ] Create `src/features/accounts/components/AccountTypeIcon.tsx` — Lucide icon map per `AccountType`
- [ ] Create `src/features/accounts/components/AccountCard.tsx` — type icon, name, balance display, color indicator, edit/delete dropdown
- [ ] Create `src/features/accounts/components/AccountList.tsx` — grid of `AccountCard`s with loading skeleton
- [ ] Create `src/features/accounts/components/AccountForm.tsx` — create/edit form: name, type select, currency select, starting balance, color picker, icon picker

### Routes
- [ ] Create `src/routes/app/accounts/index.tsx` — accounts list page with "Add Account" button
- [ ] Create `src/routes/app/accounts/new.tsx` — create account page
- [ ] Create `src/routes/app/accounts/$accountId/edit.tsx` — edit account page

### Navigation
- [ ] Add "Accounts" entry to `AppSidebar.tsx` nav config

---

## Key Files to Create

```
src/features/accounts/
  components/
    AccountCard.tsx
    AccountForm.tsx
    AccountList.tsx
    AccountTypeIcon.tsx
  query/
    account.queries.ts
  repository/
    account.repository.ts
  schema/
    account.schema.ts
  server/
    account.server.ts
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
- `prisma/schema.prisma` — add `Account`, `AccountType`
- `src/shared/query/keys.ts` — add `accounts` key group
- `src/shared/components/nav/AppSidebar.tsx` — add Accounts nav item

---

## Verification

- [ ] `pnpm dev` starts without errors after migration
- [ ] Can create an account (cash, bank, e-wallet, credit card)
- [ ] Account list shows all accounts with correct icons per type
- [ ] Can edit account name, color, starting balance
- [ ] Can soft-delete an account (disappears from list)
- [ ] Attempting to access another user's account returns 403/404
- [ ] Currency selection persists correctly (IDR default)
