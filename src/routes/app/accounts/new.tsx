import { createFileRoute } from '@tanstack/react-router'
import { CreateAccountPage } from '@/features/accounts/components/form/CreateAccountPage'

export const Route = createFileRoute('/app/accounts/new')({
  component: CreateAccountPage,
})
