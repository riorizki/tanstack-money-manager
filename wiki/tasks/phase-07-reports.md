# Phase 7 — Reports & Analytics

**Status:** ⬜ Pending
**Complexity:** Medium-High
**Depends on:** Phase 6

---

## Goal

Rich financial reporting: category breakdowns with pie/bar charts, monthly cashflow trends, month-over-month comparisons, anomaly detection (spending spikes), and data export to CSV and PDF.

---

## Tasks

### Dependencies
- [ ] Add `papaparse` + `@types/papaparse` — CSV generation
- [ ] Add `jspdf` + `jspdf-autotable` — PDF generation

---

### Feature: Server Functions (Aggregations)

- [ ] Create `src/features/reports/server/reports.server.ts`:
  - `getCategoryBreakdown(userId, dateRange, type)` → `{ categoryId, name, color, amount, percentage }[]`
  - `getCashflowByMonth(userId, months)` → `{ month, income, expense, net }[]` — last N months
  - `getMonthlyComparison(userId, month)` → `{ category, thisMonth, lastMonth, change, changePercent }[]`
  - `getTopMerchants(userId, dateRange)` → `{ merchant, amount, count }[]` — top 10
  - `getAnomalies(userId, month)` → categories where spending increased >30% vs 3-month avg

### Feature: Query Hooks
- [ ] Create `src/features/reports/query/reports.queries.ts`:
  - `useCategoryBreakdown(dateRange, type)`
  - `useCashflow(months)`
  - `useMonthlyComparison(month)`
  - `useTopMerchants(dateRange)`
  - `useAnomalies(month)`

### Feature: Utilities
- [ ] Create `src/features/reports/utils/reports.utils.ts`:
  - `generateCSV(transactions, columns)` → CSV string (via papaparse)
  - `generateTransactionsPDF(transactions, summary)` → PDF blob (via jspdf)
  - `generateBudgetReportPDF(budgets, month)` → PDF blob
  - `downloadBlob(blob, filename)` — triggers browser download

### Feature: UI Components
- [ ] Create `src/features/reports/components/DateRangeSelector.tsx` — preset buttons: This Month, Last Month, Last 3 Months, This Year, Custom
- [ ] Create `src/features/reports/components/CategoryBreakdownChart.tsx` — recharts `PieChart` (interactive: click slice to filter) + summary table
- [ ] Create `src/features/reports/components/CashflowChart.tsx` — recharts `BarChart` with grouped bars (income green, expense red, net line)
- [ ] Create `src/features/reports/components/TrendLineChart.tsx` — recharts `LineChart` for category spending trend over months
- [ ] Create `src/features/reports/components/MonthlyComparison.tsx` — table with % change indicators (up/down arrows, colored)
- [ ] Create `src/features/reports/components/TopMerchantsTable.tsx` — merchant name, total, transaction count
- [ ] Create `src/features/reports/components/AnomalyAlerts.tsx` — warning cards for detected anomalies
- [ ] Create `src/features/reports/components/ExportMenu.tsx` — dropdown: "Export CSV", "Export PDF"

### Routes
- [ ] Create `src/routes/app/reports/index.tsx` — overview: summary stats + category breakdown + cashflow
- [ ] Create `src/routes/app/reports/cashflow.tsx` — detailed cashflow page with trend charts
- [ ] Create `src/routes/app/reports/categories.tsx` — category deep-dive with monthly comparison

### Navigation
- [ ] Add "Reports" section to `AppSidebar.tsx` with sub-items: Overview, Cashflow, Categories

---

## Key Files to Create

```
src/features/reports/
  components/
    AnomalyAlerts.tsx
    CategoryBreakdownChart.tsx
    CashflowChart.tsx
    DateRangeSelector.tsx
    ExportMenu.tsx
    MonthlyComparison.tsx
    TopMerchantsTable.tsx
    TrendLineChart.tsx
  query/
    reports.queries.ts
  server/
    reports.server.ts
  types/
    index.ts
  utils/
    reports.utils.ts
  index.ts

src/routes/app/reports/
  index.tsx
  cashflow.tsx
  categories.tsx
```

**Modified files:**
- `src/shared/components/nav/AppSidebar.tsx` — add Reports section

---

## Verification

- [ ] Category breakdown pie chart renders correctly for the selected date range
- [ ] Cashflow chart shows 6 months of income vs expense bars
- [ ] Monthly comparison table shows correct % change vs last month
- [ ] Anomaly detection flags a category with 30%+ spending increase
- [ ] "Export CSV" downloads a valid CSV file with all transaction fields
- [ ] "Export PDF" downloads a formatted PDF with summary + transaction table
- [ ] Date range presets (This Month, Last 3 Months, etc.) update all charts simultaneously
- [ ] Charts are responsive on mobile viewport
