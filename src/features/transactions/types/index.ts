import type { AccountType, TransactionType } from '@/shared/constants/enums'

export interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId: string | null
  merchantId: string | null
  type: TransactionType
  amount: number
  date: string
  notes: string | null
  transferId: string | null
  recurringId: string | null
  createdAt: string
  updatedAt: string
}

export interface TransactionAccount {
  id: string
  name: string
  type: AccountType
  currency: string
}

export interface TransactionCategory {
  id: string
  name: string
  type: TransactionType
  color: string | null
  icon: string | null
}

export interface TransactionMerchant {
  id: string
  name: string
  categoryId: string | null
}

export interface TransactionWithRelations extends Transaction {
  account: TransactionAccount
  category: TransactionCategory | null
  merchant: TransactionMerchant | null
}

export interface TransactionFilters {
  accountId?: string
  categoryIds?: string[]
  type?: TransactionType
  from?: string
  to?: string
  q?: string
  cursor?: string
  limit?: number
}

export interface TransactionStats {
  totalIncome: number
  totalExpense: number
  count: number
}

export interface TransactionListResponse {
  items: TransactionWithRelations[]
  nextCursor: string | null
}

export interface MerchantOption {
  id: string
  name: string
  categoryId: string | null
}
