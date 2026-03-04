# Phase 12 — AI Features

**Status:** ⬜ Pending
**Complexity:** High
**Depends on:** Phase 11

---

## Goal

AI-powered features: receipt OCR (extract transaction data from photos), auto-categorization (suggest category from merchant/notes), spending insights (anomaly detection + natural language monthly summaries), and user-defined smart rules ("If merchant contains 'PLN' → Utilities").

---

## Prisma Model

```prisma
model SmartRule {
  id         String   @id @default(cuid())
  userId     String
  name       String
  condition  String   // e.g., "merchant:PLN" or "notes:grab"
  field      String   // "merchant" | "notes" | "amount"
  operator   String   // "contains" | "equals" | "startsWith" | "gt" | "lt"
  value      String
  categoryId String
  priority   Int      @default(0)    // higher priority = checked first
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id])

  @@index([userId, isActive])
}
```

---

## Tasks

### Dependencies
- [ ] Add `ai` (Vercel AI SDK) or `@anthropic-ai/sdk` for LLM API calls — choose one provider (Anthropic recommended)
- [ ] Update `src/env.ts` to add: `AI_PROVIDER`, `ANTHROPIC_API_KEY?`, `OPENAI_API_KEY?`, `GEMINI_API_KEY?`, `OCR_PROVIDER` (tesseract|google-vision)
- [ ] Add feature flags to `src/shared/constants/feature-flags.ts`: `ENABLE_OCR`, `ENABLE_AI_CATEGORIZATION`, `ENABLE_AI_INSIGHTS`

### Schema & Migration
- [ ] Add `SmartRule` model to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

---

### Sub-feature: AI/LLM Abstraction

- [ ] Create `src/shared/lib/ai.ts`:
  - `createAIClient()` — factory returning provider client based on `AI_PROVIDER` env var
  - `generateText(prompt, systemPrompt)` → `string` — single-turn text generation
  - Implementations: Anthropic (`claude-haiku-4-5` for cost efficiency), OpenAI, Gemini

---

### Sub-feature: Receipt OCR

- [ ] Create `src/shared/lib/ocr.ts`:
  - `extractFromReceipt(imageBuffer, mimeType)` → `OcrResult`:
    ```ts
    type OcrResult = {
      total: number | null;
      date: string | null;      // ISO date string
      merchant: string | null;
      lineItems: { name: string; amount: number }[];
      rawText: string;
    }
    ```
  - Implementations: `TesseractOcr` (local, free), `GoogleVisionOcr` (API, accurate)
  - Factory: reads `OCR_PROVIDER` env var
- [ ] Create `src/features/receipts/server/ocr.server.ts`:
  - `scanReceipt` — POST: receive image (already uploaded as Receipt), run OCR, return structured draft
- [ ] Create `src/features/receipts/query/ocr.queries.ts` — `useScanReceipt(receiptId)`
- [ ] Create `src/features/receipts/components/OcrResultPreview.tsx` — shows extracted data (merchant, amount, date) with "Use this data" button
- [ ] Add "Scan Receipt" flow to transaction creation:
  1. User uploads receipt photo
  2. "Scan" button calls OCR
  3. Extracted data pre-fills `TransactionForm`
  4. User reviews + confirms

---

### Sub-feature: Smart Rules Engine

- [ ] Create `src/features/ai/schema/smart-rule.schema.ts` — Zod: create/update rule
- [ ] Create `src/features/ai/types/index.ts` — `SmartRule`, `RuleCondition`, `RuleMatch`
- [ ] Create `src/features/ai/repository/smart-rule.repository.ts`:
  - `findAllByUser(userId)` — ordered by priority desc
  - `findById(id, userId)`
  - `create(data)`
  - `update(id, userId, data)`
  - `delete(id, userId)`
- [ ] Create `src/features/ai/utils/rule-engine.ts`:
  - `applyRules(rules, input)` → `{ categoryId: string | null, matchedRule: SmartRule | null }`
  - `input`: `{ merchantName?, notes?, amount? }`
  - Evaluates rules in priority order, returns first match
- [ ] Create `src/features/ai/server/smart-rules.server.ts` — list, create, update, delete, test rule
- [ ] Create `src/features/ai/query/smart-rule.queries.ts`
- [ ] Create `src/features/ai/components/SmartRuleForm.tsx` — condition builder: field select, operator select, value input, category select, priority
- [ ] Create `src/features/ai/components/SmartRuleList.tsx` — rules table with drag-to-reorder priority, active toggle
- [ ] Create `src/routes/app/settings/smart-rules.tsx` — smart rules management page

---

### Sub-feature: Auto-Categorization

- [ ] Create `src/features/ai/server/categorize.server.ts`:
  - `suggestCategory(input)` → `{ categoryId, confidence, source }` where source is `'merchant_map' | 'smart_rule' | 'llm' | 'none'`
  - Priority order:
    1. Check Merchant → `defaultCategoryId` mapping (Phase 8)
    2. Apply SmartRules engine
    3. If `ENABLE_AI_CATEGORIZATION`, call LLM with recent transaction history context
    4. Return null if none match
- [ ] Integrate into `TransactionForm.tsx`: when merchant name is entered + lost focus, call `suggestCategory` and pre-fill category field with a "suggested" indicator (user can override)
- [ ] Create `src/features/ai/components/CategorySuggestion.tsx` — "Suggested: [Category Name]" chip with source label + "Accept" / dismiss

---

### Sub-feature: Spending Insights

- [ ] Create `src/features/ai/server/insights.server.ts`:
  - `generateInsights(userId, month)` → `Insight[]`:
    ```ts
    type Insight = {
      type: 'anomaly' | 'recurring_suggestion' | 'summary' | 'savings_tip';
      title: string;
      body: string;
      metadata?: Record<string, unknown>;
    }
    ```
  - **Anomaly**: category spending increased >30% vs 3-month average
  - **Recurring suggestion**: same merchant + similar amount appearing monthly → "Add as recurring?"
  - **Summary**: if `ENABLE_AI_INSIGHTS`, call LLM to generate a 2-3 sentence natural language monthly summary
  - **Savings tip**: if expense > income this month → suggest top category to reduce
- [ ] Create `src/features/ai/query/insights.queries.ts` — `useInsights(month)` (cached, generated on login or monthly)
- [ ] Create `src/features/ai/components/InsightCard.tsx` — dismissable card with icon by type, title, body, optional action button
- [ ] Create `src/features/ai/components/InsightsPanel.tsx` — list of `InsightCard` components
- [ ] Add `InsightsPanel` to Dashboard sidebar or bottom section

---

## Key Files to Create

```
src/features/ai/
  components/
    CategorySuggestion.tsx
    InsightCard.tsx
    InsightsPanel.tsx
    SmartRuleForm.tsx
    SmartRuleList.tsx
  query/
    insights.queries.ts
    smart-rule.queries.ts
  repository/
    smart-rule.repository.ts
  schema/
    smart-rule.schema.ts
  server/
    categorize.server.ts
    insights.server.ts
    smart-rules.server.ts
  types/
    index.ts
  utils/
    rule-engine.ts
  index.ts

src/features/receipts/ (additions)
  components/
    OcrResultPreview.tsx
  server/
    ocr.server.ts
  query/
    ocr.queries.ts

src/shared/lib/
  ai.ts
  ocr.ts

src/shared/constants/
  feature-flags.ts

src/routes/app/settings/
  smart-rules.tsx
```

**Modified files:**
- `prisma/schema.prisma` — add SmartRule model
- `src/env.ts` — add AI and OCR env vars
- `src/features/transactions/components/TransactionForm.tsx` — integrate auto-categorization suggestion
- `src/features/receipts/components/ReceiptUpload.tsx` — add "Scan" button for OCR
- `src/features/dashboard/` — add InsightsPanel widget

---

## Feature Flag Behavior

| Flag | Enabled | Disabled |
|------|---------|---------|
| `ENABLE_OCR` | Scan button visible, calls OCR API | Scan button hidden |
| `ENABLE_AI_CATEGORIZATION` | LLM called as fallback in `suggestCategory` | Only merchant map + smart rules used |
| `ENABLE_AI_INSIGHTS` | LLM generates summary text | Only rule-based anomalies shown |

All features degrade gracefully when disabled — the app remains fully functional without AI.

---

## Verification

- [ ] Upload a receipt photo → "Scan" → extracted merchant/amount/date pre-fills transaction form
- [ ] Entering "Grab" as merchant suggests "Transport" category (via merchant map)
- [ ] Creating a smart rule "notes contains 'listrik'" → "Bills & Utilities" applies on new transaction
- [ ] Smart rules apply in priority order (highest priority first)
- [ ] Dashboard shows anomaly insight: "Food spending up 45% this month vs avg"
- [ ] Monthly summary insight card shows LLM-generated text (if AI enabled)
- [ ] All AI features work correctly when feature flags are disabled (no crashes, graceful fallback)
- [ ] AI API key missing → falls back to rule-based categorization with no error
