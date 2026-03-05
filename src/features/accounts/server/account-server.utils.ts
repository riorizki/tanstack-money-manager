import type { Account as PrismaAccount } from '@/generated/prisma/client'
import type { AccountType } from '@/shared/constants/enums'
import type { AccountWithBalance } from '../types'

export function normalizeOptionalField(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function toAccountWithBalance(account: PrismaAccount): AccountWithBalance {
  const startingBalance = Number(account.startingBalance)

  return {
    id: account.id,
    userId: account.userId,
    name: account.name,
    type: account.type as AccountType,
    currency: account.currency,
    startingBalance,
    currentBalance: startingBalance,
    color: account.color,
    icon: account.icon,
    isActive: account.isActive,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  }
}
