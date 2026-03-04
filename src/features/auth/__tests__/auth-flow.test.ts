import { beforeEach, describe, expect, it, vi } from 'vitest'

interface TestUser {
  id: string
  name: string
  email: string
  passwordHash: string
}

interface TestSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

const state = vi.hoisted(() => {
  const usersByEmail = new Map<string, TestUser>()
  const usersById = new Map<string, TestUser>()
  const sessionsByToken = new Map<string, TestSession>()
  const cookieJar = new Map<string, string>()

  let userCounter = 0
  let sessionCounter = 0

  return {
    usersByEmail,
    usersById,
    sessionsByToken,
    cookieJar,
    nextUserId() {
      userCounter += 1
      return `user_${userCounter}`
    },
    nextSessionId() {
      sessionCounter += 1
      return `session_${sessionCounter}`
    },
    reset() {
      usersByEmail.clear()
      usersById.clear()
      sessionsByToken.clear()
      cookieJar.clear()
      userCounter = 0
      sessionCounter = 0
    },
  }
})

vi.mock('@/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-that-is-at-least-32-chars-long!!',
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '30d',
  },
}))

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => {
    let validator: ((data: unknown) => unknown) | undefined

    return {
      inputValidator(nextValidator: unknown) {
        if (typeof nextValidator === 'function') {
          validator = nextValidator as (data: unknown) => unknown
        } else if (
          nextValidator &&
          typeof nextValidator === 'object' &&
          'parse' in nextValidator &&
          typeof (nextValidator as { parse: unknown }).parse === 'function'
        ) {
          validator = (data: unknown) =>
            (nextValidator as { parse: (data: unknown) => unknown }).parse(data)
        }
        return this
      },
      handler(handlerFn: (ctx: { data: unknown }) => unknown) {
        return async (opts?: { data?: unknown }) => {
          const validatedData = validator ? validator(opts?.data) : opts?.data
          return handlerFn({ data: validatedData })
        }
      },
    }
  },
}))

vi.mock('@/features/auth/repository/user.repository', () => ({
  userRepository: {
    findByEmail: vi.fn(
      async (email: string) => state.usersByEmail.get(email) ?? null,
    ),
    findById: vi.fn(async (id: string) => state.usersById.get(id) ?? null),
    create: vi.fn(
      async (data: { name: string; email: string; passwordHash: string }) => {
        const user: TestUser = { id: state.nextUserId(), ...data }
        state.usersByEmail.set(user.email, user)
        state.usersById.set(user.id, user)
        return user
      },
    ),
    updatePassword: vi.fn(async (id: string, passwordHash: string) => {
      const user = state.usersById.get(id)
      if (!user) {
        throw new Error('User not found')
      }
      const updated = { ...user, passwordHash }
      state.usersById.set(id, updated)
      state.usersByEmail.set(updated.email, updated)
      return updated
    }),
  },
}))

vi.mock('@/features/auth/repository/session.repository', () => ({
  sessionRepository: {
    createSession: vi.fn(
      async (data: { userId: string; token: string; expiresAt: Date }) => {
        const session: TestSession = {
          id: state.nextSessionId(),
          createdAt: new Date(),
          ...data,
        }
        state.sessionsByToken.set(session.token, session)
        return session
      },
    ),
    findByToken: vi.fn(
      async (token: string) => state.sessionsByToken.get(token) ?? null,
    ),
    deleteSession: vi.fn(async (token: string) => {
      const session = state.sessionsByToken.get(token)
      if (!session) {
        throw new Error('Session not found')
      }
      state.sessionsByToken.delete(token)
      return session
    }),
    deleteExpired: vi.fn(async () => {
      let count = 0
      const now = new Date()
      for (const [token, session] of state.sessionsByToken.entries()) {
        if (session.expiresAt < now) {
          state.sessionsByToken.delete(token)
          count += 1
        }
      }
      return { count }
    }),
  },
}))

vi.mock('@tanstack/react-start/server', async () => {
  const actual = await vi.importActual<object>('@tanstack/react-start/server')
  return {
    ...actual,
    getCookie: vi.fn((name: string) => state.cookieJar.get(name)),
    setCookie: vi.fn((name: string, value: string) => {
      if (value) {
        state.cookieJar.set(name, value)
      } else {
        state.cookieJar.delete(name)
      }
    }),
  }
})

const { registerFn } = await import('@/features/auth/server/register')
const { loginFn } = await import('@/features/auth/server/login')
const { getSessionFn } = await import('@/features/auth/server/get-session')
const { logoutFn } = await import('@/features/auth/server/logout')

describe('auth flow integration', () => {
  beforeEach(() => {
    state.reset()
  })

  it('registers, restores session, logs out, and blocks invalid login', async () => {
    const email = 'demo@example.com'
    const password = 'password123'

    const registeredUser = await registerFn({
      data: {
        name: 'Demo User',
        email,
        password,
        confirmPassword: password,
      },
    })

    expect(registeredUser.email).toBe(email)
    expect(state.cookieJar.get('auth_token')).toBeTruthy()

    const currentUser = await getSessionFn()
    expect(currentUser).toEqual({
      id: registeredUser.id,
      email: registeredUser.email,
      name: registeredUser.name,
    })

    await logoutFn()
    expect(state.cookieJar.get('auth_token')).toBeUndefined()
    await expect(getSessionFn()).resolves.toBeNull()

    await expect(
      loginFn({
        data: { email, password: 'wrong-password' },
      }),
    ).rejects.toThrow('Invalid email or password')

    const loggedInUser = await loginFn({ data: { email, password } })
    expect(loggedInUser.id).toBe(registeredUser.id)
    expect(state.cookieJar.get('auth_token')).toBeTruthy()
  })
})
