import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/query/keys'
import type {
  AccountFilterInput,
  CreateAccountInput,
  UpdateAccountInput,
} from '../schema/account.schema'
import {
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
  updateAccount,
} from '../server'
import type { AccountWithBalance } from '../types'

interface UpdateAccountMutationInput {
  id: string
  data: UpdateAccountInput
}

interface DeleteAccountMutationInput {
  id: string
}

interface OptimisticUpdateContext {
  previousList?: AccountWithBalance[]
  previousDetail?: AccountWithBalance
}

function applyOptimisticPatch(
  account: AccountWithBalance,
  patch: UpdateAccountInput,
): AccountWithBalance {
  const nextStartingBalance = patch.startingBalance ?? account.startingBalance

  return {
    ...account,
    ...patch,
    startingBalance: nextStartingBalance,
    currentBalance:
      patch.startingBalance !== undefined
        ? nextStartingBalance
        : account.currentBalance,
  }
}

export function useAccounts(filters?: AccountFilterInput) {
  return useQuery({
    queryKey: queryKeys.accounts.list(filters),
    queryFn: () => (filters ? listAccounts({ data: filters }) : listAccounts()),
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => getAccount({ data: { id } }),
    enabled: Boolean(id),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountInput) => createAccount({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all() })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateAccountMutationInput) =>
      updateAccount({ data: { id, data } }),
    onMutate: async ({ id, data }): Promise<OptimisticUpdateContext> => {
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.all() })

      const listKey = queryKeys.accounts.list()
      const detailKey = queryKeys.accounts.detail(id)

      const previousList = queryClient.getQueryData<AccountWithBalance[]>(listKey)
      const previousDetail =
        queryClient.getQueryData<AccountWithBalance>(detailKey)

      if (previousList) {
        queryClient.setQueryData<AccountWithBalance[]>(
          listKey,
          previousList.map((account) =>
            account.id === id ? applyOptimisticPatch(account, data) : account,
          ),
        )
      }

      if (previousDetail) {
        queryClient.setQueryData<AccountWithBalance>(
          detailKey,
          applyOptimisticPatch(previousDetail, data),
        )
      }

      return { previousList, previousDetail }
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return
      }

      if (context.previousList) {
        queryClient.setQueryData(
          queryKeys.accounts.list(),
          context.previousList,
        )
      }

      if (context.previousDetail) {
        queryClient.setQueryData(
          queryKeys.accounts.detail(variables.id),
          context.previousDetail,
        )
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(variables.id),
      })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteAccountMutationInput) =>
      deleteAccount({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all() })
    },
  })
}
