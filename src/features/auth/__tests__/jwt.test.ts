import { describe, expect, it, vi } from 'vitest'

vi.mock('@/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-that-is-at-least-32-chars-long!!',
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '30d',
  },
}))

// Import after mock is set up
const { signAccessToken, signRefreshToken, verifyToken } =
  await import('@/shared/lib/jwt')

describe('jwt', () => {
  const payload = { userId: 'user_123', email: 'test@example.com' }

  describe('signAccessToken', () => {
    it('returns a string token', () => {
      const token = signAccessToken(payload)
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3) // JWT has 3 parts
    })
  })

  describe('signRefreshToken', () => {
    it('returns a string token', () => {
      const token = signRefreshToken(payload)
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3)
    })
  })

  describe('verifyToken', () => {
    it('round-trips sign → verify', () => {
      const token = signAccessToken(payload)
      const decoded = verifyToken(token)

      expect(decoded.userId).toBe(payload.userId)
      expect(decoded.email).toBe(payload.email)
    })

    it('throws on tampered token', () => {
      const token = signAccessToken(payload)
      const tampered = token.slice(0, -5) + 'xxxxx'

      expect(() => verifyToken(tampered)).toThrow()
    })

    it('throws on expired token', async () => {
      // Manually create an expired token by mocking jsonwebtoken
      const jwt = await import('jsonwebtoken')
      const expired = jwt.default.sign(
        payload,
        'test-secret-that-is-at-least-32-chars-long!!',
        {
          expiresIn: -1,
        },
      )

      expect(() => verifyToken(expired)).toThrow()
    })
  })
})
