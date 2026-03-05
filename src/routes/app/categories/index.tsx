import { createFileRoute } from '@tanstack/react-router'
import { Plus, Layers, Box, Diamond } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  CategoryForm,
  CategoryList,
  useCategories,
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categories'
import type { CategoryTree } from '@/features/categories'
import { DeleteCategoryDialog } from '@/features/categories/components/DeleteCategoryDialog'
import type { TransactionType } from '@/shared'
import { PageWrapper } from '@/shared'

export const Route = createFileRoute('/app/categories/')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useCategories()
  const {
    data: categoryTree = [],
    isLoading: isCategoryTreeLoading,
    isError: isCategoryTreeError,
    refetch: refetchCategoryTree,
  } = useCategoryTree()

  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [deleteChildren, setDeleteChildren] = useState(false)

  const editingCategory = useMemo(
    () => categories.find((category) => category.id === editingCategoryId) ?? null,
    [categories, editingCategoryId]
  )

  const deletingCategory = useMemo(
    () => categories.find((category) => category.id === deletingCategoryId) ?? null,
    [categories, deletingCategoryId]
  )

  const deletingCategoryNode = useMemo(() => {
    if (!deletingCategoryId) {
      return null
    }

    return findCategoryNodeById(categoryTree, deletingCategoryId)
  }, [categoryTree, deletingCategoryId])

  const deletingCategoryChildCount = useMemo(
    () =>
      deletingCategoryNode ? countDescendants(deletingCategoryNode.children) : 0,
    [deletingCategoryNode]
  )

  const stats = useMemo(() => {
    const defaultCount = categories.filter((c) => c.isDefault).length
    const customCount = categories.length - defaultCount
    return {
      total: categories.length,
      default: defaultCount,
      custom: customCount,
    }
  }, [categories])

  function handleCreate(data: Parameters<typeof createCategoryMutation.mutate>[0]) {
    createCategoryMutation.mutate(data)
  }

  function handleUpdate(data: Parameters<typeof updateCategoryMutation.mutate>[0]['data']) {
    if (!editingCategory) {
      return
    }

    updateCategoryMutation.mutate(
      {
        id: editingCategory.id,
        data,
      },
      {
        onSuccess: () => {
          setEditingCategoryId(null)
        },
      }
    )
  }

  function handleDeleteClick(categoryId: string) {
    setDeletingCategoryId(categoryId)
    setDeleteChildren(false)
  }

  function handleDeleteConfirm() {
    if (!deletingCategory) {
      return
    }

    deleteCategoryMutation.mutate(
      {
        id: deletingCategory.id,
        deleteChildren,
      },
      {
        onSuccess: () => {
          setDeletingCategoryId(null)
          setDeleteChildren(false)
        },
      }
    )
  }

  function handleDeleteCancel() {
    setDeletingCategoryId(null)
    setDeleteChildren(false)
  }

  function handleRetry() {
    refetchCategories()
    refetchCategoryTree()
  }

  return (
    <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
      <div className="w-full space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/40">
              <span className="h-2 w-2 bg-black" />
              Categories
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-6xl">
              Categories.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/50">
              Organize your transactions with custom categories.
            </p>
          </div>

          {editingCategoryId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingCategoryId(null)}
              className="h-11 shrink-0 rounded-none border-2 border-black bg-white px-5 text-xs font-bold uppercase tracking-[0.15em] shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white hover:shadow-[2px_2px_0_0_#000]"
            >
              <Plus size={14} className="rotate-45" />
              Cancel Edit
            </Button>
          )}
        </header>

        {/* Stats Cards - Monochrome */}
        <section className="grid grid-cols-3 gap-3 sm:grid-cols-3">
          <StatCard
            icon={Layers}
            label="Total"
            value={stats.total}
          />
          <StatCard
            icon={Box}
            label="Default"
            value={stats.default}
          />
          <StatCard
            icon={Diamond}
            label="Custom"
            value={stats.custom}
          />
        </section>

        {/* Error Alert */}
        {(createCategoryMutation.error ||
          updateCategoryMutation.error ||
          deleteCategoryMutation.error) && (
          <div className="border-2 border-black bg-black/5 px-4 py-3">
            <p className="text-sm font-medium text-black">
              {createCategoryMutation.error?.message ??
                updateCategoryMutation.error?.message ??
                deleteCategoryMutation.error?.message}
            </p>
          </div>
        )}

        {/* Form Section - Full Width on Top */}
        <section id="category-form">
          <CategoryForm
            mode={editingCategory ? 'edit' : 'create'}
            defaultValues={
              editingCategory
                ? {
                    name: editingCategory.name,
                    type: editingCategory.type as TransactionType.INCOME | TransactionType.EXPENSE,
                    color: editingCategory.color,
                    icon: editingCategory.icon,
                    parentId: editingCategory.parentId,
                  }
                : undefined
            }
            categories={categories}
            excludeCategoryId={editingCategory?.id}
            isSubmitting={
              createCategoryMutation.isPending || updateCategoryMutation.isPending
            }
            errorMessage={
              createCategoryMutation.error?.message ??
              updateCategoryMutation.error?.message
            }
            submitLabel={editingCategory ? 'Save Changes' : 'Create Category'}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={
              editingCategory
                ? () => {
                    setEditingCategoryId(null)
                  }
                : undefined
            }
          />
        </section>

        {/* Categories Section - Below Form */}
        <section>
          <div className="mb-4 border-b border-black/15 pb-3">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/45">
              <span className="h-2 w-2 bg-black" />
              Your Categories
            </p>
            <p className="mt-2 text-sm text-black/45">
              Browse and maintain parent and sub-category structure for expenses and income.
            </p>
          </div>
          <CategoryList
            categories={categoryTree}
            isLoading={isCategoriesLoading || isCategoryTreeLoading}
            isError={isCategoriesError || isCategoryTreeError}
            onRetry={handleRetry}
            onEdit={(categoryId) => {
              setEditingCategoryId(categoryId)
              document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
            onDelete={handleDeleteClick}
            deletingCategoryId={
              deleteCategoryMutation.isPending
                ? deleteCategoryMutation.variables.id
                : null
            }
          />
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        isOpen={deletingCategoryId !== null}
        categoryName={deletingCategory?.name ?? ''}
        childCount={deletingCategoryChildCount}
        deleteChildren={deleteChildren}
        isDeleting={deleteCategoryMutation.isPending}
        onDeleteChildrenChange={setDeleteChildren}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </PageWrapper>
  )
}

function findCategoryNodeById(
  tree: CategoryTree[],
  categoryId: string,
): CategoryTree | null {
  for (const node of tree) {
    if (node.id === categoryId) {
      return node
    }

    const childMatch = findCategoryNodeById(node.children, categoryId)
    if (childMatch) {
      return childMatch
    }
  }

  return null
}

function countDescendants(nodes: CategoryTree[]): number {
  return nodes.reduce((count, node) => count + 1 + countDescendants(node.children), 0)
}

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string | number
  isAction?: boolean
  onClick?: () => void
}

function StatCard({ icon: Icon, label, value, isAction, onClick }: StatCardProps) {
  return (
    <button
      type="button"
      disabled={!isAction}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden border-2 border-black bg-white p-4 text-left shadow-[4px_4px_0_0_#000] transition-all',
        isAction && 'cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white hover:shadow-[2px_2px_0_0_#000]',
        !isAction && 'cursor-default hover:shadow-[6px_6px_0_0_#000]'
      )}
    >
      <div className="relative">
        <Icon size={18} className={cn('mb-2', isAction ? 'text-black group-hover:text-white' : 'text-black/40')} />
        <p className={cn('text-[10px] font-bold uppercase tracking-wider', isAction ? 'text-black/50 group-hover:text-white/60' : 'text-black/40')}>
          {label}
        </p>
        <p className={cn('mt-1 text-2xl font-extrabold tracking-tight', isAction ? 'text-black group-hover:text-white' : 'text-black')}>
          {value}
        </p>
      </div>
    </button>
  )
}
