import { createServerFn } from '@tanstack/react-start'
import { accountRepository } from '../repository/account.repository'
import { accountIdSchema } from './account-server.schema'
import { toAccountWithBalance } from './account-server.utils'
import { requireCurrentUser } from './require-current-user'

export const getAccount = createServerFn({ method: 'GET' })
  .inputValidator(accountIdSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const account = await accountRepository.findById(data.id, user.id)

    if (!account) {
      throw new Error('Account not found')
    }

    return toAccountWithBalance(account)
  })
