import type { Prisma } from '@/generated/prisma/client'
import type { AccountType } from '@/shared/constants/enums'
import type {
  MerchantOption,
  TransactionWithRelations,
} from '../types'

type PrismaTransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    account: true
    category: true
    merchant: true
  }
}>

export function normalizeOptionalField(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function toTransactionWithRelations(
  transaction: PrismaTransactionWithRelations,
): TransactionWithRelations {
  return {
    id: transaction.id,
    userId: transaction.userId,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    merchantId: transaction.merchantId,
    type: transaction.type,
    amount: Number(transaction.amount),
    date: transaction.date.toISOString(),
    notes: transaction.notes,
    transferId: transaction.transferId,
    recurringId: transaction.recurringId,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
    account: {
      id: transaction.account.id,
      name: transaction.account.name,
      type: transaction.account.type as AccountType,
      currency: transaction.account.currency,
    },
    category: transaction.category
      ? {
          id: transaction.category.id,
          name: transaction.category.name,
          type: transaction.category.type,
          color: transaction.category.color,
          icon: transaction.category.icon,
        }
      : null,
    merchant: transaction.merchant
      ? {
          id: transaction.merchant.id,
          name: transaction.merchant.name,
          categoryId: transaction.merchant.categoryId,
        }
      : null,
  }
}

export function toMerchantOption(merchant: {
  id: string
  name: string
  categoryId: string | null
}): MerchantOption {
  return {
    id: merchant.id,
    name: merchant.name,
    categoryId: merchant.categoryId,
  }
}
