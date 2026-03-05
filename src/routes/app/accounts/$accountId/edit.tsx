import { createFileRoute } from '@tanstack/react-router'
import { EditAccountPage } from '@/features/accounts/components/form/EditAccountPage'

export const Route = createFileRoute('/app/accounts/$accountId/edit')({
  component: EditAccountRoute,
})

function EditAccountRoute() {
  const { accountId } = Route.useParams()

  return <EditAccountPage accountId={accountId} />
}
