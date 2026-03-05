import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TransactionType } from '@/shared/constants/enums'
import type { CategoryTypeInput } from '../schema/category.schema'
import type { Category } from '../types'
import { CategoryBadge } from './CategoryBadge'

interface CategorySelectorProps {
  categories: Category[]
  value?: string | null
  onValueChange: (value: string | null) => void
  type?: CategoryTypeInput
  disabled?: boolean
  allowClear?: boolean
  placeholder?: string
  showTypeTabs?: boolean
}

const TYPE_OPTIONS = [
  { label: 'Expense', value: TransactionType.EXPENSE },
  { label: 'Income', value: TransactionType.INCOME },
] as const

export function CategorySelector({
  categories,
  value,
  onValueChange,
  type,
  disabled = false,
  allowClear = true,
  placeholder = 'Search category',
  showTypeTabs = true,
}: CategorySelectorProps) {
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState<CategoryTypeInput>(
    type ?? TransactionType.EXPENSE,
  )

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === value) ?? null,
    [categories, value],
  )

  const effectiveType = type ?? activeType

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return categories.filter((category) => {
      if (category.type !== effectiveType) {
        return false
      }

      if (!normalized) {
        return true
      }

      return category.name.toLowerCase().includes(normalized)
    })
  }, [categories, effectiveType, query])

  return (
    <div className="space-y-3">
      {showTypeTabs && !type && (
        <div className="grid grid-cols-2 gap-2">
          {TYPE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => setActiveType(option.value)}
              className={cn(
                'h-9 rounded-none border-black bg-white text-[11px] font-bold uppercase tracking-[0.18em] shadow-none hover:bg-black hover:text-white',
                activeType === option.value && 'bg-black text-white',
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}

      <Input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-none border-black bg-white"
      />

      <div className="max-h-48 space-y-2 overflow-y-auto border border-black/25 bg-[#f7f7f7] p-2">
        {filteredCategories.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-black/55">
            No categories found.
          </p>
        )}

        {filteredCategories.map((category) => {
          const isActive = value === category.id

          return (
            <button
              key={category.id}
              type="button"
              disabled={disabled}
              onClick={() => onValueChange(category.id)}
              className={cn(
                'flex w-full items-center justify-between border border-transparent px-2 py-1.5 text-left transition-colors',
                isActive
                  ? 'border-black bg-black/5'
                  : 'hover:border-black/35 hover:bg-white',
              )}
            >
              <CategoryBadge category={category} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                {category.type === TransactionType.EXPENSE ? 'Expense' : 'Income'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-black/55">
          {selectedCategory ? (
            <span>
              Selected: <span className="font-semibold">{selectedCategory.name}</span>
            </span>
          ) : (
            <span>No category selected</span>
          )}
        </div>

        {allowClear && (
          <Button
            type="button"
            variant="outline"
            disabled={disabled || !value}
            onClick={() => onValueChange(null)}
            className="h-8 rounded-none border-black bg-white px-3 text-[10px] font-bold uppercase tracking-[0.18em] shadow-none hover:bg-black hover:text-white"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
