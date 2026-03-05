import { createFileRoute } from '@tanstack/react-router'
import { AccountsListPage } from '@/features/accounts/components/list/AccountsListPage'

export const Route = createFileRoute('/app/accounts/')({
  component: AccountsListPage,
})
