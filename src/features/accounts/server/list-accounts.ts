import { createServerFn } from '@tanstack/react-start'
import { accountRepository } from '../repository/account.repository'
import { accountFilterSchema } from '../schema/account.schema'
import { toAccountWithBalance } from './account-server.utils'
import { requireCurrentUser } from './require-current-user'

export const listAccounts = createServerFn({ method: 'GET' })
  .inputValidator(accountFilterSchema.optional())
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const accounts = await accountRepository.findAllByUser(user.id, data)
    const balanceAdjustments = await accountRepository.getBalanceAdjustmentsByAccountIds(
      user.id,
      accounts.map((account) => account.id),
    )

    return accounts.map((account) =>
      toAccountWithBalance(account, balanceAdjustments.get(account.id) ?? 0),
    )
  })
