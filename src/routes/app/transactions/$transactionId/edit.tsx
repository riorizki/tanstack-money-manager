import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccounts } from '@/features/accounts'
import { useCategories } from '@/features/categories'
import {
  TransactionForm,
  useMerchants,
  useTransaction,
  useUpdateTransaction,
} from '@/features/transactions'
import type { CreateTransactionInput } from '@/features/transactions'
import { PageWrapper } from '@/shared/index'

export const Route = createFileRoute('/app/transactions/$transactionId/edit')({
  component: EditTransactionRoute,
})

function EditTransactionRoute() {
  const { transactionId } = Route.useParams()

  return <EditTransactionPage transactionId={transactionId} />
}

function EditTransactionPage({ transactionId }: { transactionId: string }) {
  const navigate = useNavigate()
  const {
    data: transaction,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransaction(transactionId)
  const { data: accounts = [] } = useAccounts()
  const { data: categories = [] } = useCategories()
  const { data: merchants = [] } = useMerchants()

  const updateTransactionMutation = useUpdateTransaction()

  function handleSubmit(data: CreateTransactionInput) {
    updateTransactionMutation.mutate(
      {
        id: transactionId,
        data,
      },
      {
        onSuccess: () => {
          navigate({ to: '/app/transactions' })
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
              ■ 01 Transactions
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
              Edit.
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-black/52">
              Loading transaction details.
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

  if (isError || !transaction) {
    return (
      <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
        <div className="w-full space-y-8">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
              ■ 01 Transactions
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
              Edit.
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-black/52">
              Unable to load transaction details.
            </p>
          </header>
          <section className="border-2 border-black bg-[#f6f6f6] px-6 py-10 shadow-[6px_6px_0_0_#000]">
            <p className="text-base font-semibold text-black">
              {error?.message ?? 'Transaction not found'}
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
                <Link to="/app/transactions">Back to Transactions</Link>
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
            ■ 01 Transactions
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
            Edit.
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-black/52">
            Adjust account, category, amount, and notes.
          </p>
        </header>

        <TransactionForm
          mode="edit"
          accounts={accounts}
          categories={categories}
          merchants={merchants}
          defaultValues={{
            accountId: transaction.accountId,
            categoryId: transaction.categoryId,
            merchantName: transaction.merchant?.name ?? null,
            type: transaction.type,
            amount: transaction.amount,
            date: transaction.date,
            notes: transaction.notes,
            transferId: transaction.transferId,
            recurringId: transaction.recurringId,
          }}
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate({ to: '/app/transactions' })
          }}
          isSubmitting={updateTransactionMutation.isPending}
          errorMessage={updateTransactionMutation.error?.message}
          submitLabel="Save Transaction"
        />
      </div>
    </PageWrapper>
  )
}
