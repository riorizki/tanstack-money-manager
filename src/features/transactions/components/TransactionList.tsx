import { useEffect, useMemo, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState, formatDate } from '@/shared'
import type { TransactionWithRelations } from '../types'
import { groupByDate } from '../utils/transaction.utils'
import { TransactionRow } from './TransactionRow'

interface TransactionListProps {
  transactions: TransactionWithRelations[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  onEdit?: (transactionId: string) => void
  onDelete?: (transactionId: string) => void
  deletingTransactionId?: string | null
  emptyAction?: React.ReactNode
}

function TransactionListSkeleton() {
  return (
    <section className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <article
          key={index}
          className="space-y-3 border-2 border-black bg-[#f6f6f6] px-4 py-4 shadow-[4px_4px_0_0_#000]"
        >
          <Skeleton className="h-5 w-44 rounded-none bg-black/10" />
          <Skeleton className="h-4 w-72 rounded-none bg-black/10" />
          <Skeleton className="h-4 w-28 rounded-none bg-black/10" />
        </article>
      ))}
    </section>
  )
}

export function TransactionList({
  transactions,
  isLoading = false,
  isError = false,
  onRetry,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  onEdit,
  onDelete,
  deletingTransactionId,
  emptyAction,
}: TransactionListProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const groupedTransactions = useMemo(() => groupByDate(transactions), [transactions])

  useEffect(() => {
    if (!loadMoreRef.current || !onLoadMore || !hasNextPage) {
      return
    }

    const target = loadMoreRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry.isIntersecting || isFetchingNextPage) {
          return
        }

        onLoadMore()
      },
      {
        rootMargin: '200px',
      },
    )

    observer.observe(target)

    return () => {
      observer.unobserve(target)
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore])

  if (isLoading) {
    return <TransactionListSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load transactions"
        description="Please retry or refresh the page."
        onRetry={onRetry}
      />
    )
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Add your first income or expense record to build your history."
        action={emptyAction}
      />
    )
  }

  return (
    <section className="space-y-6">
      {Array.from(groupedTransactions.entries()).map(([dateKey, items]) => (
        <article key={dateKey} className="space-y-3">
          <header className="sticky top-0 z-10 border border-black/25 bg-[#f0f0f0] px-3 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/55">
              {formatDate(dateKey)}
            </p>
          </header>

          <div className="space-y-2">
            {items.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={deletingTransactionId === transaction.id}
              />
            ))}
          </div>
        </article>
      ))}

      <div ref={loadMoreRef} className="flex min-h-12 items-center justify-center">
        {isFetchingNextPage && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
            Loading more...
          </p>
        )}
      </div>
    </section>
  )
}
