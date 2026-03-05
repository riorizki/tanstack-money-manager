import type { AccountType } from '@/shared/constants/enums'

export interface Account {
  id: string
  userId: string
  name: string
  type: AccountType
  currency: string
  startingBalance: number
  color: string | null
  icon: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AccountWithBalance extends Account {
  currentBalance: number
}

export interface AccountSummary {
  totalBalance: number
  activeAccountCount: number
}
