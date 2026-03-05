import { prisma } from '@/shared/lib/prisma'
import { TransactionType } from '@/shared/constants/enums'
import type { TransactionType as PrismaTransactionType } from '@/generated/prisma/enums'
import type { CategoryFilterInput } from '../schema/category.schema'
import type { CategoryTree } from '../types'
import { inferCategoryVisual } from '../utils/category-presets'

interface CreateCategoryData {
  userId: string
  name: string
  type: TransactionType
  color?: string | null
  icon?: string | null
  parentId?: string | null
  isDefault?: boolean
}

type UpdateCategoryData = Partial<Omit<CreateCategoryData, 'userId'>>

type DeleteCategoryResult =
  | { deleted: true }
  | {
      deleted: false
      reason: 'NOT_FOUND' | 'HAS_TRANSACTIONS' | 'HAS_CHILDREN'
    }

interface DeleteCategoryOptions {
  deleteChildren?: boolean
}

interface DefaultCategorySeed {
  name: string
  children: string[]
}

const DEFAULT_EXPENSE_CATEGORIES: DefaultCategorySeed[] = [
  {
    name: 'Food & Drinks',
    children: [
      'Coffee',
      'Breakfast',
      'Lunch',
      'Dinner',
      'Groceries',
      'Snacks',
      'Dining Out',
      'Delivery',
    ],
  },
  {
    name: 'Transport',
    children: [
      'Fuel',
      'Public Transport',
      'Ride Hailing',
      'Parking & Toll',
      'Vehicle Maintenance',
    ],
  },
  {
    name: 'Housing',
    children: ['Rent', 'Mortgage', 'Home Maintenance', 'Furnishing'],
  },
  {
    name: 'Shopping',
    children: ['Clothing', 'Electronics', 'Home Needs', 'Personal Items'],
  },
  {
    name: 'Entertainment',
    children: ['Movies', 'Games', 'Streaming', 'Music', 'Hobbies'],
  },
  {
    name: 'Health & Wellness',
    children: ['Doctor', 'Pharmacy', 'Fitness', 'Health Insurance'],
  },
  {
    name: 'Bills & Utilities',
    children: ['Electricity', 'Water', 'Internet', 'Mobile Phone', 'Gas'],
  },
  {
    name: 'Education',
    children: ['Books', 'Courses', 'Tuition', 'Certification'],
  },
  {
    name: 'Travel',
    children: ['Flight', 'Hotel', 'Local Transport', 'Activities'],
  },
  {
    name: 'Family & Kids',
    children: ['Childcare', 'School Needs', 'Baby Needs'],
  },
  {
    name: 'Debt & Fees',
    children: ['Loan Payment', 'Credit Card Fee', 'Bank Fee'],
  },
  {
    name: 'Charity & Donations',
    children: ['Charity', 'Religious Giving'],
  },
  {
    name: 'Taxes',
    children: ['Income Tax', 'Property Tax'],
  },
  {
    name: 'Personal Care',
    children: ['Skincare', 'Haircut', 'Toiletries'],
  },
  {
    name: 'Others',
    children: ['Miscellaneous', 'Emergency'],
  },
]

const DEFAULT_INCOME_CATEGORIES: DefaultCategorySeed[] = [
  {
    name: 'Salary',
    children: ['Base Salary', 'Bonus', 'Overtime', 'Commission'],
  },
  {
    name: 'Freelance',
    children: ['Project Payment', 'Consulting', 'Retainer'],
  },
  {
    name: 'Business',
    children: ['Product Sales', 'Service Income', 'Profit Share'],
  },
  {
    name: 'Investment',
    children: ['Dividends', 'Capital Gain', 'Interest', 'Crypto Profit'],
  },
  {
    name: 'Rental Income',
    children: ['Property Rent', 'Vehicle Rent'],
  },
  {
    name: 'Refund & Reimbursements',
    children: ['Refund', 'Reimbursement', 'Cashback'],
  },
  {
    name: 'Gift & Support',
    children: ['Cash Gift', 'Family Support', 'Rewards'],
  },
  {
    name: 'Side Hustle',
    children: ['Online Sales', 'Content Creator', 'Affiliate'],
  },
  {
    name: 'Others',
    children: ['Misc Income'],
  },
]

function normalizeText(value: string | null | undefined) {
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

function sortTree(items: CategoryTree[]) {
  items.sort((a, b) => a.name.localeCompare(b.name))

  for (const item of items) {
    sortTree(item.children)
  }
}

function buildCategoryKey(
  type: TransactionType,
  name: string,
  parentId: string | null,
) {
  return `${type}:${parentId ?? 'root'}:${name.toLowerCase()}`
}

export const categoryRepository = {
  findAllByUser(userId: string, filters?: CategoryFilterInput) {
    return prisma.category.findMany({
      where: {
        userId,
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.includeDefault === false ? { isDefault: false } : {}),
        ...(filters?.parentId === undefined
          ? {}
          : { parentId: filters.parentId }),
        ...(filters?.q
          ? {
              name: {
                contains: filters.q,
              },
            }
          : {}),
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    })
  },

  async findTree(userId: string) {
    const categories = await this.findAllByUser(userId)

    const byId = new Map<string, CategoryTree>()
    const roots: CategoryTree[] = []

    for (const category of categories) {
      byId.set(category.id, {
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
        children: [],
      })
    }

    for (const node of byId.values()) {
      if (!node.parentId) {
        roots.push(node)
        continue
      }

      const parent = byId.get(node.parentId)
      if (!parent) {
        roots.push(node)
        continue
      }

      parent.children.push(node)
    }

    sortTree(roots)

    return roots
  },

  findById(id: string, userId: string) {
    return prisma.category.findFirst({ where: { id, userId } })
  },

  create(data: CreateCategoryData) {
    return prisma.category.create({
      data: {
        userId: data.userId,
        name: data.name,
        type: data.type,
        color: normalizeText(data.color),
        icon: normalizeText(data.icon),
        parentId: normalizeText(data.parentId),
        isDefault: data.isDefault ?? false,
      },
    })
  },

  async update(id: string, userId: string, data: UpdateCategoryData) {
    const existing = await this.findById(id, userId)
    if (!existing) {
      return null
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.color !== undefined ? { color: normalizeText(data.color) } : {}),
        ...(data.icon !== undefined ? { icon: normalizeText(data.icon) } : {}),
        ...(data.parentId !== undefined
          ? { parentId: normalizeText(data.parentId) }
          : {}),
      },
    })
  },

  async delete(
    id: string,
    userId: string,
    options?: DeleteCategoryOptions,
  ): Promise<DeleteCategoryResult> {
    const shouldDeleteChildren = options?.deleteChildren ?? false

    const existing = await prisma.category.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: {
            transactions: true,
            children: true,
          },
        },
      },
    })

    if (!existing) {
      return { deleted: false, reason: 'NOT_FOUND' }
    }

    if (!shouldDeleteChildren) {
      if (existing._count.transactions > 0) {
        return { deleted: false, reason: 'HAS_TRANSACTIONS' }
      }

      if (existing._count.children > 0) {
        return { deleted: false, reason: 'HAS_CHILDREN' }
      }

      await prisma.category.delete({ where: { id } })

      return { deleted: true }
    }

    const allCategories = await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        parentId: true,
      },
    })

    const childrenByParentId = new Map<string, string[]>()
    for (const category of allCategories) {
      if (!category.parentId) {
        continue
      }

      const children = childrenByParentId.get(category.parentId) ?? []
      children.push(category.id)
      childrenByParentId.set(category.parentId, children)
    }

    const categoryIdsToDelete = new Set<string>([id])
    const queue: string[] = [id]

    while (queue.length > 0) {
      const currentId = queue.shift()
      if (!currentId) {
        break
      }

      const children = childrenByParentId.get(currentId) ?? []
      for (const childId of children) {
        if (categoryIdsToDelete.has(childId)) {
          continue
        }

        categoryIdsToDelete.add(childId)
        queue.push(childId)
      }
    }

    const ids = Array.from(categoryIdsToDelete)
    const transactionCount = await prisma.transaction.count({
      where: {
        userId,
        categoryId: { in: ids },
      },
    })

    if (transactionCount > 0) {
      return { deleted: false, reason: 'HAS_TRANSACTIONS' }
    }

    await prisma.category.deleteMany({
      where: {
        userId,
        id: { in: ids },
      },
    })

    return { deleted: true }
  },

  async seedDefaults(userId: string) {
    const existingCategories = await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true,
      },
    })

    const categoryIndex = new Map(
      existingCategories.map((category) => [
        buildCategoryKey(
          fromPrismaTransactionType(category.type),
          category.name,
          category.parentId,
        ),
        category,
      ]),
    )

    async function ensureCategory(
      name: string,
      type: TransactionType,
      parentId: string | null,
    ) {
      const key = buildCategoryKey(type, name, parentId)
      const existing = categoryIndex.get(key)
      if (existing) {
        return existing
      }

      const visual = inferCategoryVisual(name, type)
      const created = await prisma.category.create({
        data: {
          userId,
          name,
          type,
          parentId,
          isDefault: true,
          icon: visual.icon,
          color: visual.color,
        },
      })

      const next = {
        id: created.id,
        name: created.name,
        type: created.type,
        parentId: created.parentId,
      }

      categoryIndex.set(key, next)
      return next
    }

    async function seedCategoryGroup(
      type: TransactionType.INCOME | TransactionType.EXPENSE,
      categories: DefaultCategorySeed[],
    ) {
      for (const category of categories) {
        const parent = await ensureCategory(category.name, type, null)

        for (const childName of category.children) {
          await ensureCategory(childName, type, parent.id)
        }
      }
    }

    await seedCategoryGroup(TransactionType.EXPENSE, DEFAULT_EXPENSE_CATEGORIES)
    await seedCategoryGroup(TransactionType.INCOME, DEFAULT_INCOME_CATEGORIES)

    return this.findAllByUser(userId)
  },
}
