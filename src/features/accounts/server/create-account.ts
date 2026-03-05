import { createServerFn } from '@tanstack/react-start'
import { accountRepository } from '../repository/account.repository'
import { createAccountSchema } from '../schema/account.schema'
import {
  normalizeOptionalField,
  toAccountWithBalance,
} from './account-server.utils'
import { requireCurrentUser } from './require-current-user'

export const createAccount = createServerFn({ method: 'POST' })
  .inputValidator(createAccountSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const account = await accountRepository.create({
      userId: user.id,
      name: data.name,
      type: data.type,
      currency: data.currency,
      startingBalance: data.startingBalance,
      color: normalizeOptionalField(data.color),
      icon: normalizeOptionalField(data.icon),
    })

    return toAccountWithBalance(account, 0)
  })
