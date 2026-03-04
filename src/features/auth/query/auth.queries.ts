import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { queryKeys } from '@/shared/query/keys'
import { getSessionFn } from '../server/get-session'
import { loginFn } from '../server/login'
import { logoutFn } from '../server/logout'
import { registerFn } from '../server/register'
import type { LoginInput } from '../schema/login.schema'
import type { RegisterInput } from '../schema/register.schema'

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: () => getSessionFn(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginInput) => loginFn({ data }),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.session(), user)
      navigate({ to: '/app' })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => logoutFn(),
    onSuccess: () => {
      queryClient.clear()
      navigate({ to: '/login' })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterInput) => registerFn({ data }),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.session(), user)
      navigate({ to: '/app' })
    },
  })
}
