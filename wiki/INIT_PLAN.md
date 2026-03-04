# Money Manager Web App — Plan (AI-assisted)

## Tech Stack

- **UI**: React + TailwindCSS + shadcn/ui
- **Forms**: React Hook Form + Zod (schema + validation)
- **Data Fetching**: TanStack Query (React Query)
- **Server Functions**: TanStack Server Functions (server actions layer)
- **Database**: MySQL + Prisma ORM
- **Auth**: custom JWT sessions
- _(Optional)_ Charts: Recharts / Chart.js

---

## Architecture (Feature-Based Modules)

### Goals

- Keep each feature isolated and scalable
- Clear separation between:
  - UI (components)
  - client data access (query hooks)
  - server boundary (server functions)
  - infrastructure (repo + external APIs)

### Folder Structure

src/
shared/
components/ # reusable UI (generic, not feature-specific)
hooks/ # reusable hooks (useDebounce, useLocalStorage, etc.)
types/ # shared TS types (Money, ID, Pagination, etc.)
schema/ # shared Zod schemas (common inputs/outputs)
utils/ # helpers (format currency/date, math helpers, etc.)
constants/ # enums, constant maps, feature flags
lib/ # shared libs (prisma client wrapper, logger, fetcher)
query/ # shared query key helpers (optional)
index.ts # public exports (barrel)

features/
<feature-name>/
components/
hooks/
types/
schema/
server/ # TanStack server functions / server actions
api/ # external API clients (only if needed)
repository/ # Prisma DB access layer
query/ # React Query hooks + keys
utils/
index.ts

### Data Flow

repository / api -> server -> query -> components

### Rules of Thumb (to keep it clean)

- Put something in `shared/` only if it’s used by **2+ features**.
- If it’s specific to one feature, keep it inside `features/<feature>/...`.
- `shared/components` should stay **UI-only** (no business logic).
- `shared/lib` is a good place for cross-cutting wrappers:
  - Prisma client instance
  - fetcher + auth headers
  - date/currency adapters
- Types:
  - `features/<name>/types` = feature domain types
  - `shared/types` = common primitives (Money, UUID, DateRange, etc.)

### Dependency Guidelines (recommended)

- Features **can import** from `shared/`
- `shared/` **must not import** from `features/`
- Avoid feature-to-feature imports; if needed, extract the common part into `shared/`

---

## Feature List (Product Scope)

## A. Core (Daily Use)

- **Dashboard**
  - Total balance across accounts
  - This month’s spending
  - Remaining budget (if budgeting enabled)
  - Small charts / trend indicators
- **Transactions**
  - Log income/expense with date, account, category, notes
  - Search + filters (date/category/account/payment method)
  - Split transaction (one receipt → multiple categories)
- **Accounts**
  - Cash, bank, e-wallet, credit card
  - Transfers between accounts (bank → cash, etc.) without double counting
- **Recurring Transactions**
  - Auto monthly entries (salary, rent, subscriptions, installments)

---

## B. Budgeting

- **Budgets per Category**
  - e.g., Food max IDR 100,000 / month
- **Budget Period**
  - Weekly / monthly
- **Alerts**
  - Notify when close to limit or exceeded
- **Cashflow View**
  - Income vs expenses per month
  - 3–6 month trend

---

## C. Savings & Goals

- **Goals**
  - Progress bar + target date + planned contribution
- **Automatic Contributions**
  - e.g., auto-save X every payday (rule-based)
- **Sinking Funds**
  - Saving “pots” for yearly expenses (taxes, vehicle service, holiday)
- **Reminders**
  - “You need IDR X more this week to stay on track”
- **Goal Simulation**
  - “If you save IDR 50,000/month, you’ll reach the goal on <date>”

---

## D. Debt & Credit Cards

- **Credit Card Tracking**
  - Statement cycle, total due, minimum payment, due date
- **Loan / Installment Tracker**
  - Remaining principal, interest, payment schedule
- **Due Date Notifications**
  - Reminders before due dates

---

## E. Receipt Photos

- **Receipt Attachments**
  - Multiple photos per transaction + notes
- _(Optional)_ **OCR**
  - Extract total, date, merchant from image
- **Merchant / Payee**
  - Store merchant names for spending analysis

---

## F. Insights & Reports

- **Category Reports**
  - Pie/bar charts, top spending categories
  - Month-over-month comparisons
- **Trends / Anomalies**
  - e.g., “Transport spending up 40% this month”
- **Export**
  - CSV / Excel / PDF
- **Monthly Summary**
  - End-of-month recap (income, expenses, savings rate, biggest categories)

---

## G. Quality-of-Life & Security

- **Backup & Sync**
  - Cloud sync + restore
- **Security**
  - PIN / biometric (mobile-oriented / optional)
- _(Optional)_ **Shared Wallet / Roles**
  - Shared finances with partner/family + private accounts
- _(Advanced)_ **Import**
  - Import bank/e-wallet CSV statements → map to categories

---

## Suggested MVP (Ship Fast)

1. Auth (login)
2. Accounts + starting balance
3. Transactions (income/expense) + categories + filters
4. Transfers between accounts
5. Dashboard (basic)
6. Budgets (basic per category, monthly)
7. Goals (basic progress)
8. Receipt attachment (no OCR first)

---

## AI Usage Plan (Where AI Helps Most)

- **OCR + merchant extraction**: receipt photos → structured transaction draft
- **Auto-categorization**: suggest category based on merchant/notes/history
- **Insights**: detect unusual spending spikes + generate monthly summary text
- **Smart rules**:
  - “If merchant contains 'PLN' → Utilities”
  - “If recurring monthly at similar amount → suggest recurring transaction”
