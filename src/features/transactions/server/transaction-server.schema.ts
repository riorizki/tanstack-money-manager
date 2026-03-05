import { z } from 'zod'
import { updateTransactionSchema } from '../schema/transaction.schema'

export const transactionIdSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required'),
})

export const updateTransactionPayloadSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required'),
  data: updateTransactionSchema,
})

export const merchantListSchema = z.object({
  q: z.string().trim().max(80).optional(),
})
