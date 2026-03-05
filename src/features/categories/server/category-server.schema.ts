import { z } from 'zod'
import { updateCategorySchema } from '../schema/category.schema'

export const categoryIdSchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
})

export const deleteCategoryPayloadSchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  deleteChildren: z.boolean().optional().default(false),
})

export const updateCategoryPayloadSchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  data: updateCategorySchema,
})
