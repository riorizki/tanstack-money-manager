import { z } from 'zod'
import { TransactionType } from '@/shared/constants/enums'

const transactionTypeSchema = z.nativeEnum(TransactionType)

const transactionBaseSchema = z.object({
  accountId: z.string().trim().min(1, 'Account is required'),
  categoryId: z.string().trim().min(1).nullable().optional(),
  merchantName: z.string().trim().max(80).nullable().optional(),
  type: transactionTypeSchema,
  amount: z.coerce.number().finite().positive('Amount must be greater than 0'),
  date: z.coerce.date(),
  notes: z.string().trim().max(500).nullable().optional(),
  transferId: z.string().trim().max(64).nullable().optional(),
  recurringId: z.string().trim().max(64).nullable().optional(),
})

export const createTransactionSchema = transactionBaseSchema

export const updateTransactionSchema = transactionBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be updated',
  })

const paginationSchema = z.object({
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const transactionFilterSchema = z
  .object({
    accountId: z.string().trim().min(1).optional(),
    categoryIds: z.array(z.string().trim().min(1)).optional(),
    type: transactionTypeSchema.optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    q: z.string().trim().max(120).optional(),
  })
  .merge(paginationSchema)

export const transactionListSchema = transactionFilterSchema

export const transactionStatsFilterSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>
export type TransactionListInput = z.infer<typeof transactionListSchema>
export type TransactionStatsFilterInput = z.infer<typeof transactionStatsFilterSchema>
