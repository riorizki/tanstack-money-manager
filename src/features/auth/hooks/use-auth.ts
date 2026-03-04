import { useCurrentUser, useLogin, useLogout } from '../query/auth.queries'

export function useAuth() {
  const { data: user, isLoading } = useCurrentUser()
  const { mutate: login, isPending: isLoginPending, error: loginError } = useLogin()
  const { mutate: logout, isPending: isLogoutPending } = useLogout()

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isLoginPending,
    isLogoutPending,
    loginError,
  }
}
