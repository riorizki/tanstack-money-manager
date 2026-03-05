import { TransactionType } from '@/shared/constants/enums'
import type { TransactionWithRelations } from '../types'

function toDateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10)
}

export function groupByDate(transactions: TransactionWithRelations[]) {
  const grouped = new Map<string, TransactionWithRelations[]>()

  for (const transaction of transactions) {
    const key = toDateKey(transaction.date)
    const existing = grouped.get(key)

    if (!existing) {
      grouped.set(key, [transaction])
      continue
    }

    existing.push(transaction)
  }

  return grouped
}

export function calculateNetForPeriod(transactions: TransactionWithRelations[]) {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === TransactionType.INCOME) {
      return total + transaction.amount
    }

    if (transaction.type === TransactionType.EXPENSE) {
      return total - transaction.amount
    }

    return total
  }, 0)
}
