# Phase 4 — Transfers & Dashboard

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Phase 3

---

## Goal

Users can move money between accounts (transfers) without double-counting in reports. A basic dashboard surfaces total net worth, this month's income vs expense, spending by category (pie chart), and recent transactions.

---

## Architecture Note: Transfers

A transfer creates **two linked Transaction rows atomically** via Prisma `$transaction`:
- `TRANSFER_OUT` on the source account (reduces balance)
- `TRANSFER_IN` on the destination account (increases balance)

Both rows share the same `transferId` (a new CUID). Reports exclude `TRANSFER_OUT` and `TRANSFER_IN` from income/expense totals. Balance calculation includes them:

```
balance = startingBalance + SUM(INCOME) - SUM(EXPENSE) + SUM(TRANSFER_IN) - SUM(TRANSFER_OUT)
```

---

## Tasks

### Dependencies
- [ ] Add `recharts` to dependencies (`pnpm add recharts`)

---

### Sub-feature: Transfers

- [ ] Create `src/features/transfers/schema/transfer.schema.ts` — Zod: `{ fromAccountId, toAccountId, amount, date, notes }`; validate fromAccountId ≠ toAccountId
- [ ] Create `src/features/transfers/types/index.ts` — `Transfer`, `TransferWithAccounts`
- [ ] Create `src/features/transfers/repository/transfer.repository.ts`:
  - `createTransfer(data)` — Prisma `$transaction` creating two linked Transaction rows with shared `transferId`
  - `deleteTransfer(transferId, userId)` — deletes both rows atomically
  - `findByTransferId(transferId, userId)` — returns both rows
- [ ] Create `src/features/transfers/server/transfer.server.ts` — create, delete transfer server fns
- [ ] Create `src/features/transfers/query/transfer.queries.ts` — `useCreateTransfer()`, `useDeleteTransfer()`
- [ ] Create `src/features/transfers/components/TransferForm.tsx` — from account select, to account select (excluding same account), amount, date, notes
- [ ] Create `src/routes/app/transfers/new.tsx` — transfer page
- [ ] Update `TransactionRow.tsx` — display "Transfer to [account]" / "Transfer from [account]" context when type is TRANSFER
- [ ] Add "Transfer" quick-action button to sidebar or dashboard

---

### Sub-feature: Account Balance Calculation

- [ ] Update `src/features/accounts/repository/account.repository.ts`:
  - Update `getBalanceSummary(userId)` to compute real-time balance via Transaction aggregation: `startingBalance + INCOME - EXPENSE + TRANSFER_IN - TRANSFER_OUT`
  - Add `getAccountBalance(accountId, userId)` — single account current balance
- [ ] Expose `AccountWithBalance` type with computed `currentBalance: Decimal`

---

### Sub-feature: Dashboard

- [ ] Create `src/features/dashboard/server/dashboard.server.ts` — aggregate server fn:
  - `getDashboardData(userId, month)` returning:
    - `accountBalances: AccountWithBalance[]` — all accounts with current balance
    - `totalNetWorth: Decimal` — sum of all account balances
    - `monthlyIncome: Decimal` — this month's total INCOME
    - `monthlyExpense: Decimal` — this month's total EXPENSE
    - `topCategories: { category, amount, percentage }[]` — top 5 expense categories this month
    - `recentTransactions: TransactionWithRelations[]` — last 10
- [ ] Create `src/features/dashboard/query/dashboard.queries.ts` — `useDashboard(month)`
- [ ] Create `src/features/dashboard/components/BalanceSummaryCard.tsx` — total net worth, count of accounts
- [ ] Create `src/features/dashboard/components/MonthlyStatsCard.tsx` — income vs expense this month (two stat blocks)
- [ ] Create `src/features/dashboard/components/SpendingByCategoryChart.tsx` — recharts `PieChart` + `Legend` (top 5 categories + "Others")
- [ ] Create `src/features/dashboard/components/RecentTransactionsList.tsx` — last 10 transactions with "View all" link
- [ ] Create `src/features/dashboard/components/AccountBalanceList.tsx` — all accounts with type icon + current balance
- [ ] Create `src/routes/app/dashboard.tsx` — assembles all dashboard widgets in a responsive grid
- [ ] Add "Dashboard" as first item in `AppSidebar.tsx` and make it the default route

---

## Key Files to Create

```
src/features/transfers/
  components/
    TransferForm.tsx
  query/
    transfer.queries.ts
  repository/
    transfer.repository.ts
  schema/
    transfer.schema.ts
  server/
    transfer.server.ts
  types/
    index.ts
  index.ts

src/features/dashboard/
  components/
    AccountBalanceList.tsx
    BalanceSummaryCard.tsx
    MonthlyStatsCard.tsx
    RecentTransactionsList.tsx
    SpendingByCategoryChart.tsx
  query/
    dashboard.queries.ts
  server/
    dashboard.server.ts
  types/
    index.ts
  index.ts

src/routes/app/
  dashboard.tsx
  transfers/
    new.tsx
```

**Modified files:**
- `src/features/accounts/repository/account.repository.ts` — real balance calculation
- `src/features/transactions/components/TransactionRow.tsx` — transfer display
- `src/shared/components/nav/AppSidebar.tsx` — add Dashboard as first item, Transfer quick-action

---

## Verification

- [ ] Creating a transfer reduces source account balance and increases destination balance
- [ ] Transfer appears in both accounts' transaction lists with correct labels
- [ ] Transfer amount does NOT appear in income or expense totals on dashboard
- [ ] Deleting a transfer removes both Transaction rows
- [ ] Dashboard shows correct net worth (sum of all account balances including starting balance)
- [ ] Monthly stats correctly reflect only INCOME and EXPENSE (not transfers)
- [ ] Pie chart renders with category breakdown for current month
- [ ] Recent transactions list shows 10 latest entries
- [ ] Dashboard loads via single server function call (not N+1 queries)
