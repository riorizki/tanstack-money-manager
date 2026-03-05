import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAccounts } from '@/features/accounts'
import { useCategories } from '@/features/categories'
import {
  TransactionForm,
  useCreateTransaction,
  useMerchants,
} from '@/features/transactions'
import type { CreateTransactionInput } from '@/features/transactions'
import { PageWrapper } from '@/shared/index'

export const Route = createFileRoute('/app/transactions/new')({
  component: NewTransactionPage,
})

function NewTransactionPage() {
  const navigate = useNavigate()
  const { data: accounts = [] } = useAccounts()
  const { data: categories = [] } = useCategories()
  const { data: merchants = [] } = useMerchants()

  const createTransactionMutation = useCreateTransaction()

  function handleSubmit(data: CreateTransactionInput) {
    createTransactionMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/app/transactions' })
      },
    })
  }

  return (
    <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
      <div className="w-full space-y-8">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
            ■ 01 Transactions
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
            Create.
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-black/52">
            Add a new income or expense transaction entry.
          </p>
        </header>

        {accounts.length === 0 ? (
          <section className="border-2 border-black bg-[#f6f6f6] px-6 py-8 shadow-[6px_6px_0_0_#000]">
            <p className="text-lg font-semibold text-black">No active account found.</p>
            <p className="mt-2 text-sm text-black/60">
              Create at least one account before logging transactions.
            </p>
            <Button
              asChild
              className="mt-5 h-11 rounded-none border border-black bg-black px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-none hover:bg-black/85"
            >
              <Link to="/app/accounts/new">Create Account</Link>
            </Button>
          </section>
        ) : (
          <TransactionForm
            mode="create"
            accounts={accounts}
            categories={categories}
            merchants={merchants}
            onSubmit={handleSubmit}
            onCancel={() => {
              navigate({ to: '/app/transactions' })
            }}
            isSubmitting={createTransactionMutation.isPending}
            errorMessage={createTransactionMutation.error?.message}
            submitLabel="Create Transaction"
          />
        )}
      </div>
    </PageWrapper>
  )
}
