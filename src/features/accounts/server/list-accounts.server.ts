import { createServerFn } from '@tanstack/react-start'
import { accountRepository } from '../repository/account.repository'
import { accountFilterSchema } from '../schema/account.schema'
import { toAccountWithBalance } from './account-server.utils'
import { requireCurrentUser } from './require-current-user.server'

export const listAccounts = createServerFn({ method: 'GET' })
  .inputValidator(accountFilterSchema.optional())
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const accounts = await accountRepository.findAllByUser(user.id, data)

    return accounts.map(toAccountWithBalance)
  })
