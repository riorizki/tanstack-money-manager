import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const Route = createFileRoute('/_auth/login')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/app' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return <LoginForm />
}
