import jwt from 'jsonwebtoken'
import { env } from '@/env'

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export function signAccessToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export function signRefreshToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload
}

export function getTokenExpiry(token: string): {
  expiresAt: Date
  maxAgeSeconds: number
} {
  const payload = verifyToken(token)
  if (!payload.exp) {
    throw new Error('Token missing exp claim')
  }

  const expiresAt = new Date(payload.exp * 1000)
  const maxAgeSeconds = Math.max(
    0,
    Math.floor((expiresAt.getTime() - Date.now()) / 1000),
  )

  return { expiresAt, maxAgeSeconds }
}
