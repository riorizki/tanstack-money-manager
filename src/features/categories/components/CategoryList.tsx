import { useState } from 'react'
import { ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState, ErrorState } from '@/shared'
import { TransactionType } from '@/shared/constants/enums'
import type { CategoryTree } from '../types'
import { inferCategoryVisual } from '../utils/category-presets'
import { getCategoryIconOption } from '../utils/category-icons'

interface CategoryListProps {
  categories: CategoryTree[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onEdit?: (categoryId: string) => void
  onDelete?: (categoryId: string) => void
  deletingCategoryId?: string | null
}

function CategorySkeleton() {
  return (
    <article className="border-2 border-black bg-[#f6f6f6] shadow-[5px_5px_0_0_#000]">
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-2.5">
        <Skeleton className="h-3 w-36 rounded-none bg-black/15" />
        <Skeleton className="h-6 w-16 rounded-none bg-black/15" />
      </div>
      <div className="space-y-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 border-b border-black/10 px-4 py-4 last:border-b-0">
            <Skeleton className="h-8 w-8 rounded-none bg-black/10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40 rounded-none bg-black/10" />
              <Skeleton className="h-3 w-20 rounded-none bg-black/10" />
            </div>
            <Skeleton className="h-7 w-7 rounded-none bg-black/10" />
            <Skeleton className="h-7 w-7 rounded-none bg-black/10" />
          </div>
        ))}
      </div>
    </article>
  )
}

function countTree(items: CategoryTree[]): number {
  return items.reduce((count, item) => count + 1 + countTree(item.children), 0)
}

const GENERIC_ICON_KEYS = new Set(['circle-ellipsis', 'badge-dollar-sign'])

interface InheritedVisualContext {
  iconKey: string
  color: string
}

function hexToRgba(hexColor: string, alpha: number) {
  const normalizedHex = hexColor.replace('#', '')
  if (normalizedHex.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`
  }

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16)
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function resolveCategoryVisual(
  category: CategoryTree,
  inheritedVisual?: InheritedVisualContext,
) {
  const inferredVisual = inferCategoryVisual(category.name, category.type)
  const inferredIconKey = inferredVisual.icon
  const isGenericInferredIcon = GENERIC_ICON_KEYS.has(inferredIconKey)

  const resolvedIconKey =
    category.icon ??
    (isGenericInferredIcon && inheritedVisual
      ? inheritedVisual.iconKey
      : inferredIconKey)

  const resolvedColor =
    category.color ??
    (isGenericInferredIcon && inheritedVisual
      ? inheritedVisual.color
      : inferredVisual.color)

  const iconOption = getCategoryIconOption(
    resolvedIconKey,
    category.type,
    category.name,
  )

  return {
    iconOption,
    color: resolvedColor,
    context: {
      iconKey: iconOption.value,
      color: resolvedColor,
    } satisfies InheritedVisualContext,
  }
}

function CategoryNode({
  category,
  depth,
  inheritedVisual,
  onEdit,
  onDelete,
  deletingCategoryId,
}: {
  category: CategoryTree
  depth: number
  inheritedVisual?: InheritedVisualContext
  onEdit?: (categoryId: string) => void
  onDelete?: (categoryId: string) => void
  deletingCategoryId?: string | null
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const isDeleting = deletingCategoryId === category.id
  const hasChildren = category.children.length > 0
  const visual = resolveCategoryVisual(category, inheritedVisual)
  const categoryColor = visual.color
  const hierarchyLabel = depth === 0 ? 'Parent' : 'Sub'

  return (
    <div className="group relative">
      <div
        className={cn(
          'flex min-h-14 items-center gap-3 border-b border-black/10 px-4 py-3 transition-colors last:border-b-0',
          'hover:bg-black/[0.03]',
          depth > 0 && 'bg-[#fafafa]',
          isDeleting && 'opacity-50'
        )}
        style={{ paddingLeft: `${16 + depth * 22}px` }}
      >
        {depth > 0 && (
          <span
            className="absolute top-0 bottom-0 w-px bg-black/10"
            style={{ left: `${16 + (depth - 1) * 22 + 20}px` }}
            aria-hidden
          />
        )}

        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-5 w-5 shrink-0 items-center justify-center border border-black/20 text-black/40 transition-colors hover:border-black hover:text-black"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ) : (
          <div className="w-5 shrink-0" aria-hidden />
        )}

        <div
          className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-black/20"
          style={{
            backgroundColor: hexToRgba(categoryColor, 0.12),
            boxShadow: `inset 0 0 0 1px ${hexToRgba(categoryColor, 0.12)}`,
          }}
        >
          <visual.iconOption.Icon size={14} className="text-black/70" />
        </div>

        {/* Category Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <p className="truncate text-sm font-semibold text-black">
              {category.name}
            </p>
            {category.isDefault && (
              <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.14em] text-black/40">
                Default
              </span>
            )}
          </div>
          <p className="truncate text-[10px] uppercase tracking-[0.16em] text-black/45">
            {hierarchyLabel} Category
            {hasChildren
              ? ` · ${category.children.length} Sub${
                  category.children.length > 1 ? 'ies' : 'y'
                }`
              : ''}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(category.id)}
              className="flex h-7 w-7 items-center justify-center border border-black/25 text-black/60 transition-all hover:border-black hover:bg-black hover:text-white"
              aria-label={`Edit ${category.name}`}
            >
              <Pencil size={12} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(category.id)}
              className="flex h-7 w-7 items-center justify-center border border-black/25 text-black/60 transition-all hover:border-black hover:bg-black hover:text-white disabled:opacity-50"
              aria-label={isDeleting ? `Deleting ${category.name}` : `Delete ${category.name}`}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              depth={depth + 1}
              inheritedVisual={visual.context}
              onEdit={onEdit}
              onDelete={onDelete}
              deletingCategoryId={deletingCategoryId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CategorySection({
  title,
  tabCode,
  categories,
  onEdit,
  onDelete,
  deletingCategoryId,
}: {
  title: string
  tabCode: string
  categories: CategoryTree[]
  onEdit?: (categoryId: string) => void
  onDelete?: (categoryId: string) => void
  deletingCategoryId?: string | null
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const itemCount = countTree(categories)
  const rootCount = categories.length

  if (categories.length === 0) {
    return (
      <section className="relative border-2 border-black bg-[#f6f6f6] shadow-[5px_5px_0_0_#000]">
        <header className="flex items-center justify-between gap-3 border-b-2 border-black px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex h-5 min-w-5 items-center justify-center border border-black bg-black px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
              {tabCode}
            </span>
            <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/42">
              {title}
            </p>
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/42">
            0 items
          </span>
        </header>
        <div className="flex min-h-52 items-center justify-center px-6 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
            No {title.toLowerCase()} yet
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative border-2 border-black bg-[#f6f6f6] shadow-[5px_5px_0_0_#000]">
      {/* Section Header */}
      <header className="flex items-center justify-between gap-3 border-b-2 border-black px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-5 min-w-5 items-center justify-center border border-black bg-black px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
            {tabCode}
          </span>
          <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/42">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/42">
            {itemCount} items
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-7 w-7 items-center justify-center border border-black bg-white text-black shadow-[2px_2px_0_0_#000] transition-all hover:bg-black hover:text-white"
          >
            {isExpanded ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
          </button>
        </div>
      </header>

      {/* Category List */}
      {isExpanded && (
        <div className="divide-y divide-black/10 bg-[#f6f6f6]">
          <div className="border-b border-black/10 px-4 py-2">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
              {rootCount} parent · {itemCount} total
            </p>
          </div>
          {categories.map((category) => (
            <CategoryNode
              key={category.id}
              category={category}
              depth={0}
              onEdit={onEdit}
              onDelete={onDelete}
              deletingCategoryId={deletingCategoryId}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export function CategoryList({
  categories,
  isLoading = false,
  isError = false,
  onRetry,
  onEdit,
  onDelete,
  deletingCategoryId,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <section>
        <CategorySkeleton />
      </section>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load categories"
        description="Please retry or refresh the page."
        onRetry={onRetry}
      />
    )
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Create categories for your income and expense records."
      />
    )
  }

  const expenseCategories = categories.filter(
    (category) => category.type === TransactionType.EXPENSE
  )
  const incomeCategories = categories.filter(
    (category) => category.type === TransactionType.INCOME
  )
  const defaultTab = expenseCategories.length > 0 ? 'expense' : 'income'

  return (
    <section>
      <Tabs defaultValue={defaultTab} className="gap-4">
        <TabsList
          variant="line"
          className="grid h-auto w-full grid-cols-2 rounded-none border-y border-black/20 bg-transparent px-2"
        >
          <TabsTrigger
            value="expense"
            className="h-12 justify-start rounded-none border-b-[3px] border-transparent px-2 text-sm font-semibold uppercase tracking-[0.08em] text-black/35 after:hidden data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black"
          >
            Expense
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="h-12 justify-start rounded-none border-b-[3px] border-transparent px-2 text-sm font-semibold uppercase tracking-[0.08em] text-black/35 after:hidden data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black"
          >
            Income
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expense" className="mt-0">
          <CategorySection
            title="Expense Categories"
            tabCode="EX"
            categories={expenseCategories}
            onEdit={onEdit}
            onDelete={onDelete}
            deletingCategoryId={deletingCategoryId}
          />
        </TabsContent>

        <TabsContent value="income" className="mt-0">
          <CategorySection
            title="Income Categories"
            tabCode="IN"
            categories={incomeCategories}
            onEdit={onEdit}
            onDelete={onDelete}
            deletingCategoryId={deletingCategoryId}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
