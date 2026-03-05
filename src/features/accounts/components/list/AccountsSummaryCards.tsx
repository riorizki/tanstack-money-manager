import { CURRENCIES, DEFAULT_CURRENCY } from '@/shared/constants/currencies'
import { formatCurrency } from '@/shared/utils/currency'
import type { AccountWithBalance } from '../../types'

interface AccountsSummaryCardsProps {
  accounts: AccountWithBalance[]
}

function getCurrencyLocale(code: string) {
  return CURRENCIES.find((currency) => currency.code === code)?.locale ?? 'en-US'
}

export function AccountsSummaryCards({ accounts }: AccountsSummaryCardsProps) {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.currentBalance,
    0,
  )
  const totalCurrency =
    accounts.length === 0 ? DEFAULT_CURRENCY.code : accounts[0].currency

  return (
    <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <article className="border-2 border-black bg-[#f6f6f6] px-5 py-5 shadow-[4px_4px_0_0_#000]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-black/45">
          Total Balance
        </p>
        <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em] text-black">
          {formatCurrency(
            totalBalance,
            totalCurrency,
            getCurrencyLocale(totalCurrency),
          )}
        </p>
      </article>
      <article className="border-2 border-black bg-[#f6f6f6] px-5 py-5 shadow-[4px_4px_0_0_#000]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-black/45">
          Active Accounts
        </p>
        <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em] text-black">
          {accounts.length}
        </p>
      </article>
    </section>
  )
}
