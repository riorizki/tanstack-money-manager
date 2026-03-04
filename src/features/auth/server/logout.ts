import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { sessionRepository } from '../repository/session.repository'

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const token = getCookie('auth_token')
  if (token) {
    try {
      await sessionRepository.deleteSession(token)
    } catch {
      // Session may already be deleted or expired
    }
  }
  // Clear cookie by setting maxAge to 0
  setCookie('auth_token', '', { maxAge: 0, path: '/' })
})
