import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@/features/auth/components/pages/LoginPage'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/app' })
    }
  },
  component: LoginPage,
})
