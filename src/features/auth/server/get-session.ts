import { verifyToken } from '@/shared/lib/jwt'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { sessionRepository } from '../repository/session.repository'
import { userRepository } from '../repository/user.repository'
import type { AuthUser } from '../types'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthUser | null> => {
    try {
      const token = getCookie('auth_token')
      if (!token) {
        return null
      }

      const payload = verifyToken(token)

      const session = await sessionRepository.findByToken(token)
      if (!session || session.expiresAt < new Date()) {
        return null
      }

      const user = await userRepository.findById(payload.userId)
      if (!user) {
        return null
      }

      return { id: user.id, email: user.email, name: user.name }
    } catch {
      return null
    }
  },
)
