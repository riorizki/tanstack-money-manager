import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AuthUser } from '@/features/auth/types'

let context:
  | {
      queryClient: QueryClient
      user: AuthUser | null
    }
  | undefined

export function getContext() {
  if (context) {
    return context
  }

  const queryClient = new QueryClient()

  context = {
    queryClient,
    user: null,
  }

  return context
}

export default function TanStackQueryProvider({
  children,
}: {
  children: ReactNode
}) {
  const { queryClient } = getContext()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
