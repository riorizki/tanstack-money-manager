# Phase 6 — Recurring Transactions

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Phase 5

---

## Goal

Users can define recurring transaction rules (salary, rent, subscriptions, installments) that automatically generate transactions on a schedule. Processing can be triggered manually via a "Process Due" action or scheduled via Nitro's task scheduler.

---

## Prisma Model

```prisma
model RecurringTransaction {
  id            String             @id @default(cuid())
  userId        String
  accountId     String
  categoryId    String?
  type          TransactionType    // INCOME or EXPENSE only
  amount        Decimal            @db.Decimal(18, 2)
  notes         String?
  frequency     RecurringFrequency
  startDate     DateTime
  endDate       DateTime?          // null = indefinite
  nextDate      DateTime           // next scheduled date
  lastProcessed DateTime?
  isActive      Boolean            @default(true)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  account       Account            @relation(fields: [accountId], references: [id])
  category      Category?          @relation(fields: [categoryId], references: [id])

  @@index([userId, nextDate])
  @@index([userId, isActive])
}

enum RecurringFrequency {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}
```

**Transaction model update** — add `recurringId` nullable FK:
```prisma
// in Transaction model:
recurringId  String?    // FK to RecurringTransaction.id
```

---

## Tasks

### Schema & Migration
- [ ] Add `RecurringTransaction`, `RecurringFrequency` to `prisma/schema.prisma`
- [ ] Add `recurringId String?` to `Transaction` model (no FK constraint to avoid circular; soft reference)
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

### Feature: Schema & Types
- [ ] Create `src/features/recurring/schema/recurring.schema.ts` — Zod: create, update, filter schemas; validate `type` is INCOME or EXPENSE (not TRANSFER)
- [ ] Create `src/features/recurring/types/index.ts` — `RecurringTransaction`, `RecurringWithRelations`

### Feature: Utilities
- [ ] Create `src/features/recurring/utils/recurring.utils.ts`:
  - `getNextOccurrence(frequency, fromDate)` → `Date` — next date after given date
  - `isDue(nextDate)` → `boolean` — true if nextDate ≤ today
  - `getDueSoon(nextDate, days)` → `boolean` — due within N days
  - `formatFrequency(frequency)` → human label (e.g., "Monthly")

### Feature: Repository
- [ ] Create `src/features/recurring/repository/recurring.repository.ts`:
  - `findAllByUser(userId)` — all (active + inactive)
  - `findDueToday(userId)` — where `nextDate <= today AND isActive = true`
  - `findById(id, userId)`
  - `create(data)` — sets `nextDate = startDate`
  - `update(id, userId, data)`
  - `toggleActive(id, userId)` — pause/resume
  - `delete(id, userId)`
  - `markProcessed(id, nextDate)` — update `lastProcessed = now, nextDate = nextDate`

### Feature: Server Functions
- [ ] Create `src/features/recurring/server/recurring.server.ts`:
  - `listRecurring` — GET: all recurring rules for user
  - `createRecurring` — POST
  - `updateRecurring` — PATCH
  - `toggleRecurring` — PATCH: pause/resume
  - `deleteRecurring` — DELETE
  - `processRecurring` — POST: finds all due rules, creates Transaction rows for each, updates `nextDate`, returns count processed

### Feature: Query Hooks
- [ ] Create `src/features/recurring/query/recurring.queries.ts`:
  - `useRecurring()` — list all
  - `useCreateRecurring()`
  - `useUpdateRecurring()`
  - `useToggleRecurring()`
  - `useDeleteRecurring()`
  - `useProcessRecurring()` — mutation, invalidates transactions on success

### Feature: UI Components
- [ ] Create `src/features/recurring/components/RecurringForm.tsx` — type, account, category, amount, frequency select, start date, end date (optional), notes
- [ ] Create `src/features/recurring/components/RecurringRow.tsx` — name/notes, frequency badge, next date, amount, active toggle, edit/delete
- [ ] Create `src/features/recurring/components/RecurringList.tsx` — list with "Process Due Now" button (shows count of due items)
- [ ] Create `src/features/recurring/components/ProcessConfirmDialog.tsx` — shows preview of transactions to be created, confirm action

### Routes
- [ ] Create `src/routes/app/recurring/index.tsx` — recurring list with process button
- [ ] Create `src/routes/app/recurring/new.tsx` — create recurring rule form

### Dashboard Integration
- [ ] Update `src/features/dashboard/server/dashboard.server.ts` — add `upcomingRecurring` (due in next 7 days) to dashboard data
- [ ] Create `src/features/dashboard/components/UpcomingRecurringList.tsx` — shows next 5 upcoming transactions

### Navigation
- [ ] Add "Recurring" to `AppSidebar.tsx` under Transactions section

---

## Key Files to Create

```
src/features/recurring/
  components/
    ProcessConfirmDialog.tsx
    RecurringForm.tsx
    RecurringList.tsx
    RecurringRow.tsx
  query/
    recurring.queries.ts
  repository/
    recurring.repository.ts
  schema/
    recurring.schema.ts
  server/
    recurring.server.ts
  types/
    index.ts
  utils/
    recurring.utils.ts
  index.ts

src/routes/app/recurring/
  index.tsx
  new.tsx
```

**Modified files:**
- `prisma/schema.prisma` — add RecurringTransaction, RecurringFrequency; add recurringId to Transaction
- `src/features/dashboard/server/dashboard.server.ts` — add upcoming recurring
- `src/shared/components/nav/AppSidebar.tsx` — add Recurring nav item

---

## Verification

- [ ] Can create a monthly recurring rule (e.g., salary on the 25th)
- [ ] `processRecurring` creates a Transaction and sets next month's `nextDate`
- [ ] Auto-generated transaction has `recurringId` set, showing "From recurring rule" in UI
- [ ] Pausing a rule prevents it from appearing in "due today" list
- [ ] Dashboard shows "Upcoming this week" recurring list
- [ ] Rules with an `endDate` in the past are not processed
- [ ] Frequency calculation is correct: WEEKLY adds 7 days, MONTHLY adds 1 month (same day), YEARLY adds 1 year
