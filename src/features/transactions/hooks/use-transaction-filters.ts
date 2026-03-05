import { useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { TransactionType } from '@/shared/constants/enums'
import type { TransactionFilterInput } from '../schema/transaction.schema'

interface SearchFilters {
  accountId?: string
  categoryIds?: string[]
  type?: TransactionType
  from?: string
  to?: string
  q?: string
}

function toDate(value?: string) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function toIsoDate(value: string | Date | undefined) {
  if (!value) {
    return undefined
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString().slice(0, 10)
}

export function useTransactionFilters(limit = 20) {
  const search: SearchFilters = useSearch({ from: '/app/transactions/' })
  const navigate = useNavigate({ from: '/app/transactions/' })

  const categoryIds = search.categoryIds ?? []

  const filters = useMemo<TransactionFilterInput>(
    () => ({
      accountId: search.accountId,
      categoryIds,
      type: search.type,
      from: toDate(search.from),
      to: toDate(search.to),
      q: search.q,
      limit,
    }),
    [categoryIds, limit, search.accountId, search.from, search.q, search.to, search.type],
  )

  function setSearchFilters(update: Partial<SearchFilters>) {
    navigate({
      search: (previous: Record<string, unknown>) => {
        const next = {
          ...previous,
          ...update,
        }

        if (!next.accountId) {
          delete next.accountId
        }

        if (!next.type) {
          delete next.type
        }

        if (!next.q) {
          delete next.q
        }

        if (!next.from) {
          delete next.from
        }

        if (!next.to) {
          delete next.to
        }

        if (!Array.isArray(next.categoryIds) || next.categoryIds.length === 0) {
          delete next.categoryIds
        }

        delete next.cursor

        return next
      },
      replace: true,
    })
  }

  return {
    filters,
    search,
    selectedCategoryIds: categoryIds,
    setAccountId: (accountId: string | undefined) =>
      setSearchFilters({ accountId }),
    setType: (type: TransactionType | undefined) =>
      setSearchFilters({ type }),
    setDateRange: (from?: string | Date, to?: string | Date) =>
      setSearchFilters({
        from: toIsoDate(from),
        to: toIsoDate(to),
      }),
    setQuery: (q: string | undefined) => setSearchFilters({ q }),
    toggleCategoryId: (categoryId: string) => {
      const next = categoryIds.includes(categoryId)
        ? categoryIds.filter((id) => id !== categoryId)
        : [...categoryIds, categoryId]

      setSearchFilters({ categoryIds: next })
    },
    clearFilters: () => {
      setSearchFilters({
        accountId: undefined,
        categoryIds: undefined,
        type: undefined,
        from: undefined,
        to: undefined,
        q: undefined,
      })
    },
  }
}
