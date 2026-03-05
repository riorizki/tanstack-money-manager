import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AccountForm, useCreateAccount } from '@/features/accounts'
import type { CreateAccountInput } from '@/features/accounts'
import { PageWrapper } from '@/shared/index'

export const Route = createFileRoute('/app/accounts/new')({
  component: NewAccountPage,
})

function NewAccountPage() {
  const navigate = useNavigate()
  const createAccountMutation = useCreateAccount()

  function handleSubmit(data: CreateAccountInput) {
    createAccountMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/app/accounts' })
      },
    })
  }

  return (
    <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
      <div className="w-full space-y-8">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
            ■ 03 Accounts
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
            Create.
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-black/52">
            Set up a new account with starting balance and display details.
          </p>
        </header>

        <AccountForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate({ to: '/app/accounts' })
          }}
          isSubmitting={createAccountMutation.isPending}
          errorMessage={createAccountMutation.error?.message}
        />
      </div>
    </PageWrapper>
  )
}
