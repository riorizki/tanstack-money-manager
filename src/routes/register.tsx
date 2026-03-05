import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterPage } from '@/features/auth/components/pages/RegisterPage'

export const Route = createFileRoute('/register')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/app' })
    }
  },
  component: RegisterPage,
})
