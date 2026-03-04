import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '@/shared/lib/password'

describe('password', () => {
  describe('hashPassword', () => {
    it('returns a hashed string different from plain text', async () => {
      const plain = 'MySecurePassword123'
      const hash = await hashPassword(plain)

      expect(hash).not.toBe(plain)
      expect(typeof hash).toBe('string')
      expect(hash.length).toBeGreaterThan(20)
    })

    it('produces different hashes for the same password', async () => {
      const plain = 'SamePassword'
      const hash1 = await hashPassword(plain)
      const hash2 = await hashPassword(plain)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('comparePassword', () => {
    it('returns true for correct password', async () => {
      const plain = 'CorrectPassword'
      const hash = await hashPassword(plain)

      await expect(comparePassword(plain, hash)).resolves.toBe(true)
    })

    it('returns false for wrong password', async () => {
      const hash = await hashPassword('CorrectPassword')

      await expect(comparePassword('WrongPassword', hash)).resolves.toBe(false)
    })
  })
})
