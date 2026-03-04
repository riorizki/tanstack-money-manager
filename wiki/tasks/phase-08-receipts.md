# Phase 8 — Receipt Attachments & Merchant Tracking

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Phase 7

---

## Goal

Users can attach photos to transactions (receipts, bills). Merchant/payee names are tracked and can be assigned a default category for faster future entry. Storage abstraction supports local files in dev and S3/R2 in production.

---

## Prisma Model

```prisma
model Receipt {
  id            String      @id @default(cuid())
  transactionId String
  storageKey    String      // key in storage backend (path or S3 key)
  fileName      String      // original filename
  mimeType      String      // image/jpeg, image/png, etc.
  sizeBytes     Int
  uploadedAt    DateTime    @default(now())
  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@index([transactionId])
}
```

---

## Tasks

### Dependencies
- [ ] Decide storage backend: **local** `public/uploads/` for now, swap to S3 later via abstraction
- [ ] Update `src/env.ts` to add: `STORAGE_BACKEND` (local|s3), `S3_BUCKET?`, `S3_ENDPOINT?`, `S3_ACCESS_KEY?`, `S3_SECRET_KEY?`, `PUBLIC_URL` (base URL for file serving)

### Schema & Migration
- [ ] Add `Receipt` model to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

### Shared: Storage Abstraction
- [ ] Create `src/shared/lib/storage.ts`:
  - `uploadFile(file: File, folder: string)` → `{ key: string, url: string }`
  - `deleteFile(key: string)` → `void`
  - `getFileUrl(key: string)` → `string`
  - Implementations: `LocalStorage` (saves to `public/uploads/`) and `S3Storage` (uses AWS SDK)
  - Factory: reads `STORAGE_BACKEND` env var, returns correct implementation

### Feature: Receipts — Repository
- [ ] Create `src/features/receipts/repository/receipt.repository.ts`:
  - `findByTransaction(transactionId)` — all receipts for a transaction
  - `create(data)` — after file upload succeeds
  - `delete(id, userId)` — deletes DB record + calls `storage.deleteFile(key)`
  - `deleteAllForTransaction(transactionId)` — cascade cleanup

### Feature: Receipts — Schema & Types
- [ ] Create `src/features/receipts/schema/receipt.schema.ts` — Zod: upload input (file validation: max 5MB, image types only)
- [ ] Create `src/features/receipts/types/index.ts` — `Receipt`, `ReceiptWithUrl`

### Feature: Receipts — Server Functions
- [ ] Create `src/features/receipts/server/receipt.server.ts`:
  - `uploadReceipt` — POST: receive multipart, validate file, call `storage.uploadFile`, create Receipt record
  - `deleteReceipt` — DELETE: verify ownership via transaction, delete record + file

### Feature: Receipts — Query Hooks
- [ ] Create `src/features/receipts/query/receipt.queries.ts`:
  - `useReceipts(transactionId)` — list receipts for a transaction
  - `useUploadReceipt()` — mutation: form data upload
  - `useDeleteReceipt()` — mutation with optimistic removal

### Feature: Receipts — UI Components
- [ ] Create `src/features/receipts/components/ReceiptUpload.tsx` — drag-and-drop zone + click-to-browse, shows preview thumbnail, max file size validation, multiple files support
- [ ] Create `src/features/receipts/components/ReceiptThumbnail.tsx` — small image preview with delete button
- [ ] Create `src/features/receipts/components/ReceiptGallery.tsx` — grid of `ReceiptThumbnail` components
- [ ] Create `src/features/receipts/components/ReceiptViewer.tsx` — full-size image modal (Dialog) with navigation between multiple receipts

### Integration
- [ ] Add `ReceiptUpload` + `ReceiptGallery` to `TransactionForm.tsx` (upload on form submit, or after transaction created)
- [ ] Add receipt count badge to `TransactionRow.tsx` (paperclip icon with count)
- [ ] Create `src/routes/app/transactions/$transactionId/index.tsx` — transaction detail view with receipt gallery

### Feature: Merchant Management
- [ ] Update `Merchant` model — `defaultCategoryId` already present from Phase 3 schema
- [ ] Create `src/features/merchants/components/MerchantList.tsx` — list merchants with category assignment
- [ ] Create `src/features/merchants/components/MerchantRow.tsx` — merchant name, transaction count, default category selector
- [ ] Create `src/features/merchants/server/merchant.server.ts` — list, update default category
- [ ] Create `src/features/merchants/query/merchant.queries.ts` — `useMerchants()`, `useUpdateMerchant()`
- [ ] Create `src/routes/app/merchants/index.tsx` — merchants management page
- [ ] Add "Merchants" to `AppSidebar.tsx` under Transactions section

---

## Key Files to Create

```
src/features/receipts/
  components/
    ReceiptGallery.tsx
    ReceiptThumbnail.tsx
    ReceiptUpload.tsx
    ReceiptViewer.tsx
  query/
    receipt.queries.ts
  repository/
    receipt.repository.ts
  schema/
    receipt.schema.ts
  server/
    receipt.server.ts
  types/
    index.ts
  index.ts

src/features/merchants/
  components/
    MerchantList.tsx
    MerchantRow.tsx
  query/
    merchant.queries.ts
  server/
    merchant.server.ts
  types/
    index.ts
  index.ts

src/shared/lib/
  storage.ts

src/routes/app/
  transactions/$transactionId/index.tsx
  merchants/index.tsx

public/uploads/   (gitignored directory for local storage)
```

**Modified files:**
- `prisma/schema.prisma` — add Receipt model
- `src/env.ts` — add storage env vars
- `src/features/transactions/components/TransactionForm.tsx` — add receipt upload section
- `src/features/transactions/components/TransactionRow.tsx` — add receipt count badge
- `src/shared/components/nav/AppSidebar.tsx` — add Merchants nav item

---

## Verification

- [ ] Can upload a JPEG/PNG to a transaction (drag-drop and click-to-browse both work)
- [ ] Uploaded image appears as thumbnail in the transaction detail
- [ ] Full-size viewer modal opens on thumbnail click
- [ ] Deleting a receipt removes it from storage and DB
- [ ] Files > 5MB are rejected with a clear error message
- [ ] Non-image file types are rejected
- [ ] Merchant list shows all unique merchants with transaction count
- [ ] Setting a default category for a merchant pre-fills that category in the next transaction with the same merchant
- [ ] Transaction row shows paperclip badge when receipts are attached
