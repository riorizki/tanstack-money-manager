import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccounts, useDeleteAccount } from '../../query/account.queries'
import { PageWrapper } from '@/shared/index'
import { DeleteAccountDialog, type PendingDeleteAccount } from '../dialogs/DeleteAccountDialog'
import { AccountList } from './AccountList'
import { AccountsPagination } from './AccountsPagination'
import { AccountsSummaryCards } from './AccountsSummaryCards'

const ACCOUNTS_PER_PAGE = 6

export function AccountsListPage() {
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

  const totalPages = Math.max(1, Math.ceil(accounts.length / ACCOUNTS_PER_PAGE))
  const pageStartIndex = (currentPage - 1) * ACCOUNTS_PER_PAGE
  const paginatedAccounts = useMemo(
    () => accounts.slice(pageStartIndex, pageStartIndex + ACCOUNTS_PER_PAGE),
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

        <AccountsSummaryCards accounts={accounts} />

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
            <AccountsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              firstRecord={pageFirstRecord}
              lastRecord={pageLastRecord}
              totalRecords={accounts.length}
              onPrevious={() => setCurrentPage((page) => page - 1)}
              onNext={() => setCurrentPage((page) => page + 1)}
            />
          )}

          <DeleteAccountDialog
            pendingAccount={pendingDeleteAccount}
            isDeleting={deleteAccountMutation.isPending}
            onClose={closeDeleteDialog}
            onConfirm={handleDeleteConfirm}
          />
        </section>
      </div>
    </PageWrapper>
  )
}
