import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/query/keys'
import type {
  CategoryFilterInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../schema/category.schema'
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  listCategoryTree,
  seedDefaultCategories,
  updateCategory,
} from '../server'

interface UpdateCategoryMutationInput {
  id: string
  data: UpdateCategoryInput
}

interface DeleteCategoryMutationInput {
  id: string
  deleteChildren?: boolean
}

export function useCategories(filters?: CategoryFilterInput) {
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: () =>
      filters ? listCategories({ data: filters }) : listCategories(),
  })
}

export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn: () => listCategoryTree(),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => getCategory({ data: { id } }),
    enabled: Boolean(id),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateCategoryMutationInput) =>
      updateCategory({ data: { id, data } }),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(variables.id),
      })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, deleteChildren = false }: DeleteCategoryMutationInput) =>
      deleteCategory({ data: { id, deleteChildren } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
    },
  })
}

export function useSeedDefaultCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => seedDefaultCategories(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
    },
  })
}
