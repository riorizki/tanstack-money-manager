import type { DateRange } from '../types'

type FilterBase = Record<string, unknown>

interface TransactionFilters extends FilterBase {
  accountId?: string
  type?: string
  dateRange?: DateRange
  cursor?: string
}

interface AccountFilters extends FilterBase {
  type?: string
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
