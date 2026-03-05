import type { DateRange } from '../types'
import type { AccountType, TransactionType } from '../constants/enums'

type FilterBase = Record<string, unknown>

interface TransactionFilters extends FilterBase {
  accountId?: string
  categoryIds?: string[]
  type?: TransactionType
  from?: string
  to?: string
  q?: string
  cursor?: string
  limit?: number
}

interface AccountFilters extends FilterBase {
  type?: AccountType
  currency?: string
  includeInactive?: boolean
}

interface CategoryFilters extends FilterBase {
  type?: TransactionType
  parentId?: string | null
  q?: string
  includeDefault?: boolean
}

interface MerchantFilters extends FilterBase {
  q?: string
}

export const queryKeys = {
  accounts: {
    all: () => ['accounts'] as const,
    list: (filters?: AccountFilters) => ['accounts', 'list', filters] as const,
    detail: (id: string) => ['accounts', 'detail', id] as const,
  },
  transactions: {
    all: () => ['transactions'] as const,
    list: (filters?: TransactionFilters) =>
      ['transactions', 'list', filters] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
    stats: (dateRange: DateRange) => ['transactions', 'stats', dateRange] as const,
  },
  categories: {
    all: () => ['categories'] as const,
    list: (filters?: CategoryFilters) => ['categories', 'list', filters] as const,
    tree: () => ['categories', 'tree'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  merchants: {
    all: () => ['merchants'] as const,
    list: (filters?: MerchantFilters) => ['merchants', 'list', filters] as const,
  },
  budgets: {
    all: () => ['budgets'] as const,
    list: (filters?: FilterBase) => ['budgets', 'list', filters] as const,
    detail: (id: string) => ['budgets', 'detail', id] as const,
  },
  goals: {
    all: () => ['goals'] as const,
    list: (filters?: FilterBase) => ['goals', 'list', filters] as const,
    detail: (id: string) => ['goals', 'detail', id] as const,
  },
  auth: {
    session: () => ['auth', 'session'] as const,
  },
}
