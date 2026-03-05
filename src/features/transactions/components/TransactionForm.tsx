import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AccountWithBalance } from '@/features/accounts'
import { CategorySelector } from '@/features/categories'
import type { Category } from '@/features/categories'
import { TransactionType } from '@/shared/constants/enums'
import { formatCurrency } from '@/shared/index'
import { createTransactionSchema } from '../schema/transaction.schema'
import type { CreateTransactionInput } from '../schema/transaction.schema'
import type { MerchantOption } from '../types'

interface TransactionFormProps {
  mode?: 'create' | 'edit'
  defaultValues?: Partial<TransactionFormValues>
  accounts: AccountWithBalance[]
  categories: Category[]
  merchants?: MerchantOption[]
  isSubmitting?: boolean
  errorMessage?: string
  submitLabel?: string
  onSubmit: (data: CreateTransactionInput) => void
  onCancel?: () => void
}

type TransactionFormValues = z.input<typeof createTransactionSchema>
type TransactionSubmitValues = z.output<typeof createTransactionSchema>

function toDateInputValue(value: string | Date | undefined | null) {
  if (!value) {
    return ''
  }

  const parsed = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return parsed.toISOString().slice(0, 10)
}

const DEFAULT_FORM_VALUES: Omit<CreateTransactionInput, 'accountId'> = {
  categoryId: null,
  merchantName: null,
  type: TransactionType.EXPENSE,
  amount: 0,
  date: new Date(),
  notes: null,
  transferId: null,
  recurringId: null,
}

export function TransactionForm({
  mode = 'create',
  defaultValues,
  accounts,
  categories,
  merchants = [],
  isSubmitting = false,
  errorMessage,
  submitLabel,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const defaultAccountId = defaultValues?.accountId ?? (accounts[0]?.id || '')

  const form = useForm<TransactionFormValues, undefined, TransactionSubmitValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      accountId: defaultAccountId,
      ...defaultValues,
      categoryId: defaultValues?.categoryId ?? null,
      merchantName: defaultValues?.merchantName ?? null,
      notes: defaultValues?.notes ?? null,
      transferId: defaultValues?.transferId ?? null,
      recurringId: defaultValues?.recurringId ?? null,
      date: defaultValues?.date ?? new Date(),
    },
  })

  const selectedType = form.watch('type')
  const selectedAccountId = form.watch('accountId')
  const amount = form.watch('amount')

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId],
  )

  function handleSubmit(data: TransactionSubmitValues) {
    onSubmit({
      ...data,
      categoryId: data.categoryId ?? null,
      merchantName: data.merchantName ?? null,
      notes: data.notes ?? null,
      transferId: data.transferId ?? null,
      recurringId: data.recurringId ?? null,
    })
  }

  return (
    <article className="border-2 border-black bg-[#f6f6f6] shadow-[8px_8px_0_0_#000] sm:shadow-[10px_10px_0_0_#000]">
      <header className="border-b-2 border-black px-5 py-4 sm:px-7 sm:py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/35">
          {mode === 'create' ? 'Add Transaction' : 'Edit Transaction'}
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-6 border-b-2 border-black px-5 py-5 sm:space-y-7 sm:px-7 sm:py-7">
            {errorMessage && (
              <p
                role="alert"
                className="border-2 border-black bg-black/5 px-3 py-2 text-xs font-semibold tracking-[0.02em] text-black"
              >
                {errorMessage}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue('type', TransactionType.EXPENSE)}
                className={`h-10 rounded-none border-black text-[10px] font-bold uppercase tracking-[0.18em] shadow-none hover:bg-black hover:text-white ${
                  selectedType === TransactionType.EXPENSE
                    ? 'bg-black text-white'
                    : 'bg-white'
                }`}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue('type', TransactionType.INCOME)}
                className={`h-10 rounded-none border-black text-[10px] font-bold uppercase tracking-[0.18em] shadow-none hover:bg-black hover:text-white ${
                  selectedType === TransactionType.INCOME
                    ? 'bg-black text-white'
                    : 'bg-white'
                }`}
              >
                Income
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value}
                        onChange={(event) => {
                          const next = Number(event.target.value)
                          field.onChange(Number.isFinite(next) ? next : 0)
                        }}
                        placeholder="0"
                        className="h-11 rounded-none border-black bg-white"
                      />
                    </FormControl>
                    <p className="text-xs text-black/55">
                      {selectedAccount
                        ? formatCurrency(Number(amount ?? 0), selectedAccount.currency)
                        : 'Select account to preview currency'}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={toDateInputValue(field.value)}
                        onChange={(event) => field.onChange(event.target.value)}
                        className="h-11 rounded-none border-black bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Account
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-none border-black bg-white">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-2 border-black bg-[#f6f6f6] shadow-[6px_6px_0_0_#000]">
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id}
                          className="rounded-none"
                        >
                          {account.name} ({account.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Category
                  </FormLabel>
                  <FormControl>
                    <CategorySelector
                      categories={categories}
                      type={selectedType}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      showTypeTabs={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="merchantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Merchant / Payee
                  </FormLabel>
                  <FormControl>
                    <>
                      <Input
                        type="text"
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value.trim()
                          field.onChange(value.length === 0 ? null : value)
                        }}
                        placeholder="Store, person, company"
                        list="merchant-options"
                        className="h-11 rounded-none border-black bg-white"
                      />
                      <datalist id="merchant-options">
                        {merchants.map((merchant) => (
                          <option key={merchant.id} value={merchant.name} />
                        ))}
                      </datalist>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Notes
                  </FormLabel>
                  <FormControl>
                    <textarea
                      value={field.value ?? ''}
                      onChange={(event) => {
                        const value = event.target.value.trim()
                        field.onChange(value.length === 0 ? null : value)
                      }}
                      placeholder="Optional transaction notes"
                      className="min-h-24 w-full rounded-none border border-black bg-white px-3 py-2 text-sm text-black placeholder:text-black/35"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <footer className="flex flex-wrap items-center justify-end gap-3 px-5 py-4 sm:px-7 sm:py-5">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={onCancel}
                className="h-11 rounded-none border-black bg-white px-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-none hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || accounts.length === 0}
              className="h-11 rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-none hover:bg-black/85"
            >
              {isSubmitting
                ? mode === 'create'
                  ? 'Saving...'
                  : 'Updating...'
                : submitLabel ??
                  (mode === 'create' ? 'Create Transaction' : 'Save Transaction')}
            </Button>
          </footer>
        </form>
      </Form>
    </article>
  )
}
