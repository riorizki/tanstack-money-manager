# Phase 1 — Authentication

**Status:** ✅ Completed (Implementation Ready)
**Complexity:** Medium
**Depends on:** Phase 0

---

## Goal

Implement full JWT-based auth: user registration, login, session management, and route protection. After this phase, all subsequent features can rely on `context.user` being present on authenticated routes.

---

## Prisma Models

```prisma
model User {
  id           String    @id @default(cuid()) @map("id")
  email        String    @unique @map("email")
  name         String    @map("name")
  passwordHash String    @map("password_hash")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  sessions     Session[]

  @@map("users")
}

model Session {
  id        String   @id @default(cuid()) @map("id")
  userId    String   @map("user_id")
  token     String   @map("token") @db.Text
  tokenHash String   @unique(map: "sessions_token_hash_unique") @map("token_hash") @db.VarChar(64)
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId], map: "sessions_user_id_idx")
  @@map("sessions")
}
```

Note: Prisma schema is split by domain files under `prisma/models/` (for example `user.prisma`, `auth.prisma`), with datasource/generator kept in `prisma/schema.prisma`.

---

## Tasks

### Dependencies

- [x] Add `bcryptjs` + `@types/bcryptjs` to dependencies
- [x] Add `jsonwebtoken` + `@types/jsonwebtoken` to dependencies
- [x] Run `pnpm db:migrate` then `pnpm db:generate` after schema changes

### Shared Libs

- [x] Create `src/shared/lib/jwt.ts` — `signAccessToken(payload)`, `signRefreshToken(payload)`, `verifyToken(token)`
- [x] Create `src/shared/lib/password.ts` — `hashPassword(plain)`, `comparePassword(plain, hash)`

### Feature: Auth Schema & Types

- [x] Create `src/features/auth/schema/login.schema.ts` — Zod: `{ email, password }`
- [x] Create `src/features/auth/schema/register.schema.ts` — Zod: `{ name, email, password, confirmPassword }` with refinement
- [x] Create `src/features/auth/types/index.ts` — `AuthUser`, `AuthSession`, `JWTPayload`

### Feature: Repositories

- [x] Create `src/features/auth/repository/user.repository.ts` — `findByEmail`, `findById`, `create`, `updatePassword`
- [x] Create `src/features/auth/repository/session.repository.ts` — `createSession`, `findByToken`, `deleteSession`, `deleteExpired`

### Feature: Server Functions

- [x] Create `src/features/auth/server/register.ts` — `createServerFn` POST: validate, check email uniqueness, hash password, create user, issue tokens, set HTTP-only cookie
- [x] Create `src/features/auth/server/login.ts` — `createServerFn` POST: validate credentials, issue JWT, set `auth_token` HTTP-only cookie
- [x] Create `src/features/auth/server/logout.ts` — `createServerFn` POST: clear cookie, delete session from DB
- [x] Create `src/features/auth/server/get-session.ts` — `createServerFn` GET: verify cookie token → return `AuthUser` or null

### Feature: Query Hooks

- [x] Create `src/features/auth/query/auth.queries.ts` — `useCurrentUser()`, `useLogin()`, `useLogout()`, `useRegister()`
- [x] Create `src/features/auth/hooks/use-auth.ts` — convenience hook: `{ user, isAuthenticated, login, logout }`

### Feature: UI Components

- [x] Create `src/features/auth/components/LoginForm.tsx` — React Hook Form + shadcn Form + Zod resolver
- [x] Create `src/features/auth/components/RegisterForm.tsx` — same pattern with confirm password field

### Routes

- [x] Create `src/routes/_auth.tsx` — unauthenticated layout: centered card, no sidebar
- [x] Create auth login route — renders `LoginForm`, redirects to `/app` if already logged in
- [x] Create auth register route — renders `RegisterForm`

### Route Protection

- [x] Update `src/routes/app.tsx` `beforeLoad` to call `get-session`; redirect to `/login` if session is null
- [x] Update `src/routes/__root.tsx` router context type to include `user: AuthUser | null`
- [x] Inject `user` into router context after session verification

### Tests

- [x] Unit test `jwt.ts`: sign + verify round-trip, expired token rejection
- [x] Unit test `password.ts`: hash + compare, wrong password rejection
- [x] Integration test: register → login → get-session → logout flow

---

## Key Files to Create

```
src/features/auth/
  components/
    LoginForm.tsx
    RegisterForm.tsx
  hooks/
    use-auth.ts
  query/
    auth.queries.ts
  repository/
    user.repository.ts
    session.repository.ts
  schema/
    login.schema.ts
    register.schema.ts
  server/
    get-session.ts
    login.ts
    logout.ts
    register.ts
  types/
    index.ts
  index.ts

src/shared/lib/
  jwt.ts
  password.ts

src/routes/
  _auth.tsx
  _auth.login.tsx
  _auth.register.tsx
```

**Modified files:**

- `prisma/schema.prisma` — datasource + generator
- `prisma/models/user.prisma` — `User` model
- `prisma/models/auth.prisma` — `Session` model
- `src/routes/app.tsx` — add `beforeLoad` auth check
- `src/routes/__root.tsx` — add `user` to router context type

---

## Verification

- [ ] `pnpm dev` starts without errors after schema migration
- [x] Navigate to `/app` without a session → redirects to `/login`
- [x] Register a new user → redirected to `/app`
- [x] Logout → cookie cleared, redirected to `/login`
- [x] Login with wrong password → shows error message
- [x] Login with correct credentials → session restored on page refresh
- [x] `pnpm test` passes all auth unit and integration tests

---

## Notes

- Active auth navigation currently lands on `/app` (not `/app/dashboard`) because dashboard route has not been created yet.
- Session persistence stores full JWT in `sessions.token` (`TEXT`) and uses `sessions.token_hash` (`SHA-256`) for unique lookup/deletion.
