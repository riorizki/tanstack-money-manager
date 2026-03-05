import { Link } from '@tanstack/react-router'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CURRENCIES } from '@/shared/constants/currencies'
import { formatCurrency } from '@/shared/utils/currency'
import type { AccountWithBalance } from '../types'
import { AccountTypeIcon } from './AccountTypeIcon'

interface AccountCardProps {
  account: AccountWithBalance
  onDelete?: (accountId: string) => void
  deletePending?: boolean
}

function getCurrencyLocale(code: string) {
  return CURRENCIES.find((currency) => currency.code === code)?.locale ?? 'en-US'
}

function formatTypeLabel(type: string) {
  return type.replaceAll('_', ' ')
}

export function AccountCard({
  account,
  onDelete,
  deletePending = false,
}: AccountCardProps) {
  return (
    <article className="relative border-2 border-black bg-[#f6f6f6] shadow-[5px_5px_0_0_#000] transition-transform hover:-translate-y-px">
      <header className="flex items-center justify-between gap-3 border-b-2 border-black px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-5 min-w-5 items-center justify-center border border-black bg-black px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
            {account.type === 'CREDIT_CARD' ? 'CC' : account.type.slice(0, 2)}
          </span>
          <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/42">
            {formatTypeLabel(account.type)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/42">
            {account.currency}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                className="h-7 w-7 rounded-none border-black bg-white text-black shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white data-[state=open]:translate-x-px data-[state=open]:translate-y-px data-[state=open]:shadow-none"
                aria-label={`Open actions for ${account.name}`}
              >
                <MoreHorizontal size={13} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={7}
              className="w-44 rounded-none border-2 border-black bg-[#f6f6f6] p-1 shadow-[4px_4px_0_0_#000]"
            >
              <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-0 my-1 bg-black/20" />
              <DropdownMenuItem
                asChild
                className="rounded-none px-2.5 py-2 text-[15px] font-medium text-black focus:bg-black focus:text-white"
              >
                <Link
                  to="/app/accounts/$accountId/edit"
                  params={{ accountId: account.id }}
                >
                  <Pencil size={14} />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="rounded-none px-2.5 py-2 text-[15px] font-medium focus:bg-black/10"
                disabled={deletePending}
                onSelect={(event) => {
                  event.preventDefault()
                  onDelete?.(account.id)
                }}
              >
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="min-w-0">
          <p className="truncate text-3xl font-extrabold tracking-[-0.03em] text-black">
            {account.name}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/20"
              style={{ backgroundColor: account.color ?? '#111111' }}
            />
            <AccountTypeIcon type={account.type} className="text-black/65" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
              Active account
            </span>
          </div>
        </div>
        <p className="text-right text-3xl font-extrabold tracking-[-0.03em] text-black sm:text-4xl">
          {formatCurrency(
            account.currentBalance,
            account.currency,
            getCurrencyLocale(account.currency),
          )}
        </p>
      </div>
    </article>
  )
}
