import { zodResolver } from '@hookform/resolvers/zod'
import {
  Coins,
  CreditCard,
  Landmark,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { CURRENCIES, DEFAULT_CURRENCY } from '@/shared/constants/currencies'
import { AccountType } from '@/shared/constants/enums'
import { createAccountSchema } from '../../schema/account.schema'
import type { CreateAccountInput } from '../../schema/account.schema'
import { AccountTypeIcon } from '../shared/AccountTypeIcon'

interface AccountFormProps {
  mode?: 'create' | 'edit'
  defaultValues?: Partial<AccountFormValues>
  isSubmitting?: boolean
  errorMessage?: string
  submitLabel?: string
  onSubmit: (data: CreateAccountInput) => void
  onCancel?: () => void
}

type AccountFormValues = z.input<typeof createAccountSchema>
type AccountSubmitValues = z.output<typeof createAccountSchema>

const ACCOUNT_TYPE_OPTIONS = [
  { value: AccountType.CASH, label: 'Cash' },
  { value: AccountType.BANK, label: 'Bank' },
  { value: AccountType.EWALLET, label: 'E-Wallet' },
  { value: AccountType.CREDIT_CARD, label: 'Credit Card' },
  { value: AccountType.INVESTMENT, label: 'Investment' },
  { value: AccountType.OTHER, label: 'Other' },
] as const

const ICON_OPTIONS = [
  { value: 'wallet', label: 'Wallet' },
  { value: 'landmark', label: 'Bank' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'trending-up', label: 'Investment' },
  { value: 'piggy-bank', label: 'Savings' },
  { value: 'coins', label: 'Coins' },
] as const

const ACCOUNT_ICON_MAP = {
  wallet: Wallet,
  landmark: Landmark,
  'credit-card': CreditCard,
  'trending-up': TrendingUp,
  'piggy-bank': PiggyBank,
  coins: Coins,
} as const

const SELECT_CONTENT_CLASS =
  'rounded-none border-2 border-black bg-[#f6f6f6] shadow-[6px_6px_0_0_#000]'

const SELECT_ITEM_CLASS =
  'rounded-none border-b border-black/12 px-3 py-2 text-base font-medium text-black data-[state=checked]:bg-black/8 data-[state=checked]:text-black data-[state=checked]:font-semibold data-[highlighted]:bg-black data-[highlighted]:text-white last:border-b-0'

const DEFAULT_FORM_VALUES: CreateAccountInput = {
  name: '',
  type: AccountType.CASH,
  currency: DEFAULT_CURRENCY.code,
  startingBalance: 0,
  color: null,
  icon: null,
}

function getCurrencyConfig(currencyCode: string) {
  return (
    CURRENCIES.find((currency) => currency.code === currencyCode) ??
    DEFAULT_CURRENCY
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getLocaleNumberSymbols(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)

  return {
    group: parts.find((part) => part.type === 'group')?.value ?? ',',
    decimal: parts.find((part) => part.type === 'decimal')?.value ?? '.',
  }
}

function formatCurrencyPrefix(symbol: string) {
  return /[a-z]/i.test(symbol) ? symbol.toUpperCase() : symbol
}

function formatBalanceInput(value: number, currencyCode: string) {
  const currency = getCurrencyConfig(currencyCode)

  return new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function parseBalanceInput(input: string, currencyCode: string) {
  const currency = getCurrencyConfig(currencyCode)
  const { group, decimal } = getLocaleNumberSymbols(currency.locale)

  let normalized = input
    .replace(new RegExp(escapeRegExp(currency.symbol), 'gi'), '')
    .replace(/[A-Za-z]/g, '')
    .replace(/\s+/g, '')
    .trim()

  if (!normalized) {
    return 0
  }

  // Locale-aware parsing:
  // - remove grouping separators
  // - normalize locale decimal separator to '.'
  normalized = normalized.replace(new RegExp(escapeRegExp(group), 'g'), '')
  if (decimal !== '.') {
    normalized = normalized.replace(new RegExp(escapeRegExp(decimal), 'g'), '.')
  }

  normalized = normalized.replace(/[^0-9.-]/g, '')
  normalized = normalized.replace(/(?!^)-/g, '')

  const firstDotIndex = normalized.indexOf('.')
  if (firstDotIndex >= 0) {
    normalized =
      normalized.slice(0, firstDotIndex + 1) +
      normalized.slice(firstDotIndex + 1).replace(/\./g, '')
  }

  if (
    !normalized ||
    normalized === '-' ||
    normalized === '.' ||
    normalized === '-.'
  ) {
    return 0
  }

  const parsed = Number(normalized)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  return parsed
}

export function AccountForm({
  mode = 'create',
  defaultValues,
  isSubmitting = false,
  errorMessage,
  submitLabel,
  onSubmit,
  onCancel,
}: AccountFormProps) {
  const form = useForm<AccountFormValues, undefined, AccountSubmitValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      ...defaultValues,
      color: defaultValues?.color ?? null,
      icon: defaultValues?.icon ?? null,
    },
  })
  const selectedCurrencyCode =
    form.watch('currency')?.toUpperCase() ?? DEFAULT_CURRENCY.code
  const selectedCurrency = getCurrencyConfig(selectedCurrencyCode)

  function handleSubmit(data: AccountSubmitValues) {
    onSubmit({
      ...data,
      currency: data.currency.toUpperCase(),
      color: data.color ?? null,
      icon: data.icon ?? null,
    })
  }

  return (
    <article className="border-2 border-black bg-[#f6f6f6] shadow-[8px_8px_0_0_#000] sm:shadow-[10px_10px_0_0_#000]">
      <header className="border-b-2 border-black px-5 py-4 sm:px-7 sm:py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/35">
          {mode === 'create' ? 'Create Account' : 'Edit Account'}
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Main Wallet"
                      className="h-11 w-full rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black shadow-none transition-colors placeholder:text-black/25 focus-visible:border-black focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Type
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black shadow-none focus-visible:ring-0">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={SELECT_CONTENT_CLASS}>
                        {ACCOUNT_TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className={SELECT_ITEM_CLASS}
                          >
                            <span className="flex items-center gap-2">
                              <AccountTypeIcon
                                type={option.value}
                                size={16}
                                className="text-current"
                              />
                              {option.label}
                            </span>
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
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Currency
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black shadow-none focus-visible:ring-0">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={SELECT_CONTENT_CLASS}>
                        {CURRENCIES.map((currency) => (
                          <SelectItem
                            key={currency.code}
                            value={currency.code}
                            className={SELECT_ITEM_CLASS}
                          >
                            <span className="flex items-center gap-2">
                              <span className="inline-flex min-w-11 items-center justify-center border border-black bg-black px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                                {currency.code}
                              </span>
                              <span>{currency.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startingBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Starting Balance
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      className="h-11 w-full rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-left font-mono text-xl font-semibold tracking-[0.02em] text-black shadow-none transition-colors placeholder:text-black/25 focus-visible:border-black focus-visible:ring-0"
                      value={
                        typeof field.value === 'number' &&
                        Number.isFinite(field.value)
                          ? `${formatCurrencyPrefix(selectedCurrency.symbol)} ${formatBalanceInput(
                              field.value,
                              selectedCurrency.code,
                            )}`
                          : ''
                      }
                      onChange={(event) => {
                        field.onChange(
                          parseBalanceInput(
                            event.target.value,
                            selectedCurrency.code,
                          ),
                        )
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-black/45">
                    Format follows selected currency. Example:{' '}
                    <span className="font-mono font-semibold text-black/65">
                      {formatCurrencyPrefix(selectedCurrency.symbol)}{' '}
                      {formatBalanceInput(1000000, selectedCurrency.code)}
                    </span>
                    . Current balance matches starting balance until
                    transactions are enabled.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Color
                    </FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input
                          type="color"
                          value={field.value ?? '#111111'}
                          className="h-10 w-14 rounded-none border border-black/35 bg-transparent p-1.5 shadow-none focus-visible:ring-0"
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                        />
                      </FormControl>
                      <Input
                        type="text"
                        placeholder="#111111"
                        value={field.value ?? ''}
                        className="h-10 rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-sm font-medium text-black shadow-none focus-visible:border-black focus-visible:ring-0"
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-none border-black px-3 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
                        onClick={() => field.onChange(null)}
                      >
                        Clear
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                        Icon
                      </FormLabel>
                      <Select
                        value={field.value ?? 'none'}
                        onValueChange={(value) =>
                          field.onChange(value === 'none' ? null : value)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black shadow-none focus-visible:ring-0">
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={SELECT_CONTENT_CLASS}>
                          <SelectItem
                            value="none"
                            className={SELECT_ITEM_CLASS}
                          >
                            <span className="flex items-center gap-2">
                              <span className="inline-flex size-4 items-center justify-center border border-current text-[10px] text-current">
                                -
                              </span>
                              No icon
                            </span>
                          </SelectItem>
                          {ICON_OPTIONS.map((option) => {
                            const OptionIcon = ACCOUNT_ICON_MAP[option.value]

                            return (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className={SELECT_ITEM_CLASS}
                              >
                                <span className="flex items-center gap-2">
                                  <OptionIcon
                                    size={16}
                                    className="text-current"
                                  />
                                  {option.label}
                                </span>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>

          <footer className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:justify-end sm:px-7 sm:py-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-none border-black bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-none hover:bg-black hover:text-white"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-none hover:bg-black/85 hover:text-white"
            >
              {isSubmitting
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : (submitLabel ??
                  (mode === 'create' ? 'Create Account' : 'Save Changes'))}
            </Button>
          </footer>
        </form>
      </Form>
    </article>
  )
}
