import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useAccounts } from '@/features/accounts'
import { useCategories } from '@/features/categories'
import {
  TransactionFilters,
  TransactionList,
  calculateNetForPeriod,
  flattenTransactionPages,
  useDeleteTransaction,
  useTransactionFilters,
  useTransactions,
} from '@/features/transactions'
import { TransactionType } from '@/shared/constants/enums'
import { PageWrapper } from '@/shared/index'
import { formatCurrency } from '@/shared/utils/currency'

const searchSchema = z.object({
  accountId: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  categoryIds: z
    .preprocess(
      (value) => {
        if (Array.isArray(value)) {
          return value.filter((item): item is string => typeof item === 'string')
        }

        if (typeof value === 'string' && value.length > 0) {
          return [value]
        }

        return []
      },
      z.array(z.string()).optional(),
    )
    .optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
})

export const Route = createFileRoute('/app/transactions/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: TransactionsPage,
})

function TransactionsPage() {
  const navigate = useNavigate()
  const {
    data: accounts = [],
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    refetch: refetchAccounts,
  } = useAccounts()
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useCategories()

  const {
    filters,
    search,
    selectedCategoryIds,
    setAccountId,
    setType,
    setDateRange,
    setQuery,
    toggleCategoryId,
    clearFilters,
  } = useTransactionFilters(20)

  const transactionsQuery = useTransactions(filters)
  const transactions = flattenTransactionPages(transactionsQuery.data?.pages)

  const deleteTransactionMutation = useDeleteTransaction(filters)

  const netAmount = calculateNetForPeriod(transactions)

  function handleDelete(transactionId: string) {
    const confirmed = window.confirm(
      'Delete this transaction? This action cannot be undone.',
    )

    if (!confirmed) {
      return
    }

    deleteTransactionMutation.mutate({ id: transactionId })
  }

  const isLoading = isAccountsLoading || isCategoriesLoading || transactionsQuery.isLoading
  const isError =
    isAccountsError || isCategoriesError || transactionsQuery.isError

  return (
    <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
      <div className="w-full space-y-7">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
              ■ 01 Transactions
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
              Transactions.
            </h1>
            <p className="mt-4 max-w-3xl text-xl leading-relaxed text-black/52">
              Track every income and expense movement with category and account context.
            </p>
          </div>

          <Button
            asChild
            className="h-12 self-start rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-none hover:bg-black/85 hover:text-white"
          >
            <Link to="/app/transactions/new">
              <Plus size={14} />
              Add Transaction
            </Link>
          </Button>
        </header>

        {(transactionsQuery.error || deleteTransactionMutation.error) && (
          <p
            role="alert"
            className="border-2 border-black bg-black/5 px-3 py-2 text-xs font-semibold tracking-[0.02em] text-black"
          >
            {transactionsQuery.error?.message ?? deleteTransactionMutation.error?.message}
          </p>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="border-2 border-black bg-[#f6f6f6] px-4 py-4 shadow-[4px_4px_0_0_#000]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
              Total Rows
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-black">
              {transactions.length}
            </p>
          </article>
          <article className="border-2 border-black bg-[#f6f6f6] px-4 py-4 shadow-[4px_4px_0_0_#000]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
              Net Period
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-black">
              {formatCurrency(netAmount)}
            </p>
          </article>
          <article className="border-2 border-black bg-[#f6f6f6] px-4 py-4 shadow-[4px_4px_0_0_#000]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
              Active Filters
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-black">
              {[
                search.accountId,
                search.type,
                search.from,
                search.to,
                search.q,
                selectedCategoryIds.length > 0 ? 'categories' : null,
              ].filter(Boolean).length}
            </p>
          </article>
        </section>

        <TransactionFilters
          accounts={accounts}
          categories={categories}
          accountId={search.accountId}
          type={search.type}
          from={search.from}
          to={search.to}
          q={search.q}
          selectedCategoryIds={selectedCategoryIds}
          onAccountChange={setAccountId}
          onTypeChange={setType}
          onDateRangeChange={setDateRange}
          onQueryChange={setQuery}
          onToggleCategory={toggleCategoryId}
          onClear={clearFilters}
        />

        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => {
            refetchAccounts()
            refetchCategories()
            transactionsQuery.refetch()
          }}
          hasNextPage={transactionsQuery.hasNextPage}
          isFetchingNextPage={transactionsQuery.isFetchingNextPage}
          onLoadMore={() => {
            if (!transactionsQuery.hasNextPage || transactionsQuery.isFetchingNextPage) {
              return
            }

            transactionsQuery.fetchNextPage()
          }}
          onEdit={(transactionId) => {
            navigate({ to: '/app/transactions/$transactionId/edit', params: { transactionId } })
          }}
          onDelete={handleDelete}
          deletingTransactionId={
            deleteTransactionMutation.isPending
              ? deleteTransactionMutation.variables.id
              : null
          }
          emptyAction={
            <Button
              asChild
              className="h-11 rounded-none border border-black bg-black px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-none hover:bg-black/85"
            >
              <Link to="/app/transactions/new">Create Transaction</Link>
            </Button>
          }
        />
      </div>
    </PageWrapper>
  )
}
