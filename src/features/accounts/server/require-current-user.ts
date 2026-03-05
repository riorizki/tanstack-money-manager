import { getSessionFn } from '@/features/auth/server/get-session'

export async function requireCurrentUser() {
  const user = await getSessionFn()
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
