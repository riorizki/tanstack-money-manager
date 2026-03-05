import type { Prisma } from '@/generated/prisma/client'
import type { AccountType } from '@/shared/constants/enums'
import { TransactionType } from '@/shared/constants/enums'
import { prisma } from '@/shared/lib/prisma'
import type { AccountFilterInput } from '../schema/account.schema'

function decimalToNumber(value: Prisma.Decimal | number | null | undefined) {
  if (typeof value === 'number') {
    return value
  }

  if (!value) {
    return 0
  }

  return Number(value)
}

function getSignedAmountByType(
  type: TransactionType,
  amount: number,
) {
  const multiplierByType: Record<TransactionType, 1 | -1> = {
    [TransactionType.INCOME]: 1,
    [TransactionType.EXPENSE]: -1,
    [TransactionType.TRANSFER_IN]: 1,
    [TransactionType.TRANSFER_OUT]: -1,
  }

  return amount * multiplierByType[type]
}

interface CreateAccountData {
  userId: string
  name: string
  type: AccountType
  currency: string
  startingBalance: number
  color?: string | null
  icon?: string | null
}

type UpdateAccountData = Partial<Omit<CreateAccountData, 'userId'>>

export const accountRepository = {
  findAllByUser(userId: string, filters?: AccountFilterInput) {
    const includeInactive = filters?.includeInactive ?? false

    return prisma.account.findMany({
      where: {
        userId,
        ...(includeInactive ? {} : { isActive: true }),
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.currency ? { currency: filters.currency } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    })
  },

  findById(id: string, userId: string) {
    return prisma.account.findFirst({
      where: { id, userId, isActive: true },
    })
  },

  create(data: CreateAccountData) {
    return prisma.account.create({ data })
  },

  async update(id: string, userId: string, data: UpdateAccountData) {
    const existing = await this.findById(id, userId)
    if (!existing) {
      return null
    }

    return prisma.account.update({
      where: { id },
      data,
    })
  },

  async softDelete(id: string, userId: string) {
    const result = await prisma.account.updateMany({
      where: { id, userId, isActive: true },
      data: { isActive: false },
    })

    return result.count > 0
  },

  async getTotalBalance(userId: string) {
    const result = await prisma.account.aggregate({
      where: { userId, isActive: true },
      _sum: { startingBalance: true },
    })

    return decimalToNumber(result._sum.startingBalance)
  },

  async getBalanceAdjustmentsByAccountIds(userId: string, accountIds: string[]) {
    if (accountIds.length === 0) {
      return new Map<string, number>()
    }

    const grouped = await prisma.transaction.groupBy({
      by: ['accountId', 'type'],
      where: {
        userId,
        accountId: { in: accountIds },
      },
      _sum: {
        amount: true,
      },
    })

    const adjustments = new Map<string, number>()

    for (const row of grouped) {
      const current = adjustments.get(row.accountId) ?? 0
      const movement = getSignedAmountByType(
        row.type as TransactionType,
        decimalToNumber(row._sum.amount),
      )

      adjustments.set(row.accountId, current + movement)
    }

    return adjustments
  },
}
