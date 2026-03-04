import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { loginSchema } from '../schema/login.schema'
import { userRepository } from '../repository/user.repository'
import { sessionRepository } from '../repository/session.repository'
import { comparePassword } from '@/shared/lib/password'
import { getTokenExpiry, signAccessToken } from '@/shared/lib/jwt'
import type { AuthUser } from '../types'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }): Promise<AuthUser> => {
    const user = await userRepository.findByEmail(data.email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isValid = await comparePassword(data.password, user.passwordHash)
    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    const token = signAccessToken({ userId: user.id, email: user.email })
    const { expiresAt, maxAgeSeconds } = getTokenExpiry(token)

    await sessionRepository.createSession({ userId: user.id, token, expiresAt })

    setCookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeSeconds,
      path: '/',
    })

    return { id: user.id, email: user.email, name: user.name }
  })
