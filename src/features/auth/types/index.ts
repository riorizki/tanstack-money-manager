export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface AuthSession {
  token: string
  userId: string
  expiresAt: Date
}

export type { JWTPayload } from '../../../shared/lib/jwt'
