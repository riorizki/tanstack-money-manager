import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccount, useUpdateAccount } from '../../query/account.queries'
import type { CreateAccountInput } from '../../schema/account.schema'
import { PageWrapper } from '@/shared/index'
import { AccountForm } from './AccountForm'

interface EditAccountPageProps {
  accountId: string
}

export function EditAccountPage({ accountId }: EditAccountPageProps) {
  const navigate = useNavigate()
  const {
    data: account,
    isLoading,
    isError,
    refetch,
    error,
  } = useAccount(accountId)
  const updateAccountMutation = useUpdateAccount()

  function handleSubmit(data: CreateAccountInput) {
    updateAccountMutation.mutate(
      {
        id: accountId,
        data,
      },
      {
        onSuccess: () => {
          navigate({ to: '/app/accounts' })
        },
      },
    )
  }

  if (isLoading) {
    return (
      <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
        <div className="w-full space-y-8">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
              ■ 03 Accounts
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
              Edit.
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-black/52">
              Loading account details.
            </p>
          </header>
          <article className="border-2 border-black bg-[#f6f6f6] px-6 py-6 shadow-[6px_6px_0_0_#000]">
            <Skeleton className="h-7 w-36 rounded-none bg-black/10" />
            <Skeleton className="mt-4 h-10 w-full rounded-none bg-black/10" />
            <Skeleton className="mt-4 h-10 w-full rounded-none bg-black/10" />
            <Skeleton className="mt-4 h-10 w-full rounded-none bg-black/10" />
          </article>
        </div>
      </PageWrapper>
    )
  }

  if (isError || !account) {
    return (
      <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
        <div className="w-full space-y-8">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
              ■ 03 Accounts
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
              Edit.
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-black/52">
              Unable to load account details.
            </p>
          </header>
          <section className="border-2 border-black bg-[#f6f6f6] px-6 py-10 shadow-[6px_6px_0_0_#000]">
            <p className="text-base font-semibold text-black">
              {error?.message ?? 'Account not found'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-none border-black bg-white px-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-none hover:bg-black hover:text-white"
                onClick={() => {
                  refetch()
                }}
              >
                Retry
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-none border-black bg-white px-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-none hover:bg-black hover:text-white"
              >
                <Link to="/app/accounts">Back to Accounts</Link>
              </Button>
            </div>
          </section>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
      <div className="w-full space-y-8">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
            ■ 03 Accounts
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
            Edit.
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-black/52">
            Update account identity, color, and starting balance.
          </p>
        </header>
        <AccountForm
          mode="edit"
          defaultValues={{
            name: account.name,
            type: account.type,
            currency: account.currency,
            startingBalance: account.startingBalance,
            color: account.color,
            icon: account.icon,
          }}
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate({ to: '/app/accounts' })
          }}
          isSubmitting={updateAccountMutation.isPending}
          errorMessage={updateAccountMutation.error?.message}
          submitLabel="Save Account"
        />
      </div>
    </PageWrapper>
  )
}
