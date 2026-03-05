import { Link, createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AccountList,
  useAccounts,
  useDeleteAccount,
} from '@/features/accounts'
import { CURRENCIES, DEFAULT_CURRENCY } from '@/shared/constants/currencies'
import { PageWrapper } from '@/shared/index'
import { formatCurrency } from '@/shared/utils/currency'

export const Route = createFileRoute('/app/accounts/')({
  component: AccountsPage,
})

const ACCOUNTS_PER_PAGE = 6

interface PendingDeleteAccount {
  id: string
  name: string
}

function getCurrencyLocale(code: string) {
  return CURRENCIES.find((currency) => currency.code === code)?.locale ?? 'en-US'
}

function AccountsPage() {
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null)
  const [pendingDeleteAccount, setPendingDeleteAccount] =
    useState<PendingDeleteAccount | null>(null)
  const {
    data: accounts = [],
    isLoading,
    isError,
    refetch,
  } = useAccounts()
  const [currentPage, setCurrentPage] = useState(1)
  const deleteAccountMutation = useDeleteAccount()

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.currentBalance,
    0,
  )
  const totalCurrency =
    accounts.length === 0 ? DEFAULT_CURRENCY.code : accounts[0].currency
  const totalPages = Math.max(1, Math.ceil(accounts.length / ACCOUNTS_PER_PAGE))
  const pageStartIndex = (currentPage - 1) * ACCOUNTS_PER_PAGE
  const paginatedAccounts = useMemo(
    () =>
      accounts.slice(pageStartIndex, pageStartIndex + ACCOUNTS_PER_PAGE),
    [accounts, pageStartIndex],
  )
  const pageFirstRecord = accounts.length === 0 ? 0 : pageStartIndex + 1
  const pageLastRecord = Math.min(
    accounts.length,
    pageStartIndex + paginatedAccounts.length,
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  function handleDeleteRequest(accountId: string) {
    if (deleteAccountMutation.isPending) {
      return
    }

    const targetAccount = accounts.find((account) => account.id === accountId)
    if (!targetAccount) {
      return
    }

    setPendingDeleteAccount({
      id: targetAccount.id,
      name: targetAccount.name,
    })
  }

  function closeDeleteDialog() {
    if (deleteAccountMutation.isPending) {
      return
    }

    setPendingDeleteAccount(null)
  }

  function handleDeleteConfirm() {
    if (!pendingDeleteAccount) {
      return
    }

    setDeletingAccountId(pendingDeleteAccount.id)

    deleteAccountMutation.mutate(
      { id: pendingDeleteAccount.id },
      {
        onSettled: () => {
          setDeletingAccountId(null)
          setPendingDeleteAccount(null)
        },
      },
    )
  }

  return (
    <PageWrapper className="px-6 pb-12 pt-8 md:px-8 md:pt-10">
      <div className="w-full">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/42">
              ■ 03 Accounts
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl">
              Accounts.
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-black/52">
              Manage your cash, bank, wallet, credit card, and investment
              accounts.
            </p>
          </div>

          <Button
            asChild
            className="h-12 self-start rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-none hover:bg-black/85 hover:text-white"
          >
            <Link to="/app/accounts/new">
              <Plus size={14} />
              Add Account
            </Link>
          </Button>
        </header>

        {deleteAccountMutation.error && (
          <p
            role="alert"
            className="mt-7 border-2 border-black bg-black/5 px-3 py-2 text-xs font-semibold tracking-[0.02em] text-black"
          >
            {deleteAccountMutation.error.message}
          </p>
        )}

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

        <section className="mt-7">
          <AccountList
            accounts={paginatedAccounts}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => {
              refetch()
            }}
            onDelete={handleDeleteRequest}
            deletePending={deleteAccountMutation.isPending && !!deletingAccountId}
            emptyAction={
              <Button
                asChild
                className="h-12 rounded-none border border-black bg-black px-7 text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-none hover:bg-black/85 hover:text-white"
              >
                <Link to="/app/accounts/new">Create Account</Link>
              </Button>
            }
          />

          {!isLoading && !isError && accounts.length > 0 && (
            <footer className="mt-4 flex flex-col gap-3 border border-black/35 bg-[#f2f2f2] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
                Account Registry{' '}
                <span className="text-black/65">
                  {String(pageFirstRecord).padStart(2, '0')} —{' '}
                  {String(pageLastRecord).padStart(2, '0')} /{' '}
                  {String(accounts.length).padStart(2, '0')}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-none border-black bg-white px-3 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
                  onClick={() => setCurrentPage((page) => page - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <span className="min-w-[72px] text-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-black/55">
                  {String(currentPage).padStart(2, '0')} /{' '}
                  {String(totalPages).padStart(2, '0')}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-none border-black bg-white px-3 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </footer>
          )}

          <Dialog
            open={Boolean(pendingDeleteAccount)}
            onOpenChange={(open) => {
              if (!open) {
                closeDeleteDialog()
              }
            }}
          >
            <DialogContent
              showCloseButton={!deleteAccountMutation.isPending}
              className="gap-0 rounded-none border-2 border-black bg-[#f6f6f6] p-0 shadow-[8px_8px_0_0_#000] sm:max-w-[34rem]"
            >
              <DialogHeader className="border-b-2 border-black px-5 py-4 text-left sm:px-6 sm:py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/35">
                  Delete Account
                </p>
                <DialogTitle className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-black sm:text-3xl">
                  Remove {pendingDeleteAccount?.name ?? 'this account'}?
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-relaxed text-black/60">
                  This account will be hidden from the list. You can continue
                  managing other accounts after deletion.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="border-t-2 border-black px-5 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-none border-black bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-none hover:bg-black hover:text-white"
                  onClick={closeDeleteDialog}
                  disabled={deleteAccountMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="h-11 rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-none hover:bg-black/85 hover:text-white"
                  onClick={handleDeleteConfirm}
                  disabled={deleteAccountMutation.isPending}
                >
                  {deleteAccountMutation.isPending
                    ? 'Deleting...'
                    : 'Delete Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </PageWrapper>
  )
}
