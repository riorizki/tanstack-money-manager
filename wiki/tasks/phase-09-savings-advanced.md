# Phase 9 — Savings (Advanced)

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Phase 8

---

## Goal

Advanced savings features: sinking funds for planned irregular expenses, goal completion simulation ("If I save X/month, I'll reach my goal by date Y"), automatic contribution rules, in-app reminders, and goal deadline notifications.

---

## Prisma Models

```prisma
model SinkingFund {
  id                  String    @id @default(cuid())
  userId              String
  name                String    // e.g., "Annual Car Service", "Holiday 2026"
  targetAmount        Decimal   @db.Decimal(18, 2)
  targetDate          DateTime
  currentAmount       Decimal   @default(0) @db.Decimal(18, 2)
  monthlyContribution Decimal?  // set manually or computed from target
  notes               String?
  isCompleted         Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  body      String
  isRead    Boolean          @default(false)
  metadata  Json?            // e.g., { goalId, budgetId }
  createdAt DateTime         @default(now())
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@index([userId, createdAt])
}

enum NotificationType {
  GOAL_DEADLINE
  GOAL_COMPLETED
  BUDGET_WARNING
  BUDGET_EXCEEDED
  RECURRING_DUE
  SAVINGS_REMINDER
}
```

---

## Tasks

### Schema & Migration
- [ ] Add `SinkingFund`, `Notification`, `NotificationType` to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

---

### Sub-feature: Sinking Funds

- [ ] Create `src/features/sinking-funds/schema/sinking-fund.schema.ts` — Zod: create, update, contribute
- [ ] Create `src/features/sinking-funds/types/index.ts` — `SinkingFund`, `SinkingFundWithProgress`
- [ ] Create `src/features/sinking-funds/repository/sinking-fund.repository.ts`:
  - `findAllByUser(userId)` — with computed progress fields
  - `findById(id, userId)`
  - `create(data)` — auto-compute `monthlyContribution` if not set
  - `update(id, userId, data)`
  - `delete(id, userId)`
  - `addContribution(id, userId, amount)` — increments `currentAmount`, marks completed if reached
- [ ] Create `src/features/sinking-funds/utils/sinking-fund.utils.ts`:
  - `computeMonthlyContribution(target, current, deadline)` → `Decimal` — amount needed per month
  - `computeProjectedCompletion(current, monthly, target)` → `Date` — when goal is met at current rate
- [ ] Create `src/features/sinking-funds/server/sinking-fund.server.ts` — list, get, create, update, delete, contribute
- [ ] Create `src/features/sinking-funds/query/sinking-fund.queries.ts`
- [ ] Create `src/features/sinking-funds/components/SinkingFundCard.tsx` — name, progress bar, target date, monthly contribution needed, days left
- [ ] Create `src/features/sinking-funds/components/SinkingFundForm.tsx` — name, target, deadline, starting amount, notes
- [ ] Create `src/features/sinking-funds/components/ContributeDialog.tsx` — amount input, confirms contribution
- [ ] Create `src/routes/app/sinking-funds/index.tsx`
- [ ] Create `src/routes/app/sinking-funds/new.tsx`
- [ ] Add "Sinking Funds" to `AppSidebar.tsx` under Savings section

---

### Sub-feature: Goal Simulation

- [ ] Create `src/features/goals/utils/simulation.utils.ts`:
  - `simulateGoalCompletion(goal, monthlySaving)` → `{ completionDate, monthsNeeded, isOnTrack, shortfallPerMonth }`
  - `calculateRequiredMonthlySaving(goal)` → `Decimal` — amount needed per month to hit deadline
  - `generateSavingsProjection(current, monthly, target)` → `{ month, projected }[]` — 12-month projection array
- [ ] Create `src/features/goals/components/GoalSimulationCard.tsx` — interactive slider for monthly saving → updates projected date in real-time
- [ ] Create `src/features/goals/components/SavingsProjectionChart.tsx` — recharts LineChart showing current amount vs projection to target
- [ ] Integrate simulation card into goal detail page (`$goalId/index.tsx`)
- [ ] Create `src/routes/app/goals/$goalId/index.tsx` — goal detail with simulation

---

### Sub-feature: Notifications

- [ ] Create `src/features/notifications/repository/notification.repository.ts`:
  - `findUnreadByUser(userId, limit)` — for notification bell
  - `findAllByUser(userId, cursor)` — paginated notification history
  - `create(data)` — create notification
  - `markRead(id, userId)` — mark single notification as read
  - `markAllRead(userId)` — mark all as read
  - `createBatch(notifications[])` — bulk insert
- [ ] Create `src/features/notifications/server/notification.server.ts`:
  - `getNotifications` — GET: unread + recent
  - `markRead` — PATCH
  - `markAllRead` — PATCH
  - `generateDueNotifications` — POST: check goals, budgets, recurring; create new notifications for anything due/exceeded
- [ ] Create `src/features/notifications/query/notification.queries.ts` — `useNotifications()`, `useMarkRead()`, `useMarkAllRead()`
- [ ] Create `src/features/notifications/components/NotificationBell.tsx` — bell icon + unread count badge in app header
- [ ] Create `src/features/notifications/components/NotificationList.tsx` — popover/sheet with notification items
- [ ] Create `src/features/notifications/components/NotificationItem.tsx` — icon by type, title, body, time, read state
- [ ] Call `generateDueNotifications` on each login (in `get-session.ts` server function)
- [ ] Add `NotificationBell` to the authenticated app shell header

---

## Key Files to Create

```
src/features/sinking-funds/
  components/
    ContributeDialog.tsx
    SinkingFundCard.tsx
    SinkingFundForm.tsx
  query/
    sinking-fund.queries.ts
  repository/
    sinking-fund.repository.ts
  schema/
    sinking-fund.schema.ts
  server/
    sinking-fund.server.ts
  types/
    index.ts
  utils/
    sinking-fund.utils.ts
  index.ts

src/features/goals/
  components/ (additions)
    GoalSimulationCard.tsx
    SavingsProjectionChart.tsx
  utils/ (additions)
    simulation.utils.ts

src/features/notifications/
  components/
    NotificationBell.tsx
    NotificationItem.tsx
    NotificationList.tsx
  query/
    notification.queries.ts
  repository/
    notification.repository.ts
  server/
    notification.server.ts
  types/
    index.ts
  index.ts

src/routes/app/
  sinking-funds/
    index.tsx
    new.tsx
  goals/
    $goalId/
      index.tsx
```

**Modified files:**
- `prisma/schema.prisma` — add SinkingFund, Notification, NotificationType
- `src/features/auth/server/get-session.ts` — trigger `generateDueNotifications`
- `src/routes/app.tsx` — add `NotificationBell` to header
- `src/shared/components/nav/AppSidebar.tsx` — add Sinking Funds nav item

---

## Verification

- [ ] Can create a sinking fund (e.g., "Holiday 2026, target 5M, deadline Dec 2026")
- [ ] Monthly contribution needed is computed correctly based on target, current amount, and deadline
- [ ] Goal simulation slider: dragging monthly amount updates "completion date" in real-time
- [ ] Projection chart shows trajectory to the goal target
- [ ] Notification bell shows unread count on login
- [ ] Goal deadline notifications appear when a goal's deadline is within 30 days
- [ ] Budget exceeded notifications appear when spending surpasses budget amount
- [ ] Marking notification as read removes it from the unread count
