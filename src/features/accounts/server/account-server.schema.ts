import { z } from 'zod'
import { updateAccountSchema } from '../schema/account.schema'

export const accountIdSchema = z.object({
  id: z.string().min(1, 'Account ID is required'),
})

export const updateAccountPayloadSchema = z.object({
  id: z.string().min(1, 'Account ID is required'),
  data: updateAccountSchema,
})
