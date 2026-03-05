import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { registerSchema } from '../schema/register.schema'
import { userRepository } from '../repository/user.repository'
import { sessionRepository } from '../repository/session.repository'
import { hashPassword } from '@/shared/lib/password'
import { getTokenExpiry, signAccessToken } from '@/shared/lib/jwt'
import { categoryRepository } from '@/features/categories/repository/category.repository'
import type { AuthUser } from '../types'

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(registerSchema)
  .handler(async ({ data }): Promise<AuthUser> => {
    const existing = await userRepository.findByEmail(data.email)
    if (existing) {
      throw new Error('Email already in use')
    }

    const passwordHash = await hashPassword(data.password)
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    })
    await categoryRepository.seedDefaults(user.id)

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
