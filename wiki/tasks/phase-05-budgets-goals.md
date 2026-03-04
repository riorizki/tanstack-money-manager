# Phase 5 — Budgets & Goals

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Phase 4

---

## Goal

Users can set monthly (or weekly) budgets per spending category and track progress against actual spending. Users can define financial goals (e.g., "Save 10M for a laptop") and track contributions. **After this phase, the MVP is complete.**

---

## Prisma Models

```prisma
model Budget {
  id         String       @id @default(cuid())
  userId     String
  categoryId String
  amount     Decimal      @db.Decimal(18, 2)
  period     BudgetPeriod @default(MONTHLY)
  startDate  DateTime     // first day of the budget period
  isActive   Boolean      @default(true)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  category   Category     @relation(fields: [categoryId], references: [id])

  @@unique([userId, categoryId, period, startDate])
  @@index([userId])
}

model Goal {
  id            String    @id @default(cuid())
  userId        String
  name          String
  targetAmount  Decimal   @db.Decimal(18, 2)
  currentAmount Decimal   @default(0) @db.Decimal(18, 2)
  deadline      DateTime?
  isCompleted   Boolean   @default(false)
  accountId     String?   // optional: tie to a specific savings account
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

enum BudgetPeriod {
  WEEKLY
  MONTHLY
  YEARLY
}
```

---

## Tasks

### Schema & Migration
- [ ] Add `Budget`, `Goal`, `BudgetPeriod` to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

---

### Sub-feature: Budgets

- [ ] Create `src/features/budgets/schema/budget.schema.ts` — Zod: create, update, filter schemas
- [ ] Create `src/features/budgets/types/index.ts` — `Budget`, `BudgetWithProgress`
  ```ts
  type BudgetWithProgress = Budget & {
    spent: Decimal;
    remaining: Decimal;
    percentage: number;     // 0–100+
    status: 'SAFE' | 'WARNING' | 'EXCEEDED';
  }
  ```
- [ ] Create `src/features/budgets/repository/budget.repository.ts`:
  - `findAllByUser(userId, month)` — active budgets for a given month
  - `findById(id, userId)`
  - `create(data)`
  - `update(id, userId, data)`
  - `delete(id, userId)`
  - `getBudgetsWithSpending(userId, month)` — joins Transaction aggregation to compute spent per category
- [ ] Create `src/features/budgets/utils/budget.utils.ts`:
  - `calculateProgress(budget, spent)` → `BudgetWithProgress`
  - `getBudgetStatus(percentage)` → `'SAFE' | 'WARNING' | 'EXCEEDED'`
  - WARNING threshold: ≥ 80%; EXCEEDED: ≥ 100%
- [ ] Create `src/features/budgets/server/budget.server.ts` — list (with spending), get, create, update, delete
- [ ] Create `src/features/budgets/query/budget.queries.ts`:
  - `useBudgets(month)` — returns `BudgetWithProgress[]`
  - `useCreateBudget()`
  - `useUpdateBudget()`
  - `useDeleteBudget()`
- [ ] Create `src/features/budgets/components/BudgetProgress.tsx` — progress bar, color: green/amber/red based on status
- [ ] Create `src/features/budgets/components/BudgetCard.tsx` — category badge, budget amount, spent, remaining, progress bar, status badge
- [ ] Create `src/features/budgets/components/BudgetList.tsx` — list of `BudgetCard` with month navigator (prev/next month)
- [ ] Create `src/features/budgets/components/BudgetForm.tsx` — category selector (EXPENSE only), amount, period, start date
- [ ] Create `src/routes/app/budgets/index.tsx` — budget list + month switcher + "Add Budget" button
- [ ] Create `src/routes/app/budgets/new.tsx` — create budget form
- [ ] Add budget summary widget (over-budget count, most exceeded) to Dashboard
- [ ] Add "Budgets" to `AppSidebar.tsx`

---

### Sub-feature: Goals

- [ ] Create `src/features/goals/schema/goal.schema.ts` — Zod: create, update, contribute schemas
- [ ] Create `src/features/goals/types/index.ts` — `Goal`, `GoalWithProgress`
  ```ts
  type GoalWithProgress = Goal & {
    percentage: number;    // (currentAmount / targetAmount) * 100
    remaining: Decimal;
    isOverdue: boolean;
    daysLeft: number | null;
  }
  ```
- [ ] Create `src/features/goals/repository/goal.repository.ts`:
  - `findAllByUser(userId)` — with computed progress fields
  - `findById(id, userId)`
  - `create(data)`
  - `update(id, userId, data)`
  - `delete(id, userId)`
  - `addContribution(goalId, userId, amount)` — increments `currentAmount`, marks `isCompleted` if reached
- [ ] Create `src/features/goals/server/goal.server.ts` — list, get, create, update, delete, contribute
- [ ] Create `src/features/goals/query/goal.queries.ts`:
  - `useGoals()`
  - `useGoal(id)`
  - `useCreateGoal()`
  - `useUpdateGoal()`
  - `useDeleteGoal()`
  - `useContributeToGoal()`
- [ ] Create `src/features/goals/components/GoalProgress.tsx` — progress bar with percentage label
- [ ] Create `src/features/goals/components/GoalCard.tsx` — name, target vs current, progress bar, deadline, days left badge, completed state
- [ ] Create `src/features/goals/components/GoalForm.tsx` — name, target amount, deadline (optional), starting amount, notes, linked account (optional)
- [ ] Create `src/features/goals/components/ContributeDialog.tsx` — amount input + confirm button; calls `addContribution`
- [ ] Create `src/routes/app/goals/index.tsx` — goal list with "Add Goal" button
- [ ] Create `src/routes/app/goals/new.tsx` — create goal form
- [ ] Add "Goals" to `AppSidebar.tsx`

---

## Key Files to Create

```
src/features/budgets/
  components/
    BudgetCard.tsx
    BudgetForm.tsx
    BudgetList.tsx
    BudgetProgress.tsx
  query/
    budget.queries.ts
  repository/
    budget.repository.ts
  schema/
    budget.schema.ts
  server/
    budget.server.ts
  types/
    index.ts
  utils/
    budget.utils.ts
  index.ts

src/features/goals/
  components/
    ContributeDialog.tsx
    GoalCard.tsx
    GoalForm.tsx
    GoalProgress.tsx
  query/
    goal.queries.ts
  repository/
    goal.repository.ts
  schema/
    goal.schema.ts
  server/
    goal.server.ts
  types/
    index.ts
  index.ts

src/routes/app/
  budgets/
    index.tsx
    new.tsx
  goals/
    index.tsx
    new.tsx
```

**Modified files:**
- `prisma/schema.prisma` — add Budget, Goal, BudgetPeriod
- `src/features/dashboard/server/dashboard.server.ts` — add budget summary to dashboard data
- `src/shared/components/nav/AppSidebar.tsx` — add Budgets, Goals nav items

---

## MVP Checkpoint

After completing this phase, the app supports the full MVP scope:
1. ✅ Auth (login/register)
2. ✅ Accounts + starting balance
3. ✅ Transactions (income/expense) + categories + filters
4. ✅ Transfers between accounts
5. ✅ Dashboard
6. ✅ Budgets (per category, monthly)
7. ✅ Goals (basic progress + contributions)

---

## Verification

- [ ] Can create a monthly budget for a specific category
- [ ] Budget progress updates as new expense transactions are added in that category
- [ ] Budget card shows SAFE (green) / WARNING (amber) / EXCEEDED (red) status correctly
- [ ] Month navigator shows budgets for previous/next months
- [ ] Can create a goal with a target amount and deadline
- [ ] Contributing to a goal increments `currentAmount` and updates progress bar
- [ ] Goal marked as completed when `currentAmount >= targetAmount`
- [ ] Dashboard shows budget overview (e.g., "2 budgets exceeded this month")
- [ ] Deleting a budget or goal does not affect existing transactions
