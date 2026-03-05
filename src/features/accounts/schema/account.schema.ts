import { z } from 'zod'
import { AccountType } from '@/shared/constants/enums'

const currencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, 'Currency must be a valid 3-letter code')

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([A-Fa-f0-9]{6})$/, 'Color must be a valid hex value')

const accountBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(64, 'Name is too long'),
  type: z.nativeEnum(AccountType),
  currency: currencyCodeSchema.default('IDR'),
  startingBalance: z.coerce
    .number()
    .finite('Starting balance must be a valid number'),
  color: hexColorSchema.nullable().optional(),
  icon: z.string().trim().min(1).max(64).nullable().optional(),
})

export const createAccountSchema = accountBaseSchema

export const updateAccountSchema = accountBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be updated',
  })

export const accountFilterSchema = z.object({
  type: z.nativeEnum(AccountType).optional(),
  currency: currencyCodeSchema.optional(),
  includeInactive: z.boolean().default(false),
})

export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type AccountFilterInput = z.infer<typeof accountFilterSchema>
