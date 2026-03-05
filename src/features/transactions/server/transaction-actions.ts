import { createServerFn } from '@tanstack/react-start'
import { accountRepository } from '@/features/accounts/repository/account.repository'
import { categoryRepository } from '@/features/categories/repository/category.repository'
import { transactionRepository } from '../repository/transaction.repository'
import {
  createTransactionSchema,
  transactionListSchema,
  transactionStatsFilterSchema,
} from '../schema/transaction.schema'
import {
  merchantListSchema,
  transactionIdSchema,
  updateTransactionPayloadSchema,
} from './transaction-server.schema'
import {
  toMerchantOption,
  toTransactionWithRelations,
} from './transaction-utils'
import { requireCurrentUser } from './require-current-user'

async function assertAccountAccess(userId: string, accountId: string) {
  const account = await accountRepository.findById(accountId, userId)
  if (!account) {
    throw new Error('Account not found')
  }

  return account
}

async function assertCategoryAccess(
  userId: string,
  categoryId: string,
  transactionType: string,
) {
  const category = await categoryRepository.findById(categoryId, userId)
  if (!category) {
    throw new Error('Category not found')
  }

  if (
    (transactionType === 'INCOME' || transactionType === 'EXPENSE') &&
    category.type !== transactionType
  ) {
    throw new Error('Category type must match transaction type')
  }

  return category
}

export const listTransactions = createServerFn({ method: 'GET' })
  .inputValidator(transactionListSchema.optional())
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const result = await transactionRepository.findMany(user.id, data)

    return {
      items: result.items.map(toTransactionWithRelations),
      nextCursor: result.nextCursor,
    }
  })

export const getTransaction = createServerFn({ method: 'GET' })
  .inputValidator(transactionIdSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const transaction = await transactionRepository.findById(data.id, user.id)

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return toTransactionWithRelations(transaction)
  })

export const createTransaction = createServerFn({ method: 'POST' })
  .inputValidator(createTransactionSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()

    await assertAccountAccess(user.id, data.accountId)

    if (data.categoryId) {
      await assertCategoryAccess(user.id, data.categoryId, data.type)
    }

    const transaction = await transactionRepository.create(user.id, data)

    return toTransactionWithRelations(transaction)
  })

export const updateTransaction = createServerFn({ method: 'POST' })
  .inputValidator(updateTransactionPayloadSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const existing = await transactionRepository.findById(data.id, user.id)

    if (!existing) {
      throw new Error('Transaction not found')
    }

    const nextAccountId = data.data.accountId ?? existing.accountId
    await assertAccountAccess(user.id, nextAccountId)

    const nextType = data.data.type ?? existing.type
    const nextCategoryId =
      data.data.categoryId !== undefined
        ? data.data.categoryId
        : existing.categoryId

    if (nextCategoryId) {
      await assertCategoryAccess(user.id, nextCategoryId, nextType)
    }

    const transaction = await transactionRepository.update(data.id, user.id, data.data)

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return toTransactionWithRelations(transaction)
  })

export const deleteTransaction = createServerFn({ method: 'POST' })
  .inputValidator(transactionIdSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const deleted = await transactionRepository.delete(data.id, user.id)

    if (!deleted) {
      throw new Error('Transaction not found')
    }

    return { success: true }
  })

export const getTransactionStats = createServerFn({ method: 'GET' })
  .inputValidator(transactionStatsFilterSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    return transactionRepository.getStats(user.id, data)
  })

export const listMerchants = createServerFn({ method: 'GET' })
  .inputValidator(merchantListSchema.optional())
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const merchants = await transactionRepository.listMerchants(user.id, data?.q)

    return merchants.map(toMerchantOption)
  })
