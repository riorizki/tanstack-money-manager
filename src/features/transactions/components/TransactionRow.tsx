import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/features/categories'
import { TransactionType } from '@/shared/constants/enums'
import { formatCurrency, formatDate } from '@/shared/index'
import type { TransactionWithRelations } from '../types'

interface TransactionRowProps {
  transaction: TransactionWithRelations
  onEdit?: (transactionId: string) => void
  onDelete?: (transactionId: string) => void
  isDeleting?: boolean
}

function getAmountTone(type: TransactionType) {
  if (type === TransactionType.INCOME || type === TransactionType.TRANSFER_IN) {
    return 'text-emerald-700'
  }

  return 'text-rose-700'
}

function getAmountPrefix(type: TransactionType) {
  if (type === TransactionType.INCOME || type === TransactionType.TRANSFER_IN) {
    return '+'
  }

  return '-'
}

export function TransactionRow({
  transaction,
  onEdit,
  onDelete,
  isDeleting = false,
}: TransactionRowProps) {
  const amountClass = getAmountTone(transaction.type)

  return (
    <article className="flex flex-col gap-3 border border-black/20 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {transaction.category ? (
            <CategoryBadge category={transaction.category} />
          ) : (
            <span className="inline-flex items-center border border-black/20 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
              Uncategorised
            </span>
          )}
          <span className="text-xs text-black/45">{transaction.account.name}</span>
        </div>

        <div className="text-sm text-black/70">
          <span className="font-medium">
            {transaction.merchant?.name ?? 'No merchant'}
          </span>
          {transaction.notes && <span className="ml-2 text-black/50">{transaction.notes}</span>}
        </div>

        <p className="text-xs uppercase tracking-[0.16em] text-black/45">
          {formatDate(transaction.date)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className={`text-lg font-bold tracking-[-0.02em] ${amountClass}`}>
          {getAmountPrefix(transaction.type)}
          {formatCurrency(transaction.amount, transaction.account.currency)}
        </p>

        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit(transaction.id)}
              className="h-8 rounded-none border-black bg-white px-2 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
            >
              <Pencil size={13} />
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => onDelete(transaction.id)}
              className="h-8 rounded-none border-black bg-white px-2 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
            >
              <Trash2 size={13} />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
