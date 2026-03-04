import { z } from 'zod'

export const dateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

export type DateRangeInput = z.infer<typeof dateRangeSchema>
