# Phase 1 — Authentication

**Status:** ⬜ Pending
**Complexity:** Medium
**Depends on:** Phase 0

---

## Goal

Implement full JWT-based auth: user registration, login, session management, and route protection. After this phase, all subsequent features can rely on `context.user` being present on authenticated routes.

---

## Prisma Models

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String
  passwordHash String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  sessions     Session[]
  // relations added by later phases:
  // accounts, transactions, categories, etc.
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
}
```

---

## Tasks

### Dependencies

- [ ] Add `bcryptjs` + `@types/bcryptjs` to dependencies
- [ ] Add `jsonwebtoken` + `@types/jsonwebtoken` to dependencies
- [ ] Run `pnpm db:migrate` then `pnpm db:generate` after schema changes

### Shared Libs

- [ ] Create `src/shared/lib/jwt.ts` — `signAccessToken(payload)`, `signRefreshToken(payload)`, `verifyToken(token)`
- [ ] Create `src/shared/lib/password.ts` — `hashPassword(plain)`, `comparePassword(plain, hash)`

### Feature: Auth Schema & Types

- [ ] Create `src/features/auth/schema/login.schema.ts` — Zod: `{ email, password }`
- [ ] Create `src/features/auth/schema/register.schema.ts` — Zod: `{ name, email, password, confirmPassword }` with refinement
- [ ] Create `src/features/auth/types/index.ts` — `AuthUser`, `AuthSession`, `JWTPayload`

### Feature: Repositories

- [ ] Create `src/features/auth/repository/user.repository.ts` — `findByEmail`, `findById`, `create`, `updatePassword`
- [ ] Create `src/features/auth/repository/session.repository.ts` — `createSession`, `findByToken`, `deleteSession`, `deleteExpired`

### Feature: Server Functions

- [ ] Create `src/features/auth/server/register.ts` — `createServerFn` POST: validate, check email uniqueness, hash password, create user, issue tokens, set HTTP-only cookie
- [ ] Create `src/features/auth/server/login.ts` — `createServerFn` POST: validate credentials, issue JWT, set `auth_token` HTTP-only cookie
- [ ] Create `src/features/auth/server/logout.ts` — `createServerFn` POST: clear cookie, delete session from DB
- [ ] Create `src/features/auth/server/get-session.ts` — `createServerFn` GET: verify cookie token → return `AuthUser` or null

### Feature: Query Hooks

- [ ] Create `src/features/auth/query/auth.queries.ts` — `useCurrentUser()`, `useLogin()`, `useLogout()`, `useRegister()`
- [ ] Create `src/features/auth/hooks/use-auth.ts` — convenience hook: `{ user, isAuthenticated, login, logout }`

### Feature: UI Components

- [ ] Create `src/features/auth/components/LoginForm.tsx` — React Hook Form + shadcn Form + Zod resolver
- [ ] Create `src/features/auth/components/RegisterForm.tsx` — same pattern with confirm password field

### Routes

- [ ] Create `src/routes/_auth.tsx` — unauthenticated layout: centered card, no sidebar
- [ ] Create `src/routes/login.tsx` — renders `LoginForm`, redirects to `/app/dashboard` if already logged in
- [ ] Create `src/routes/register.tsx` — renders `RegisterForm`

### Route Protection

- [ ] Update `src/routes/app.tsx` `beforeLoad` to call `get-session`; redirect to `/login` if session is null
- [ ] Update `src/routes/__root.tsx` router context type to include `user: AuthUser | null`
- [ ] Inject `user` into router context after session verification

### Tests

- [ ] Unit test `jwt.ts`: sign + verify round-trip, expired token rejection
- [ ] Unit test `password.ts`: hash + compare, wrong password rejection
- [ ] Integration test: register → login → get-session → logout flow

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
  login.tsx
  register.tsx
```

**Modified files:**

- `prisma/schema.prisma` — add `User`, `Session` models
- `src/routes/app.tsx` — add `beforeLoad` auth check
- `src/routes/__root.tsx` — add `user` to router context type

---

## Verification

- [ ] `pnpm dev` starts without errors after schema migration
- [ ] Navigate to `/app/dashboard` without a session → redirects to `/login`
- [ ] Register a new user → redirected to `/app/dashboard`
- [ ] Logout → cookie cleared, redirected to `/login`
- [ ] Login with wrong password → shows error message
- [ ] Login with correct credentials → session restored on page refresh
- [ ] `pnpm test` passes all auth unit and integration tests
