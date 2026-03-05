import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AccountWithBalance } from '@/features/accounts'
import type { Category } from '@/features/categories'
import { TransactionType } from '@/shared/constants/enums'

interface TransactionFiltersProps {
  accounts: AccountWithBalance[]
  categories: Category[]
  accountId?: string
  type?: TransactionType
  from?: string
  to?: string
  q?: string
  selectedCategoryIds: string[]
  onAccountChange: (accountId: string | undefined) => void
  onTypeChange: (type: TransactionType | undefined) => void
  onDateRangeChange: (from?: string, to?: string) => void
  onQueryChange: (q: string | undefined) => void
  onToggleCategory: (categoryId: string) => void
  onClear: () => void
}

const TYPE_OPTIONS: Array<{
  label: string
  value?: TransactionType
}> = [
  { label: 'All' },
  { label: 'Expense', value: TransactionType.EXPENSE },
  { label: 'Income', value: TransactionType.INCOME },
  { label: 'Transfer In', value: TransactionType.TRANSFER_IN },
  { label: 'Transfer Out', value: TransactionType.TRANSFER_OUT },
]

export function TransactionFilters({
  accounts,
  categories,
  accountId,
  type,
  from,
  to,
  q,
  selectedCategoryIds,
  onAccountChange,
  onTypeChange,
  onDateRangeChange,
  onQueryChange,
  onToggleCategory,
  onClear,
}: TransactionFiltersProps) {
  const visibleCategories = useMemo(() => {
    if (!type || (type !== TransactionType.EXPENSE && type !== TransactionType.INCOME)) {
      return categories
    }

    return categories.filter((category) => category.type === type)
  }, [categories, type])

  return (
    <article className="border-2 border-black bg-[#f6f6f6] p-4 shadow-[6px_6px_0_0_#000]">
      <header className="mb-4 flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
          Filter Transactions
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          className="h-8 rounded-none border-black bg-white px-3 text-[10px] font-bold uppercase tracking-[0.18em] shadow-none hover:bg-black hover:text-white"
        >
          Reset
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
            Search
          </label>
          <Input
            value={q ?? ''}
            onChange={(event) => onQueryChange(event.target.value || undefined)}
            placeholder="Notes or merchant"
            className="mt-1 h-10 rounded-none border-black bg-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
            Account
          </label>
          <Select
            value={accountId ?? 'all'}
            onValueChange={(value) => onAccountChange(value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="mt-1 h-10 rounded-none border-black bg-white">
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-black bg-[#f6f6f6] shadow-[6px_6px_0_0_#000]">
              <SelectItem value="all" className="rounded-none">
                All accounts
              </SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="rounded-none">
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
            From
          </label>
          <Input
            type="date"
            value={from ?? ''}
            onChange={(event) => onDateRangeChange(event.target.value || undefined, to)}
            className="mt-1 h-10 rounded-none border-black bg-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
            To
          </label>
          <Input
            type="date"
            value={to ?? ''}
            onChange={(event) => onDateRangeChange(from, event.target.value || undefined)}
            className="mt-1 h-10 rounded-none border-black bg-white"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TYPE_OPTIONS.map((option) => {
          const active = option.value === type || (!option.value && !type)

          return (
            <Button
              key={option.label}
              type="button"
              variant="outline"
              onClick={() => onTypeChange(option.value)}
              className={`h-8 rounded-none border-black px-3 text-[10px] font-bold uppercase tracking-[0.18em] shadow-none hover:bg-black hover:text-white ${
                active ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {option.label}
            </Button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleCategories.length === 0 && (
          <p className="text-sm text-black/55">No categories available.</p>
        )}
        {visibleCategories.map((category) => {
          const active = selectedCategoryIds.includes(category.id)

          return (
            <Button
              key={category.id}
              type="button"
              variant="outline"
              onClick={() => onToggleCategory(category.id)}
              className={`h-8 rounded-none border-black px-3 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white ${
                active ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {category.name}
            </Button>
          )
        })}
      </div>
    </article>
  )
}
