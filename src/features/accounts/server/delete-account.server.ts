import { createServerFn } from '@tanstack/react-start'
import { accountRepository } from '../repository/account.repository'
import { accountIdSchema } from './account-server.schema'
import { requireCurrentUser } from './require-current-user.server'

export const deleteAccount = createServerFn({ method: 'POST' })
  .inputValidator(accountIdSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const deleted = await accountRepository.softDelete(data.id, user.id)

    if (!deleted) {
      throw new Error('Account not found')
    }

    return { success: true }
  })
