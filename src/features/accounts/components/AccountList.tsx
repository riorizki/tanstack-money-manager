import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/shared/components/layout/ErrorState'
import type { AccountWithBalance } from '../types'
import { AccountCard } from './AccountCard'

interface AccountListProps {
  accounts: AccountWithBalance[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onDelete?: (accountId: string) => void
  deletePending?: boolean
  emptyAction?: React.ReactNode
}

function AccountCardSkeleton() {
  return (
    <article className="border-2 border-black bg-[#f6f6f6] shadow-[5px_5px_0_0_#000]">
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-2.5">
        <Skeleton className="h-4 w-28 rounded-none bg-black/10" />
        <Skeleton className="h-4 w-16 rounded-none bg-black/10" />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3 rounded-none bg-black/10" />
          <Skeleton className="h-3 w-32 rounded-none bg-black/10" />
        </div>
        <Skeleton className="h-9 w-40 rounded-none bg-black/10" />
      </div>
    </article>
  )
}

export function AccountList({
  accounts,
  isLoading = false,
  isError = false,
  onRetry,
  onDelete,
  deletePending = false,
  emptyAction,
}: AccountListProps) {
  if (isLoading) {
    return (
      <section className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <AccountCardSkeleton key={index} />
        ))}
      </section>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load accounts"
        description="Please retry or refresh the page."
        onRetry={onRetry}
      />
    )
  }

  if (accounts.length === 0) {
    return (
      <section className="border border-black/35 bg-[#f2f2f2]">
        <div className="flex min-h-84 items-center justify-center px-6 py-14 text-center sm:px-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
              ■ Empty Ledger
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] text-black sm:text-5xl">
              No accounts yet.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-black/55">
              Create your first account to start tracking balances.
            </p>
            {emptyAction && <footer className="mt-8">{emptyAction}</footer>}
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-black/20 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-black/35">
          <span>Account Registry</span>
          <span>00 — 00</span>
        </footer>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onDelete={onDelete}
          deletePending={deletePending}
        />
      ))}
    </section>
  )
}
