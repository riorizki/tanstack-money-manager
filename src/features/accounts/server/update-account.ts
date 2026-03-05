import { createServerFn } from '@tanstack/react-start'
import { accountRepository } from '../repository/account.repository'
import {
  normalizeOptionalField,
  toAccountWithBalance,
} from './account-server.utils'
import { updateAccountPayloadSchema } from './account-server.schema'
import { requireCurrentUser } from './require-current-user'

export const updateAccount = createServerFn({ method: 'POST' })
  .inputValidator(updateAccountPayloadSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const account = await accountRepository.update(data.id, user.id, {
      ...data.data,
      color:
        data.data.color !== undefined
          ? normalizeOptionalField(data.data.color)
          : undefined,
      icon:
        data.data.icon !== undefined
          ? normalizeOptionalField(data.data.icon)
          : undefined,
    })

    if (!account) {
      throw new Error('Account not found')
    }

    const adjustments = await accountRepository.getBalanceAdjustmentsByAccountIds(
      user.id,
      [account.id],
    )

    return toAccountWithBalance(account, adjustments.get(account.id) ?? 0)
  })
