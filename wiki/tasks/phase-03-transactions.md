# Phase 3 — Categories & Transactions

**Status:** ⬜ Pending
**Complexity:** High
**Depends on:** Phase 2

---

## Goal

Core financial data entry. Users can manage categories and log income/expense transactions with full filtering, search, and pagination. This is the backbone of the entire app — nearly every other feature reads from the Transaction table.

---

## Prisma Models

```prisma
model Category {
  id        String          @id @default(cuid())
  userId    String
  name      String
  type      TransactionType // INCOME or EXPENSE
  color     String?
  icon      String?
  parentId  String?         // sub-categories
  isDefault Boolean         @default(false)
  parent    Category?       @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[]      @relation("CategoryHierarchy")
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  budgets   Budget[]        // added in Phase 5

  @@index([userId])
}

model Merchant {
  id           String        @id @default(cuid())
  userId       String
  name         String
  categoryId   String?       // default category suggestion
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, name])
  @@index([userId])
}

model Transaction {
  id           String          @id @default(cuid())
  userId       String
  accountId    String
  categoryId   String?
  merchantId   String?
  type         TransactionType
  amount       Decimal         @db.Decimal(18, 2)
  date         DateTime
  notes        String?
  transferId   String?         // links TRANSFER_OUT + TRANSFER_IN pair (Phase 4)
  recurringId  String?         // links to RecurringTransaction (Phase 6)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  user         User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  account      Account         @relation(fields: [accountId], references: [id])
  category     Category?       @relation(fields: [categoryId], references: [id])
  merchant     Merchant?       @relation(fields: [merchantId], references: [id])
  receipts     Receipt[]       // added in Phase 8

  @@index([userId, date])
  @@index([userId, accountId])
  @@index([userId, categoryId])
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER_OUT
  TRANSFER_IN
}
```

---

## Tasks

### Schema & Migration
- [ ] Add `Category`, `Merchant`, `Transaction`, `TransactionType` to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

---

### Sub-feature: Categories

- [ ] Create `src/features/categories/schema/category.schema.ts` — Zod: create, update, filter schemas
- [ ] Create `src/features/categories/types/index.ts` — `Category`, `CategoryTree`
- [ ] Create `src/features/categories/repository/category.repository.ts`:
  - `findAllByUser(userId)` — flat list
  - `findTree(userId)` — nested by parentId
  - `findById(id, userId)`
  - `create(data)`
  - `update(id, userId, data)`
  - `delete(id, userId)` — fails if has transactions
  - `seedDefaults(userId)` — called on user registration (Phase 1 server function)
- [ ] Create `src/features/categories/server/category.server.ts` — list, get, create, update, delete
- [ ] Create `src/features/categories/query/category.queries.ts` — `useCategories()`, `useCreateCategory()`, `useUpdateCategory()`, `useDeleteCategory()`
- [ ] Create `src/features/categories/components/CategoryBadge.tsx` — colored dot + name
- [ ] Create `src/features/categories/components/CategorySelector.tsx` — searchable select/combobox (income vs expense tabs)
- [ ] Create `src/features/categories/components/CategoryForm.tsx` — name, type, color, icon, parent category
- [ ] Create `src/features/categories/components/CategoryList.tsx` — grouped by type, with sub-category indentation
- [ ] Update `src/features/auth/server/register.ts` — call `seedDefaults(userId)` after user creation
- [ ] Create `src/routes/app/categories/index.tsx` — category management page
- [ ] Add "Categories" entry to `AppSidebar.tsx`

**Default categories to seed (EXPENSE):** Food & Drinks, Transport, Shopping, Entertainment, Health, Bills & Utilities, Education, Travel, Personal Care, Others

**Default categories to seed (INCOME):** Salary, Freelance, Investment, Business, Gift, Others

---

### Sub-feature: Transactions

- [ ] Install shadcn components: `pnpm dlx shadcn@latest add calendar popover`
- [ ] Create `src/features/transactions/schema/transaction.schema.ts` — Zod: create, update, filter, list (with pagination)
- [ ] Create `src/features/transactions/types/index.ts` — `Transaction`, `TransactionWithRelations`, `TransactionFilters`, `TransactionStats`
- [ ] Create `src/features/transactions/repository/transaction.repository.ts`:
  - `findMany(userId, filters, cursor)` — with date/category/account/type filters + cursor pagination
  - `findById(id, userId)` — with all relations
  - `create(data)` — auto-create or find Merchant by name
  - `update(id, userId, data)`
  - `delete(id, userId)` — also deletes linked transfer pair (Phase 4)
  - `getStats(userId, dateRange)` — `{ totalIncome, totalExpense, count }`
- [ ] Create `src/features/transactions/server/transaction.server.ts` — list, get, create, update, delete, stats
- [ ] Create `src/features/transactions/query/transaction.queries.ts`:
  - `useTransactions(filters)` — with `useInfiniteQuery` for pagination
  - `useTransaction(id)`
  - `useCreateTransaction()`
  - `useUpdateTransaction()`
  - `useDeleteTransaction()`
- [ ] Create `src/features/transactions/hooks/use-transaction-filters.ts` — sync filters with URL search params (TanStack Router `useSearch`)
- [ ] Create `src/features/transactions/utils/transaction.utils.ts`:
  - `groupByDate(transactions)` — `Map<string, Transaction[]>`
  - `calculateNetForPeriod(transactions)` — income minus expense
- [ ] Create `src/features/transactions/components/TransactionForm.tsx`:
  - Type toggle (Income / Expense)
  - Amount input with currency formatting
  - Date picker (shadcn Calendar + Popover)
  - Account selector
  - Category selector (filtered by type)
  - Merchant/payee name input (autocomplete from existing merchants)
  - Notes textarea
- [ ] Create `src/features/transactions/components/TransactionRow.tsx` — category badge, merchant, amount (colored), date, account chip
- [ ] Create `src/features/transactions/components/TransactionList.tsx` — grouped by date sections, infinite scroll, loading skeleton
- [ ] Create `src/features/transactions/components/TransactionFilters.tsx` — date range, category multi-select, account select, type toggle
- [ ] Create `src/routes/app/transactions/index.tsx` — list + filters + "Add Transaction" button
- [ ] Create `src/routes/app/transactions/new.tsx` — full-page form
- [ ] Create `src/routes/app/transactions/$transactionId/edit.tsx` — edit form pre-filled
- [ ] Add "Transactions" entry to `AppSidebar.tsx`
- [ ] Update `src/shared/query/keys.ts` with `transactions`, `categories`, `merchants` key groups

---

## Key Files to Create

```
src/features/categories/
  components/
    CategoryBadge.tsx
    CategoryForm.tsx
    CategoryList.tsx
    CategorySelector.tsx
  query/
    category.queries.ts
  repository/
    category.repository.ts
  schema/
    category.schema.ts
  server/
    category.server.ts
  types/
    index.ts
  index.ts

src/features/transactions/
  components/
    TransactionFilters.tsx
    TransactionForm.tsx
    TransactionList.tsx
    TransactionRow.tsx
  hooks/
    use-transaction-filters.ts
  query/
    transaction.queries.ts
  repository/
    transaction.repository.ts
  schema/
    transaction.schema.ts
  server/
    transaction.server.ts
  types/
    index.ts
  utils/
    transaction.utils.ts
  index.ts

src/routes/app/
  categories/index.tsx
  transactions/
    index.tsx
    new.tsx
    $transactionId/
      edit.tsx
```

**Modified files:**
- `prisma/schema.prisma` — add Category, Merchant, Transaction, TransactionType
- `src/features/auth/server/register.ts` — seed default categories
- `src/shared/query/keys.ts` — add transactions, categories, merchants
- `src/shared/components/nav/AppSidebar.tsx` — add Transactions, Categories nav items

---

## Verification

- [ ] Can create an INCOME and EXPENSE transaction with category, account, date, notes
- [ ] Transaction list groups entries by date correctly
- [ ] Filter by date range, category, account, type all work independently and combined
- [ ] Infinite scroll loads more transactions when scrolled to bottom
- [ ] Editing a transaction pre-fills all fields correctly
- [ ] Deleting a transaction removes it from the list immediately (optimistic update)
- [ ] Merchant name autocomplete suggests existing merchants
- [ ] Default categories exist for a newly registered user
- [ ] Amount displays formatted (e.g., "Rp 150.000" for IDR)
