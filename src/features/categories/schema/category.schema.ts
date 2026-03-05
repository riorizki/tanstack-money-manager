import { z } from 'zod'
import { TransactionType } from '@/shared/constants/enums'

export const categoryTypeSchema = z.enum([
  TransactionType.INCOME,
  TransactionType.EXPENSE,
])

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([A-Fa-f0-9]{6})$/, 'Color must be a valid hex value')

const categoryBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(64, 'Name is too long'),
  type: categoryTypeSchema,
  color: hexColorSchema.nullable().optional(),
  icon: z.string().trim().min(1).max(64).nullable().optional(),
  parentId: z.string().trim().min(1).nullable().optional(),
})

export const createCategorySchema = categoryBaseSchema

export const updateCategorySchema = categoryBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be updated',
  })

export const categoryFilterSchema = z.object({
  type: categoryTypeSchema.optional(),
  parentId: z.string().trim().min(1).nullable().optional(),
  q: z.string().trim().max(64).optional(),
  includeDefault: z.boolean().default(true),
})

export type CategoryTypeInput = z.infer<typeof categoryTypeSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CategoryFilterInput = z.infer<typeof categoryFilterSchema>
