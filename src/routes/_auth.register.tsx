import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const Route = createFileRoute('/_auth/register')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/app' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  return <RegisterForm />
}
