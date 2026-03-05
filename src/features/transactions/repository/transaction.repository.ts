import type { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/shared/lib/prisma'
import type {
  CreateTransactionInput,
  TransactionFilterInput,
  TransactionStatsFilterInput,
  UpdateTransactionInput,
} from '../schema/transaction.schema'

const DEFAULT_LIMIT = 20

const transactionInclude = {
  account: true,
  category: true,
  merchant: true,
} satisfies Prisma.TransactionInclude

function decimalToNumber(value: Prisma.Decimal | number | null | undefined) {
  if (typeof value === 'number') {
    return value
  }

  if (!value) {
    return 0
  }

  return Number(value)
}

function normalizeOptionalField(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function toStartOfDay(value: Date) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function toEndOfDay(value: Date) {
  const date = new Date(value)
  date.setHours(23, 59, 59, 999)
  return date
}

function buildWhereClause(
  userId: string,
  filters?: TransactionFilterInput,
): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId }

  if (!filters) {
    return where
  }

  if (filters.accountId) {
    where.accountId = filters.accountId
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    where.categoryId = { in: filters.categoryIds }
  }

  if (filters.type) {
    where.type = filters.type
  }

  if (filters.from || filters.to) {
    where.date = {
      ...(filters.from ? { gte: toStartOfDay(filters.from) } : {}),
      ...(filters.to ? { lte: toEndOfDay(filters.to) } : {}),
    }
  }

  if (filters.q) {
    where.OR = [
      {
        notes: {
          contains: filters.q,
        },
      },
      {
        merchant: {
          is: {
            name: {
              contains: filters.q,
            },
          },
        },
      },
    ]
  }

  return where
}

async function findOrCreateMerchant(
  userId: string,
  merchantName: string | null | undefined,
  categoryId: string | null | undefined,
) {
  const normalized = normalizeOptionalField(merchantName)

  if (!normalized) {
    return null
  }

  const existing = await prisma.merchant.findFirst({
    where: {
      userId,
      name: normalized,
    },
  })

  if (existing) {
    if (categoryId && !existing.categoryId) {
      await prisma.merchant.update({
        where: { id: existing.id },
        data: { categoryId },
      })
    }

    return existing.id
  }

  const created = await prisma.merchant.create({
    data: {
      userId,
      name: normalized,
      categoryId: categoryId ?? null,
    },
  })

  return created.id
}

export const transactionRepository = {
  async findMany(userId: string, filters?: TransactionFilterInput) {
    const limit = filters?.limit ?? DEFAULT_LIMIT

    const transactions = await prisma.transaction.findMany({
      where: buildWhereClause(userId, filters),
      include: transactionInclude,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(filters?.cursor
        ? {
            cursor: { id: filters.cursor },
            skip: 1,
          }
        : {}),
    })

    const hasMore = transactions.length > limit

    return {
      items: hasMore ? transactions.slice(0, limit) : transactions,
      nextCursor: hasMore ? transactions[limit]?.id ?? null : null,
    }
  },

  findById(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: { id, userId },
      include: transactionInclude,
    })
  },

  async create(userId: string, data: CreateTransactionInput) {
    const merchantId = await findOrCreateMerchant(
      userId,
      data.merchantName,
      data.categoryId,
    )

    return prisma.transaction.create({
      data: {
        userId,
        accountId: data.accountId,
        categoryId: normalizeOptionalField(data.categoryId),
        merchantId,
        type: data.type,
        amount: data.amount,
        date: data.date,
        notes: normalizeOptionalField(data.notes),
        transferId: normalizeOptionalField(data.transferId),
        recurringId: normalizeOptionalField(data.recurringId),
      },
      include: transactionInclude,
    })
  },

  async update(id: string, userId: string, data: UpdateTransactionInput) {
    const existing = await this.findById(id, userId)
    if (!existing) {
      return null
    }

    const nextCategoryId =
      data.categoryId !== undefined
        ? normalizeOptionalField(data.categoryId)
        : existing.categoryId

    const merchantId =
      data.merchantName !== undefined
        ? await findOrCreateMerchant(userId, data.merchantName, nextCategoryId)
        : undefined

    return prisma.transaction.update({
      where: { id },
      data: {
        ...(data.accountId !== undefined ? { accountId: data.accountId } : {}),
        ...(data.categoryId !== undefined ? { categoryId: nextCategoryId } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.amount !== undefined ? { amount: data.amount } : {}),
        ...(data.date !== undefined ? { date: data.date } : {}),
        ...(data.notes !== undefined
          ? { notes: normalizeOptionalField(data.notes) }
          : {}),
        ...(data.transferId !== undefined
          ? { transferId: normalizeOptionalField(data.transferId) }
          : {}),
        ...(data.recurringId !== undefined
          ? { recurringId: normalizeOptionalField(data.recurringId) }
          : {}),
        ...(merchantId !== undefined ? { merchantId } : {}),
      },
      include: transactionInclude,
    })
  },

  async delete(id: string, userId: string) {
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
      select: {
        id: true,
        transferId: true,
      },
    })

    if (!existing) {
      return false
    }

    if (existing.transferId) {
      const result = await prisma.transaction.deleteMany({
        where: {
          userId,
          transferId: existing.transferId,
        },
      })

      return result.count > 0
    }

    const result = await prisma.transaction.deleteMany({
      where: {
        id,
        userId,
      },
    })

    return result.count > 0
  },

  async getStats(userId: string, dateRange: TransactionStatsFilterInput) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    }

    const [income, expense, count] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          ...where,
          type: 'INCOME',
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          ...where,
          type: 'EXPENSE',
        },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where }),
    ])

    return {
      totalIncome: decimalToNumber(income._sum.amount),
      totalExpense: decimalToNumber(expense._sum.amount),
      count,
    }
  },

  listMerchants(userId: string, query?: string) {
    return prisma.merchant.findMany({
      where: {
        userId,
        ...(query
          ? {
              name: {
                contains: query,
              },
            }
          : {}),
      },
      orderBy: [{ name: 'asc' }],
      take: 30,
    })
  },
}
