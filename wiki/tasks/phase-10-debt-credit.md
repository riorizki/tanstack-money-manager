# Phase 10 — Debt & Credit Cards

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Phase 9

---

## Goal

Track credit card statement cycles (billing dates, due dates, minimum payments) and loan/installment schedules (remaining principal, interest, amortization). Receive due date reminders before payments are due.

---

## Prisma Models

```prisma
model CreditCardStatement {
  id              String   @id @default(cuid())
  userId          String
  accountId       String   // must be AccountType.CREDIT_CARD
  billingStart    DateTime
  billingEnd      DateTime
  dueDate         DateTime
  totalDue        Decimal  @db.Decimal(18, 2)
  minimumPayment  Decimal  @db.Decimal(18, 2)
  isPaid          Boolean  @default(false)
  paidAmount      Decimal? @db.Decimal(18, 2)
  paidAt          DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  account         Account  @relation(fields: [accountId], references: [id])

  @@index([userId, dueDate])
}

model Loan {
  id               String    @id @default(cuid())
  userId           String
  name             String    // e.g., "KPR BCA", "Motor Cicilan"
  principalAmount  Decimal   @db.Decimal(18, 2)
  interestRate     Decimal   @db.Decimal(5, 4)  // annual rate e.g., 0.0875 = 8.75%
  termMonths       Int
  startDate        DateTime
  accountId        String?   // account to debit payments from
  notes            String?
  isCompleted      Boolean   @default(false)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  payments         LoanPayment[]

  @@index([userId])
}

model LoanPayment {
  id            String   @id @default(cuid())
  loanId        String
  dueDate       DateTime
  paidDate      DateTime?
  principalPaid Decimal  @db.Decimal(18, 2)
  interestPaid  Decimal  @db.Decimal(18, 2)
  balance       Decimal  @db.Decimal(18, 2)  // remaining balance after payment
  isPaid        Boolean  @default(false)
  loan          Loan     @relation(fields: [loanId], references: [id], onDelete: Cascade)

  @@index([loanId, dueDate])
}
```

---

## Tasks

### Schema & Migration
- [ ] Add `CreditCardStatement`, `Loan`, `LoanPayment` to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

---

### Sub-feature: Credit Cards

- [ ] Create `src/features/credit-cards/schema/credit-card.schema.ts` — Zod: create statement, pay statement schemas
- [ ] Create `src/features/credit-cards/types/index.ts` — `CreditCardStatement`, `StatementStatus`
- [ ] Create `src/features/credit-cards/repository/credit-card.repository.ts`:
  - `findStatementsByUser(userId)` — ordered by dueDate desc
  - `findUpcomingStatements(userId, days)` — due within N days, unpaid
  - `findById(id, userId)`
  - `create(data)` — create new statement
  - `markPaid(id, userId, paidAmount)` — sets isPaid, paidAmount, paidAt; creates expense Transaction
  - `delete(id, userId)`
- [ ] Create `src/features/credit-cards/server/credit-card.server.ts` — list, get, create, markPaid, delete
- [ ] Create `src/features/credit-cards/query/credit-card.queries.ts`
- [ ] Create `src/features/credit-cards/components/StatementCard.tsx` — billing period, total due, minimum, due date, status (paid/upcoming/overdue)
- [ ] Create `src/features/credit-cards/components/StatementList.tsx` — grouped by account
- [ ] Create `src/features/credit-cards/components/PayStatementDialog.tsx` — amount input, account selector, confirm
- [ ] Create `src/features/credit-cards/components/NewStatementForm.tsx` — create statement for billing cycle
- [ ] Create `src/routes/app/credit-cards/index.tsx` — statements list
- [ ] Create `src/routes/app/credit-cards/new.tsx` — create statement

---

### Sub-feature: Loans

- [ ] Create `src/features/loans/utils/loan.utils.ts`:
  - `generateAmortizationSchedule(principal, annualRate, termMonths, startDate)` → `LoanPayment[]` — standard reducing-balance amortization
  - `getTotalInterest(schedule)` → `Decimal`
  - `getRemainingBalance(schedule)` → `Decimal` — sum of unpaid balances
  - `getNextPayment(schedule)` → `LoanPayment | null`
- [ ] Create `src/features/loans/schema/loan.schema.ts` — Zod: create loan, record payment
- [ ] Create `src/features/loans/types/index.ts` — `Loan`, `LoanWithSchedule`, `LoanSummary`
- [ ] Create `src/features/loans/repository/loan.repository.ts`:
  - `findAllByUser(userId)` — with payment schedule
  - `findById(id, userId)` — full schedule
  - `create(data)` — create loan + generate and store full `LoanPayment` schedule
  - `recordPayment(paymentId, userId, paidDate)` — mark payment as paid, create linked Transaction
  - `delete(id, userId)` — cascade deletes payments
- [ ] Create `src/features/loans/server/loan.server.ts` — list, get, create, recordPayment, delete
- [ ] Create `src/features/loans/query/loan.queries.ts`
- [ ] Create `src/features/loans/components/LoanCard.tsx` — name, original amount, remaining balance, next payment date + amount, progress bar
- [ ] Create `src/features/loans/components/LoanForm.tsx` — name, principal, interest rate, term, start date, account
- [ ] Create `src/features/loans/components/LoanScheduleTable.tsx` — full amortization table: payment #, due date, principal, interest, balance, paid status
- [ ] Create `src/features/loans/components/RecordPaymentDialog.tsx` — confirm paying next installment
- [ ] Create `src/routes/app/loans/index.tsx` — active loans list
- [ ] Create `src/routes/app/loans/new.tsx` — create loan form
- [ ] Create `src/routes/app/loans/$loanId/index.tsx` — loan detail + full schedule table

### Navigation & Notifications
- [ ] Add "Debt & Credit" section to `AppSidebar.tsx` with sub-items: Credit Cards, Loans
- [ ] Update `generateDueNotifications` (Phase 9) to include credit card due dates (7 days, 3 days, day-of) and loan payment due dates

---

## Key Files to Create

```
src/features/credit-cards/
  components/
    NewStatementForm.tsx
    PayStatementDialog.tsx
    StatementCard.tsx
    StatementList.tsx
  query/
    credit-card.queries.ts
  repository/
    credit-card.repository.ts
  schema/
    credit-card.schema.ts
  server/
    credit-card.server.ts
  types/
    index.ts
  index.ts

src/features/loans/
  components/
    LoanCard.tsx
    LoanForm.tsx
    LoanScheduleTable.tsx
    RecordPaymentDialog.tsx
  query/
    loan.queries.ts
  repository/
    loan.repository.ts
  schema/
    loan.schema.ts
  server/
    loan.server.ts
  types/
    index.ts
  utils/
    loan.utils.ts
  index.ts

src/routes/app/
  credit-cards/
    index.tsx
    new.tsx
  loans/
    index.tsx
    new.tsx
    $loanId/
      index.tsx
```

**Modified files:**
- `prisma/schema.prisma` — add CreditCardStatement, Loan, LoanPayment
- `src/features/notifications/server/notification.server.ts` — add credit card + loan due date checks
- `src/shared/components/nav/AppSidebar.tsx` — add Debt & Credit section

---

## Verification

- [ ] Can create a credit card statement with billing period, due date, total due, minimum payment
- [ ] "Pay Statement" creates an expense transaction and marks statement as paid
- [ ] Overdue unpaid statements are highlighted in red
- [ ] Can create a loan with principal 100M, 8.75% annual rate, 60-month term
- [ ] Amortization schedule is generated correctly (first payment mostly interest, last mostly principal)
- [ ] Recording a payment marks that installment as paid and creates a linked transaction
- [ ] "Next payment due" notification appears 7 days before due date
- [ ] Loan progress bar shows % of principal repaid
