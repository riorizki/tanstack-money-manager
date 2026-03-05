import type { Category as PrismaCategory } from '@/generated/prisma/client'
import type { TransactionType as PrismaTransactionType } from '@/generated/prisma/enums'
import { TransactionType } from '@/shared/constants/enums'
import type { Category, CategoryTree } from '../types'

export function normalizeOptionalField(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function fromPrismaTransactionType(type: PrismaTransactionType): TransactionType {
  switch (type) {
    case 'INCOME':
      return TransactionType.INCOME
    case 'EXPENSE':
      return TransactionType.EXPENSE
    case 'TRANSFER_IN':
      return TransactionType.TRANSFER_IN
    case 'TRANSFER_OUT':
      return TransactionType.TRANSFER_OUT
  }
}

export function toCategory(category: PrismaCategory): Category {
  return {
    id: category.id,
    userId: category.userId,
    name: category.name,
    type: fromPrismaTransactionType(category.type),
    color: category.color,
    icon: category.icon,
    parentId: category.parentId,
    isDefault: category.isDefault,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }
}

export function toCategoryList(categories: PrismaCategory[]) {
  return categories.map(toCategory)
}

export function sortCategoryTree(items: CategoryTree[]) {
  items.sort((a, b) => a.name.localeCompare(b.name))

  for (const item of items) {
    sortCategoryTree(item.children)
  }
}
