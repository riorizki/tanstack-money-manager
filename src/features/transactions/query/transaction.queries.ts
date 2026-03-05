import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/shared/query/keys'
import type {
  CreateTransactionInput,
  TransactionFilterInput,
  TransactionStatsFilterInput,
  UpdateTransactionInput,
} from '../schema/transaction.schema'
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactionStats,
  listMerchants,
  listTransactions,
  updateTransaction,
} from '../server'
import type {
  TransactionListResponse,
  TransactionWithRelations,
} from '../types'

interface UpdateTransactionMutationInput {
  id: string
  data: UpdateTransactionInput
}

interface DeleteTransactionMutationInput {
  id: string
}

interface OptimisticDeleteContext {
  previousPages?: InfiniteData<TransactionListResponse>
}

function stripCursor(filters?: TransactionFilterInput) {
  if (!filters) {
    return undefined
  }

  const { cursor: _cursor, ...rest } = filters
  return rest
}

export function useTransactions(filters?: TransactionFilterInput) {
  const keyFilters = stripCursor(filters)

  return useInfiniteQuery({
    queryKey: queryKeys.transactions.list(keyFilters),
    queryFn: ({ pageParam }) =>
      listTransactions({
        data: {
          ...filters,
          cursor: typeof pageParam === 'string' ? pageParam : undefined,
        },
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => getTransaction({ data: { id } }),
    enabled: Boolean(id),
  })
}

export function useTransactionStats(filters: TransactionStatsFilterInput) {
  return useQuery({
    queryKey: queryKeys.transactions.stats(filters),
    queryFn: () => getTransactionStats({ data: filters }),
  })
}

export function useMerchants(q?: string) {
  return useQuery({
    queryKey: queryKeys.merchants.list({ q }),
    queryFn: () => listMerchants({ data: { q } }),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionInput) => createTransaction({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.merchants.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all() })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateTransactionMutationInput) =>
      updateTransaction({ data: { id, data } }),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.merchants.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all() })
    },
  })
}

export function useDeleteTransaction(filters?: TransactionFilterInput) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteTransactionMutationInput) =>
      deleteTransaction({ data: { id } }),
    onMutate: async ({ id }): Promise<OptimisticDeleteContext> => {
      const key = queryKeys.transactions.list(stripCursor(filters))

      await queryClient.cancelQueries({ queryKey: key })
      const previousPages =
        queryClient.getQueryData<InfiniteData<TransactionListResponse>>(key)

      if (previousPages) {
        queryClient.setQueryData<InfiniteData<TransactionListResponse>>(key, {
          ...previousPages,
          pages: previousPages.pages.map((page) => ({
            ...page,
            items: page.items.filter((transaction) => transaction.id !== id),
          })),
        })
      }

      return { previousPages }
    },
    onError: (_error, _variables, context) => {
      if (!context?.previousPages) {
        return
      }

      const key = queryKeys.transactions.list(stripCursor(filters))
      queryClient.setQueryData(key, context.previousPages)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all() })
    },
  })
}

export function flattenTransactionPages(
  pages: TransactionListResponse[] | undefined,
): TransactionWithRelations[] {
  if (!pages) {
    return []
  }

  return pages.flatMap((page) => page.items)
}
