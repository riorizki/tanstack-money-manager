# Phase 11 — Quality of Life & Security

**Status:** ⬜ Pending
**Complexity:** High
**Depends on:** Phase 10

---

## Goal

Polish and production-readiness: import transactions from bank/e-wallet CSV exports, full data backup and restore, shared wallet with role-based access, user settings pages, session management, and optional client-side PIN lock for idle sessions.

---

## Prisma Models

```prisma
model SharedWallet {
  id        String          @id @default(cuid())
  name      String
  ownerId   String
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  owner     User            @relation("WalletOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members   WalletMember[]

  @@index([ownerId])
}

model WalletMember {
  id            String       @id @default(cuid())
  walletId      String
  userId        String
  role          WalletRole   @default(VIEWER)
  joinedAt      DateTime     @default(now())
  wallet        SharedWallet @relation(fields: [walletId], references: [id], onDelete: Cascade)
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([walletId, userId])
  @@index([userId])
}

enum WalletRole {
  OWNER
  EDITOR
  VIEWER
}
```

---

## Tasks

### Schema & Migration
- [ ] Add `SharedWallet`, `WalletMember`, `WalletRole` to `prisma/schema.prisma`
- [ ] Run `pnpm db:migrate` then `pnpm db:generate`

---

### Sub-feature: CSV Import (Bank Statement Import)

- [ ] Create `src/features/import/schema/import.schema.ts` — Zod: column mapping schema, import preview row
- [ ] Create `src/features/import/types/index.ts` — `ImportMapping`, `ImportRow`, `ImportPreview`, `ImportResult`
- [ ] Create `src/features/import/utils/import.utils.ts`:
  - `parseCSV(content)` → raw rows
  - `applyMapping(rows, mapping)` → `ImportRow[]` — maps CSV columns to transaction fields
  - `detectDuplicates(rows, existing)` → marks rows likely to be duplicates (same date + amount + ±3 days)
  - `formatImportRow(row, mapping)` → `CreateTransactionInput`
- [ ] Create `src/features/import/server/import.server.ts`:
  - `previewImport` — POST: parse CSV, apply mapping, detect duplicates, return preview rows
  - `confirmImport` — POST: bulk-create transactions from confirmed rows; returns `{ created, skipped, failed }`
- [ ] Create `src/features/import/query/import.queries.ts` — `usePreviewImport()`, `useConfirmImport()`
- [ ] Create `src/features/import/components/CsvUploader.tsx` — file input, CSV content reader (client-side)
- [ ] Create `src/features/import/components/ColumnMapper.tsx` — dropdowns to map CSV column → field (date, amount, notes, type, account)
- [ ] Create `src/features/import/components/ImportPreviewTable.tsx` — paginated preview with duplicate flags, per-row include/exclude toggle
- [ ] Create `src/features/import/components/ImportSummary.tsx` — post-import result: created/skipped/failed counts
- [ ] Create `src/routes/app/import/index.tsx` — 3-step wizard: Step 1 Upload + Column Mapping → Step 2 Preview → Step 3 Confirm
- [ ] Add "Import" to `AppSidebar.tsx`

---

### Sub-feature: Data Backup & Restore

- [ ] Create `src/features/backup/server/backup.server.ts`:
  - `exportUserData` — GET: serialize all user data (accounts, categories, transactions, budgets, goals, recurring, receipts metadata) as JSON
  - `importUserData` — POST: validate JSON structure, restore all records (with deduplication)
- [ ] Create `src/features/backup/types/index.ts` — `BackupData`, `BackupManifest`
- [ ] Create `src/features/backup/components/BackupPanel.tsx` — "Export Backup" button (downloads JSON file) + "Restore from Backup" file upload
- [ ] Integrate `BackupPanel` into Settings page

---

### Sub-feature: Shared Wallet

- [ ] Create `src/features/shared-wallet/schema/wallet.schema.ts` — Zod: create wallet, invite member, update role
- [ ] Create `src/features/shared-wallet/types/index.ts` — `SharedWallet`, `WalletMember`, `WalletRole`
- [ ] Create `src/features/shared-wallet/repository/wallet.repository.ts`:
  - `findByUser(userId)` — wallets user owns or is member of
  - `create(name, ownerId)` — creates wallet, adds owner as OWNER member
  - `inviteMember(walletId, inviterUserId, inviteeEmail, role)` — looks up invitee by email
  - `updateMemberRole(walletId, memberId, role)` — only OWNER can do this
  - `removeMember(walletId, memberId, requesterId)` — OWNER removes anyone; members can remove themselves
  - `delete(walletId, ownerId)` — only owner can delete
- [ ] Create `src/features/shared-wallet/server/wallet.server.ts` — list, create, invite, updateRole, removeMember, delete
- [ ] Create `src/features/shared-wallet/query/wallet.queries.ts`
- [ ] Create `src/features/shared-wallet/components/WalletMemberList.tsx` — member rows with role badge + remove button
- [ ] Create `src/features/shared-wallet/components/InviteMemberDialog.tsx` — email input + role select
- [ ] Create `src/routes/app/settings/wallet.tsx` — wallet management: create, view members, invite

---

### Sub-feature: Settings Pages

- [ ] Create `src/routes/app/settings/index.tsx` — profile (name, email), currency preference, language, theme toggle (dark/light)
- [ ] Create `src/routes/app/settings/security.tsx` — change password form, active sessions list with revoke button
- [ ] Create `src/routes/app/settings/categories.tsx` — move category management here (simpler sidebar)
- [ ] Create `src/routes/app/settings/wallet.tsx` — shared wallet management
- [ ] Add `src/routes/app/settings.tsx` — settings layout route with sub-navigation tabs

### Sub-feature: PIN Lock (Client-Side)

- [ ] Create `src/features/pin-lock/hooks/use-idle-timer.ts` — detects N minutes of inactivity
- [ ] Create `src/features/pin-lock/components/PinLockOverlay.tsx` — fullscreen lock screen with PIN entry (4-6 digits)
- [ ] Create `src/features/pin-lock/hooks/use-pin-lock.ts` — manages lock state, PIN validation (PIN hashed in localStorage)
- [ ] Integrate `PinLockOverlay` into `src/routes/app.tsx` layout — shows when idle timer fires
- [ ] Add PIN setup to `src/routes/app/settings/security.tsx`

---

## Key Files to Create

```
src/features/import/
  components/
    ColumnMapper.tsx
    CsvUploader.tsx
    ImportPreviewTable.tsx
    ImportSummary.tsx
  query/
    import.queries.ts
  schema/
    import.schema.ts
  server/
    import.server.ts
  types/
    index.ts
  utils/
    import.utils.ts
  index.ts

src/features/backup/
  components/
    BackupPanel.tsx
  server/
    backup.server.ts
  types/
    index.ts
  index.ts

src/features/shared-wallet/
  components/
    InviteMemberDialog.tsx
    WalletMemberList.tsx
  query/
    wallet.queries.ts
  repository/
    wallet.repository.ts
  schema/
    wallet.schema.ts
  server/
    wallet.server.ts
  types/
    index.ts
  index.ts

src/features/pin-lock/
  components/
    PinLockOverlay.tsx
  hooks/
    use-idle-timer.ts
    use-pin-lock.ts
  index.ts

src/routes/app/
  import/index.tsx
  settings.tsx              (settings layout)
  settings/
    index.tsx
    security.tsx
    wallet.tsx
    categories.tsx
```

**Modified files:**
- `prisma/schema.prisma` — add SharedWallet, WalletMember, WalletRole
- `src/routes/app.tsx` — add PinLockOverlay
- `src/shared/components/nav/AppSidebar.tsx` — add Import + Settings nav items

---

## Verification

- [ ] CSV import wizard: upload → map columns → preview with duplicate detection → confirm → transactions created
- [ ] Duplicate rows flagged in preview are skipped (unless user manually unchecks the flag)
- [ ] "Export Backup" downloads a valid JSON file with all user data
- [ ] Restoring from backup JSON recreates all records without duplication
- [ ] Can create a shared wallet and invite another user by email
- [ ] Invited user (VIEWER) can see shared accounts but cannot edit
- [ ] EDITOR role can add transactions to shared accounts
- [ ] Changing name/email in settings persists after page refresh
- [ ] PIN lock overlay appears after 5 minutes of inactivity
- [ ] Correct PIN dismisses lock overlay; wrong PIN shows error
